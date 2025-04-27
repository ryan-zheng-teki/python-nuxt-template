"""
Functions for animation-related services that run outside the workflow context.
"""
import os
import logging
import sys
from typing import List, Dict, Any
from restack_ai.function import function, log, NonRetryableError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Import the parser and file utilities here (outside workflow context)
from linda_server.utils.animation_parser import parse_animation_code, save_animation_files

@function.defn()
async def save_animation_code(animation_code: str) -> Dict[str, Any]:
    """
    Save animation code to the animation server directory.
    This function runs outside the workflow context and can access environment variables.
    
    Args:
        animation_code: The raw animation code to save
        
    Returns:
        Dict with status and message
    """
    logger.info("Service function: save_animation_code called")
    
    # Check for mandatory ANIMATION_SERVER_PATH environment variable
    if "ANIMATION_SERVER_PATH" not in os.environ:
        error_msg = "ERROR: ANIMATION_SERVER_PATH environment variable is not set!"
        logger.error(error_msg)
        return {
            "success": False,
            "message": error_msg,
            "saved_files": []
        }
    
    animation_server_dir = os.environ["ANIMATION_SERVER_PATH"]
    
    if not os.path.exists(animation_server_dir):
        error_msg = f"ERROR: Animation server directory not found: {animation_server_dir}"
        logger.error(error_msg)
        return {
            "success": False,
            "message": error_msg,
            "saved_files": []
        }
    
    try:
        # Parse and save the animation code
        logger.info(f"Saving animation code to {animation_server_dir}")
        parsed_files = parse_animation_code(animation_code)
        saved_files = save_animation_files(animation_server_dir, parsed_files)
        
        return {
            "success": True,
            "message": f"Successfully saved {len(saved_files)} animation files",
            "saved_files": saved_files
        }
    except Exception as e:
        error_msg = f"Error saving animation code: {str(e)}"
        logger.exception(error_msg)
        return {
            "success": False,
            "message": error_msg,
            "saved_files": []
        }
