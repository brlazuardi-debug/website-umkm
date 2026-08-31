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
