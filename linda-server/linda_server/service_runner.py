import asyncio
import logging
import os
import webbrowser
from pathlib import Path

from watchfiles import run_process
from dotenv import load_dotenv

from linda_server.app import app
from linda_server.agents.coordinator_agent import CoordinatorAgent
from linda_server.agents.math_master_agent import MathMasterAgent
from linda_server.agents.animation_developer_agent import AnimationDeveloperAgent
from linda_server.functions.llm_chat import llm_chat
from linda_server.functions.file_storage import save_file

from restack_ai import Restack
from restack_ai.restack import CloudConnectionOptions, ServiceOptions

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Setup Restack client without validation
engine_id = os.getenv("RESTACK_ENGINE_ID")
address = os.getenv("RESTACK_ENGINE_ADDRESS")
api_key = os.getenv("RESTACK_ENGINE_API_KEY")
api_address = os.getenv("RESTACK_ENGINE_API_ADDRESS")

connection_options = CloudConnectionOptions(
    engine_id=engine_id,
    address=address,
    api_key=api_key,
    api_address=api_address
)
client = Restack()
restack_available = True

async def start_restack_services():
    """Start Restack agents and workflows"""
    try:
        await client.start_service(
            agents=[CoordinatorAgent, MathMasterAgent, AnimationDeveloperAgent],
            # No workflows registered since workflows were removed
            workflows=[],
            functions=[llm_chat, save_file],
            options=ServiceOptions(
                max_concurrent_workflow_runs=10,
                max_concurrent_function_runs=5
            )
        )
        logger.info("Restack services started successfully")
    except Exception as e:
        logger.error(f"Failed to start Restack services: {str(e)}")

async def start_animation_server():
    """Start the animation server"""
    try:
        animation_server_dir = os.path.join("python-nuxt-template", "animation_server")
        if not os.path.exists(animation_server_dir):
            logger.error(f"Animation server directory not found: {animation_server_dir}")
            return

        process = await asyncio.create_subprocess_shell(
            f"cd {animation_server_dir} && yarn dev",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            shell=True
        )

        logger.info(f"Animation server started on port 4000")
        return process
    except Exception as e:
        logger.error(f"Failed to start animation server: {str(e)}")

async def main():
    """Main entry point for the service"""
    try:
        await start_restack_services()
        animation_server = await start_animation_server()

        import uvicorn
        config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
        server = uvicorn.Server(config)
        await server.serve()

        if animation_server:
            animation_server.terminate()
    except Exception as e:
        logger.error(f"Error in main service: {str(e)}")

def run_services():
    """Run all services"""
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Service interrupted by user. Exiting gracefully.")

def watch_services():
    """Watch for changes and restart services"""
    watch_path = Path.cwd()
    logger.info(f"Watching {watch_path} and its subdirectories for changes...")

    webbrowser.open("http://localhost:8000/graphql")
    webbrowser.open("http://localhost:3000")
    webbrowser.open("http://localhost:4000")

    run_process(watch_path, recursive=True, target=run_services)
