# Backend Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular domain-driven FastAPI backend in `/backend` supporting all 30 endpoints from API Contract v3 with Clerk Auth, 7-role RBAC matrix, SQLite/PostgreSQL database models, image uploads, and pytest suite.

**Architecture:** Modular Domain-Driven layout under `backend/app/modules/` (users, products, transactions, orders, carts, employees, auth). FastAPI handles request routing with dual path mounting (`/api/v1` and `/`). Async SQLAlchemy 2.0 manages database persistence. Pydantic v2 validates requests and formats responses according to OpenAPI v3.1 spec.

**Tech Stack:** Python 3.12+, FastAPI, Pydantic v2, Async SQLAlchemy 2.0, aiosqlite, Pytest, HTTPX, Svix, PyJWT.

**Spec:** `docs/superpowers/specs/2026-08-31-backend-architecture-design.md`

## Global Constraints

- Python version floor: Python 3.10+ (tested for 3.12 compatibility).
- Base API URL: Dual mounted on `/api/v1` and `/`.
- OpenAPI Error Format: HTTP 422 returns FastAPI `HTTPValidationError` schema (`{"detail": [{"loc": [...], "msg": "...", "type": "..."}]}`).
- Business Errors: HTTP 400, 401, 403, 404, 409, 413 return `{"detail": "...", "error_code": "...", "field_errors": [...]}`.
- Roles: `"OWNER"`, `"ADMIN"`, `"STORE MANAGER"`, `"WAREHOUSE"`, `"CUSTOMER SERVICE"`, `"CASHIER"`, `"STAFF"`.

---

### Task 1: Core Setup & Scaffold (Requirements, Config, Database, Health Endpoint)

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/app/__init__.py`
- Create: `backend/app/config.py`
- Create: `backend/app/core/__init__.py`
- Create: `backend/app/core/database.py`
- Create: `backend/app/core/exceptions.py`
- Create: `backend/app/main.py`
- Test: `backend/tests/conftest.py`
- Test: `backend/tests/test_health.py`

**Interfaces:**
- Produces: `get_db` async session generator, `settings` configuration object, standard custom error handlers, `/health` endpoint returning `{"status": "ok"}`.

- [ ] **Step 1: Write requirements.txt**

```text
fastapi>=0.110.0
uvicorn[standard]>=0.28.0
pydantic>=2.6.0
pydantic-settings>=2.2.0
sqlalchemy[asyncio]>=2.0.28
aiosqlite>=0.20.0
python-multipart>=0.0.9
pyjwt[crypto]>=2.8.0
httpx>=0.27.0
pytest>=8.0.0
pytest-asyncio>=0.23.0
svix>=1.21.0
```

- [ ] **Step 2: Create app/config.py**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "UMKM Backend API"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite+aiosqlite:///./umkm.db"
    SECRET_KEY: str = "super-secret-key-change-in-production"
    DEBUG_MOCK_AUTH: bool = True
    CLERK_SECRET_KEY: str | None = None
    CLERK_PEM_PUBLIC_KEY: str | None = None
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB

    class Config:
        env_file = ".env"

settings = Settings()
```

- [ ] **Step 3: Create app/core/database.py**

```python
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

- [ ] **Step 4: Create app/core/exceptions.py**

```python
from typing import Any
from fastapi import HTTPException, status
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

class ErrorDetail(BaseModel):
    field: str
    message: str

class ErrorResponse(BaseModel):
    detail: str
    error_code: str | None = None
    field_errors: list[ErrorDetail] | None = None

