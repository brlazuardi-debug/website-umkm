import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    total_harga: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING", nullable=False)
    payment_type: Mapped[str] = mapped_column(String(50), default="qris", nullable=False)
    midtrans_order_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    qr_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    shipped_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    user: Mapped["User"] = relationship("User")

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[str] = mapped_column(String(36), ForeignKey("orders.id"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("produk.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    harga_satuan: Mapped[int] = mapped_column(Integer, nullable=False)

    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product")
