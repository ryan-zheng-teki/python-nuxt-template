from datetime import datetime, timedelta
from linda_server.db.repositories.subscription_repository import SubscriptionRepository
from typing import Optional

subscription_repository = SubscriptionRepository()

class SubscriptionService:
    def __init__(self, subscription_repository: SubscriptionRepository):
        self.subscription_repository = subscription_repository

    def buy_subscription(self, user_id: int, plan_type: str, duration_days: int) -> bool:
        """
        Allows a user to purchase a subscription plan. In real scenarios, payment validation would happen here.
        """
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=duration_days)
        new_sub = self.subscription_repository.create_subscription(
            user_id=user_id,
            plan_type=plan_type,
            start_date=start_date,
            end_date=end_date
        )
        return new_sub is not None

    def has_active_subscription(self, user_id: int) -> bool:
        """
        Returns True if the user currently has an active subscription.
        """
        sub = self.subscription_repository.find_active_subscription(user_id)
        return sub is not None

    def cancel_subscription(self, subscription_id: int) -> bool:
        """
        Cancels an existing subscription by removing it from the database.
        """
        return self.subscription_repository.cancel_subscription(subscription_id)

subscription_service = SubscriptionService(subscription_repository)
