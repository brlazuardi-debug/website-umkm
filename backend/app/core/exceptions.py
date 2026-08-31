from fastapi import HTTPException
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

class ErrorDetail(BaseModel):
    field: str
    message: str

class ErrorResponse(BaseModel):
    detail: str
    error_code: str | None = None
    field_errors: list[ErrorDetail] | None = None

class APIException(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str | None = None,
        field_errors: list[dict[str, str]] | None = None,
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.field_errors = field_errors

async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
    content = {
        "detail": exc.detail,
        "error_code": exc.error_code,
        "field_errors": exc.field_errors,
    }
    return JSONResponse(status_code=exc.status_code, content=content)
