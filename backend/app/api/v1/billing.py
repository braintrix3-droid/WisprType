import stripe
import logging
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.models import User, Subscription, SubscriptionTier, SubscriptionStatus
from app.core.security import get_current_user

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_API_KEY

router = APIRouter()

@router.post("/portal")
async def create_portal_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates a Stripe billing management portal session for the active user.
    """
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    
    # Auto-provision a subscription record if none exists yet
    if not sub:
        sub = Subscription(
            user_id=current_user.id,
            current_period_start=datetime.utcnow(),
            current_period_end=datetime.utcnow() + timedelta(days=30),
            status=SubscriptionStatus.ACTIVE,
            tier=SubscriptionTier.FREE
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)
        
    if not sub.stripe_customer_id:
        try:
            customer = stripe.Customer.create(email=current_user.email)
            sub.stripe_customer_id = customer.id
            db.commit()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stripe Customer creation failed: {str(e)}"
            )
            
    try:
        session = stripe.billing_portal.Session.create(
            customer=sub.stripe_customer_id,
            return_url="http://localhost:3000/dashboard" # Mapped frontend portal redirect
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe Session creation failed: {str(e)}"
        )

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook endpoint to capture Stripe events.
    Synchronizes tiers, status, and subscription parameters in the local database.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not sig_header:
        return Response(content="Missing stripe-signature header", status_code=status.HTTP_400_BAD_REQUEST)
        
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        logger.error(f"Webhook signature check failed: {str(e)}")
        return Response(content=f"Signature error: {str(e)}", status_code=status.HTTP_400_BAD_REQUEST)
        
    event_type = event["type"]
    data_object = event["data"]["object"]
    
    logger.info(f"Received Stripe Event: {event_type}")
    
    # 1. Handle Subscription Creation or Updates
    if event_type in ["customer.subscription.created", "customer.subscription.updated"]:
        stripe_sub_id = data_object["id"]
        customer_id = data_object["customer"]
        status_val = data_object["status"]
        
        price_id = data_object["items"]["data"][0]["price"]["id"]
        tier = SubscriptionTier.FREE
        if price_id == settings.STRIPE_PRO_PRICE_ID:
            tier = SubscriptionTier.PRO
            
        period_start = datetime.fromtimestamp(data_object["current_period_start"])
        period_end = datetime.fromtimestamp(data_object["current_period_end"])
        cancel_at_period_end = data_object["cancel_at_period_end"]
        
        sub = db.query(Subscription).filter(Subscription.stripe_customer_id == customer_id).first()
        if not sub:
            # Retrieve customer details to map email to user
            customer_data = stripe.Customer.retrieve(customer_id)
            user = db.query(User).filter(User.email == customer_data.get("email")).first()
            if user:
                sub = Subscription(user_id=user.id, stripe_customer_id=customer_id)
                db.add(sub)
                
        if sub:
            sub.stripe_subscription_id = stripe_sub_id
            sub.tier = tier
            sub.status = SubscriptionStatus(status_val)
            sub.current_period_start = period_start
            sub.current_period_end = period_end
            sub.cancel_at_period_end = cancel_at_period_end
            db.commit()
            logger.info(f"Subscription synchronized for Stripe Customer {customer_id}: Tier {tier}")
            
    # 2. Handle Subscription Cancellations
    elif event_type == "customer.subscription.deleted":
        stripe_sub_id = data_object["id"]
        sub = db.query(Subscription).filter(Subscription.stripe_subscription_id == stripe_sub_id).first()
        if sub:
            sub.tier = SubscriptionTier.FREE
            sub.status = SubscriptionStatus.CANCELED
            db.commit()
            logger.info(f"Subscription canceled for stripe subscription ID {stripe_sub_id}")
            
    return {"status": "success"}
