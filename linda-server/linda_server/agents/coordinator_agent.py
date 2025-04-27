import os
import logging
import sys
from typing import Dict, Any, List
from datetime import timedelta
from pydantic import BaseModel
from restack_ai.agent import agent, import_functions, NonRetryableError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class EndEvent(BaseModel):
    end: bool

class Message(BaseModel):
    role: str
    content: str

class MessagesEvent(BaseModel):
    messages: List[Message]

class GeometryProblemInput(BaseModel):
    problem_text: str
    image_path: str | None = None

with import_functions():
    from linda_server.functions.llm_chat import Message as LlmMessage, LlmChatInput, llm_chat

@agent.defn()
class CoordinatorAgent:
    def __init__(self) -> None:
        logger.info("Initializing CoordinatorAgent")
        self.status = "idle"
        self.end = False

    @agent.event
    async def messages(self, messages_event: MessagesEvent):
        """
        Handle messages event for streaming support.
        This is required by Restack for streaming chat completions.
        """
        logger.info("Event messages started")
        logger.info(f"Messages payload: {messages_event.json()}")
        
        self.status = "processing"
        try:
            # Extract the problem text from the first user message
            user_messages = [m for m in messages_event.messages if m.role == "user"]
            if not user_messages:
                raise ValueError("No user message found in the request")
            
            problem_text = user_messages[0].content
            logger.info(f"Extracted problem text: {problem_text}")
            
            system_content = "You are a coordinator for a geometry problem solving system. Given a geometry problem, analyze it step by step and explain the solution approach clearly."
            messages = [
                LlmMessage(role="system", content=system_content),
                LlmMessage(role="user", content=problem_text)
            ]
            
            logger.info("Calling llm_chat for analysis (streaming)")
            stream_response = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=messages, stream=True),
                start_to_close_timeout=timedelta(seconds=600),
            )
            
            self.status = "complete"
            logger.info("messages event completed successfully")
            return stream_response
        except Exception as e:
            logger.exception("Error in messages event")
            self.status = "error"
            raise NonRetryableError(f"Error in coordinator agent messages handler: {e}") from e

    @agent.event
    async def submit_problem(self, input: GeometryProblemInput):
        """
        Legacy handler for non-streaming requests.
        Kept for backward compatibility.
        """
        logger.info("Event submit_problem started")
        logger.info("Input payload: %s", input.json())
        self.status = "processing"
        try:
            system_content = "You are a coordinator..."
            messages = [
                LlmMessage(role="system", content=system_content),
                LlmMessage(role="user", content=input.problem_text)
            ]
            logger.info("Calling llm_chat for analysis (streaming)")
            stream_response = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=messages, stream=True),
                start_to_close_timeout=timedelta(seconds=120),
            )
            self.status = "complete"
            logger.info("submit_problem completed successfully")
            return stream_response
        except Exception as e:
            logger.exception("Error in submit_problem")
            self.status = "error"
            raise NonRetryableError(f"Error in coordinator agent: {e}") from e

    @agent.event
    async def end(self, end: EndEvent) -> EndEvent:
        logger.info("Event end received")
        logger.info("End payload: %s", end.json())
        self.end = True
        return end

    @agent.run
    async def run(self, function_input: Dict[str, Any]) -> None:
        logger.info("CoordinatorAgent run started")
        logger.info("Run input: %s", function_input)
        await agent.condition(lambda: self.end)
