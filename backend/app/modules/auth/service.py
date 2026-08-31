import logging
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

async def process_clerk_webhook(db: AsyncSession, payload: dict):
    event_type = payload.get("type")
    data = payload.get("data", {})
    logger.info("Received Clerk webhook event: %s", event_type)
    return {"status": "success", "event": event_type}

async def process_payment_webhook(db: AsyncSession, payload: dict):
    order_id = payload.get("order_id")
    status = payload.get("transaction_status")
    logger.info("Received Payment webhook for order %s with status %s", order_id, status)
    return {"status": "success", "order_id": order_id}
