from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL
import jwt  # PyJWT library
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import your GraphQL schema
from .graphql.schema import schema

app = FastAPI()

# Get CORS settings from environment
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
cors_origins_list = cors_origins.split(",") if cors_origins else ["*"]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_list,
    allow_credentials=False,  # Must be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = None  # Not used anymore since we removed REST authentication

def verify_token(token: str):
    try:
        # Get JWT settings directly from environment
        secret_key = os.getenv("JWT_SECRET_KEY", "your_default_secret_key")
        algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return {"user_id": user_id, "is_authenticated": True}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.middleware("http")
async def add_user_to_request(request: Request, call_next):
    token = request.headers.get("Authorization")
    if token:
        try:
            scheme, _, param = token.partition(" ")
            if scheme.lower() == "bearer":
                user = verify_token(param)
                request.state.user = user
        except HTTPException:
            request.state.user = None
    else:
        request.state.user = None
    response = await call_next(request)
    return response

# Set up GraphQL router
graphql_router = GraphQLRouter(
    schema,
    subscription_protocols=[
        GRAPHQL_WS_PROTOCOL,
        GRAPHQL_TRANSPORT_WS_PROTOCOL,
    ],
)

# Include GraphQL router
app.include_router(graphql_router, prefix="/graphql")
