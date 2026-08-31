from fastapi import APIRouter, Depends, UploadFile, File, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.rbac import require_role
from app.modules.products.schemas import (
    ProdukCreate, ProdukUpdate, ProdukStockUpdate, ProdukResponse, ProdukPaginatedResponse
)
from app.modules.products.service import (
    list_products, get_product_by_id, create_product, update_product,
    update_product_stock, delete_product, upload_product_image, delete_product_image
)

router = APIRouter(tags=["Produk"])

ADMIN_ROLES = ["OWNER", "ADMIN", "STORE MANAGER"]
WAREHOUSE_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE"]

@router.get("/products", response_model=ProdukPaginatedResponse)
@router.get(f"{settings.API_V1_STR}/products", response_model=ProdukPaginatedResponse)
async def get_public_products(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    return await list_products(db, limit=limit, offset=offset, search=search, is_active=True)

@router.get("/admin/products", response_model=ProdukPaginatedResponse)
@router.get(f"{settings.API_V1_STR}/admin/products", response_model=ProdukPaginatedResponse)
async def get_admin_products(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: str | None = None,
    is_active: bool | None = None,
    current_user=Depends(require_role(WAREHOUSE_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await list_products(db, limit=limit, offset=offset, search=search, is_active=is_active)

@router.get("/products/{produk_id}", response_model=ProdukResponse)
@router.get(f"{settings.API_V1_STR}/products/{{produk_id}}", response_model=ProdukResponse)
async def get_product(produk_id: str, db: AsyncSession = Depends(get_db)):
    return await get_product_by_id(db, produk_id)

@router.post("/products", response_model=ProdukResponse, status_code=status.HTTP_201_CREATED)
@router.post(f"{settings.API_V1_STR}/products", response_model=ProdukResponse, status_code=status.HTTP_201_CREATED)
async def post_product(
    payload: ProdukCreate,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await create_product(db, payload)

@router.put("/products/{produk_id}", response_model=ProdukResponse)
@router.put(f"{settings.API_V1_STR}/products/{{produk_id}}", response_model=ProdukResponse)
async def put_product(
    produk_id: str,
    payload: ProdukUpdate,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_product(db, produk_id, payload)

@router.patch("/admin/products/{produk_id}/stock", response_model=ProdukResponse)
@router.patch(f"{settings.API_V1_STR}/admin/products/{{produk_id}}/stock", response_model=ProdukResponse)
async def patch_stock(
    produk_id: str,
    payload: ProdukStockUpdate,
    current_user=Depends(require_role(WAREHOUSE_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_product_stock(db, produk_id, payload)

@router.delete("/products/{produk_id}", status_code=status.HTTP_204_NO_CONTENT)
@router.delete(f"{settings.API_V1_STR}/products/{{produk_id}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prod(
    produk_id: str,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    await delete_product(db, produk_id)

@router.post("/admin/products/{produk_id}/image", response_model=ProdukResponse)
@router.post(f"{settings.API_V1_STR}/admin/products/{{produk_id}}/image", response_model=ProdukResponse)
async def post_image(
    produk_id: str,
    file: UploadFile = File(...),
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await upload_product_image(db, produk_id, file)

@router.delete("/admin/products/{produk_id}/image", response_model=ProdukResponse)
@router.delete(f"{settings.API_V1_STR}/admin/products/{{produk_id}}/image", response_model=ProdukResponse)
async def delete_image(
    produk_id: str,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await delete_product_image(db, produk_id)
