"""
Clerk authentication.

Clerk issues short-lived JWTs to the frontend. We verify them here using
Clerk's JWKS endpoint (no Clerk backend SDK required), which keeps the
backend framework-agnostic and easy to test.

To use in production:
1. Set CLERK_JWKS_URL and CLERK_ISSUER in .env (found in your Clerk dashboard
   under "API Keys" -> "Advanced" -> "JWKS URL").
2. The frontend must attach `Authorization: Bearer <clerk_session_token>`
   to every API request (see frontend/lib/api.ts).
"""
from functools import lru_cache
from typing import Optional

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from jose.exceptions import JWTError

from app.core.config import get_settings

security_scheme = HTTPBearer(auto_error=False)


@lru_cache
def _jwks_cache() -> dict:
    """Fetch and cache Clerk's JSON Web Key Set."""
    settings = get_settings()
    if not settings.CLERK_JWKS_URL:
        return {"keys": []}
    resp = httpx.get(settings.CLERK_JWKS_URL, timeout=10)
    resp.raise_for_status()
    return resp.json()


class AuthUser:
    def __init__(self, user_id: str, email: Optional[str] = None):
        self.user_id = user_id
        self.email = email


def _decode_clerk_token(token: str) -> dict:
    settings = get_settings()
    jwks = _jwks_cache()
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token header") from exc

    key = next((k for k in jwks.get("keys", []) if k.get("kid") == unverified_header.get("kid")), None)
    if key is None:
        # Refresh cache once in case of key rotation.
        _jwks_cache.cache_clear()
        jwks = _jwks_cache()
        key = next((k for k in jwks.get("keys", []) if k.get("kid") == unverified_header.get("kid")), None)
    if key is None:
        raise HTTPException(status_code=401, detail="Unable to verify token signature")

    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            issuer=settings.CLERK_ISSUER or None,
            options={"verify_aud": False},
        )
    except JWTError as exc:
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}") from exc
    return payload


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
) -> AuthUser:
    settings = get_settings()

    # Local/dev convenience: if Clerk isn't configured, allow a fake user so
    # the API is exercisable without a live Clerk account.
    if not settings.CLERK_JWKS_URL:
        if settings.ENVIRONMENT == "development":
            return AuthUser(user_id="dev-user", email="dev@example.com")
        raise HTTPException(status_code=500, detail="Auth is not configured")

    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    payload = _decode_clerk_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing subject claim")
    return AuthUser(user_id=user_id, email=payload.get("email"))
