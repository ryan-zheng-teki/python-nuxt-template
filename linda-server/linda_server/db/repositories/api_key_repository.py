from repository_sqlalchemy import BaseRepository
from linda_server.db.models.api_key import ApiKey
from typing import Optional
import secrets
import hashlib, hmac
import os

class ApiKeyRepository(BaseRepository[ApiKey]):

    def create_api_key(self, user_id: int) -> (str, ApiKey):
        """
        Generates a new API key, returns the plain-text key for the user to see once,
        and stores only the hash in the database.
        """
        # Generate a random 32-byte (hex) string
        raw_key = secrets.token_hex(32)

        # Hashing (e.g., using HMAC with a server-side secret or a salt)
        # For maximum security, consider using an additional salt from env variables
        # This sample code is simplified—adapt to your needs (e.g. Argon2, PBKDF2, or bcrypt).
        server_side_secret = os.environ.get("API_KEY_HASH_SECRET", "SOME_COMPLEX_SECRET")
        hashed_key = hmac.new(
            key=server_side_secret.encode("utf-8"),
            msg=raw_key.encode("utf-8"),
            digestmod=hashlib.sha256
        ).hexdigest()

        # Optionally generate a separate public identifier for referencing multiple keys
        public_key_identifier = secrets.token_hex(8)

        # Create the ApiKey DB object
        new_key = ApiKey(
            user_id=user_id,
            hashed_key=hashed_key,
            public_key_identifier=public_key_identifier
        )
        created_key = self.create(new_key)

        # Return the raw key so the user can copy it for their records
        return raw_key, created_key

    def find_by_public_key_identifier(self, user_id: int, public_key_identifier: str) -> Optional[ApiKey]:
        """
        A convenient method to fetch the ApiKey record by user_id + public identifier.
        """
        return (
            self.session.query(ApiKey)
            .filter(
                ApiKey.user_id == user_id,
                ApiKey.public_key_identifier == public_key_identifier
            )
            .first()
        )

    def validate_api_key(self, raw_key: str, hashed_key: str) -> bool:
        """
        Validate if a raw key, when hashed, matches the stored hashed_key.
        """
        server_side_secret = os.environ.get("API_KEY_HASH_SECRET", "SOME_COMPLEX_SECRET")
        computed_hash = hmac.new(
            key=server_side_secret.encode("utf-8"),
            msg=raw_key.encode("utf-8"),
            digestmod=hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(computed_hash, hashed_key)
