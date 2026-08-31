from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.core.database import get_db
from app.modules.auth.service import process_clerk_webhook, process_payment_webhook

router = APIRouter(tags=["webhooks"])

@router.post("/auth/webhook")
@router.post(f"{settings.API_V1_STR}/auth/webhook")
async def auth_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    return await process_clerk_webhook(db, payload)

@router.post("/payments/webhook")
@router.post(f"{settings.API_V1_STR}/payments/webhook")
async def payment_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    return await process_payment_webhook(db, payload)
