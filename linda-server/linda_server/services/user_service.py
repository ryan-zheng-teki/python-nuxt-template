from typing import List, Optional
from linda_server.db.repositories import user_repository
from linda_server.db.repositories.user_repository import user_repository, UserRepository
from linda_server.db.models.user import User


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create_user(self, username: str, email: str, full_name: str) -> User:
        return self.user_repository.create_user(username, email, full_name)

    def find_user_by_id(self, user_id: int) -> Optional[User]:
        return self.user_repository.find_user_by_id(user_id)

    def find_all_users(self) -> List[User]:
        return self.user_repository.find_all_users()

    def update_user(self, user_id: int, username: str = None, email: str = None, full_name: str = None) -> Optional[User]:
        return self.user_repository.update_user(user_id, username, email, full_name)

    def delete_user(self, user_id: int) -> bool:
        return self.user_repository.delete_user(user_id)
    

user_service: UserService = UserService(user_repository)
