import os
import uuid
from fastapi import UploadFile
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.exceptions import APIException
from app.modules.products.models import Product
from app.modules.products.schemas import ProdukCreate, ProdukUpdate, ProdukStockUpdate

async def list_products(
    db: AsyncSession, limit: int = 20, offset: int = 0, search: str | None = None, is_active: bool | None = True
):
    query = select(Product)
    count_query = select(func.count(Product.id))

    if is_active is not None:
        query = query.where(Product.is_active == is_active)
        count_query = count_query.where(Product.is_active == is_active)

    if search:
        query = query.where(Product.nama.ilike(f"%{search}%"))
        count_query = count_query.where(Product.nama.ilike(f"%{search}%"))

    query = query.offset(offset).limit(limit)

    total_res = await db.execute(count_query)
    total = total_res.scalar() or 0

    res = await db.execute(query)
    products = res.scalars().all()

    return {
        "data": products,
        "meta": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_next": (offset + limit) < total,
        },
    }

async def get_product_by_id(db: AsyncSession, product_id: str) -> Product:
    res = await db.execute(select(Product).where(Product.id == product_id))
    prod = res.scalar_one_or_none()
    if not prod:
        raise APIException(status_code=404, detail="Product not found", error_code="NOT_FOUND")
    return prod

async def create_product(db: AsyncSession, payload: ProdukCreate) -> Product:
    prod = Product(**payload.model_dump())
    db.add(prod)
    await db.commit()
    await db.refresh(prod)
    return prod

async def update_product(db: AsyncSession, product_id: str, payload: ProdukUpdate) -> Product:
    prod = await get_product_by_id(db, product_id)
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(prod, field, val)
    await db.commit()
    await db.refresh(prod)
    return prod

async def update_product_stock(db: AsyncSession, product_id: str, payload: ProdukStockUpdate) -> Product:
    prod = await get_product_by_id(db, product_id)
    prod.stok = payload.stok
    await db.commit()
    await db.refresh(prod)
    return prod

async def delete_product(db: AsyncSession, product_id: str):
    prod = await get_product_by_id(db, product_id)
    await db.delete(prod)
    await db.commit()

async def upload_product_image(db: AsyncSession, product_id: str, file: UploadFile) -> Product:
    prod = await get_product_by_id(db, product_id)

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise APIException(status_code=413, detail="Payload Too Large — File image size exceeds 5MB limit", error_code="FILE_TOO_LARGE")

    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    prod.gambar_url = f"/static/uploads/{filename}"
    await db.commit()
    await db.refresh(prod)
    return prod

async def delete_product_image(db: AsyncSession, product_id: str) -> Product:
    prod = await get_product_by_id(db, product_id)
    prod.gambar_url = None
    await db.commit()
    await db.refresh(prod)
    return prod
