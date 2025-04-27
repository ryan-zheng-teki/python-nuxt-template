# Linda Server

A backend server providing geometry problem solving and animation generation capabilities through a GraphQL API.

## Architecture

This backend consists of multiple components:

1. **Restack Engine** - Manages agents and workflows for solving geometry problems and generating animations
2. **FastAPI Server** - Provides GraphQL API endpoints for client communication
3. **Animation Server** - A Nuxt.js application rendering 3D animations for geometry problems

## Prerequisites

- Docker (for running Restack)
- Python 3.10+
- Node.js and Yarn (for the animation server)

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

# Restack Settings
RESTACK_ENGINE_ID=your_engine_id
RESTACK_ENGINE_ADDRESS=your_engine_address
RESTACK_ENGINE_API_KEY=your_api_key
RESTACK_ENGINE_API_ADDRESS=your_api_address
```

You can customize these values based on your specific needs.

## Running the Application

**IMPORTANT**: Always use `main.py` to start the application. This will start all required components:
- The Restack services
- The FastAPI GraphQL server  
- The animation server

### Installation

```bash
cd python-nuxt-template/linda-server
pip install -r requirements.txt
```

### Starting the Application

There are two modes for running the application:

#### Regular Mode

```bash
cd python-nuxt-template/linda-server
python main.py
```

#### Watch Mode (development)

Watch mode automatically reloads when files change and opens browser tabs for all services:

```bash
cd python-nuxt-template/linda-server
python main.py --watch
```

This will automatically open:
- GraphQL playground: http://localhost:8000/graphql
- Main frontend: http://localhost:3000  
- Animation server: http://localhost:4000

## Component Details

### Restack

Restack orchestrates the AI agents and workflows. It runs in a Docker container with the following ports:

```
0.0.0.0:5233->5233/tcp
0.0.0.0:6233->6233/tcp
0.0.0.0:7233->7233/tcp
0.0.0.0:9233->9233/tcp
```

### FastAPI GraphQL Server

The GraphQL server runs on:
- Endpoint: http://localhost:8000/graphql
- Playground: http://localhost:8000/graphql

### Animation Server

The animation server is a Nuxt.js application using TypeScript, Three.js, and Tween.js. It's automatically started when you run `main.py` and available at:
- http://localhost:4000

## IMPORTANT: Don't start components individually

Do not start components individually using commands like:
```
uvicorn linda_server.app:app --reload  # Don't use this
```

This would only start the FastAPI server without the other necessary components.
