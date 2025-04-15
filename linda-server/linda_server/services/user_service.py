from typing import List, Optional, Tuple
from linda_server.db.repositories.user_repository import user_repository, UserRepository
from linda_server.db.models.user import User
from linda_server.utils.password import hash_password, verify_password
import jwt
from datetime import datetime, timedelta
import logging
import os

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        # Get JWT settings from environment variables
        self.secret_key = os.getenv("JWT_SECRET_KEY", "your_default_secret_key")
        self.algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    def create_user(self, username: str, email: str, full_name: str, password: str) -> User:
        """
        Create a new user with a hashed password.
        Args:
            username: User's username
            email: User's email
            full_name: User's full name
            password: User's plain text password
        Returns:
            Created User object
        """
        hashed_password = hash_password(password)
        return self.user_repository.create_user(
            username=username,
            email=email,
            full_name=full_name,
            hashed_password=hashed_password
        )

    def find_user_by_id(self, user_id: int) -> Optional[User]:
        return self.user_repository.find_user_by_id(user_id)

    def find_all_users(self) -> List[User]:
        return self.user_repository.find_all_users()

    def update_user(
        self,
        user_id: int,
        username: str = None,
        email: str = None,
        full_name: str = None,
        password: str = None
    ) -> Optional[User]:
        """
        Update user information, including optional password update.
        Args:
            user_id: ID of user to update
            username: Optional new username
            email: Optional new email
            full_name: Optional new full name
            password: Optional new password
        Returns:
            Updated User object or None if user not found
        """
        update_data = {}
        if username:
            update_data['username'] = username
        if email:
            update_data['email'] = email
        if full_name:
            update_data['full_name'] = full_name
        if password:
            update_data['hashed_password'] = hash_password(password)
            
        return self.user_repository.update_user(user_id, **update_data)

    def delete_user(self, user_id: int) -> bool:
        return self.user_repository.delete_user(user_id)
    
    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """
        Authenticate a user using secure password verification.
        Args:
            username: Username to authenticate
            password: Plain text password to verify
        Returns:
            User object if authentication successful, None otherwise
        """
        try:
            user = self.user_repository.find_user_by_username(username)
            if not user or not user.hashed_password:
                logger.warning(f"Authentication failed: User {username} not found or no password set")
                return None
                
            if verify_password(password, user.hashed_password):
                return user
            
            logger.warning(f"Authentication failed: Invalid password for user {username}")
            return None
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return None

    def create_access_token(self, data: dict, expires_delta: timedelta = None) -> str:
        """
        Create a JWT access token.
        Args:
            data: Data to encode in token
            expires_delta: Optional custom expiration time
        Returns:
            Encoded JWT token string
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=self.access_token_expire_minutes))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def login(self, username: str, password: str) -> Tuple[Optional[str], Optional[User]]:
        """
        Login a user and return access token if successful.
        Args:
            username: Username to login
            password: Plain text password to verify
        Returns:
            Tuple of (access_token, user) if successful, (None, None) otherwise
        """
        user = self.authenticate_user(username, password)
        if not user:
            return None, None
        access_token = self.create_access_token(data={"sub": str(user.id)})
        return access_token, user

user_service: UserService = UserService(user_repository)
