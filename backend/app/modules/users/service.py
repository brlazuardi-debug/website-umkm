from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.users.models import User
from app.modules.users.schemas import UserUpdate
from app.core.security import AuthUser

async def get_or_create_user(db: AsyncSession, auth_user: AuthUser) -> User:
    result = await db.execute(select(User).where(User.clerk_id == auth_user.clerk_id))
    user = result.scalar_one_or_none()
    if not user:
        user = User(
            clerk_id=auth_user.clerk_id,
            email=auth_user.email,
            name=auth_user.name,
            role=auth_user.role,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user

async def update_user(db: AsyncSession, auth_user: AuthUser, payload: UserUpdate) -> User:
    user = await get_or_create_user(db, auth_user)
    if payload.name is not None:
        user.name = payload.name
    await db.commit()
    await db.refresh(user)
    return user