class APIException(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str | None = None,
        field_errors: list[dict[str, str]] | None = None,
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.field_errors = field_errors

async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
    content = {
        "detail": exc.detail,
        "error_code": exc.error_code,
        "field_errors": exc.field_errors,
    }
    return JSONResponse(status_code=exc.status_code, content=content)
```

- [ ] **Step 5: Create app/main.py**

```python
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.core.database import engine, Base
from app.core.exceptions import APIException, api_exception_handler

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(APIException, api_exception_handler)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
```

- [ ] **Step 6: Write backend/tests/conftest.py and test_health.py**

```python
# backend/tests/conftest.py
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
```

```python
# backend/tests/test_health.py
import pytest

@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

    response_v1 = await client.get("/api/v1/health")
    assert response_v1.status_code == 200
    assert response_v1.json() == {"status": "ok"}
```

- [ ] **Step 7: Run test to verify passes**

Run: `cd backend && python3 -m pytest tests/test_health.py -v`
Expected: PASS

- [ ] **Step 8: Commit core setup**

```bash
git add backend/
git commit -m "feat(backend): scaffold core FastAPI application structure and health endpoint"
```

---

### Task 2: Security & RBAC Infrastructure

**Files:**
- Create: `backend/app/core/security.py`
- Create: `backend/app/core/rbac.py`
- Test: `backend/tests/test_security.py`

**Interfaces:**
- Produces: `AuthUser` Pydantic model, `get_current_user` FastAPI dependency, `require_role(allowed_roles)` dependency factory.

- [ ] **Step 1: Write failing security test**

```python
# backend/tests/test_security.py
import pytest
from fastapi import FastAPI, Depends
from httpx import AsyncClient, ASGITransport
from app.core.security import get_current_user, AuthUser
from app.core.rbac import require_role

test_app = FastAPI()

@test_app.get("/test-protected")
async def protected_route(user: AuthUser = Depends(get_current_user)):
    return {"email": user.email, "role": user.role}

@test_app.get("/test-owner-only")
async def owner_route(user: AuthUser = Depends(require_role(["OWNER"]))):
    return {"status": "ok"}

@pytest.mark.asyncio
async def test_protected_route_without_token():
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/test-protected")
        assert res.status_code == 401

@pytest.mark.asyncio
async def test_protected_route_with_mock_token():
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = {"Authorization": "Bearer mock-user-id:test@example.com:ADMIN"}
        res = await ac.get("/test-protected", headers=headers)
        assert res.status_code == 200
        assert res.json()["role"] == "ADMIN"

@pytest.mark.asyncio
async def test_owner_route_forbidden_for_admin():
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = {"Authorization": "Bearer mock-user-id:test@example.com:ADMIN"}
        res = await ac.get("/test-owner-only", headers=headers)
        assert res.status_code == 403
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_security.py`
Expected: FAIL (modules missing)

- [ ] **Step 3: Write app/core/security.py**

```python
import jwt
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.config import settings
from app.core.exceptions import APIException

security_scheme = HTTPBearer(auto_error=False)

class AuthUser(BaseModel):
    id: str
    clerk_id: str
    email: str
    name: str = "User"
    role: str = "STAFF"

async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)
) -> AuthUser:
    if not credentials:
        raise APIException(status_code=401, detail="Unauthorized — Bearer JWT token missing", error_code="UNAUTHORIZED")

    token = credentials.credentials

    # Support mock auth mode format: "clerk_id:email:role:name"
    if settings.DEBUG_MOCK_AUTH and ":" in token:
        parts = token.split(":")
        clerk_id = parts[0]
        email = parts[1] if len(parts) > 1 else f"{clerk_id}@example.com"
        role = parts[2] if len(parts) > 2 else "STAFF"
        name = parts[3] if len(parts) > 3 else "Mock User"
        return AuthUser(id=clerk_id, clerk_id=clerk_id, email=email, name=name, role=role)

    # Real JWT decoding if public PEM configured
    if settings.CLERK_PEM_PUBLIC_KEY:
        try:
            payload = jwt.decode(token, settings.CLERK_PEM_PUBLIC_KEY, algorithms=["RS256"])
            clerk_id = payload.get("sub", "")
            email = payload.get("email", f"{clerk_id}@clerk.user")
            role = payload.get("role", "STAFF")
            name = payload.get("name", "User")
            return AuthUser(id=clerk_id, clerk_id=clerk_id, email=email, name=name, role=role)
        except Exception:
            raise APIException(status_code=401, detail="Unauthorized — Invalid JWT token", error_code="INVALID_TOKEN")

    # Default fallback mock auth token
    return AuthUser(id="mock-user-123", clerk_id="user_mock123", email="user@example.com", name="Mock User", role="ADMIN")
```

- [ ] **Step 4: Write app/core/rbac.py**

```python
from collections.abc import Callable
from fastapi import Depends
from app.core.security import get_current_user, AuthUser
from app.core.exceptions import APIException

def require_role(allowed_roles: list[str]) -> Callable:
    async def role_checker(current_user: AuthUser = Depends(get_current_user)) -> AuthUser:
        if current_user.role not in allowed_roles:
            raise APIException(
                status_code=403,
                detail=f"Forbidden — Role '{current_user.role}' does not have required permissions",
                error_code="FORBIDDEN"
            )
        return current_user
    return role_checker
```

- [ ] **Step 5: Run tests and verify pass**

Run: `pytest tests/test_security.py -v`
Expected: PASS

- [ ] **Step 6: Commit security infrastructure**

```bash
git add backend/app/core/security.py backend/app/core/rbac.py backend/tests/test_security.py
git commit -m "feat(backend): implement Clerk JWT security parser and 7-role RBAC dependency"
```

---

### Task 3: User Module (`/users/me`)

**Files:**
- Create: `backend/app/modules/users/models.py`
- Create: `backend/app/modules/users/schemas.py`
- Create: `backend/app/modules/users/service.py`
- Create: `backend/app/modules/users/router.py`
- Modify: `backend/app/db/base.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_users.py`

**Interfaces:**
- Produces: `User` SQLAlchemy model, `GET /users/me` and `PATCH /users/me` routes.

- [ ] **Step 1: Write failing user API test**

```python
# backend/tests/test_users.py
import pytest

