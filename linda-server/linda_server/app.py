from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL
from fastapi.responses import FileResponse
import os
import jwt  # PyJWT library
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import your GraphQL schema and settings
from .graphql.schema import schema
from .config.settings import settings

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
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

@app.get("/libraries/my_library/libmylibrary.so", name="download_library")
async def download_library(request: Request):
    """
    Serves the C++ library file for download.
    Only accessible to authenticated users.
    """
    user = getattr(request.state, "user", None)

    if not user or not user.get("is_authenticated", False):
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not os.path.exists(settings.LIBRARY_PATH):
        raise HTTPException(status_code=404, detail="Library not found")
    
    return FileResponse(
        path=settings.LIBRARY_PATH,
        filename="libmylibrary.so",
        media_type='application/octet-stream'
    )

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

def authenticate_user(username: str, password: str):
    # Replace with your actual user authentication logic
    return {"id": 1, "username": username}

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt
