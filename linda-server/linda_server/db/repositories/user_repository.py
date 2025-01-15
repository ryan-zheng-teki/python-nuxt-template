from typing import List, Optional, Dict, Any
from sqlalchemy.exc import IntegrityError
from linda_server.db.models.user import User
from repository_sqlalchemy import BaseRepository
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserRepository(BaseRepository[User]):
    def create_user(self, username: str, email: str, full_name: str, hashed_password: str) -> User:
        try:
            new_user = User(
                username=username,
                email=email,
                full_name=full_name,
                hashed_password=hashed_password
            )
            return self.create(new_user)
        except IntegrityError as e:
            logger.error(f"Error creating user: {str(e)}")
            raise

    def find_user_by_id(self, user_id: int) -> Optional[User]:
        return self.find_by_id(user_id)

    def find_all_users(self) -> List[User]:
        return self.find_all()
    
    def find_user_by_username(self, username: str) -> Optional[User]:
        return self.session.query(User).filter(User.username == username).first()

    def update_user(
        self,
        user_id: int,
        username: str = None,
        email: str = None,
        full_name: str = None,
        hashed_password: str = None
    ) -> Optional[User]:
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
                if hashed_password:
                    update_data['hashed_password'] = hashed_password
                
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
