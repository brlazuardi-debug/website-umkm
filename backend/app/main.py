import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.exceptions import APIException, api_exception_handler
from app.db.init_db import init_db
from app.modules.auth.router import router as auth_router
from app.modules.users.router import router as users_router
from app.modules.products.router import router as products_router
from app.modules.carts.router import router as carts_router
from app.modules.transactions.router import router as transactions_router
from app.modules.orders.router import router as orders_router
from app.modules.employees.router import router as employees_router

@asynccontextmanager
async def lifespan(fastapi_app: FastAPI):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await init_db(session)
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

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(products_router)
app.include_router(carts_router)
app.include_router(transactions_router)
app.include_router(orders_router)
app.include_router(employees_router)
