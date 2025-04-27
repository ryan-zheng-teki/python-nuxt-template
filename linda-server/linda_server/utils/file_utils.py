"""
Utility functions for file operations.
"""
import os
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def save_file(file_path: str, content: str, skip_system_files: bool = True) -> bool:
    """
    Save content to a file, creating directories as needed.
    
    Args:
        file_path: The path to the file to save
        content: The content to write to the file
        skip_system_files: If True, will skip saving files that match system file patterns
        
    Returns:
        bool: True if file was saved successfully, False if it was skipped
        
    Raises:
        IOError: If there was an error saving the file
    """
    logger.info("Saving file: %s", file_path)
    
    try:
        # Skip if the file path contains system files that should not be modified
        if skip_system_files:
            system_files = [
                "nuxt.config", "app.vue", "package.json", "tailwind.config",
                "postcss.config", "vite.config", "tsconfig.json", "main.ts"
            ]
            
            if any(sys_file in file_path for sys_file in system_files):
                logger.warning("Skipping system file: %s", file_path)
                return False
        
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Write the content to the file
        with open(file_path, "w") as f:
            f.write(content)
            
        logger.info("Successfully saved file: %s", file_path)
        return True
        
    except Exception as e:
        logger.exception("Error saving file %s", file_path)
        raise IOError(f"Error saving file {file_path}: {str(e)}") from e

def ensure_directory_exists(directory_path: str) -> None:
    """
    Ensure a directory exists, creating it if necessary.
    
    Args:
        directory_path: The path to the directory
        
    Raises:
        IOError: If there was an error creating the directory
    """
    try:
        os.makedirs(directory_path, exist_ok=True)
        logger.info("Ensured directory exists: %s", directory_path)
    except Exception as e:
        logger.exception("Error creating directory %s", directory_path)
        raise IOError(f"Error creating directory {directory_path}: {str(e)}") from e
