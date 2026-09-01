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

    # Seed sample products with luxury minimalist fashion images matching Figma specifications
    res = await db.execute(select(Product))
    if not res.scalars().all():
        sample_prods = [
            Product(
                nama="Italian Tailored Black Blazer",
                deskripsi="Jas pria double-breasted premium dari wol Italia super 130s dengan konstruksi kanvas penuh dan detail kancing tanduk asli.",
                harga=1450000,
                stok=12,
                gambar_url="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Architectural Poplin Dress Shirt",
                deskripsi="Kemeja katun poplin Mesir 120s dengan kerah arsitektural, saku tersembunyi, dan potongan tailored elegan.",
                harga=520000,
                stok=24,
                gambar_url="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Heavyweight Minimalist Tee Black",
                deskripsi="T-shirt 280gsm combed cotton jersey berpotongan boxy dengan ribbed collar kokoh dan sentuhan akhir halus.",
                harga=299000,
                stok=45,
                gambar_url="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Tailored Pleated Trousers",
                deskripsi="Celana panjang high-waisted dari wol Jepang dengan lipit tunggal tajam dan siluet jatuh yang sempurna.",
                harga=620000,
                stok=18,
                gambar_url="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Handcrafted Leather Loafers",
                deskripsi="Sepatu formal loafer kulit sapi calfskin asli dengan jahitan tangan Goodyear welted dan sol kulit alami.",
                harga=1250000,
                stok=10,
                gambar_url="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Minimalist Calfskin Leather Belt",
                deskripsi="Sabuk kulit calfskin kualitas tinggi dengan buckle matte nickel minimalis tanpa jahitan tepi yang mencolok.",
                harga=380000,
                stok=22,
                gambar_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Double-Faced Wool Coat Men",
                deskripsi="Mantel luar panjang pria berbahan wol kasmir dua sisi dengan notch lapel elegan dan siluet unconstructed.",
                harga=1850000,
                stok=8,
                gambar_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Structured Tailored Blazer Women",
                deskripsi="Blazer tailored wanita berpotongan arsitektural modern dengan bantalan bahu halus dan siluet ramping berkelas.",
                harga=1350000,
                stok=14,
                gambar_url="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800",
                is_active=True
            ),
            Product(
                nama="Minimalist Noir Chronograph Watch",
                deskripsi="Jam tangan mewah dial hitam sapphire crystal dengan movement otomatis Swiss dan strap kulit asli premium.",
                harga=1650000,
                stok=10,
                gambar_url="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800",
                is_active=True
            ),
        ]
        db.add_all(sample_prods)

    await db.commit()
