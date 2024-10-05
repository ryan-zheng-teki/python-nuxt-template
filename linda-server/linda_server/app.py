"""
app.py: The main entry point for the Linda server FastAPI application with GraphQL.

This script sets up a FastAPI server with GraphQL endpoints using the Strawberry GraphQL library.
It includes CORS middleware configuration and sets up the GraphQL router.

To run the server, use uvicorn from the command line:
uvicorn linda_server.app:app --host 127.0.0.1 --port 8000
For development mode with auto-reload:
uvicorn linda_server.app:app --host 127.0.0.1 --port 8000 --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL

# Import your GraphQL schema
from .graphql.schema import schema

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
    # Add other origins if required
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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