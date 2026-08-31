import pytest

@pytest.mark.asyncio
async def test_auth_and_payment_webhooks(client):
    res = await client.post("/auth/webhook", json={"type": "user.created", "data": {"id": "user_svix1"}})
    assert res.status_code == 200

    res = await client.post("/payments/webhook", json={"order_id": "TRX-123", "transaction_status": "settlement"})
    assert res.status_code == 200
