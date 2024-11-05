import strawberry
from linda_server.graphql.types.user_types import User, CreateUserInput, UpdateUserInput, LoginInput, LoginPayload
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
    
    @strawberry.mutation
    def login(self, input: LoginInput) -> LoginPayload:
        """
        Authenticates a user and returns a JWT token along with user information.
        """
        token, user = user_service.login(input.username, input.password)
        if not token:
            raise strawberry.exceptions.GraphQLHTTPException(message="Invalid credentials", status_code=401)
        return LoginPayload(token=token, user=user)