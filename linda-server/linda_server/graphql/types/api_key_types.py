import strawberry

@strawberry.type
class ApiKey:
    id: int
    user_id: int
    key_value: str
