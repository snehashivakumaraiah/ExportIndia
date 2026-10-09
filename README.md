# ExportIndia Scrap Marketplace

React/Vite frontend with a FastAPI and PostgreSQL backend.

## Local setup

1. Install frontend dependencies and start Vite from this directory:

   ```powershell
   npm ci
   npm run dev
   ```

2. Create `backend/.env` using `backend/.env.example` as a template. Set
   `DATABASE_URL`, a unique `ADMIN_EMAIL`, an `ADMIN_PASSWORD` of at least
   12 characters, and a cryptographically random `AUTH_TOKEN_SECRET` of at
   least 32 bytes. Do not commit the `.env` file.

3. Install backend dependencies and start FastAPI from `backend`:

   ```powershell
   py -m venv venv
   .\venv\Scripts\python.exe -m pip install -r requirements.txt
   .\venv\Scripts\python.exe -m uvicorn main:app --reload
   ```

   Use a Python version supported by FastAPI and the selected psycopg wheel.
   The API listens on `http://localhost:8000` by default.

4. Optionally copy `.env.example` to the frontend `.env` to configure
   `VITE_API_URL`, `VITE_CONTACT_EMAIL`, and `VITE_WHATSAPP_NUMBER`.
   Set `FRONTEND_ORIGINS` in `backend/.env` to the comma-separated exact origins
   of the frontend. Defaults permit Vite development and preview on localhost
   and 127.0.0.1 ports 5173 and 4173.

The backend creates missing tables on startup and applies the versioned
`001_add_product_availability_and_enquiry_buyer` schema migration. Existing
enquiries remain available to administrators but are not assigned to a buyer.

## Accounts, privacy, and API

- Buyers register and sign in through `/auth/register` and `/auth/login`.
  Passwords are stored as PBKDF2 hashes; signed bearer tokens expire after
  eight hours and are kept in browser session storage.
- Admin login uses the `ADMIN_EMAIL` and `ADMIN_PASSWORD` deployment settings.
  Catalog writes and enquiry updates require the administrator bearer token.
- Product reads are public. Buyer quote creation, profile changes, and saved
  products require a buyer token. Buyers can only read their own enquiries and
  saved products; administrator enquiry reads include buyer contact details.
- Product endpoints: `GET /products`, `GET /products/{id}`, `POST /products`,
  `PUT /products/{id}`, `DELETE /products/{id}`.
- Enquiry endpoints: `POST /enquiries`, `GET /enquiries`,
  `PATCH /enquiries/{id}`.
- Buyer endpoints: `GET/PUT /auth/me`, `GET /buyers/me/saved-products`, and
  `PUT/DELETE /buyers/me/saved-products/{product_id}`.

Deploy behind HTTPS, replace all example credentials/secrets, and restrict
`FRONTEND_ORIGINS` to trusted origins. The bearer token is a browser credential;
the frontend must be protected against cross-site scripting and served over
HTTPS.

## Validation

Run frontend checks from this directory:

```powershell
npm run build
npm run lint
```

Run backend tests from `backend`:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\venv\Scripts\python.exe -m unittest discover -s tests -v
```
