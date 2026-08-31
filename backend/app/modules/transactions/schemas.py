from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.modules.products.schemas import ProdukResponse, PaginationMeta

class TransaksiCreate(BaseModel):
    total_harga: int = Field(..., ge=0)
    payment_type: str = "qris"

class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_id: str
    product_id: str
    quantity: int
    harga_satuan: int
    product: ProdukResponse | None = None

class TransaksiResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    total_harga: int
    status: str
    payment_type: str
    midtrans_order_id: str | None = None
    qr_url: str | None = None
    created_at: datetime
    updated_at: datetime

class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    total_harga: int
    status: str
    payment_type: str
    paid_at: datetime | None = None
    shipped_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse] = []

class OrderPaginatedResponse(BaseModel):
    data: list[OrderResponse]
    meta: PaginationMeta

class OrderStatusUpdate(BaseModel):
    status: str
