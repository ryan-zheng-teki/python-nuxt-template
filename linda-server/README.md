# Linda Server

A simple authentication server template with login and signup functionality.

## Environment Variables

This application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
# JWT Settings
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Database Settings (for PostgreSQL)
DB_TYPE=postgresql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
```

You can customize these values based on your specific needs.

## Running the Application

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Start the server:
```
uvicorn linda_server.app:app --reload
```

The application will be available at http://localhost:8000.

## API Documentation

- GraphQL endpoint: http://localhost:8000/graphql
- GraphQL playground: http://localhost:8000/graphql
