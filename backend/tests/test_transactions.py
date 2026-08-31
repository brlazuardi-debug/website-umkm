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

    # Admin get single order
    res = await client.get(f"/admin/orders/{tx_id}", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["id"] == tx_id

    # Admin update order status to PAID
    res = await client.patch(f"/admin/orders/{tx_id}/status", json={"status": "PAID"}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["status"] == "PAID"
    assert res.json()["paid_at"] is not None
