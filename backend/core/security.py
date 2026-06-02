"""
JWT verification via Supabase. The Next.js app passes the Supabase JWT in
Authorization: Bearer <token> so the backend can verify the user without
keeping its own session state.
"""
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import create_client
from core.config import get_settings

_bearer = HTTPBearer()


def get_verified_user_id(
    credentials: HTTPAuthorizationCredentials = Security(_bearer),
) -> str:
    settings = get_settings()
    try:
        client = create_client(settings.supabase_url, settings.supabase_service_role_key)
        user = client.auth.get_user(credentials.credentials)
        if user is None or user.user is None:
            raise ValueError("Invalid token")
        return user.user.id
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
        )
