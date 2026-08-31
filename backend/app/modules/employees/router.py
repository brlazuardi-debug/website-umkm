from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.rbac import require_role
from app.modules.employees.schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeRoleUpdate, EmployeeStatusUpdate, EmployeeResponse, EmployeePaginatedResponse
)
from app.modules.employees.service import (
    list_employees, get_employee_by_id, create_employee, update_employee,
    update_employee_role, update_employee_status, delete_employee
)

router = APIRouter(tags=["admin-employees"])

ADMIN_ROLES = ["OWNER", "ADMIN"]
OWNER_ONLY = ["OWNER"]

@router.get("/admin/employees", response_model=EmployeePaginatedResponse)
@router.get(f"{settings.API_V1_STR}/admin/employees", response_model=EmployeePaginatedResponse)
async def get_employees(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await list_employees(db, limit=limit, offset=offset, search=search, role=role, is_active=is_active)

@router.post("/admin/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
@router.post(f"{settings.API_V1_STR}/admin/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def post_employee(
    payload: EmployeeCreate,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await create_employee(db, payload)

@router.get("/admin/employees/{employee_id}", response_model=EmployeeResponse)
@router.get(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: str,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await get_employee_by_id(db, employee_id)

@router.put("/admin/employees/{employee_id}", response_model=EmployeeResponse)
@router.put(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}", response_model=EmployeeResponse)
async def put_employee(
    employee_id: str,
    payload: EmployeeUpdate,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_employee(db, employee_id, payload)

@router.delete("/admin/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
@router.delete(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_emp(
    employee_id: str,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    await delete_employee(db, employee_id)

@router.patch("/admin/employees/{employee_id}/role", response_model=EmployeeResponse)
@router.patch(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}/role", response_model=EmployeeResponse)
async def patch_employee_role(
    employee_id: str,
    payload: EmployeeRoleUpdate,
    current_user=Depends(require_role(OWNER_ONLY)),
    db: AsyncSession = Depends(get_db)
):
    return await update_employee_role(db, employee_id, payload)

@router.patch("/admin/employees/{employee_id}/status", response_model=EmployeeResponse)
@router.patch(f"{settings.API_V1_STR}/admin/employees/{{employee_id}}/status", response_model=EmployeeResponse)
async def patch_employee_status(
    employee_id: str,
    payload: EmployeeStatusUpdate,
    current_user=Depends(require_role(ADMIN_ROLES)),
    db: AsyncSession = Depends(get_db)
):
    return await update_employee_status(db, employee_id, payload)
