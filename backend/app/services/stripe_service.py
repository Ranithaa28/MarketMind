"""
Stripe billing integration. Requires a real Stripe account + webhook
endpoint registered in the Stripe dashboard pointing at
POST /api/subscriptions/webhook for subscription state to stay in sync.
"""
import stripe

from app.core.config import get_settings

settings = get_settings()
stripe.api_key = settings.STRIPE_SECRET_KEY

PRICE_IDS = {
    "pro": settings.STRIPE_PRICE_PRO,
    "enterprise": settings.STRIPE_PRICE_ENTERPRISE,
}


def get_or_create_customer(email: str, existing_customer_id: str | None) -> str:
    if existing_customer_id:
        return existing_customer_id
    customer = stripe.Customer.create(email=email)
    return customer.id


def create_checkout_session(customer_id: str, plan: str, success_url: str, cancel_url: str) -> str:
    price_id = PRICE_IDS.get(plan)
    if not price_id:
        raise ValueError(f"Unknown plan '{plan}'")
    session = stripe.checkout.Session.create(
        customer=customer_id,
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
    )
    return session.url


def create_billing_portal_session(customer_id: str, return_url: str) -> str:
    session = stripe.billing_portal.Session.create(customer=customer_id, return_url=return_url)
    return session.url


def construct_webhook_event(payload: bytes, sig_header: str):
    return stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
