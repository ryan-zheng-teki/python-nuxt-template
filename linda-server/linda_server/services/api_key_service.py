from linda_server.db.repositories.api_key_repository import ApiKeyRepository
from .subscription_service import subscription_service
from typing import Tuple

api_key_repository = ApiKeyRepository()

class ApiKeyService:
    def __init__(self, api_key_repository: ApiKeyRepository):
        self.api_key_repository = api_key_repository

    def generate_api_key(self, user_id: int) -> Tuple[str, str]:
        """
        Generates a new API key (raw_key), saves only the hashed key in the database,
        and returns (raw_key, public_identifier) so the user can reference it.
        The user must store the raw_key somewhere safe; we do NOT store or show it again.
        """
        raw_key, created_key = self.api_key_repository.create_api_key(user_id)
        return raw_key, created_key.public_key_identifier

    def validate_api_key(self, user_id: int, public_key_identifier: str, raw_key: str) -> bool:
        """
        Validates whether the API key is valid and the user has an active subscription.
        """
        # 1) Find the key entry for this user & identifier
        api_key = self.api_key_repository.find_by_public_key_identifier(
            user_id, 
            public_key_identifier
        )
        if not api_key:
            return False

        # 2) Compare the hashed key
        if not self.api_key_repository.validate_api_key(raw_key, api_key.hashed_key):
            return False

        # 3) Ensure the user still has an active subscription
        if not subscription_service.has_active_subscription(user_id):
            return False

        return True

api_key_service = ApiKeyService(api_key_repository)
