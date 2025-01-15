from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from repository_sqlalchemy import Base

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Instead of storing the raw key_value, we store it hashed:
    # The user will see the key once upon generation.
    hashed_key = Column(String(255), unique=True, nullable=False)

    # We can store a short "reference" or "public identifier" for the user
    # to keep track of which key they are using (if you want to list multiple keys).
    # Alternatively, you can skip this if only one key is ever generated.
    public_key_identifier = Column(String(50), unique=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return (
            f"<ApiKey("
            f"id={self.id}, "
            f"user_id={self.user_id}, "
            f"hashed_key='{self.hashed_key}', "
            f"public_key_identifier='{self.public_key_identifier}', "
            f"created_at='{self.created_at}'"
            f")>")
