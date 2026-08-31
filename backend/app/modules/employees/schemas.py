from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.modules.products.schemas import PaginationMeta

VALID_ROLES = ["OWNER", "ADMIN", "STORE MANAGER", "WAREHOUSE", "CUSTOMER SERVICE", "CASHIER", "STAFF"]

class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str | None = None
    role: str = "STAFF"
    is_active: bool = True
    status: str = "ACTIVE"
    clerk_id: str | None = None

class EmployeeUpdate(BaseModel):
    name: str | None = Field(None, min_length=1)
    email: EmailStr | None = None
    phone: str | None = None

class EmployeeRoleUpdate(BaseModel):
    role: str

class EmployeeStatusUpdate(BaseModel):
    status: str
    is_active: bool | None = None

class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    clerk_id: str | None = None
    name: str
    email: str
    phone: str | None = None
    role: str
    is_active: bool
    status: str
    joined_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

class EmployeePaginatedResponse(BaseModel):
    data: list[EmployeeResponse]
    meta: PaginationMeta
