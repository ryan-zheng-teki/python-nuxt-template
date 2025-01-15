import strawberry
from linda_server.services.api_key_service import api_key_service

@strawberry.type
class ApiKeyQuery:
    @strawberry.field
    def access_restricted_resource_with_key(self, user_id: int, public_key_identifier: str, raw_key: str) -> str:
        """
        Attempts to access a restricted resource using the provided API key.
        The user must supply their user_id, the public identifier for the key, 
        and the raw key. The system checks if the key is valid and if there is an active subscription.
        """
        is_valid = api_key_service.validate_api_key(user_id, public_key_identifier, raw_key)
        if not is_valid:
            raise strawberry.exceptions.GraphQLHTTPException(
                message="Please buy the service or provide a valid API key",
                status_code=401
            )
        return "Access granted to the restricted resource!"
