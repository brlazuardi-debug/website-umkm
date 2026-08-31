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

    # Update employee info
    res = await client.put(f"/admin/employees/{emp_id}", json={"name": "Jane Doe Staff"}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Jane Doe Staff"

    # Update employee status
    res = await client.patch(f"/admin/employees/{emp_id}/status", json={"status": "INACTIVE"}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["status"] == "INACTIVE"
    assert res.json()["is_active"] is False

    # List employees
    res = await client.get("/admin/employees", headers=admin_headers)
    assert res.status_code == 200
    assert len(res.json()["data"]) >= 1

    # Delete employee
    res = await client.delete(f"/admin/employees/{emp_id}", headers=admin_headers)
    assert res.status_code == 204

    # Verify not found
    res = await client.get(f"/admin/employees/{emp_id}", headers=admin_headers)
    assert res.status_code == 404
