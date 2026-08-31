import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Product(Base):
    __tablename__ = "produk"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nama: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    deskripsi: Mapped[str | None] = mapped_column(Text, nullable=True)
    harga: Mapped[int] = mapped_column(Integer, nullable=False)
    stok: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    gambar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
