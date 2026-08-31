from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.exceptions import APIException
from app.modules.carts.models import Cart
from app.modules.carts.schemas import CartUpdate

async def list_carts(
    db: AsyncSession, limit: int = 20, offset: int = 0, status: str | None = None, user_id: str | None = None
):
    query = select(Cart).options(selectinload(Cart.items))
    count_query = select(func.count(Cart.id))

    if status:
        query = query.where(Cart.status == status)
        count_query = count_query.where(Cart.status == status)

    if user_id:
        query = query.where(Cart.user_id == user_id)
        count_query = count_query.where(Cart.user_id == user_id)

    query = query.offset(offset).limit(limit)

    total_res = await db.execute(count_query)
    total = total_res.scalar() or 0

    res = await db.execute(query)
    carts = res.scalars().all()

    return {
        "data": carts,
        "meta": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_next": (offset + limit) < total,
        },
    }

async def get_cart_by_id(db: AsyncSession, cart_id: str) -> Cart:
    res = await db.execute(select(Cart).options(selectinload(Cart.items)).where(Cart.id == cart_id))
    cart = res.scalar_one_or_none()
    if not cart:
        raise APIException(status_code=404, detail="Cart not found", error_code="NOT_FOUND")
    return cart

async def update_cart_status(db: AsyncSession, cart_id: str, payload: CartUpdate) -> Cart:
    cart = await get_cart_by_id(db, cart_id)
    cart.status = payload.status
    await db.commit()
    await db.refresh(cart)
    return cart

async def delete_cart(db: AsyncSession, cart_id: str):
    cart = await get_cart_by_id(db, cart_id)
    await db.delete(cart)
    await db.commit()
