import bcrypt
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    Args:
        password: Plain text password
    Returns:
        Hashed password string
    """
    try:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    except Exception as e:
        logger.error(f"Error hashing password: {str(e)}")
        raise

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to check against
    Returns:
        Boolean indicating if password matches
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False
