import pytest
from httpx import AsyncClient, ASGITransport
import app.main
from app.core.database import engine, Base
import app.db.base  # ensure all models imported

@pytest.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client():
    transport = ASGITransport(app=app.main.app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
