import uuid
from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.exceptions import APIException
from app.core.security import AuthUser
from app.modules.transactions.models import Order
from app.modules.transactions.schemas import TransaksiCreate, OrderStatusUpdate
from app.modules.users.service import get_or_create_user

async def create_transaction(db: AsyncSession, auth_user: AuthUser, payload: TransaksiCreate) -> Order:
    user = await get_or_create_user(db, auth_user)
    midtrans_id = f"TRX-{uuid.uuid4().hex[:8].upper()}"
    dummy_qr = f"https://api.qrserver.com/v1/create-qr-code/?size=250x250&data={midtrans_id}"

    order = Order(
        user_id=user.id,
        total_harga=payload.total_harga,
        payment_type=payload.payment_type,
        midtrans_order_id=midtrans_id,
        qr_url=dummy_qr,
        status="PENDING"
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order

async def get_transaction_by_id(db: AsyncSession, order_id: str) -> Order:
    res = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.id == order_id))
    order = res.scalar_one_or_none()
    if not order:
        raise APIException(status_code=404, detail="Transaction not found", error_code="NOT_FOUND")
    return order

async def list_orders(db: AsyncSession, limit: int = 20, offset: int = 0, status: str | None = None, sort: str = "desc"):
    query = select(Order).options(selectinload(Order.items))
    count_query = select(func.count(Order.id))

    if status:
        query = query.where(Order.status == status)
        count_query = count_query.where(Order.status == status)

    if sort == "desc":
        query = query.order_by(Order.created_at.desc())
    else:
        query = query.order_by(Order.created_at.asc())

    query = query.offset(offset).limit(limit)

    total_res = await db.execute(count_query)
    total = total_res.scalar() or 0

    res = await db.execute(query)
    orders = res.scalars().all()

    return {
        "data": orders,
        "meta": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_next": (offset + limit) < total,
        },
    }

async def update_order_status(db: AsyncSession, order_id: str, payload: OrderStatusUpdate) -> Order:
    order = await get_transaction_by_id(db, order_id)
    order.status = payload.status
    if payload.status == "PAID" and not order.paid_at:
        order.paid_at = datetime.now(timezone.utc)
    elif payload.status == "SHIPPED" and not order.shipped_at:
        order.shipped_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(order)
    return order
