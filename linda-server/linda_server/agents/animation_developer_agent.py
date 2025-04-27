import logging
from typing import Any, Dict, List, Optional
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
        """
        logger.info("Event messages started")
        logger.info(f"Messages payload: {messages_event.json()}")
        
        self.status = "creating"
        try:
            # Extract the first user message content
            user_messages = [m for m in messages_event.messages if m.role == "user"]
            if not user_messages:
                raise ValueError("No user message found in the request")
            
            content = user_messages[0].content
            logger.info(f"Animation Developer received raw content: {content}")

            # Prepare chat messages for code generation
            logger.info("Generating animation code")
            code_messages = [
                Message(role="system", content=ANIMATION_DEVELOPER_SYSTEM_PROMPT),
                Message(
                    role="user",
                    content=f"Create animation code for this geometry problem:\n\n{content}"
                )
            ]
            
            # Call LLM to generate animation code
            animation_code = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=code_messages),
                start_to_close_timeout=timedelta(seconds=240),
            )
            logger.info("Received animation code block")
            
            # Save the animation code
            logger.info("Calling service function to save animation code")
            save_result = await agent.step(
                function=save_animation_code,
                function_input=animation_code,
                start_to_close_timeout=timedelta(seconds=60000),
            )
            
            if not save_result.get("success", False):
                logger.error(f"Failed to save animation code: {save_result.get('message')}")
                raise ValueError(save_result.get("message", "Unknown error saving animation code"))
                
            logger.info(f"Animation code saved: {save_result.get('message')}")
            
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

    @agent.run
    async def run(self, function_input: Dict[str, Any]) -> None:
        logger.info("AnimationDeveloperAgent run started")
        logger.info("Run input: %s", function_input)
        await agent.condition(lambda: False)
