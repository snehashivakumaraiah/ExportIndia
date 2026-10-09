import hashlib
import hmac
import os
import secrets
import time
from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database import get_db
from models import Buyer


TOKEN_LIFETIME_SECONDS = 8 * 60 * 60
PASSWORD_ITERATIONS = 600_000
bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Principal:
    role: str
    subject: str
    buyer: Buyer | None = None


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PASSWORD_ITERATIONS,
    )
    return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded_hash: str) -> bool:
    try:
        algorithm, iterations, encoded_salt, expected = encoded_hash.split("$", 3)
        iteration_count = int(iterations)
        if algorithm != "pbkdf2_sha256" or not 100_000 <= iteration_count <= 2_000_000:
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(encoded_salt),
            iteration_count,
        )
        return hmac.compare_digest(digest.hex(), expected)
    except (ValueError, TypeError):
        return False


def create_access_token(
    role: str,
    subject: str,
    credential_version: str | None = None,
) -> str:
    payload = {
        "role": role,
        "sub": subject,
        "exp": int(time.time()) + TOKEN_LIFETIME_SECONDS,
    }
    if credential_version is not None:
        payload["ver"] = credential_version
    return jwt.encode(payload, require_token_secret(), algorithm="HS256")


def decode_access_token(token: str) -> dict[str, str | int]:
    try:
        payload = jwt.decode(
            token,
            require_token_secret(),
            algorithms=["HS256"],
            options={"require": ["exp", "role", "sub"]},
        )
        if payload["role"] not in {"admin", "buyer"} or not isinstance(payload["sub"], str):
            raise jwt.InvalidTokenError("Invalid token subject")
        return payload
    except jwt.InvalidTokenError as error:
        raise HTTPException(status_code=401, detail="Invalid or expired access token") from error


def get_current_principal(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Principal:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentication required")

    payload = decode_access_token(credentials.credentials)
    subject = str(payload["sub"])
    if payload["role"] == "admin":
        admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
        admin_password = os.getenv("ADMIN_PASSWORD", "")
        current_version = hmac.digest(
            admin_password.encode("utf-8"),
            b"admin-auth-version",
            "sha256",
        ).hex()
        if (
            not admin_email
            or not hmac.compare_digest(subject.encode("utf-8"), admin_email.encode("utf-8"))
            or not hmac.compare_digest(str(payload.get("ver", "")), current_version)
        ):
            raise HTTPException(status_code=401, detail="Invalid admin session")
        return Principal(role="admin", subject=subject)

    try:
        buyer_id = int(subject)
    except ValueError as error:
        raise HTTPException(status_code=401, detail="Invalid buyer session") from error
    buyer = db.query(Buyer).filter(Buyer.id == buyer_id).first()
    if buyer is None:
        raise HTTPException(status_code=401, detail="Buyer account no longer exists")
    return Principal(role="buyer", subject=subject, buyer=buyer)


def require_admin(principal: Principal = Depends(get_current_principal)) -> Principal:
    if principal.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required")
    return principal


def require_buyer(principal: Principal = Depends(get_current_principal)) -> Principal:
    if principal.role != "buyer" or principal.buyer is None:
        raise HTTPException(status_code=403, detail="Buyer account required")
    return principal


def require_token_secret() -> bytes:
    secret = os.getenv("AUTH_TOKEN_SECRET", "")
    encoded_secret = secret.encode("utf-8")
    if len(encoded_secret) < 32:
        raise HTTPException(
            status_code=503,
            detail="AUTH_TOKEN_SECRET must be configured with at least 32 characters",
        )
    return encoded_secret
