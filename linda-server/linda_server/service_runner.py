import asyncio
import logging
import os
import sys
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
from linda_server.functions.animation_services import save_animation_code
from linda_server.utils.animation_server_runner import start_animation_server, get_animation_server_url

from restack_ai import Restack
from restack_ai.restack import CloudConnectionOptions, ServiceOptions

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check for mandatory ANIMATION_SERVER_PATH environment variable
if "ANIMATION_SERVER_PATH" not in os.environ:
    logger.error("ERROR: ANIMATION_SERVER_PATH environment variable is not set!")
    logger.error("Please set the ANIMATION_SERVER_PATH environment variable to the absolute path of the animation server directory.")
    logger.error("Example: export ANIMATION_SERVER_PATH=/Users/ryan-zheng/learning/autobyteus_org_workspace/python-nuxt-template/animation_server")
    sys.exit(1)  # Exit with error code

# Verify that the specified path exists
animation_server_path = os.environ["ANIMATION_SERVER_PATH"]
if not os.path.exists(animation_server_path):
    logger.error(f"ERROR: The specified ANIMATION_SERVER_PATH does not exist: {animation_server_path}")
    logger.error("Please set the correct path to the animation server directory.")
    sys.exit(1)  # Exit with error code

logger.info(f"Using ANIMATION_SERVER_PATH: {animation_server_path}")

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
            functions=[llm_chat, save_animation_code, save_file],  # Added save_animation_code function
            options=ServiceOptions(
                max_concurrent_workflow_runs=10,
                max_concurrent_function_runs=5
            )
        )
        logger.info("Restack services started successfully")
    except Exception as e:
        logger.error(f"Failed to start Restack services: {str(e)}")

async def main():
    """Main entry point for the service"""
    try:
        # Start the animation server using the dedicated module
        animation_server = await start_animation_server()
        
        await start_restack_services()
        

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
    # Open the animation server URL using the function from the animation_server_runner module
    webbrowser.open(get_animation_server_url())

    run_process(watch_path, recursive=True, target=run_services)
