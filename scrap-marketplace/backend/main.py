import hmac
import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from migrations import migrate_existing_schema
from models import Buyer, Enquiry, Product, SavedProduct
from schemas import (
    AdminLogin,
    AuthResponse,
    BuyerLogin,
    BuyerProfileUpdate,
    BuyerRegistration,
    EnquiryCreate,
    EnquiryResponse,
    EnquiryUpdate,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
    UserResponse,
)
from security import (
    Principal,
    create_access_token,
    hash_password,
    require_admin,
    require_buyer,
    require_token_secret,
    verify_password,
    get_current_principal,
)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    migrate_existing_schema(engine)
    yield


app = FastAPI(title="ExportIndia API", lifespan=lifespan)
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:4173,http://127.0.0.1:4173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


def buyer_response(buyer: Buyer) -> UserResponse:
    return UserResponse(
        id=buyer.id,
        role="buyer",
        name=buyer.name,
        company=buyer.company,
        email=buyer.email,
        phone=buyer.phone,
        country=buyer.country,
    )


def issue_auth_response(
    role: str,
    subject: str,
    user: UserResponse,
    credential_version: str | None = None,
) -> AuthResponse:
    return AuthResponse(
        access_token=create_access_token(role, subject, credential_version),
        user=user,
    )


@app.post("/auth/admin/login", response_model=AuthResponse)
def admin_login(credentials: AdminLogin):
    configured_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    configured_password = os.getenv("ADMIN_PASSWORD", "")
    if not configured_email or len(configured_password) < 12:
        raise HTTPException(
            status_code=503,
            detail="Admin login requires ADMIN_EMAIL and a 12-character ADMIN_PASSWORD",
        )
    require_token_secret()
    valid_email = hmac.compare_digest(
        credentials.email.encode("utf-8"),
        configured_email.encode("utf-8"),
    )
    valid_password = hmac.compare_digest(
        credentials.password.encode("utf-8"),
        configured_password.encode("utf-8"),
    )
    if not valid_email or not valid_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return issue_auth_response(
        "admin",
        configured_email,
        UserResponse(role="admin", name="Administrator", email=configured_email),
        hmac.digest(configured_password.encode("utf-8"), b"admin-auth-version", "sha256").hex(),
    )


@app.post("/auth/register", response_model=AuthResponse, status_code=201)
def register_buyer(registration: BuyerRegistration, db: Session = Depends(get_db)):
    require_token_secret()
    if db.query(Buyer).filter(Buyer.email == registration.email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    buyer = Buyer(
        name=registration.name,
        company=registration.company,
        email=registration.email,
        phone=registration.phone,
        country=registration.country,
        password_hash=hash_password(registration.password),
    )
    db.add(buyer)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists",
        ) from error
    db.refresh(buyer)
    return issue_auth_response("buyer", str(buyer.id), buyer_response(buyer))


@app.post("/auth/login", response_model=AuthResponse)
def buyer_login(credentials: BuyerLogin, db: Session = Depends(get_db)):
    buyer = db.query(Buyer).filter(Buyer.email == credentials.email).first()
    if buyer is None or not verify_password(credentials.password, buyer.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    require_token_secret()
    return issue_auth_response("buyer", str(buyer.id), buyer_response(buyer))


@app.get("/auth/me", response_model=UserResponse)
def get_current_user(principal: Principal = Depends(get_current_principal)):
    if principal.role == "admin":
        return UserResponse(role="admin", name="Administrator", email=principal.subject)
    return buyer_response(principal.buyer)


@app.put("/auth/me", response_model=UserResponse)
def update_buyer_profile(
    profile: BuyerProfileUpdate,
    principal: Principal = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    buyer = principal.buyer
    for field, value in profile.model_dump().items():
        setattr(buyer, field, value)
    db.commit()
    db.refresh(buyer)
    return buyer_response(buyer)


@app.post(
    "/products",
    response_model=ProductResponse,
    status_code=201,
    dependencies=[Depends(require_admin)],
)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
):
    product = Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@app.get("/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).order_by(Product.id.desc()).all()


@app.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.put(
    "/products/{product_id}",
    response_model=ProductResponse,
    dependencies=[Depends(require_admin)],
)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@app.delete(
    "/products/{product_id}",
    status_code=204,
    dependencies=[Depends(require_admin)],
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    db.query(SavedProduct).filter(SavedProduct.product_id == product_id).delete(
        synchronize_session=False
    )
    db.delete(product)
    db.commit()
    return Response(status_code=204)


@app.post("/enquiries", response_model=EnquiryResponse, status_code=201)
def create_enquiry(
    enquiry_data: EnquiryCreate,
    principal: Principal = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    buyer = principal.buyer
    product = db.query(Product).filter(Product.id == enquiry_data.product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if not product.available:
        raise HTTPException(status_code=409, detail="Product is currently unavailable")

    enquiry = Enquiry(
        buyer_id=buyer.id,
        product_id=product.id,
        product=product.name,
        category=product.category,
        quantity=enquiry_data.quantity,
        country=enquiry_data.country,
        message=enquiry_data.message,
        buyer_name=buyer.name,
        buyer_company=buyer.company,
        buyer_email=buyer.email,
        buyer_phone=buyer.phone,
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


@app.get("/enquiries", response_model=list[EnquiryResponse])
def get_enquiries(
    principal: Principal = Depends(get_current_principal),
    db: Session = Depends(get_db),
):
    query = db.query(Enquiry)
    if principal.role == "buyer":
        query = query.filter(Enquiry.buyer_id == principal.buyer.id)
    return query.order_by(Enquiry.id.asc()).all()


@app.patch(
    "/enquiries/{enquiry_id}",
    response_model=EnquiryResponse,
    dependencies=[Depends(require_admin)],
)
def update_enquiry(
    enquiry_id: int,
    enquiry_data: EnquiryUpdate,
    db: Session = Depends(get_db),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    updates = enquiry_data.model_dump(exclude_unset=True)
    next_status = updates.get("status", enquiry.status)
    next_response = updates.get("response", enquiry.response)
    if next_status == "Responded" and not next_response.strip():
        raise HTTPException(
            status_code=422,
            detail="A response is required when an enquiry is marked Responded",
        )
    for field, value in updates.items():
        setattr(enquiry, field, value)
    db.commit()
    db.refresh(enquiry)
    return enquiry


@app.get("/buyers/me/saved-products", response_model=list[ProductResponse])
def get_saved_products(
    principal: Principal = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    return (
        db.query(Product)
        .join(SavedProduct, SavedProduct.product_id == Product.id)
        .filter(SavedProduct.buyer_id == principal.buyer.id)
        .order_by(Product.id.desc())
        .all()
    )


@app.put("/buyers/me/saved-products/{product_id}", status_code=204)
def save_product(
    product_id: int,
    principal: Principal = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    if db.query(Product.id).filter(Product.id == product_id).first() is None:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(SavedProduct).filter_by(
        buyer_id=principal.buyer.id,
        product_id=product_id,
    ).first()
    if existing is None:
        db.add(SavedProduct(buyer_id=principal.buyer.id, product_id=product_id))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
    return Response(status_code=204)


@app.delete("/buyers/me/saved-products/{product_id}", status_code=204)
def unsave_product(
    product_id: int,
    principal: Principal = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    db.query(SavedProduct).filter_by(
        buyer_id=principal.buyer.id,
        product_id=product_id,
    ).delete(synchronize_session=False)
    db.commit()
    return Response(status_code=204)
