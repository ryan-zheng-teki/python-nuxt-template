import logging
import sys
from datetime import timedelta
from typing import List
from pydantic import BaseModel
from restack_ai.agent import agent, import_functions, NonRetryableError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

with import_functions():
    from linda_server.functions.llm_chat import Message, LlmChatInput, llm_chat
    from linda_server.agents.prompts.math_master_prompt import SYSTEM_PROMPT as MATH_MASTER_SYSTEM_PROMPT

class GeometrySolutionInput(BaseModel):
    problem_text: str
    analysis: str
    image_path: str | None = None

class MessagesEvent(BaseModel):
    messages: List[Message]

@agent.defn()
class MathMasterAgent:
    def __init__(self) -> None:
        logger.info("Initializing MathMasterAgent")
        self.status = "idle"

    @agent.event
    async def messages(self, messages_event: MessagesEvent):
        """
        Handle messages event for streaming support.
        This is required by Restack for streaming chat completions.
        """
        logger.info("Event messages started")
        logger.info(f"Messages payload: {messages_event.json()}")
        
        self.status = "solving"
        try:
            # Extract the problem text from the first user message
            user_messages = [m for m in messages_event.messages if m.role == "user"]
            if not user_messages:
                raise ValueError("No user message found in the request")
            
            problem_text = user_messages[0].content
            
            # Check if there's an analysis included in the message
            # We'll assume the format is "Problem: <problem_text>\nAnalysis: <analysis>"
            analysis = ""
            if "Analysis:" in problem_text:
                parts = problem_text.split("Analysis:", 1)
                problem_text = parts[0].strip()
                if len(parts) > 1:
                    analysis = parts[1].strip()
            
            logger.info(f"Extracted problem text: {problem_text}")
            logger.info(f"Extracted analysis: {analysis}")
            
            messages = [
                Message(role="system", content=MATH_MASTER_SYSTEM_PROMPT),
                Message(role="user", content=f"{problem_text}\nAnalysis: {analysis}" if analysis else problem_text)
            ]
            
            logger.info("Calling llm_chat for solution (streaming)")
            stream_response = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=messages, stream=True),
                start_to_close_timeout=timedelta(seconds=240),
            )
            
            self.status = "complete"
            logger.info("messages event completed successfully")
            return stream_response
        except Exception as e:
            logger.exception("Error in messages event")
            self.status = "error"
            raise NonRetryableError(f"Error in math master agent messages handler: {e}") from e

    @agent.event
    async def solve_problem(self, input: GeometrySolutionInput):
        """
        Legacy handler for non-streaming requests.
        Kept for backward compatibility.
        """
        logger.info("Event solve_problem started")
        logger.info("Input payload: %s", input.json())
        self.status = "solving"
        try:
            messages = [
                Message(role="system", content=MATH_MASTER_SYSTEM_PROMPT),
                Message(role="user", content=f"{input.problem_text}\nAnalysis: {input.analysis}")
            ]
            logger.info("Calling llm_chat for solution (streaming)")
            stream_response = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=messages, stream=True),
                start_to_close_timeout=timedelta(seconds=240),
            )
            self.status = "complete"
            logger.info("solve_problem completed successfully")
            return stream_response
        except Exception as e:
            logger.exception("Error in solve_problem")
            self.status = "error"
            raise NonRetryableError(f"Error in math master agent: {e}") from e

    @agent.event
    async def llm_chat(self, chunk: dict) -> None:
        # Handler to receive each streamed chunk from llm_chat
        logger.info("Received llm_chat chunk: %s", chunk)

    @agent.run
    async def run(self, function_input: dict) -> None:
        logger.info("MathMasterAgent run started")
        logger.info("Run input: %s", function_input)
        await agent.condition(lambda: False)
