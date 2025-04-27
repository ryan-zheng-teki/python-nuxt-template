"""
Utility module for starting and managing the animation server.
"""
import asyncio
import logging
import os
import subprocess
import sys
from typing import Optional, Tuple

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Hardcoded animation server port
ANIMATION_SERVER_PORT = 4000

async def start_animation_server() -> Optional[asyncio.subprocess.Process]:
    """
    Start the animation server as a subprocess.
    
    Returns:
        Optional[asyncio.subprocess.Process]: The animation server process if successful, None otherwise
    """
    try:
        # Check for mandatory ANIMATION_SERVER_PATH environment variable
        if "ANIMATION_SERVER_PATH" not in os.environ:
            logger.error("ERROR: ANIMATION_SERVER_PATH environment variable is not set!")
            logger.error("Animation server cannot be started.")
            return None
        
        animation_server_dir = os.environ["ANIMATION_SERVER_PATH"]
        
        if not os.path.exists(animation_server_dir):
            logger.error(f"ERROR: Animation server directory not found: {animation_server_dir}")
            logger.error("Please check the ANIMATION_SERVER_PATH environment variable.")
            return None

        # Start the animation server process with explicit port 4000
        logger.info(f"Starting animation server from {animation_server_dir} on port {ANIMATION_SERVER_PORT}")
        process = await asyncio.create_subprocess_shell(
            f"cd {animation_server_dir} && yarn dev --port {ANIMATION_SERVER_PORT}",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            shell=True
        )

        # Log the output in the background
        async def log_output():
            while True:
                line = await process.stdout.readline()
                if not line:
                    break
                line_text = line.decode('utf-8').strip()
                logger.info(f"Animation server: {line_text}")
        
        # Start logging in the background - don't await to avoid blocking
        asyncio.create_task(log_output())
        
        logger.info(f"Animation server started on port {ANIMATION_SERVER_PORT}")
        return process
    except Exception as e:
        logger.error(f"Failed to start animation server: {str(e)}")
        return None

def start_animation_server_sync() -> Optional[subprocess.Popen]:
    """
    Start the animation server synchronously (for command-line usage).
    
    Returns:
        Optional[subprocess.Popen]: The animation server process if successful, None otherwise
    """
    try:
        # Check for mandatory ANIMATION_SERVER_PATH environment variable
        if "ANIMATION_SERVER_PATH" not in os.environ:
            logger.error("ERROR: ANIMATION_SERVER_PATH environment variable is not set!")
            logger.error("Animation server cannot be started.")
            return None
        
        animation_server_dir = os.environ["ANIMATION_SERVER_PATH"]
        
        if not os.path.exists(animation_server_dir):
            logger.error(f"ERROR: Animation server directory not found: {animation_server_dir}")
            logger.error("Please check the ANIMATION_SERVER_PATH environment variable.")
            return None

        # Start the animation server process with explicit port 4000
        logger.info(f"Starting animation server from {animation_server_dir} on port {ANIMATION_SERVER_PORT}")
        
        # Use shell=True because we have a compound command with cd
        process = subprocess.Popen(
            f"cd {animation_server_dir} && yarn dev --port {ANIMATION_SERVER_PORT}",
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        
        # Start a thread to log the output
        import threading
        
        def log_output(stream, prefix):
            for line in stream:
                logger.info(f"{prefix}: {line.strip()}")
        
        # Start threads for stdout and stderr
        stdout_thread = threading.Thread(
            target=log_output, 
            args=(process.stdout, "Animation server stdout"),
            daemon=True
        )
        stderr_thread = threading.Thread(
            target=log_output, 
            args=(process.stderr, "Animation server stderr"),
            daemon=True
        )
        
        stdout_thread.start()
        stderr_thread.start()
        
        logger.info(f"Animation server started synchronously on port {ANIMATION_SERVER_PORT}")
        return process
    except Exception as e:
        logger.error(f"Failed to start animation server synchronously: {str(e)}")
        return None

def get_animation_server_url() -> str:
    """
    Get the URL of the animation server.
    
    Returns:
        str: The animation server URL
    """
    return f"http://localhost:{ANIMATION_SERVER_PORT}"

# Allow this module to be run directly for testing
if __name__ == "__main__":
    # Configure logging for standalone execution
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    logger.info("Starting animation server as standalone process...")
    
    # Start the animation server synchronously
    process = start_animation_server_sync()
    
    if process:
        try:
            logger.info(f"Animation server is running at {get_animation_server_url()}")
            logger.info("Press Ctrl+C to stop the server")
            
            # Wait for the process to finish or for a keyboard interrupt
            process.wait()
        except KeyboardInterrupt:
            logger.info("Stopping animation server...")
            process.terminate()
            process.wait()
            logger.info("Animation server stopped")
    else:
        logger.error("Failed to start animation server")
