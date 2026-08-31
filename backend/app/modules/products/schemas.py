from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class PaginationMeta(BaseModel):
    total: int
    limit: int
    offset: int
    has_next: bool

class ProdukCreate(BaseModel):
    nama: str = Field(..., min_length=1)
    deskripsi: str | None = None
    harga: int = Field(..., ge=0)
    stok: int = Field(0, ge=0)
    is_active: bool = True

class ProdukUpdate(BaseModel):
    nama: str | None = Field(None, min_length=1)
    deskripsi: str | None = None
    harga: int | None = Field(None, ge=0)
    stok: int | None = Field(None, ge=0)
    is_active: bool | None = None

class ProdukStockUpdate(BaseModel):
    stok: int = Field(..., ge=0)

class ProdukResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    nama: str
    deskripsi: str | None = None
    harga: int
    stok: int
    gambar_url: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

class ProdukPaginatedResponse(BaseModel):
    data: list[ProdukResponse]
    meta: PaginationMeta