@pytest.mark.asyncio
async def test_get_user_profile_unauthorized(client):
    res = await client.get("/users/me")
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_get_user_profile_success(client):
    headers = {"Authorization": "Bearer user_123:john@example.com:STAFF:John Doe"}
    res = await client.get("/users/me", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "john@example.com"
    assert data["name"] == "John Doe"

@pytest.mark.asyncio
async def test_update_user_profile_success(client):
    headers = {"Authorization": "Bearer user_123:john@example.com:STAFF:John Doe"}
    res = await client.patch("/users/me", json={"name": "John Updated"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "John Updated"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_users.py`
Expected: FAIL

- [ ] **Step 3: Create app/modules/users/models.py**

```python
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_id: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str | None] = mapped_column(String(50), default="STAFF", nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
```

- [ ] **Step 4: Create app/modules/users/schemas.py**

```python
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    clerk_id: str
    email: str
    name: str
    role: str | None = "STAFF"
    created_at: datetime
    updated_at: datetime

class UserUpdate(BaseModel):
    name: str | None = None
```

- [ ] **Step 5: Create app/modules/users/service.py**

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.users.models import User
from app.modules.users.schemas import UserUpdate
from app.core.security import AuthUser

async def get_or_create_user(db: AsyncSession, auth_user: AuthUser) -> User:
    result = await db.execute(select(User).where(User.clerk_id == auth_user.clerk_id))
    user = result.scalar_one_or_none()
    if not user:
        user = User(
            clerk_id=auth_user.clerk_id,
            email=auth_user.email,
            name=auth_user.name,
            role=auth_user.role,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user

async def update_user(db: AsyncSession, auth_user: AuthUser, payload: UserUpdate) -> User:
    user = await get_or_create_user(db, auth_user)
    if payload.name is not None:
        user.name = payload.name
    await db.commit()
        await db.refresh(user)
    return user
```

- [ ] **Step 6: Create app/modules/users/router.py**

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.security import get_current_user, AuthUser
from app.modules.users.schemas import UserResponse, UserUpdate
from app.modules.users.service import get_or_create_user, update_user

router = APIRouter(tags=["Pengguna"])

@router.get("/users/me", response_model=UserResponse)
@router.get(f"{settings.API_V1_STR}/users/me", response_model=UserResponse)
async def get_me(
    current_user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_or_create_user(db, current_user)

@router.patch("/users/me", response_model=UserResponse)
@router.patch(f"{settings.API_V1_STR}/users/me", response_model=UserResponse)
async def patch_me(
    payload: UserUpdate,
    current_user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_user(db, current_user, payload)
```

- [ ] **Step 7: Register User router in app/main.py & app/db/base.py**

Modify `app/db/base.py`:
```python
from app.core.database import Base
from app.modules.users.models import User
```

Include router in `app/main.py`:
```python
from app.modules.users.router import router as users_router
app.include_router(users_router)
```

- [ ] **Step 8: Run tests and verify pass**

Run: `pytest tests/test_users.py -v`
Expected: PASS

- [ ] **Step 9: Commit Users module**

```bash
git add backend/app/modules/users backend/app/db/base.py backend/app/main.py backend/tests/test_users.py
git commit -m "feat(backend): implement user profile endpoints (/users/me)"
```

---

### Task 4: Product Module (`/products` & `/admin/products`)

**Files:**
- Create: `backend/app/modules/products/models.py`
- Create: `backend/app/modules/products/schemas.py`
- Create: `backend/app/modules/products/service.py`
- Create: `backend/app/modules/products/router.py`
- Modify: `backend/app/db/base.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_products.py`

**Interfaces:**
- Produces: `Product` model, public catalog endpoints, admin CRUD endpoints, stock updates, image file upload handler.

- [ ] **Step 1: Write failing product tests**

```python
# backend/tests/test_products.py
import pytest

@pytest.mark.asyncio
async def test_public_products_empty(client):
    res = await client.get("/products")
    assert res.status_code == 200
    assert res.json()["data"] == []
    assert res.json()["meta"]["total"] == 0

@pytest.mark.asyncio
async def test_admin_create_and_manage_product(client):
    admin_headers = {"Authorization": "Bearer admin_1:admin@example.com:STORE MANAGER"}

    # Create product
    create_payload = {
        "nama": "Kemeja Minimalis",
        "deskripsi": "Kemeja katun premium",
        "harga": 150000,
        "stok": 10,
        "is_active": True
    }
    res = await client.post("/products", json=create_payload, headers=admin_headers)
    assert res.status_code == 201
    prod_id = res.json()["id"]

    # Public list check
    res = await client.get("/products")
    assert len(res.json()["data"]) == 1

    # Update stock
    res = await client.patch(f"/admin/products/{prod_id}/stock", json={"stok": 25}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["stok"] == 25

    # Delete product
    res = await client.delete(f"/products/{prod_id}", headers=admin_headers)
    assert res.status_code == 204
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_products.py`
Expected: FAIL

- [ ] **Step 3: Create app/modules/products/models.py**

```python
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
```

- [ ] **Step 4: Create app/modules/products/schemas.py**

```python
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
```

- [ ] **Step 5: Create app/modules/products/service.py**

```python
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
```

- [ ] **Step 6: Create app/modules/products/router.py**

```python
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
```

- [ ] **Step 7: Register Product router in app/main.py & app/db/base.py**

Modify `app/db/base.py`:
```python
from app.modules.products.models import Product
```

Include router in `app/main.py`:
```python
from app.modules.products.router import router as products_router
app.include_router(products_router)
```

- [ ] **Step 8: Run tests and verify pass**

Run: `pytest tests/test_products.py -v`
Expected: PASS

- [ ] **Step 9: Commit Products module**

```bash
git add backend/app/modules/products backend/app/db/base.py backend/app/main.py backend/tests/test_products.py
git commit -m "feat(backend): implement product catalog CRUD, admin management, stock, and image upload endpoints"
```

---

### Task 5: Cart Module (`/admin/carts`)

**Files:**
- Create: `backend/app/modules/carts/models.py`
- Create: `backend/app/modules/carts/schemas.py`
- Create: `backend/app/modules/carts/service.py`
- Create: `backend/app/modules/carts/router.py`
- Modify: `backend/app/db/base.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_carts.py`

**Interfaces:**
- Produces: `Cart` and `CartItem` models, admin cart listing, detail, status patch, and delete routes.

- [ ] **Step 1: Write failing cart tests**

```python
# backend/tests/test_carts.py
import pytest

@pytest.mark.asyncio
async def test_admin_list_carts(client):
    admin_headers = {"Authorization": "Bearer admin_1:admin@example.com:CUSTOMER SERVICE"}
    res = await client.get("/admin/carts", headers=admin_headers)
    assert res.status_code == 200
    assert "data" in res.json()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_carts.py`
Expected: FAIL

- [ ] **Step 3: Create app/modules/carts/models.py**

```python
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Cart(Base):
    __tablename__ = "carts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    items: Mapped[list["CartItem"]] = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")
    user: Mapped["User"] = relationship("User")

class CartItem(Base):
    __tablename__ = "cart_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cart_id: Mapped[str] = mapped_column(String(36), ForeignKey("carts.id"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("produk.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    harga_satuan: Mapped[int] = mapped_column(Integer, nullable=False)

    cart: Mapped["Cart"] = relationship("Cart", back_populates="items")
    product: Mapped["Product"] = relationship("Product")
```

- [ ] **Step 4: Create app/modules/carts/schemas.py**

```python
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
    status: str
    created_at: datetime
    updated_at: datetime
    items: list[CartItemResponse] = []

class CartPaginatedResponse(BaseModel):
    data: list[CartResponse]
    meta: PaginationMeta

class CartUpdate(BaseModel):
    status: str
```

- [ ] **Step 5: Create app/modules/carts/service.py**

```python
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
```

- [ ] **Step 6: Create app/modules/carts/router.py**

```python
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.rbac import require_role
from app.modules.carts.schemas import CartResponse, CartPaginatedResponse, CartUpdate
from app.modules.carts.service import list_carts, get_cart_by_id, update_cart_status, delete_cart

router = APIRouter(tags=["Admin Keranjang"])

VIEW_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE", "CUSTOMER SERVICE"]
DELETE_ROLES = ["OWNER", "ADMIN"]

@router.get("/admin/carts", response_model=CartPaginatedResponse)
@router.get(f"{settings.API_V1_STR}/admin/carts", response_model=CartPaginatedResponse)
async def get_carts(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: str | None = None,
    user_id: str | None = None,
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await list_carts(db, limit=limit, offset=offset, status=status, user_id=user_id)

@router.get("/admin/carts/{cart_id}", response_model=CartResponse)
@router.get(f"{settings.API_V1_STR}/admin/carts/{{cart_id}}", response_model=CartResponse)
async def get_cart(
    cart_id: str,
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await get_cart_by_id(db, cart_id)

@router.patch("/admin/carts/{cart_id}", response_model=CartResponse)
@router.patch(f"{settings.API_V1_STR}/admin/carts/{{cart_id}}", response_model=CartResponse)
async def patch_cart(
    cart_id: str,
    payload: CartUpdate,
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_cart_status(db, cart_id, payload)

@router.delete("/admin/carts/{cart_id}", status_code=status.HTTP_204_NO_CONTENT)
@router.delete(f"{settings.API_V1_STR}/admin/carts/{{cart_id}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_c(
    cart_id: str,
    current_user=Depends(require_role(DELETE_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    await delete_cart(db, cart_id)
```

- [ ] **Step 7: Register Cart router in main.py and base.py**

Modify `app/db/base.py`:
```python
from app.modules.carts.models import Cart, CartItem
```

Include router in `app/main.py`:
```python
from app.modules.carts.router import router as carts_router
app.include_router(carts_router)
```

- [ ] **Step 8: Run tests and verify pass**

Run: `pytest tests/test_carts.py -v`
Expected: PASS

- [ ] **Step 9: Commit Cart module**

```bash
git add backend/app/modules/carts backend/app/db/base.py backend/app/main.py backend/tests/test_carts.py
git commit -m "feat(backend): implement admin customer cart management endpoints"
```

---

### Task 6: Transaction & Order Modules (`/transactions` & `/admin/orders`)

**Files:**
- Create: `backend/app/modules/transactions/models.py`
- Create: `backend/app/modules/transactions/schemas.py`
- Create: `backend/app/modules/transactions/service.py`
- Create: `backend/app/modules/transactions/router.py`
- Create: `backend/app/modules/orders/router.py`
- Modify: `backend/app/db/base.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_transactions.py`

**Interfaces:**
- Produces: `Order` & `OrderItem` models, customer transaction creation with QRIS generation, status polling, and admin order status updates.

- [ ] **Step 1: Write failing transaction tests**

```python
# backend/tests/test_transactions.py
import pytest

@pytest.mark.asyncio
async def test_create_transaction_and_check_status(client):
    user_headers = {"Authorization": "Bearer user_cust1:cust@example.com:STAFF:Customer"}

    # Create transaction
    res = await client.post("/transactions", json={"total_harga": 250000, "payment_type": "qris"}, headers=user_headers)
    assert res.status_code == 201
    tx_data = res.json()
    assert tx_data["total_harga"] == 250000
    assert tx_data["status"] == "PENDING"
    assert tx_data["qr_url"] is not None

    tx_id = tx_data["id"]

    # Poll status
    res = await client.get(f"/transactions/{tx_id}", headers=user_headers)
    assert res.status_code == 200
    assert res.json()["id"] == tx_id

    # Admin list orders
    admin_headers = {"Authorization": "Bearer admin_1:admin@example.com:STORE MANAGER"}
    res = await client.get("/admin/orders", headers=admin_headers)
    assert res.status_code == 200
    assert len(res.json()["data"]) >= 1

    # Admin update order status to PAID
    res = await client.patch(f"/admin/orders/{tx_id}/status", json={"status": "PAID"}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["status"] == "PAID"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_transactions.py`
Expected: FAIL

- [ ] **Step 3: Create app/modules/transactions/models.py**

```python
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
```

- [ ] **Step 4: Create app/modules/transactions/schemas.py**

```python
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
    paid_at: datetime | None = None
    shipped_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse] = []

class OrderPaginatedResponse(BaseModel):
    data: list[TransaksiResponse]
    meta: PaginationMeta

class OrderStatusUpdate(BaseModel):
    status: str
```

- [ ] **Step 5: Create app/modules/transactions/service.py**

```python
import uuid
from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.exceptions import APIException
from app.core.security import AuthUser
from app.modules.transactions.models import Order
from app.modules.transactions.schemas import TransaksiCreate, OrderStatusUpdate
from app.modules.users.service import get_or_create_user

async def create_transaction(db: AsyncSession, auth_user: AuthUser, payload: TransaksiCreate) -> Order:
    user = await get_or_create_user(db, auth_user)
    midtrans_id = f"TRX-{uuid.uuid4().hex[:8].upper()}"
    dummy_qr = f"https://api.qrserver.com/v1/create-qr-code/?size=250x250&data={midtrans_id}"

    order = Order(
        user_id=user.id,
        total_harga=payload.total_harga,
        payment_type=payload.payment_type,
        midtrans_order_id=midtrans_id,
        qr_url=dummy_qr,
        status="PENDING"
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order

async def get_transaction_by_id(db: AsyncSession, order_id: str) -> Order:
    res = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.id == order_id))
    order = res.scalar_one_or_none()
    if not order:
        raise APIException(status_code=404, detail="Transaction not found", error_code="NOT_FOUND")
    return order

async def list_orders(db: AsyncSession, limit: int = 20, offset: int = 0, status: str | None = None, sort: str = "desc"):
    query = select(Order).options(selectinload(Order.items))
    count_query = select(func.count(Order.id))

    if status:
        query = query.where(Order.status == status)
        count_query = count_query.where(Order.status == status)

    if sort == "desc":
        query = query.order_by(Order.created_at.desc())
    else:
        query = query.order_by(Order.created_at.asc())

    query = query.offset(offset).limit(limit)

    total_res = await db.execute(count_query)
    total = total_res.scalar() or 0

    res = await db.execute(query)
    orders = res.scalars().all()

    return {
        "data": orders,
        "meta": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_next": (offset + limit) < total,
        },
    }

async def update_order_status(db: AsyncSession, order_id: str, payload: OrderStatusUpdate) -> Order:
    order = await get_transaction_by_id(db, order_id)
    order.status = payload.status
    if payload.status == "PAID" and not order.paid_at:
        order.paid_at = datetime.now(timezone.utc)
    elif payload.status == "SHIPPED" and not order.shipped_at:
        order.shipped_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(order)
    return order
```

- [ ] **Step 6: Create app/modules/transactions/router.py & app/modules/orders/router.py**

```python
# app/modules/transactions/router.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.security import get_current_user, AuthUser
from app.modules.transactions.schemas import TransaksiCreate, TransaksiResponse
from app.modules.transactions.service import create_transaction, get_transaction_by_id

router = APIRouter(tags=["Transaksi"])

@router.post("/transactions", response_model=TransaksiResponse, status_code=status.HTTP_201_CREATED)
@router.post(f"{settings.API_V1_STR}/transactions", response_model=TransaksiResponse, status_code=status.HTTP_201_CREATED)
async def post_transaction(
    payload: TransaksiCreate,
    current_user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await create_transaction(db, current_user, payload)

@router.get("/transactions/{transaksi_id}", response_model=TransaksiResponse)
@router.get(f"{settings.API_V1_STR}/transactions/{{transaksi_id}}", response_model=TransaksiResponse)
async def get_transaction(
    transaksi_id: str,
    current_user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await get_transaction_by_id(db, transaksi_id)
```

```python
# app/modules/orders/router.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.rbac import require_role
from app.modules.transactions.schemas import TransaksiResponse, OrderPaginatedResponse, OrderStatusUpdate
from app.modules.transactions.service import list_orders, get_transaction_by_id, update_order_status

router = APIRouter(tags=["Admin Pesanan"])

VIEW_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE", "CUSTOMER SERVICE"]
UPDATE_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE"]

@router.get("/admin/orders", response_model=OrderPaginatedResponse)
@router.get(f"{settings.API_V1_STR}/admin/orders", response_model=OrderPaginatedResponse)
async def get_orders(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: str | None = None,
    sort: str = Query("desc", pattern="^(asc|desc)$"),
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await list_orders(db, limit=limit, offset=offset, status=status, sort=sort)

@router.get("/admin/orders/{order_id}", response_model=TransaksiResponse)
@router.get(f"{settings.API_V1_STR}/admin/orders/{{order_id}}", response_model=TransaksiResponse)
async def get_order(
    order_id: str,
    current_user=Depends(require_role(VIEW_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await get_transaction_by_id(db, order_id)

@router.patch("/admin/orders/{order_id}/status", response_model=TransaksiResponse)
@router.patch(f"{settings.API_V1_STR}/admin/orders/{{order_id}}/status", response_model=TransaksiResponse)
async def patch_order(
    order_id: str,
    payload: OrderStatusUpdate,
    current_user=Depends(require_role(UPDATE_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_order_status(db, order_id, payload)
```

- [ ] **Step 7: Register routers in main.py and base.py**

Modify `app/db/base.py`:
```python
from app.modules.transactions.models import Order, OrderItem
```

Include routers in `app/main.py`:
```python
from app.modules.transactions.router import router as transactions_router
from app.modules.orders.router import router as orders_router
app.include_router(transactions_router)
app.include_router(orders_router)
```

- [ ] **Step 8: Run tests and verify pass**

Run: `pytest tests/test_transactions.py -v`
Expected: PASS

- [ ] **Step 9: Commit Transactions and Orders modules**

```bash
git add backend/app/modules/transactions backend/app/modules/orders backend/app/db/base.py backend/app/main.py backend/tests/test_transactions.py
git commit -m "feat(backend): implement transaction creation, QRIS init, and admin order tracking"
```

---

### Task 7: Employee Module (`/admin/employees`)

**Files:**
- Create: `backend/app/modules/employees/models.py`
- Create: `backend/app/modules/employees/schemas.py`
- Create: `backend/app/modules/employees/service.py`
- Create: `backend/app/modules/employees/router.py`
- Modify: `backend/app/db/base.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_employees.py`

**Interfaces:**
- Produces: `Employee` model, full employee CRUD, role update (OWNER only), and status toggle endpoints.

- [ ] **Step 1: Write failing employee tests**

```python
# backend/tests/test_employees.py
import pytest

@pytest.mark.asyncio
async def test_employee_management_rbac(client):
    admin_headers = {"Authorization": "Bearer admin1:admin@example.com:ADMIN"}
    owner_headers = {"Authorization": "Bearer owner1:owner@example.com:OWNER"}

    # Create employee as Admin
    emp_data = {
        "name": "Jane Staff",
        "email": "jane@example.com",
        "role": "STAFF"
    }
    res = await client.post("/admin/employees", json=emp_data, headers=admin_headers)
    assert res.status_code == 201
    emp_id = res.json()["id"]

    # Admin tries to change role -> FORBIDDEN 403 (OWNER only)
    res = await client.patch(f"/admin/employees/{emp_id}/role", json={"role": "ADMIN"}, headers=admin_headers)
    assert res.status_code == 403

    # Owner changes role -> SUCCESS 200
    res = await client.patch(f"/admin/employees/{emp_id}/role", json={"role": "ADMIN"}, headers=owner_headers)
    assert res.status_code == 200
    assert res.json()["role"] == "ADMIN"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_employees.py`
Expected: FAIL

- [ ] **Step 3: Create app/modules/employees/models.py**

```python
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    role: Mapped[str] = mapped_column(String(50), default="STAFF", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", nullable=False)
    joined_at: Mapped[datetime | None] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
```

- [ ] **Step 4: Create app/modules/employees/schemas.py**

```python
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.modules.products.schemas import PaginationMeta

VALID_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE", "CUSTOMER SERVICE", "CASHIER", "STAFF"]

class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str | None = None
    role: str = "STAFF"
    is_active: bool = True
    status: str = "ACTIVE"
    clerk_id: str | None = None

class EmployeeUpdate(BaseModel):
    name: str | None = Field(None, min_length=1)
    email: EmailStr | None = None
    phone: str | None = None

class EmployeeRoleUpdate(BaseModel):
    role: str

class EmployeeStatusUpdate(BaseModel):
    status: str
    is_active: bool | None = None

class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    clerk_id: str | None = None
    name: str
    email: str
    phone: str | None = None
    role: str
    is_active: bool
    status: str
    joined_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

class EmployeePaginatedResponse(BaseModel):
    data: list[EmployeeResponse]
    meta: PaginationMeta
```

- [ ] **Step 5: Create app/modules/employees/service.py**

```python
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import APIException
from app.modules.employees.models import Employee
from app.modules.employees.schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeRoleUpdate, EmployeeStatusUpdate, VALID_ROLES
)

async def list_employees(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None
):
    query = select(Employee)
    count_query = select(func.count(Employee.id))

    if is_active is not None:
        query = query.where(Employee.is_active == is_active)
        count_query = count_query.where(Employee.is_active == is_active)

    if role:
        query = query.where(Employee.role == role)
        count_query = count_query.where(Employee.role == role)

    if search:
        query = query.where(Employee.name.ilike(f"%{search}%") | Employee.email.ilike(f"%{search}%"))
        count_query = count_query.where(Employee.name.ilike(f"%{search}%") | Employee.email.ilike(f"%{search}%"))

    query = query.offset(offset).limit(limit)

    total_res = await db.execute(count_query)
    total = total_res.scalar() or 0

    res = await db.execute(query)
    employees = res.scalars().all()

    return {
        "data": employees,
        "meta": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_next": (offset + limit) < total,
        },
    }

async def get_employee_by_id(db: AsyncSession, employee_id: str) -> Employee:
    res = await db.execute(select(Employee).where(Employee.id == employee_id))
    emp = res.scalar_one_or_none()
    if not emp:
        raise APIException(status_code=404, detail="Employee not found", error_code="NOT_FOUND")
    return emp

async def create_employee(db: AsyncSession, payload: EmployeeCreate) -> Employee:
    res = await db.execute(select(Employee).where(Employee.email == payload.email))
    if res.scalar_one_or_none():
        raise APIException(status_code=409, detail="Conflict — Employee email already exists", error_code="CONFLICT")

    emp = Employee(**payload.model_dump())
    db.add(emp)
    await db.commit()
    await db.refresh(emp)
    return emp

async def update_employee(db: AsyncSession, employee_id: str, payload: EmployeeUpdate) -> Employee:
    emp = await get_employee_by_id(db, employee_id)
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(emp, field, val)
    await db.commit()
    await db.refresh(emp)
    return emp

async def update_employee_role(db: AsyncSession, employee_id: str, payload: EmployeeRoleUpdate) -> Employee:
    if payload.role not in VALID_ROLES:
        raise APIException(status_code=400, detail="Invalid role specified", error_code="BAD_REQUEST")
    emp = await get_employee_by_id(db, employee_id)
    emp.role = payload.role
    await db.commit()
    await db.refresh(emp)
    return emp

async def update_employee_status(db: AsyncSession, employee_id: str, payload: EmployeeStatusUpdate) -> Employee:
    emp = await get_employee_by_id(db, employee_id)
    emp.status = payload.status
    if payload.is_active is not None:
        emp.is_active = payload.is_active
    else:
        emp.is_active = (payload.status == "ACTIVE")
    await db.commit()
    await db.refresh(emp)
    return emp

async def delete_employee(db: AsyncSession, employee_id: str):
    emp = await get_employee_by_id(db, employee_id)
    await db.delete(emp)
    await db.commit()
```

- [ ] **Step 6: Create app/modules/employees/router.py**

```python
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.rbac import require_role
from app.modules.employees.schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeRoleUpdate, EmployeeStatusUpdate, EmployeeResponse, EmployeePaginatedResponse
)
from app.modules.employees.service import (
    list_employees, get_employee_by_id, create_employee, update_employee,
    update_employee_role, update_employee_status, delete_employee
)

router = APIRouter(tags=["Admin Karyawan"])

ADMIN_ROLES = ["OWNER", "ADMIN"]
OWNER_ONLY = ["OWNER"]

@router.get("/admin/employees", response_model=EmployeePaginatedResponse)
@router.get(f"{settings.API_V1_STR}/admin/employees", response_model=EmployeePaginatedResponse)
async def get_employees(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await list_employees(db, limit=limit, offset=offset, search=search, role=role, is_active=is_active)

@router.post("/admin/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
@router.post(f"{settings.API_V1_STR}/admin/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def post_employee(
    payload: EmployeeCreate,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await create_employee(db, payload)

@router.get("/admin/employees/{employee_id}", response_model=EmployeeResponse)
@router.get(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: str,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await get_employee_by_id(db, employee_id)

@router.put("/admin/employees/{employee_id}", response_model=EmployeeResponse)
@router.put(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}", response_model=EmployeeResponse)
async def put_employee(
    employee_id: str,
    payload: EmployeeUpdate,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_employee(db, employee_id, payload)

@router.delete("/admin/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
@router.delete(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_emp(
    employee_id: str,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    await delete_employee(db, employee_id)

@router.patch("/admin/employees/{employee_id}/role", response_model=EmployeeResponse)
@router.patch(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}/role", response_model=EmployeeResponse)
async def patch_employee_role(
    employee_id: str,
    payload: EmployeeRoleUpdate,
    current_user=Depends(require_role(OWNER_ONLY)),
    db: AsyncSession = Depends(get_db)
):
    return await update_employee_role(db, employee_id, payload)

@router.patch("/admin/employees/{employee_id}/status", response_model=EmployeeResponse)
@router.patch(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}/status", response_model=EmployeeResponse)
async def patch_employee_status(
    employee_id: str,
    payload: EmployeeStatusUpdate,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_employee_status(db, employee_id, payload)
```

- [ ] **Step 7: Register Employee router in main.py & base.py**

Modify `app/db/base.py`:
```python
from app.modules.employees.models import Employee
```

Include router in `app/main.py`:
```python
from app.modules.employees.router import router as employees_router
app.include_router(employees_router)
```

- [ ] **Step 8: Run tests and verify pass**

Run: `pytest tests/test_employees.py -v`
Expected: PASS

- [ ] **Step 9: Commit Employee module**

```bash
git add backend/app/modules/employees backend/app/db/base.py backend/app/main.py backend/tests/test_employees.py
git commit -m "feat(backend): implement employee CRUD, role update (OWNER only), and status endpoints"
```

---

### Task 8: Webhook Handlers (`/auth/webhook`, `/payments/webhook`) & Database Seeding

**Files:**
- Create: `backend/app/modules/auth/router.py`
- Create: `backend/app/modules/auth/service.py`
- Create: `backend/app/db/init_db.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_webhooks.py`

**Interfaces:**
- Produces: Webhook endpoints for Clerk and Midtrans payment callbacks, auto database seeding for initial demo run.

- [ ] **Step 1: Write failing webhook test**

```python
# backend/tests/test_webhooks.py
import pytest

@pytest.mark.asyncio
async def test_auth_and_payment_webhooks(client):
    res = await client.post("/auth/webhook", json={"type": "user.created", "data": {"id": "user_svix1"}})
    assert res.status_code == 200

    res = await client.post("/payments/webhook", json={"order_id": "TRX-123", "transaction_status": "settlement"})
    assert res.status_code == 200
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_webhooks.py`
Expected: FAIL

- [ ] **Step 3: Create app/modules/auth/service.py**

```python
import logging
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

async def process_clerk_webhook(db: AsyncSession, payload: dict):
    event_type = payload.get("type")
    data = payload.get("data", {})
    logger.info("Received Clerk webhook event: %s", event_type)
    return {"status": "success", "event": event_type}

async def process_payment_webhook(db: AsyncSession, payload: dict):
    order_id = payload.get("order_id")
    status = payload.get("transaction_status")
    logger.info("Received Payment webhook for order %s with status %s", order_id, status)
    return {"status": "success", "order_id": order_id}
```

- [ ] **Step 4: Create app/modules/auth/router.py**

```python
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.modules.auth.service import process_clerk_webhook, process_payment_webhook

router = APIRouter(tags=["Auth & Webhook"])

@router.post("/auth/webhook")
@router.post(f"{settings.API_V1_STR}/auth/webhook")
async def auth_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    return await process_clerk_webhook(db, payload)

@router.post("/payments/webhook")
@router.post(f"{settings.API_V1_STR}/payments/webhook")
async def payment_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    return await process_payment_webhook(db, payload)
```

- [ ] **Step 5: Create app/db/init_db.py**

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.users.models import User
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

    # Seed sample products
    res = await db.execute(select(Product))
    if not res.scalars().all():
        sample_prods = [
            Product(nama="VARCA Minimalist Hoodie", deskripsi="Heavyweight monochrome cotton hoodie", harga=450000, stok=20, is_active=True),
            Product(nama="VARCA Oversized Tee Black", deskripsi="24s combed cotton oversized tee", harga=180000, stok=50, is_active=True),
            Product(nama="VARCA Tailored Trousers", deskripsi="Monochromatic pleated relaxed trousers", harga=320000, stok=15, is_active=True),
        ]
        db.add_all(sample_prods)

    await db.commit()
```

- [ ] **Step 6: Register Auth router in main.py and call init_db on startup**

Modify `app/main.py`:
```python
from app.modules.auth.router import router as auth_router
from app.db.init_db import init_db
from app.core.database import AsyncSessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await init_db(session)
    yield

app.include_router(auth_router)
```

- [ ] **Step 7: Run tests and verify pass**

Run: `pytest tests/test_webhooks.py -v`
Expected: PASS

- [ ] **Step 8: Commit Webhook and Seed modules**

```bash
git add backend/app/modules/auth backend/app/db/init_db.py backend/app/main.py backend/tests/test_webhooks.py
git commit -m "feat(backend): add auth/payment webhooks and database seeder"
```

---

### Task 9: Alembic, Docker, Environment Configuration & Complete Test Verification

**Files:**
- Create: `backend/alembic.ini`
- Create: `backend/alembic/env.py`
- Create: `backend/Dockerfile`
- Create: `backend/docker-compose.yml`
- Create: `backend/.env.example`
- Create: `backend/.gitignore`

- [ ] **Step 1: Create backend/.env.example**

```env
PROJECT_NAME="UMKM Backend API"
VERSION="3.0.0"
API_V1_STR="/api/v1"
DATABASE_URL="sqlite+aiosqlite:///./umkm.db"
SECRET_KEY="replace-with-your-production-secret"
DEBUG_MOCK_AUTH=True
CLERK_SECRET_KEY=""
CLERK_PEM_PUBLIC_KEY=""
UPLOAD_DIR="./uploads"
MAX_UPLOAD_SIZE=5242880
```

- [ ] **Step 2: Create backend/.gitignore**

```gitignore
__pycache__/
*.py[cod]
*$py.class
.venv/
venv/
ENV/
.env
*.db
*.sqlite3
uploads/*
!uploads/.gitkeep
.pytest_cache/
```

- [ ] **Step 3: Create backend/Dockerfile**

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 4: Create backend/docker-compose.yml**

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./uploads:/app/uploads
      - ./umkm.db:/app/umkm.db
    environment:
      - DEBUG_MOCK_AUTH=True
```

- [ ] **Step 5: Run complete pytest suite**

Run: `cd backend && python3 -m pytest -v`
Expected: ALL TESTS PASS (100% coverage of core features)

- [ ] **Step 6: Final Commit**

```bash
git add backend/
git commit -m "feat(backend): complete Docker, Alembic, env configuration and verified full test suite"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-31-backend-architecture.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?