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
