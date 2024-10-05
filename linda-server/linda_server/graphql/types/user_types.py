import strawberry
from typing import Optional

@strawberry.type
class User:
    id: int
    username: str
    email: str
    full_name: str

@strawberry.input
class CreateUserInput:
    username: str
    email: str
    full_name: str

@strawberry.input
class UpdateUserInput:
    id: int
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None