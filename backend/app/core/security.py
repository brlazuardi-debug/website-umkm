import jwt
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.config import settings
from app.core.exceptions import APIException

security_scheme = HTTPBearer(auto_error=False)

class AuthUser(BaseModel):
    id: str
    clerk_id: str
    email: str
    name: str = "User"
    role: str = "STAFF"

async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)
) -> AuthUser:
    if not credentials:
        raise APIException(status_code=401, detail="Unauthorized — Bearer JWT token missing", error_code="UNAUTHORIZED")

    token = credentials.credentials

    # Support mock auth mode format: "clerk_id:email:role:name"
    if settings.DEBUG_MOCK_AUTH and ":" in token:
        parts = token.split(":")
        clerk_id = parts[0]
        email = parts[1] if len(parts) > 1 else f"{clerk_id}@example.com"
        role = parts[2] if len(parts) > 2 else "STAFF"
        name = parts[3] if len(parts) > 3 else "Mock User"
        return AuthUser(id=clerk_id, clerk_id=clerk_id, email=email, name=name, role=role)

    # Real JWT decoding if public PEM configured
    if settings.CLERK_PEM_PUBLIC_KEY:
        try:
            payload = jwt.decode(token, settings.CLERK_PEM_PUBLIC_KEY, algorithms=["RS256"])
            clerk_id = payload.get("sub", "")
            email = payload.get("email", f"{clerk_id}@clerk.user")
            role = payload.get("role", "STAFF")
            name = payload.get("name", "User")
            return AuthUser(id=clerk_id, clerk_id=clerk_id, email=email, name=name, role=role)
        except Exception:
            raise APIException(status_code=401, detail="Unauthorized — Invalid JWT token", error_code="INVALID_TOKEN")

    # Default fallback mock auth token
    return AuthUser(id="mock-user-123", clerk_id="user_mock123", email="user@example.com", name="Mock User", role="ADMIN")
