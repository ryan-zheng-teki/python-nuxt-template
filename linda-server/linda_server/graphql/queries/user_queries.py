import strawberry
from typing import List
from linda_server.graphql.types.user_types import User
from linda_server.services.user_service import user_service
from fastapi import Request
from strawberry.types import Info

@strawberry.type
class UserQuery:
    @strawberry.field
    def user(self, user_id: int) -> User:
        return user_service.find_user_by_id(user_id)

    @strawberry.field
    def users(self) -> List[User]:
        return user_service.find_all_users()
    
    @strawberry.field
    def download_library_url(self, info: Info) -> str:
        """
        Provides the URL for the C++ library download.
        Only accessible to authenticated users.
        """
        request: Request = info.context["request"]
        user = getattr(request.state, "user", None)

        if not user or not user.get("is_authenticated", False):
            raise strawberry.exceptions.GraphQLHTTPException(message="Unauthorized", status_code=401)
        
        # Define the relative path to the library
        library_path = "/libraries/my_library/libmylibrary.so"
        
        # Construct the full URL
        base_url = request.url_for("download_library")
        download_url = f"{base_url}"
        
        return download_url