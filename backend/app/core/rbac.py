from collections.abc import Callable
from fastapi import Depends
from app.core.security import get_current_user, AuthUser
from app.core.exceptions import APIException

def require_role(allowed_roles: list[str]) -> Callable:
    async def role_checker(current_user: AuthUser = Depends(get_current_user)) -> AuthUser:
        if current_user.role not in allowed_roles:
            raise APIException(
                status_code=403,
                detail=f"Forbidden — Role '{current_user.role}' does not have required permissions",
                error_code="FORBIDDEN"
            )
        return current_user
    return role_checker
