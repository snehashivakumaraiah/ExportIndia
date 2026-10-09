
from sqlalchemy import inspect
from database import Base, engine
from models import Product

Base.metadata.create_all(bind=engine)

inspector = inspect(engine)
print("Connected to PostgreSQL successfully!")
print("Tables:", inspector.get_table_names())