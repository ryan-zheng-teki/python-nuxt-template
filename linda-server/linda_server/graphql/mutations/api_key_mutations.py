import strawberry
from typing import Tuple
from linda_server.services.api_key_service import api_key_service
from linda_server.graphql.types.api_key_types import ApiKey

@strawberry.type
class ApiKeyMutation:
    @strawberry.mutation
    def generate_api_key(self, user_id: int) -> ApiKey:
        """
        Generates a new API key for the user, only after they've presumably purchased a subscription.
        Returns the raw API key once and a public identifier used to reference it in future calls.
        """
        raw_key, public_identifier = api_key_service.generate_api_key(user_id)
        return ApiKey(
            id=0,  # Not used in this example.
            user_id=user_id,
            key_value=f"RAW_KEY: {raw_key} | PUBLIC_IDENTIFIER: {public_identifier}"
        )
