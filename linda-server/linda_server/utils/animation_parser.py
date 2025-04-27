"""
Utility module for parsing and extracting animation code files.
"""
import os
import logging
from typing import Dict, List, Tuple, Set

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class AnimationFileInfo:
    """Class to hold information about a parsed animation file."""
    def __init__(self, path: str, content: str):
        self.path = path
        self.content = content
    
    def __repr__(self) -> str:
        return f"AnimationFileInfo(path={self.path})"

def parse_animation_code(code: str) -> List[AnimationFileInfo]:
    """
    Parse animation code text and extract file information.
    
    Args:
        code: The raw animation code text containing file definitions
        
    Returns:
        List[AnimationFileInfo]: A list of AnimationFileInfo objects containing file paths and contents
    """
    logger.info("Parsing animation code")
    
    # Parse the code to extract file contents
    files = []
    current_file = None
    current_path = None
    current_content = []
    
    # Track files we've already processed to avoid duplicates
    processed_paths = set()
    
    lines = code.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Look for file path indicators (both markdown and plain text formats)
        if line.lower().startswith("file:"):
            # Save previous file if we were tracking one
            if current_file and current_path and current_path not in processed_paths:
                files.append(AnimationFileInfo(
                    path=current_path,
                    content="\n".join(current_content)
                ))
                processed_paths.add(current_path)
            
            # Extract the new file path
            current_path = line.split(":", 1)[1].strip()
            current_file = os.path.basename(current_path)
            current_content = []
            
            # Skip the next line if it's a code fence
            if i + 1 < len(lines) and lines[i + 1].strip().startswith("```"):
                i += 1
                
        elif line.startswith("```") and current_file is not None:
            # End of a code block, we'll continue collecting content
            # until we find another file indicator or the end
            pass
            
        elif current_file is not None:
            # Add the line to the current file content
            current_content.append(lines[i])
        
        i += 1
        
    # Save the last file if there is one
    if current_file and current_path and current_path not in processed_paths:
        files.append(AnimationFileInfo(
            path=current_path,
            content="\n".join(current_content)
        ))
    
    logger.info(f"Parsed {len(files)} files from animation code")
    return files

def save_animation_files(base_dir: str, files: List[AnimationFileInfo]) -> List[str]:
    """
    Save parsed animation files to the specified base directory.
    
    Args:
        base_dir: Base directory where files should be saved
        files: List of AnimationFileInfo objects to save
        
    Returns:
        List[str]: List of successfully saved file paths
        
    Raises:
        IOError: If there's an error saving files
    """
    from linda_server.utils.file_utils import save_file
    
    logger.info(f"Saving {len(files)} animation files to {base_dir}")
    saved_files = []
    
    for file_info in files:
        file_path = os.path.join(base_dir, file_info.path)
        try:
            success = save_file(file_path, file_info.content)
            if success:
                saved_files.append(file_path)
        except IOError as e:
            logger.error(f"Failed to save {file_path}: {str(e)}")
            # Continue with other files even if one fails
    
    logger.info(f"Successfully saved {len(saved_files)} animation files")
    return saved_files
