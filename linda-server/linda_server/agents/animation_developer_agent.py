import os
import json
import logging
import sys
from typing import Dict, List, Optional, Any
from datetime import timedelta
from pydantic import BaseModel
from restack_ai.agent import agent, import_functions, NonRetryableError

# Create a logger for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

with import_functions():
    from linda_server.functions.llm_chat import Message, LlmChatInput, llm_chat

class GeometryStepSolution(BaseModel):
    steps: List[Dict[str, str]]
    final_answer: str

class AnimationInput(BaseModel):
    problem_text: str
    solution: GeometryStepSolution

class AnimationDeveloperResponse(BaseModel):
    status: str
    message: str
    animation_code: Optional[str] = None

@agent.defn()
class AnimationDeveloperAgent:
    def __init__(self) -> None:
        logger.debug("Initializing AnimationDeveloperAgent")
        self.animation_code = None
        self.status = "idle"
        self.animation_dir = os.path.join("python-nuxt-template", "animation_server")
        
    @agent.event
    async def create_animation(self, input: AnimationInput) -> AnimationDeveloperResponse:
        logger.info("Event create_animation started")
        logger.debug("Input payload: %s", input.json())
        self.status = "creating"
        
        try:
            # Log before plan generation
            logger.info("Generating animation plan")
            system_content = """<omitted for brevity>"""
            
            plan_messages = [
                Message(role="system", content=system_content),
                Message(role="user", content=f"Create an animation plan for: {input.problem_text}")
            ]
            
            animation_plan = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=plan_messages),
                start_to_close_timeout=timedelta(seconds=180),
            )
            logger.debug("Received animation plan: %s", animation_plan)
            
            logger.info("Generating animation code from plan")
            code_messages = [
                Message(role="system", content=system_content),
                Message(role="user", content=f"Generate TypeScript code for: {input.problem_text}")
            ]
            
            animation_code = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=code_messages),
                start_to_close_timeout=timedelta(seconds=240),
            )
            logger.debug("Received animation code block")
            
            # Save the animation code to files
            logger.info("Saving animation code to files")
            self._save_animation_code(animation_code)
            
            self.animation_code = animation_code
            self.status = "complete"
            logger.info("create_animation completed successfully")
            return AnimationDeveloperResponse(
                status=self.status,
                message="Animation created successfully",
                animation_code=self.animation_code
            )
            
        except Exception as e:
            logger.exception("Error in create_animation")
            self.status = "error"
            raise NonRetryableError(f"Error in animation developer agent: {e}") from e
    
    def _save_animation_code(self, code: str) -> None:
        logger.debug("Entering _save_animation_code")
        try:
            current_file = None
            current_path = None
            current_content = []
            processed_files = set()
            lines = code.split("\n")
            for i, raw in enumerate(lines):
                line = raw.strip()
                if line.lower().startswith("file:"):
                    if current_file and current_path:
                        path = os.path.join(self.animation_dir, current_path)
                        logger.debug("Writing file %s", path)
                        self._save_file(path, "\n".join(current_content))
                        processed_files.add(current_path)
                    current_path = line.split(":", 1)[1].strip()
                    current_file = os.path.basename(current_path)
                    current_content = []
                elif current_file:
                    current_content.append(raw)
            if current_file and current_path and current_path not in processed_files:
                path = os.path.join(self.animation_dir, current_path)
                logger.debug("Writing final file %s", path)
                self._save_file(path, "\n".join(current_content))
            logger.info("All animation files saved")
        except Exception as e:
            logger.exception("Error in _save_animation_code")
            raise
    
    def _save_file(self, file_path: str, content: str) -> None:
        logger.debug("Entering _save_file for %s", file_path)
        try:
            system_files = [
                "nuxt.config", "app.vue", "package.json", "tailwind.config",
                "postcss.config", "vite.config", "tsconfig.json", "main.ts"
            ]
            if any(sys_file in file_path for sys_file in system_files):
                logger.warning("Skipping system file: %s", file_path)
                return
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "w") as f:
                f.write(content)
            logger.info("Saved file: %s", file_path)
        except Exception as e:
            logger.exception("Error saving file %s", file_path)
            raise

    @agent.run
    async def run(self, function_input: Dict[str, Any]) -> None:
        logger.info("AnimationDeveloperAgent run started")
        logger.debug("Run input: %s", function_input)
        await agent.condition(lambda: False)
