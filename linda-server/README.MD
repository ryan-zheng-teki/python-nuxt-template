# Linda Server

Linda Server is a FastAPI application with GraphQL support using Strawberry and PostgreSQL as the database.

## Prerequisites

- Python 3.8+
- Docker (optional, for containerized setup)
- PostgreSQL (if running locally without Docker)

## Setting up PostgreSQL with Docker

If you don't have PostgreSQL installed locally, you can run it in a Docker container. This step is optional and mainly for development purposes.

Run the following command to start a PostgreSQL container:

```
docker run -d \
    --name linda-postgres \
    -e POSTGRES_DB=postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -p 5432:5432 \
    postgres:13
```

This command will start a PostgreSQL 13 instance with the following configuration:
- Database name: postgres
- User: postgres
- Password: mysecretpassword
- Port: 5432 (mapped to the host)

## Local Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd linda-server
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```
   export DB_TYPE=postgresql
   export DB_NAME=postgres
   export DB_USER=postgres
   export DB_PASSWORD=mysecretpassword
   export DB_HOST=localhost
   export DB_PORT=5432
   ```

   Note: If you're using the PostgreSQL Docker container, these settings will work as-is. If you're using a different PostgreSQL setup, adjust the values accordingly.

5. Apply database migrations:
   ```
   alembic upgrade head
   ```

6. Run the server:
   ```
   uvicorn linda_server.app:app --host 127.0.0.1 --port 8000 --reload
   ```

   The server will be available at `http://127.0.0.1:8000`.

## Running Tests

To run the tests, use the following command:

```
pytest
```

## Docker Setup

1. Build the Docker image:
   ```
   docker build -t linda-server .
   ```

2. Run the container:
   ```
   docker run -d -p 8000:8000 \
     -e DB_TYPE=postgresql \
     -e DB_NAME=postgres \
     -e DB_USER=postgres \
     -e DB_PASSWORD=mysecretpassword \
     -e DB_HOST=host.docker.internal \
     -e DB_PORT=5432 \
     linda-server
   ```

   Note: If you're using the PostgreSQL Docker container, make sure it's running before starting the Linda Server container. You may need to adjust the `DB_HOST` value depending on your Docker network configuration.

   The server will be available at `http://localhost:8000`.

## GraphQL Endpoint

The GraphQL endpoint is available at `http://localhost:8000/graphql`.

## Development

For development with auto-reload:

```
uvicorn linda_server.app:app --host 127.0.0.1 --port 8000 --reload
```

## Database Migrations

This project uses Alembic for database migrations. Here's how to work with migrations:

1. Create a new migration:
   ```
   alembic revision --autogenerate -m "Description of the changes"
   ```

2. Apply migrations:
   ```
   alembic upgrade head
   ```

3. Revert the last migration:
   ```
   alembic downgrade -1
   ```

4. View migration history:
   ```
   alembic history --verbose
   ```

When you add a new model or make changes to existing models, create a new migration and apply it to update the database schema.

