from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.modules.products.schemas import ProdukResponse, PaginationMeta

class CartItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    cart_id: str
    product_id: str
    quantity: int
    harga_satuan: int
    product: ProdukResponse | None = None

class CartResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    status: str = "active"
    created_at: datetime
    updated_at: datetime
    items: list[CartItemResponse] = []

class CartPaginatedResponse(BaseModel):
    data: list[CartResponse]
    meta: PaginationMeta

class CartUpdate(BaseModel):
    status: str
