from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, Text

from database import Base


class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    company = Column(String(150), nullable=False)
    email = Column(String(254), nullable=False, unique=True, index=True)
    phone = Column(String(50), nullable=False)
    country = Column(String(100), nullable=False)
    password_hash = Column(String(256), nullable=False)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    grade = Column(String(100), nullable=True)
    origin = Column(String(100), default="India")
    description = Column(Text, nullable=True)
    quantity = Column(String(100), default="Available on request")
    price = Column(Float, nullable=True)
    available = Column(Boolean, nullable=False, default=True, server_default="true")


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("buyers.id"), nullable=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    product = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    quantity = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    buyer_name = Column(String(150), nullable=False)
    buyer_company = Column(String(150), nullable=False)
    buyer_email = Column(String(254), nullable=False)
    buyer_phone = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False, default="Pending")
    response = Column(Text, nullable=False, default="")

    @property
    def buyer(self):
        return {
            "name": self.buyer_name,
            "company": self.buyer_company,
            "email": self.buyer_email,
            "phone": self.buyer_phone,
        }


class SavedProduct(Base):
    __tablename__ = "saved_products"

    buyer_id = Column(Integer, ForeignKey("buyers.id", ondelete="CASCADE"), primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
