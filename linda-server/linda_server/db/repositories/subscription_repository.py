from typing import Optional
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from repository_sqlalchemy import BaseRepository
from linda_server.db.models.subscription import Subscription
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SubscriptionRepository(BaseRepository[Subscription]):
    def create_subscription(self, user_id: int, plan_type: str, start_date: datetime, end_date: datetime) -> Subscription:
        try:
            new_subscription = Subscription(
                user_id=user_id,
                plan_type=plan_type,
                start_date=start_date,
                end_date=end_date
            )
            return self.create(new_subscription)
        except IntegrityError as e:
            logger.error(f"Error creating subscription: {str(e)}")
            raise

    def find_active_subscription(self, user_id: int) -> Optional[Subscription]:
        """
        Returns the currently active subscription if any, otherwise None.
        """
        now = datetime.utcnow()
        return (
            self.session.query(Subscription)
            .filter(
                Subscription.user_id == user_id,
                Subscription.start_date <= now,
                Subscription.end_date >= now
            )
            .first()
        )

    def find_subscription_by_id(self, subscription_id: int) -> Optional[Subscription]:
        return self.find_by_id(subscription_id)

    def cancel_subscription(self, subscription_id: int) -> bool:
        subscription = self.find_subscription_by_id(subscription_id)
        if subscription:
            self.delete(subscription)
            return True
        return False
