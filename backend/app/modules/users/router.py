from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.security import get_current_user, AuthUser
from app.modules.users.schemas import UserResponse, UserUpdate
from app.modules.users.service import get_or_create_user, update_user

router = APIRouter(tags=["Pengguna"])

@router.get("/users/me", response_model=UserResponse)
@router.get(f"{settings.API_V1_STR}/users/me", response_model=UserResponse)
async def get_me(
    current_user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_or_create_user(db, current_user)

@router.patch("/users/me", response_model=UserResponse)
@router.patch(f"{settings.API_V1_STR}/users/me", response_model=UserResponse)
async def patch_me(
    payload: UserUpdate,
    current_user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_user(db, current_user, payload)
