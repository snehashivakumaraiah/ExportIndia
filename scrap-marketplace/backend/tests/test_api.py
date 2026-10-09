import os
import unittest
from collections.abc import Iterator
from unittest.mock import patch

os.environ.setdefault("DATABASE_URL", "sqlite://")

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

import main
from database import get_db
from migrations import migrate_existing_schema


class MarketplaceAPITests(unittest.TestCase):
    def setUp(self):
        self.environment = patch.dict(
            os.environ,
            {
                "AUTH_TOKEN_SECRET": "test-secret-with-more-than-thirty-two-bytes",
                "ADMIN_EMAIL": "admin@example.com",
                "ADMIN_PASSWORD": "a-strong-admin-password",
            },
        )
        self.environment.start()
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.previous_engine = main.engine
        main.engine = self.engine
        self.sessions = sessionmaker(bind=self.engine, autoflush=False, autocommit=False)

        def override_get_db() -> Iterator[Session]:
            with self.sessions() as session:
                yield session

        main.app.dependency_overrides[get_db] = override_get_db
        self.client_context = TestClient(main.app)
        self.client = self.client_context.__enter__()

    def tearDown(self):
        self.client_context.__exit__(None, None, None)
        main.app.dependency_overrides.clear()
        main.engine = self.previous_engine
        self.engine.dispose()
        self.environment.stop()

    def register_buyer(self, email: str, name: str = "Buyer") -> dict:
        response = self.client.post(
            "/auth/register",
            json={
                "name": name,
                "company": "Buyer Company",
                "email": email,
                "phone": "+1 555 555 0100",
                "country": "United States",
                "password": "buyer-password-123",
            },
        )
        self.assertEqual(response.status_code, 201, response.text)
        return response.json()

    def admin_headers(self) -> dict[str, str]:
        response = self.client.post(
            "/auth/admin/login",
            json={
                "email": "admin@example.com",
                "password": "a-strong-admin-password",
            },
        )
        self.assertEqual(response.status_code, 200, response.text)
        return {"Authorization": f"Bearer {response.json()['access_token']}"}

    def create_product(self, headers: dict[str, str]) -> dict:
        response = self.client.post(
            "/products",
            headers=headers,
            json={
                "name": "Copper scrap",
                "category": "Copper",
                "grade": "Millberry",
                "origin": "India",
                "description": "Clean copper scrap",
                "quantity": "20 MT",
                "price": 12.5,
                "available": True,
            },
        )
        self.assertEqual(response.status_code, 201, response.text)
        return response.json()

    def test_catalog_requires_admin_for_writes_and_validates_input(self):
        unauthorized = self.client.post(
            "/products",
            json={"name": "X", "category": "Copper"},
        )
        self.assertEqual(unauthorized.status_code, 401)

        buyer = self.register_buyer("buyer@example.com")
        buyer_headers = {"Authorization": f"Bearer {buyer['access_token']}"}
        forbidden = self.client.post(
            "/products",
            headers=buyer_headers,
            json={"name": "X", "category": "Copper"},
        )
        self.assertEqual(forbidden.status_code, 403)

        admin_headers = self.admin_headers()
        invalid = self.client.post(
            "/products",
            headers=admin_headers,
            json={"name": "  ", "category": "Copper", "price": -1},
        )
        self.assertEqual(invalid.status_code, 422)
        extra_field = self.client.post(
            "/products",
            headers=admin_headers,
            json={"name": "Copper", "category": "Copper", "available": True, "ignored": True},
        )
        self.assertEqual(extra_field.status_code, 422)

        product = self.create_product(admin_headers)
        update = self.client.put(
            f"/products/{product['id']}",
            headers=admin_headers,
            json={"available": False, "price": 0},
        )
        self.assertEqual(update.status_code, 200, update.text)
        self.assertFalse(update.json()["available"])
        self.assertEqual(update.json()["price"], 0)

        null_update = self.client.put(
            f"/products/{product['id']}",
            headers=admin_headers,
            json={"name": None},
        )
        self.assertEqual(null_update.status_code, 422)

    def test_enquiries_are_private_and_admin_updates_are_protected(self):
        first_buyer = self.register_buyer("first@example.com")
        second_buyer = self.register_buyer("second@example.com", name="Second")
        first_headers = {"Authorization": f"Bearer {first_buyer['access_token']}"}
        second_headers = {"Authorization": f"Bearer {second_buyer['access_token']}"}
        admin_headers = self.admin_headers()
        product = self.create_product(admin_headers)

        quote = self.client.post(
            "/enquiries",
            headers=first_headers,
            json={
                "product_id": product["id"],
                "quantity": "5 MT",
                "country": "Japan",
                "message": "Please provide a quote",
            },
        )
        self.assertEqual(quote.status_code, 201, quote.text)
        enquiry = quote.json()
        self.assertEqual(enquiry["buyer"]["email"], "first@example.com")

        spoofed_buyer = self.client.post(
            "/enquiries",
            headers=first_headers,
            json={
                "product_id": product["id"],
                "quantity": "5 MT",
                "country": "Japan",
                "message": "Please provide a quote",
                "buyer": {
                    "name": "Not the account owner",
                    "company": "Impersonator",
                    "email": "second@example.com",
                    "phone": "1234567890",
                },
            },
        )
        self.assertEqual(spoofed_buyer.status_code, 422)

        self.assertEqual(len(self.client.get("/enquiries", headers=first_headers).json()), 1)
        self.assertEqual(self.client.get("/enquiries", headers=second_headers).json(), [])
        admin_list = self.client.get("/enquiries", headers=admin_headers)
        self.assertEqual(len(admin_list.json()), 1)

        forbidden = self.client.patch(
            f"/enquiries/{enquiry['id']}",
            headers=first_headers,
            json={"status": "Closed"},
        )
        self.assertEqual(forbidden.status_code, 403)

        updated = self.client.patch(
            f"/enquiries/{enquiry['id']}",
            headers=admin_headers,
            json={"status": "Responded", "response": "Quote sent"},
        )
        self.assertEqual(updated.status_code, 200, updated.text)
        self.assertEqual(updated.json()["response"], "Quote sent")

    def test_buyer_profile_and_saved_products_are_persisted_per_account(self):
        first_buyer = self.register_buyer("first@example.com")
        second_buyer = self.register_buyer("second@example.com", name="Second")
        first_headers = {"Authorization": f"Bearer {first_buyer['access_token']}"}
        second_headers = {"Authorization": f"Bearer {second_buyer['access_token']}"}
        product = self.create_product(self.admin_headers())

        saved = self.client.put(
            f"/buyers/me/saved-products/{product['id']}",
            headers=first_headers,
        )
        self.assertEqual(saved.status_code, 204)
        self.assertEqual(len(self.client.get("/buyers/me/saved-products", headers=first_headers).json()), 1)
        self.assertEqual(self.client.get("/buyers/me/saved-products", headers=second_headers).json(), [])

        profile = self.client.put(
            "/auth/me",
            headers=first_headers,
            json={
                "name": "Updated Buyer",
                "company": "Updated Company",
                "phone": "+1 555 555 0101",
                "country": "Canada",
            },
        )
        self.assertEqual(profile.status_code, 200, profile.text)
        self.assertEqual(profile.json()["country"], "Canada")
        current = self.client.get("/auth/me", headers=first_headers)
        self.assertEqual(current.json()["name"], "Updated Buyer")

        removed = self.client.delete(
            f"/buyers/me/saved-products/{product['id']}",
            headers=first_headers,
        )
        self.assertEqual(removed.status_code, 204)
        self.assertEqual(self.client.get("/buyers/me/saved-products", headers=first_headers).json(), [])

        self.client.put(
            f"/buyers/me/saved-products/{product['id']}",
            headers=first_headers,
        )
        deleted = self.client.delete(
            f"/products/{product['id']}",
            headers=self.admin_headers(),
        )
        self.assertEqual(deleted.status_code, 204)
        self.assertEqual(self.client.get("/buyers/me/saved-products", headers=first_headers).json(), [])

    def test_login_and_registration_reject_invalid_credentials_and_payloads(self):
        invalid_admin = self.client.post(
            "/auth/admin/login",
            json={"email": "admin@example.com", "password": "incorrect-password"},
        )
        self.assertEqual(invalid_admin.status_code, 401)

        invalid_buyer = self.client.post(
            "/auth/register",
            json={
                "name": "Buyer",
                "company": "Buyer Company",
                "email": "not-an-email",
                "phone": "12345",
                "country": "India",
                "password": "short",
            },
        )
        self.assertEqual(invalid_buyer.status_code, 422)

        buyer = self.register_buyer("buyer@example.com")
        duplicate = self.client.post(
            "/auth/register",
            json={
                "name": "Buyer",
                "company": "Buyer Company",
                "email": "buyer@example.com",
                "phone": "12345",
                "country": "India",
                "password": "buyer-password-123",
            },
        )
        self.assertEqual(duplicate.status_code, 409)

        login = self.client.post(
            "/auth/login",
            json={"email": "buyer@example.com", "password": "buyer-password-123"},
        )
        self.assertEqual(login.status_code, 200, login.text)
        self.assertEqual(login.json()["user"]["id"], buyer["user"]["id"])
        parts = login.json()["access_token"].split(".")
        parts[1] = ("A" if parts[1][0] != "A" else "B") + parts[1][1:]
        invalid_token = self.client.get(
            "/enquiries",
            headers={"Authorization": f"Bearer {'.'.join(parts)}"},
        )
        self.assertEqual(invalid_token.status_code, 401)

    def test_rotating_admin_password_invalidates_existing_admin_tokens(self):
        old_headers = self.admin_headers()
        with patch.dict(os.environ, {"ADMIN_PASSWORD": "another-admin-password"}):
            response = self.client.post(
                "/products",
                headers=old_headers,
                json={"name": "Copper", "category": "Copper"},
            )
        self.assertEqual(response.status_code, 401)

    def test_marking_enquiry_responded_requires_a_nonblank_response(self):
        buyer = self.register_buyer("buyer@example.com")
        buyer_headers = {"Authorization": f"Bearer {buyer['access_token']}"}
        admin_headers = self.admin_headers()
        product = self.create_product(admin_headers)
        enquiry_response = self.client.post(
            "/enquiries",
            headers=buyer_headers,
            json={
                "product_id": product["id"],
                "quantity": "1 MT",
                "country": "Japan",
                "message": "Please quote",
            },
        )
        enquiry_id = enquiry_response.json()["id"]

        invalid = self.client.patch(
            f"/enquiries/{enquiry_id}",
            headers=admin_headers,
            json={"status": "Responded", "response": "  "},
        )
        self.assertEqual(invalid.status_code, 422)


    def test_legacy_database_migration_adds_missing_columns_once(self):
        legacy_engine = create_engine("sqlite://")
        with legacy_engine.begin() as connection:
            connection.execute(text("CREATE TABLE products (id INTEGER PRIMARY KEY)"))
            connection.execute(text("CREATE TABLE enquiries (id INTEGER PRIMARY KEY)"))
        migrate_existing_schema(legacy_engine)
        migrate_existing_schema(legacy_engine)

        inspector = inspect(legacy_engine)
        self.assertIn("available", {column["name"] for column in inspector.get_columns("products")})
        self.assertIn("buyer_id", {column["name"] for column in inspector.get_columns("enquiries")})
        legacy_engine.dispose()


if __name__ == "__main__":
    unittest.main()
