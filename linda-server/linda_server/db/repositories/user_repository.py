from typing import List, Optional, Dict, Any
from sqlalchemy.exc import IntegrityError
from linda_server.db.models.user import User
from repository_sqlalchemy import BaseRepository
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class UserRepository(BaseRepository[User]):
    def create_user(self, username: str, email: str, full_name: str) -> User:
        try:
            new_user = User(username=username, email=email, full_name=full_name)
            return self.create(new_user)
        except IntegrityError as e:
            logger.error(f"Error creating user: {str(e)}")
            raise

    def find_user_by_id(self, user_id: int) -> Optional[User]:
        return self.find_by_id(user_id)

    def find_all_users(self) -> List[User]:
        return self.find_all()

    def update_user(self, user_id: int, username: str = None, email: str = None, full_name: str = None) -> Optional[User]:
        try:
            user = self.find_by_id(user_id)
            if user:
                update_data: Dict[str, Any] = {}
                if username:
                    update_data['username'] = username
                if email:
                    update_data['email'] = email
                if full_name:
                    update_data['full_name'] = full_name
                
                if update_data:
                    return self.update(user, update_data)
                else:
                    return user
            logger.warning(f"User with id {user_id} not found")
            return None
        except IntegrityError as e:
            logger.error(f"Error updating user: {str(e)}")
            raise

    def delete_user(self, user_id: int) -> bool:
        user = self.find_by_id(user_id)
        if user:
            self.delete(user)
            return True
        logger.warning(f"User with id {user_id} not found")
        return False
    
user_repository = UserRepository()