import io
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
    assert res.json()["nama"] == "Kemeja Minimalis"

    # Public list check
    res = await client.get("/products")
    assert res.status_code == 200
    assert len(res.json()["data"]) == 1

    # Admin list check
    res = await client.get("/admin/products", headers=admin_headers)
    assert res.status_code == 200
    assert len(res.json()["data"]) == 1

    # Get single product
    res = await client.get(f"/products/{prod_id}")
    assert res.status_code == 200
    assert res.json()["id"] == prod_id

    # Update product
    res = await client.put(f"/products/{prod_id}", json={"nama": "Kemeja Hitam Polos"}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["nama"] == "Kemeja Hitam Polos"

    # Update stock
    res = await client.patch(f"/admin/products/{prod_id}/stock", json={"stok": 25}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["stok"] == 25

    # Upload image
    file_data = io.BytesIO(b"fake image data")
    res = await client.post(
        f"/admin/products/{prod_id}/image",
        files={"file": ("test.jpg", file_data, "image/jpeg")},
        headers=admin_headers,
    )
    assert res.status_code == 200
    assert res.json()["gambar_url"] is not None

    # Delete image
    res = await client.delete(f"/admin/products/{prod_id}/image", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["gambar_url"] is None

    # Delete product
    res = await client.delete(f"/products/{prod_id}", headers=admin_headers)
    assert res.status_code == 204

    # Verify not found
    res = await client.get(f"/products/{prod_id}")
    assert res.status_code == 404
