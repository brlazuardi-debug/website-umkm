from datetime import datetime
from pydantic import BaseModel, ConfigDict

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    clerk_id: str
    email: str
    name: str
    role: str | None = "STAFF"
    created_at: datetime
    updated_at: datetime

class UserUpdate(BaseModel):
    name: str | None = None
