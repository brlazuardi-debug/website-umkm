import pytest
from app.core.database import AsyncSessionLocal
from app.modules.users.models import User
from app.modules.carts.models import Cart

@pytest.mark.asyncio
async def test_admin_list_and_manage_carts(client):
    admin_headers = {"Authorization": "Bearer admin_cs:cs@example.com:CUSTOMER SERVICE"}
    owner_headers = {"Authorization": "Bearer admin_owner:owner@example.com:OWNER"}

    # Seed a cart directly
    async with AsyncSessionLocal() as db:
        user = User(clerk_id="user_cart_1", email="cartuser@example.com", name="Cart User")
        db.add(user)
        await db.commit()
        await db.refresh(user)

        cart = Cart(user_id=user.id, status="active")
        db.add(cart)
        await db.commit()
        await db.refresh(cart)
        cart_id = cart.id

    # List carts as CS
    res = await client.get("/admin/carts", headers=admin_headers)
    assert res.status_code == 200
    assert len(res.json()["data"]) >= 1
    assert res.json()["meta"]["total"] >= 1

    # Get single cart
    res = await client.get(f"/admin/carts/{cart_id}", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["id"] == cart_id

    # Patch cart status
    res = await client.patch(f"/admin/carts/{cart_id}", json={"status": "abandoned"}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["status"] == "abandoned"

    # Delete cart as OWNER
    res = await client.delete(f"/admin/carts/{cart_id}", headers=owner_headers)
    assert res.status_code == 204

    # Verify not found
    res = await client.get(f"/admin/carts/{cart_id}", headers=admin_headers)
    assert res.status_code == 404
