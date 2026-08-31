from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.core.security import get_current_user, AuthUser
from app.modules.transactions.schemas import TransaksiCreate, TransaksiResponse
from app.modules.transactions.service import create_transaction, get_transaction_by_id

router = APIRouter(tags=["transaksi"])

@router.post("/transactions", response_model=TransaksiResponse, status_code=status.HTTP_201_CREATED)
@router.post(f"{settings.API_V1_STR}/transactions", response_model=TransaksiResponse, status_code=status.HTTP_201_CREATED)
async def post_transaction(
    payload: TransaksiCreate,
    current_user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await create_transaction(db, current_user, payload)

@router.get("/transactions/{transaksi_id}", response_model=TransaksiResponse)
@router.get(f"{settings.API_V1_STR}/transactions/{{transaksi_id}}", response_model=TransaksiResponse)
async def get_transaction(
    transaksi_id: str,
    current_user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await get_transaction_by_id(db, transaksi_id)
