from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.products.models import Product
from app.modules.employees.models import Employee

async def init_db(db: AsyncSession):
    # Seed Owner/Admin employee if missing
    res = await db.execute(select(Employee).where(Employee.email == "owner@varca.id"))
    if not res.scalar_one_or_none():
        owner = Employee(
            name="VARCA Owner",
            email="owner@varca.id",
            phone="+6281234567890",
            role="OWNER",
            is_active=True,
            status="ACTIVE"
        )
        db.add(owner)

    # Seed sample products with luxury minimalist fashion images matching Figma
    res = await db.execute(select(Product))
    if not res.scalars().all():
        sample_prods = [
            Product(
                nama="The Essential Overshirt",
                deskripsi="Heavyweight structured cotton overshirt with horn buttons and relaxed fit.",
                harga=499000,
                stok=20,
                gambar_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Heavyweight Oversized Tee Black",
                deskripsi="280gsm combed cotton jersey in a boxy dropped-shoulder silhouette.",
                harga=289000,
                stok=45,
                gambar_url="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Tailored Pleated Trousers",
                deskripsi="Monochromatic high-waisted relaxed trousers with deep front pleats.",
                harga=580000,
                stok=15,
                gambar_url="https://images.unsplash.com/photo-1542272604-780c96856553?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Relaxed Structured Shirt Off-White",
                deskripsi="Crisp luxury poplin shirt designed with an architectural collar and hidden placket.",
                harga=420000,
                stok=18,
                gambar_url="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Minimalist Cargo Trousers",
                deskripsi="Streamlined military-inspired trousers with flush seamless utility pockets.",
                harga=520000,
                stok=12,
                gambar_url="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Monochrome Minimalist Wool Coat",
                deskripsi="Double-faced Italian wool blend overcoat with clean notch lapels.",
                harga=1250000,
                stok=8,
                gambar_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800",
                is_active=True
            ),
        ]
        db.add_all(sample_prods)

    await db.commit()
