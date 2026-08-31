import pytest

@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

    response_v1 = await client.get("/api/v1/health")
    assert response_v1.status_code == 200
    assert response_v1.json() == {"status": "ok"}
