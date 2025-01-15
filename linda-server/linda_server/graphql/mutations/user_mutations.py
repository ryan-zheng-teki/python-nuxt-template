import strawberry
from graphql import GraphQLError
from linda_server.graphql.types.user_types import User, CreateUserInput, UpdateUserInput, LoginInput, LoginPayload
from linda_server.services.user_service import user_service

@strawberry.type
class UserMutation:
    @strawberry.mutation
    def create_user(self, input: CreateUserInput) -> User:
        try:
            return user_service.create_user(
                username=input.username,
                email=input.email,
                full_name=input.full_name,
                password=input.password
            )
        except Exception as e:
            raise GraphQLError(str(e))
    
    @strawberry.mutation
    def update_user(self, input: UpdateUserInput) -> User:
        try:
            return user_service.update_user(
                user_id=input.id,
                username=input.username,
                email=input.email,
                full_name=input.full_name,
                password=input.password
            )
        except Exception as e:
            raise GraphQLError(str(e))
    
    @strawberry.mutation
    def delete_user(self, user_id: int) -> bool:
        try:
            return user_service.delete_user(user_id)
        except Exception as e:
            raise GraphQLError(str(e))
    
    @strawberry.mutation
    def login(self, input: LoginInput) -> LoginPayload:
        """
        Authenticates a user and returns a JWT token along with user information.
        """
        token, user = user_service.login(input.username, input.password)
        if not token or not user:
            raise GraphQLError("Invalid credentials")
        return LoginPayload(token=token, user=user)
