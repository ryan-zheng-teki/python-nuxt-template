import strawberry
from linda_server.services.subscription_service import subscription_service

@strawberry.type
class SubscriptionMutation:
    @strawberry.mutation
    def buy_subscription(self, user_id: int, plan_type: str, duration_days: int) -> bool:
        """
        Allows a user to purchase a subscription of a given plan_type for duration_days.
        """
        return subscription_service.buy_subscription(user_id, plan_type, duration_days)

    @strawberry.mutation
    def cancel_subscription(self, subscription_id: int) -> bool:
        """
        Cancels an existing subscription by removing it from the database.
        """
        return subscription_service.cancel_subscription(subscription_id)
