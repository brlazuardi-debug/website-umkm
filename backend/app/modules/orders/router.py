from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.rbac import require_role
from app.modules.transactions.schemas import OrderResponse, OrderPaginatedResponse, OrderStatusUpdate
from app.modules.transactions.service import list_orders, get_transaction_by_id, update_order_status

router = APIRouter(tags=["admin-orders"])

VIEW_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE", "CUSTOMER SERVICE"]
UPDATE_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE"]

@router.get("/admin/orders", response_model=OrderPaginatedResponse)
@router.get(f"{settings.API_V1_STR}/admin/orders", response_model=OrderPaginatedResponse)
async def get_orders(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: str | None = None,
    sort: str = Query("desc", pattern="^(asc|desc)$"),
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await list_orders(db, limit=limit, offset=offset, status=status, sort=sort)

@router.get("/admin/orders/{order_id}", response_model=OrderResponse)
@router.get(f"{settings.API_V1_STR}/admin/orders/{{order_id}}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await get_transaction_by_id(db, order_id)

@router.patch("/admin/orders/{order_id}/status", response_model=OrderResponse)
@router.patch(f"{settings.API_V1_STR}/admin/orders/{{order_id}}/status", response_model=OrderResponse)
async def patch_order(
    order_id: str,
    payload: OrderStatusUpdate,
    current_user=Depends(require_role(UPDATE_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_order_status(db, order_id, payload)
