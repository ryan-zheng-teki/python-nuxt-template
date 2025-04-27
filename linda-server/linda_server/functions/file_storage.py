import os
import base64
import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from restack_ai.function import function, log, NonRetryableError

class SaveFileInput(BaseModel):
    file_content: str  # Base64 encoded file content
    file_name: Optional[str] = None
    file_type: str  # Mime type

class SaveFileOutput(BaseModel):
    file_path: str
    public_url: str

@function.defn()
async def save_file(function_input: SaveFileInput) -> SaveFileOutput:
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join("uploads", datetime.now().strftime("%Y-%m-%d"))
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate a unique filename if not provided
        if not function_input.file_name:
            extension = function_input.file_type.split("/")[-1]
            function_input.file_name = f"{uuid.uuid4()}.{extension}"
            
        # Construct file path
        file_path = os.path.join(upload_dir, function_input.file_name)
        
        # Decode base64 and save file
        file_data = base64.b64decode(function_input.file_content)
        with open(file_path, "wb") as f:
            f.write(file_data)
            
        # Generate public URL (depends on server configuration)
        public_url = f"/uploads/{datetime.now().strftime('%Y-%m-%d')}/{function_input.file_name}"
        
        log.info(f"File saved successfully at {file_path}")
        
        return SaveFileOutput(
            file_path=file_path,
            public_url=public_url
        )
        
    except Exception as e:
        error_message = f"Error saving file: {str(e)}"
        log.error(error_message)
        raise NonRetryableError(error_message) from e
