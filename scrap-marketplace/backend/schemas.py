from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ProductBase(StrictModel):
    name: str = Field(min_length=1, max_length=150)
    category: str = Field(min_length=1, max_length=100)
    grade: str | None = Field(default=None, max_length=100)
    origin: str = Field(default="India", min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=5000)
    quantity: str = Field(default="Available on request", min_length=1, max_length=100)
    price: float | None = Field(default=None, ge=0, allow_inf_nan=False)
    available: bool = True

    @field_validator("name", "category", "origin", "quantity")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank")
        return value

    @field_validator("grade", "description")
    @classmethod
    def strip_optional_text(cls, value: str | None) -> str | None:
        return value.strip() if value is not None else None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(StrictModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    grade: str | None = Field(default=None, max_length=100)
    origin: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=5000)
    quantity: str | None = Field(default=None, min_length=1, max_length=100)
    price: float | None = Field(default=None, ge=0, allow_inf_nan=False)
    available: bool | None = None

    @model_validator(mode="after")
    def validate_partial_update(self):
        if not self.model_fields_set:
            raise ValueError("At least one field must be updated")
        for field in ("name", "category", "origin", "quantity", "available"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null")
        for field in ("name", "category", "origin", "quantity", "grade", "description"):
            value = getattr(self, field)
            if value is not None:
                normalized = value.strip()
                if field in {"name", "category", "origin", "quantity"} and not normalized:
                    raise ValueError(f"{field} cannot be blank")
                setattr(self, field, normalized)
        return self


class ProductResponse(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True, extra="forbid")


class BuyerRegistration(StrictModel):
    name: str = Field(min_length=1, max_length=150)
    company: str = Field(min_length=1, max_length=150)
    email: EmailStr = Field(max_length=254)
    phone: str = Field(min_length=5, max_length=50)
    country: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=12, max_length=128)

    @field_validator("name", "company", "phone", "country")
    @classmethod
    def strip_and_validate_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class BuyerLogin(StrictModel):
    email: EmailStr = Field(max_length=254)
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class AdminLogin(BuyerLogin):
    pass


class BuyerProfileUpdate(StrictModel):
    name: str = Field(min_length=1, max_length=150)
    company: str = Field(min_length=1, max_length=150)
    phone: str = Field(min_length=5, max_length=50)
    country: str = Field(min_length=1, max_length=100)

    @field_validator("name", "company", "phone", "country")
    @classmethod
    def strip_and_validate_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank")
        return value


class BuyerDetails(StrictModel):
    name: str
    company: str
    email: str
    phone: str


class EnquiryCreate(StrictModel):
    product_id: int = Field(gt=0)
    quantity: str = Field(min_length=1, max_length=100)
    country: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=5000)

    @field_validator("quantity", "country", "message")
    @classmethod
    def strip_and_validate_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank")
        return value


class EnquiryUpdate(StrictModel):
    status: Literal["Pending", "Responded", "Closed"] | None = None
    response: str | None = Field(default=None, max_length=5000)

    @model_validator(mode="after")
    def validate_update(self):
        if not self.model_fields_set:
            raise ValueError("At least one field must be updated")
        if "status" in self.model_fields_set and self.status is None:
            raise ValueError("status cannot be null")
        if "response" in self.model_fields_set:
            if self.response is None:
                raise ValueError("response cannot be null")
            self.response = self.response.strip()
        return self


class EnquiryResponse(StrictModel):
    id: int
    buyer_id: int | None
    product_id: int | None
    product: str
    category: str
    quantity: str
    country: str
    message: str
    buyer: BuyerDetails
    status: str
    response: str

    model_config = ConfigDict(from_attributes=True, extra="forbid")


class AuthResponse(StrictModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: "UserResponse"


class UserResponse(StrictModel):
    id: int | None = None
    role: Literal["admin", "buyer"]
    name: str
    company: str | None = None
    email: EmailStr
    phone: str | None = None
    country: str | None = None


AuthResponse.model_rebuild()
