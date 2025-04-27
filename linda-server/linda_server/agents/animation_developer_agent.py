import json
import logging
from typing import Dict, List, Optional, Any
from datetime import timedelta
from pydantic import BaseModel
from restack_ai.agent import agent, import_functions, NonRetryableError

# Create a logger for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

with import_functions():
    from linda_server.functions.llm_chat import Message, LlmChatInput, llm_chat
    from linda_server.functions.animation_services import save_animation_code
    from linda_server.agents.prompts.animation_developer_prompt import SYSTEM_PROMPT as ANIMATION_DEVELOPER_SYSTEM_PROMPT

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

class MessagesEvent(BaseModel):
    messages: List[Message]

@agent.defn()
class AnimationDeveloperAgent:
    def __init__(self) -> None:
        logger.info("Initializing AnimationDeveloperAgent")
        self.animation_code = None
        self.status = "idle"
    
    @agent.event
    async def messages(self, messages_event: MessagesEvent):
        """
        Handle messages event for streaming support.
        This is required by Restack for streaming chat completions.
        """
        logger.info("Event messages started")
        logger.info(f"Messages payload: {messages_event.json()}")
        
        self.status = "creating"
        try:
            # Extract the problem and solution from the message content
            user_messages = [m for m in messages_event.messages if m.role == "user"]
            if not user_messages:
                raise ValueError("No user message found in the request")
            
            content = user_messages[0].content
            
            # Try to parse the content as JSON
            try:
                # First check if the entire content is JSON
                data = json.loads(content)
                problem_text = data.get("problem_text", "")
                solution = data.get("solution", {})
                
                # Create an AnimationInput
                input = AnimationInput(
                    problem_text=problem_text,
                    solution=GeometryStepSolution(
                        steps=solution.get("steps", []),
                        final_answer=solution.get("final_answer", "")
                    )
                )
            except json.JSONDecodeError:
                # If it's not JSON, try to extract problem and solution from text
                # Format might be "Problem: <problem_text>\nSolution: <solution_json>"
                problem_text = ""
                solution_steps = []
                final_answer = ""
                
                if "Problem:" in content:
                    parts = content.split("Problem:", 1)
                    if len(parts) > 1:
                        problem_part = parts[1]
                        if "Solution:" in problem_part:
                            problem_solution_parts = problem_part.split("Solution:", 1)
                            problem_text = problem_solution_parts[0].strip()
                            
                            # Try to parse solution as JSON if available
                            if len(problem_solution_parts) > 1:
                                solution_text = problem_solution_parts[1].strip()
                                try:
                                    solution_data = json.loads(solution_text)
                                    solution_steps = solution_data.get("steps", [])
                                    final_answer = solution_data.get("final_answer", "")
                                except:
                                    # If not JSON, use the text as final answer
                                    final_answer = solution_text
                
                # Create AnimationInput with parsed data
                input = AnimationInput(
                    problem_text=problem_text,
                    solution=GeometryStepSolution(
                        steps=solution_steps,
                        final_answer=final_answer
                    )
                )
            
            logger.info(f"Animation Developer received problem: {input.problem_text}")
            
            # Generate animation code directly (no separate plan step)
            logger.info("Generating animation code")
            code_messages = [
                Message(role="system", content=ANIMATION_DEVELOPER_SYSTEM_PROMPT),
                Message(role="user", content=f"""
                Create animation code for this geometry problem:
                
                Problem: {input.problem_text}
                
                Solution steps:
                {json.dumps(input.solution.steps, indent=2)}
                
                Final answer: {input.solution.final_answer}
                """)
            ]
            
            animation_code = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=code_messages),
                start_to_close_timeout=timedelta(seconds=240),  # Longer timeout for code generation
            )
            logger.info("Received animation code block")
            
            # Save the animation code to files using the service function
            # This avoids accessing environment variables or file system from the workflow
            logger.info("Calling service function to save animation code")
            save_result = await agent.step(
                function=save_animation_code,
                function_input=animation_code,
                start_to_close_timeout=timedelta(seconds=30),
            )
            
            if not save_result["success"]:
                logger.error(f"Failed to save animation code: {save_result['message']}")
                raise ValueError(save_result["message"])
                
            logger.info(f"Animation code saved: {save_result['message']}")
            
            self.animation_code = animation_code
            self.status = "complete"
            logger.info("messages event completed successfully")
            
            return AnimationDeveloperResponse(
                status=self.status,
                message="Animation created successfully",
                animation_code=self.animation_code
            )
            
        except Exception as e:
            logger.exception("Error in messages event")
            self.status = "error"
            raise NonRetryableError(f"Error in animation developer agent: {e}") from e
    
    # The create_animation event handler has been removed as it's no longer needed
    # We now use the messages event handler with the chat completions API instead

    @agent.run
    async def run(self, function_input: Dict[str, Any]) -> None:
        logger.info("AnimationDeveloperAgent run started")
        logger.info("Run input: %s", function_input)
        await agent.condition(lambda: False)
