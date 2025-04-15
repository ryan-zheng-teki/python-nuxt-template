import strawberry
from typing import List
from linda_server.graphql.types.user_types import User
from linda_server.services.user_service import user_service

@strawberry.type
class UserQuery:
    @strawberry.field
    def user(self, user_id: int) -> User:
        return user_service.find_user_by_id(user_id)

    @strawberry.field
    def users(self) -> List[User]:
        return user_service.find_all_users()
