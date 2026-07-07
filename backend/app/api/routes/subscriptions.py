from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import get_or_create_db_user
from app.db.models import PlanTier, User
from app.db.session import get_db
from app.services.stripe_service import (
    construct_webhook_event,
    create_billing_portal_session,
    create_checkout_session,
    get_or_create_customer,
)

router = APIRouter(prefix="/api/subscriptions", tags=["subscriptions"])


@router.post("/checkout")
def checkout(plan: str, db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    if plan not in ("pro", "enterprise"):
        raise HTTPException(status_code=400, detail="Invalid plan")

    customer_id = get_or_create_customer(user.email, user.stripe_customer_id)
    if not user.stripe_customer_id:
        user.stripe_customer_id = customer_id
        db.commit()

    url = create_checkout_session(
        customer_id=customer_id,
        plan=plan,
        success_url="http://localhost:3000/dashboard/billing?success=true",
        cancel_url="http://localhost:3000/dashboard/billing?canceled=true",
    )
    return {"checkout_url": url}


@router.post("/portal")
def billing_portal(db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    if not user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No billing account yet")
    url = create_billing_portal_session(user.stripe_customer_id, "http://localhost:3000/dashboard/billing")
    return {"portal_url": url}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    try:
        event = construct_webhook_event(payload, sig_header)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Invalid webhook signature: {exc}") from exc

    data = event["data"]["object"]
    customer_id = data.get("customer")

    if event["type"] in ("customer.subscription.created", "customer.subscription.updated"):
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            price_id = data["items"]["data"][0]["price"]["id"]
            from app.services.stripe_service import PRICE_IDS

            plan = next((k for k, v in PRICE_IDS.items() if v == price_id), "free")
            user.plan = PlanTier(plan)
            user.stripe_subscription_id = data.get("id")
            db.commit()

    elif event["type"] == "customer.subscription.deleted":
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.plan = PlanTier.FREE
            user.stripe_subscription_id = None
            db.commit()

    return {"received": True}
