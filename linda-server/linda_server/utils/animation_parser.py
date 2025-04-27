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
    logger.info("Parsing animation code with fence-aware logic")

    files: List[AnimationFileInfo] = []
    processed_paths: Set[str] = set()

    lines = code.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        # Look for file path indicator
        if line.strip().lower().startswith("file:"):
            # Extract the file path
            current_path = line.split(":", 1)[1].strip()
            if current_path in processed_paths:
                # Skip duplicates
                i += 1
                continue

            # Expect next line to be the opening fence ```lang
            i += 1
            if i < len(lines) and lines[i].strip().startswith("```"):
                # Enter fence mode
                fence_lang = lines[i].strip()
                current_content_lines: List[str] = []
                i += 1
                # Collect until closing fence ```
                while i < len(lines) and lines[i].strip() != "```":
                    current_content_lines.append(lines[i])
                    i += 1
                # Skip the closing fence line
                i += 1
                # Save the file info
                files.append(AnimationFileInfo(
                    path=current_path,
                    content="\n".join(current_content_lines)
                ))
                processed_paths.add(current_path)
                continue
            else:
                # No fence detected, fallback to old behavior: collect until next File:
                current_content_lines = []
                while i < len(lines) and not lines[i].strip().lower().startswith("file:"):
                    current_content_lines.append(lines[i])
                    i += 1
                files.append(AnimationFileInfo(
                    path=current_path,
                    content="\n".join(current_content_lines)
                ))
                processed_paths.add(current_path)
                continue
        i += 1

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
    saved_files: List[str] = []

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
