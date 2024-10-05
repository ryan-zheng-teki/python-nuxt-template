import strawberry
from linda_server.graphql.types.user_types import User, CreateUserInput, UpdateUserInput
from linda_server.services.user_service import user_service

@strawberry.type
class UserMutation:
    @strawberry.mutation
    def create_user(self, input: CreateUserInput) -> User:
        return user_service.create_user(input.username, input.email, input.full_name)

    @strawberry.mutation
    def update_user(self, input: UpdateUserInput) -> User:
        return user_service.update_user(input.id, input.username, input.email, input.full_name)

    @strawberry.mutation
    def delete_user(self, user_id: int) -> bool:
        return user_service.delete_user(user_id)