import os
import logging
import sys
from typing import Dict, Any
from datetime import timedelta
from pydantic import BaseModel
from restack_ai.agent import agent, import_functions, NonRetryableError

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class EndEvent(BaseModel):
    end: bool

with import_functions():
    from linda_server.functions.llm_chat import Message, LlmChatInput, llm_chat

class GeometryProblemInput(BaseModel):
    problem_text: str
    image_path: str | None = None

@agent.defn()
class CoordinatorAgent:
    def __init__(self) -> None:
        logger.debug("Initializing CoordinatorAgent")
        self.status = "idle"
        self.end = False

    @agent.event
    async def submit_problem(self, input: GeometryProblemInput):
        logger.info("Event submit_problem started")
        logger.debug("Input payload: %s", input.json())
        self.status = "processing"
        try:
            system_content = "You are a coordinator..."
            messages = [
                Message(role="system", content=system_content),
                Message(role="user", content=input.problem_text)
            ]
            logger.info("Calling llm_chat for analysis")
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
        logger.debug("End payload: %s", end.json())
        self.end = True
        return end

    @agent.run
    async def run(self, function_input: Dict[str, Any]) -> None:
        logger.info("CoordinatorAgent run started")
        logger.debug("Run input: %s", function_input)
        await agent.condition(lambda: self.end)
