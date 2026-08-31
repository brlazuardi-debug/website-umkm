from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.rbac import require_role
from app.modules.carts.schemas import CartResponse, CartPaginatedResponse, CartUpdate
from app.modules.carts.service import list_carts, get_cart_by_id, update_cart_status, delete_cart

router = APIRouter(tags=["admin-carts"])

VIEW_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE", "CUSTOMER SERVICE"]
DELETE_ROLES = ["OWNER", "ADMIN"]

@router.get("/admin/carts", response_model=CartPaginatedResponse)
@router.get(f"{settings.API_V1_STR}/admin/carts", response_model=CartPaginatedResponse)
async def get_carts(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: str | None = None,
    user_id: str | None = None,
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await list_carts(db, limit=limit, offset=offset, status=status, user_id=user_id)

@router.get("/admin/carts/{cart_id}", response_model=CartResponse)
@router.get(f"{settings.API_V1_STR}/admin/carts/{{cart_id}}", response_model=CartResponse)
async def get_cart(
    cart_id: str,
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await get_cart_by_id(db, cart_id)

@router.patch("/admin/carts/{cart_id}", response_model=CartResponse)
@router.patch(f"{settings.API_V1_STR}/admin/carts/{{cart_id}}", response_model=CartResponse)
async def patch_cart(
    cart_id: str,
    payload: CartUpdate,
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_cart_status(db, cart_id, payload)

@router.delete("/admin/carts/{cart_id}", status_code=status.HTTP_204_NO_CONTENT)
@router.delete(f"{settings.API_V1_STR}/admin/carts/{{cart_id}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_c(
    cart_id: str,
    current_user=Depends(require_role(DELETE_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    await delete_cart(db, cart_id)
