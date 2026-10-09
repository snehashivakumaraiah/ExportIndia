from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


MIGRATION_ID = "001_add_product_availability_and_enquiry_buyer"


def migrate_existing_schema(engine: Engine) -> None:
    with engine.begin() as connection:
        connection.execute(
            text(
                "CREATE TABLE IF NOT EXISTS schema_migrations "
                "(version VARCHAR(100) PRIMARY KEY)"
            )
        )
        completed = connection.execute(
            text("SELECT version FROM schema_migrations WHERE version = :version"),
            {"version": MIGRATION_ID},
        ).first()
        if completed:
            return

        inspector = inspect(connection)
        tables = set(inspector.get_table_names())
        if "products" in tables:
            product_columns = {column["name"] for column in inspector.get_columns("products")}
            if "available" not in product_columns:
                connection.execute(
                    text(
                        "ALTER TABLE products ADD COLUMN available "
                        "BOOLEAN NOT NULL DEFAULT TRUE"
                    )
                )

        if "enquiries" in tables:
            enquiry_columns = {column["name"] for column in inspector.get_columns("enquiries")}
            if "buyer_id" not in enquiry_columns:
                connection.execute(
                    text("ALTER TABLE enquiries ADD COLUMN buyer_id INTEGER")
                )

        connection.execute(
            text("INSERT INTO schema_migrations (version) VALUES (:version)"),
            {"version": MIGRATION_ID},
        )
