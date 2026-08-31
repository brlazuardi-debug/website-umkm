from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import APIException
from app.modules.employees.models import Employee
from app.modules.employees.schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeRoleUpdate, EmployeeStatusUpdate, VALID_ROLES
)

async def list_employees(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None
):
    query = select(Employee)
    count_query = select(func.count(Employee.id))

    if is_active is not None:
        query = query.where(Employee.is_active == is_active)
        count_query = count_query.where(Employee.is_active == is_active)

    if role:
        query = query.where(Employee.role == role)
        count_query = count_query.where(Employee.role == role)

    if search:
        query = query.where(Employee.name.ilike(f"%{search}%") | Employee.email.ilike(f"%{search}%"))
        count_query = count_query.where(Employee.name.ilike(f"%{search}%") | Employee.email.ilike(f"%{search}%"))

    query = query.offset(offset).limit(limit)

    total_res = await db.execute(count_query)
    total = total_res.scalar() or 0

    res = await db.execute(query)
    employees = res.scalars().all()

    return {
        "data": employees,
        "meta": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_next": (offset + limit) < total,
        },
    }

async def get_employee_by_id(db: AsyncSession, employee_id: str) -> Employee:
    res = await db.execute(select(Employee).where(Employee.id == employee_id))
    emp = res.scalar_one_or_none()
    if not emp:
        raise APIException(status_code=404, detail="Employee not found", error_code="NOT_FOUND")
    return emp

async def create_employee(db: AsyncSession, payload: EmployeeCreate) -> Employee:
    res = await db.execute(select(Employee).where(Employee.email == payload.email))
    if res.scalar_one_or_none():
        raise APIException(status_code=409, detail="Conflict — Employee email already exists", error_code="CONFLICT")

    emp = Employee(**payload.model_dump())
    db.add(emp)
    await db.commit()
    await db.refresh(emp)
    return emp

async def update_employee(db: AsyncSession, employee_id: str, payload: EmployeeUpdate) -> Employee:
    emp = await get_employee_by_id(db, employee_id)
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(emp, field, val)
    await db.commit()
    await db.refresh(emp)
    return emp

async def update_employee_role(db: AsyncSession, employee_id: str, payload: EmployeeRoleUpdate) -> Employee:
    if payload.role not in VALID_ROLES:
        raise APIException(status_code=400, detail="Invalid role specified", error_code="BAD_REQUEST")
    emp = await get_employee_by_id(db, employee_id)
    emp.role = payload.role
    await db.commit()
    await db.refresh(emp)
    return emp

async def update_employee_status(db: AsyncSession, employee_id: str, payload: EmployeeStatusUpdate) -> Employee:
    emp = await get_employee_by_id(db, employee_id)
    emp.status = payload.status
    if payload.is_active is not None:
        emp.is_active = payload.is_active
    else:
        emp.is_active = (payload.status == "ACTIVE")
    await db.commit()
    await db.refresh(emp)
    return emp

async def delete_employee(db: AsyncSession, employee_id: str):
    emp = await get_employee_by_id(db, employee_id)
    await db.delete(emp)
    await db.commit()
