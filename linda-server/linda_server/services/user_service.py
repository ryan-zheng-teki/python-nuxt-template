from typing import List, Optional
from linda_server.db.repositories import user_repository
from linda_server.db.repositories.user_repository import user_repository, UserRepository
from linda_server.db.models.user import User
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your_secret_key"  # Replace with your actual secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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
    
    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        # Implement your actual authentication logic here
        # For demonstration, assume all passwords are 'password'
        user = self.user_repository.find_user_by_username(username)
        if user and password == "password":  # Replace with real password verification
            return user
        return None

    def create_access_token(self, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def login(self, username: str, password: str):
        user = self.authenticate_user(username, password)
        if not user:
            return None, None
        access_token = self.create_access_token(data={"sub": str(user.id)})
        return access_token, user

user_service: UserService = UserService(user_repository)