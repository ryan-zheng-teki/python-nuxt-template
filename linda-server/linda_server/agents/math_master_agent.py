import logging
import sys
from datetime import timedelta
from pydantic import BaseModel
from restack_ai.agent import agent, import_functions, NonRetryableError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

with import_functions():
    from linda_server.functions.llm_chat import Message, LlmChatInput, llm_chat

class GeometrySolutionInput(BaseModel):
    problem_text: str
    analysis: str
    image_path: str | None = None

@agent.defn()
class MathMasterAgent:
    def __init__(self) -> None:
        logger.info("Initializing MathMasterAgent")
        self.status = "idle"

    @agent.event
    async def solve_problem(self, input: GeometrySolutionInput):
        logger.info("Event solve_problem started")
        logger.info("Input payload: %s", input.json())
        self.status = "solving"
        try:
            system_content = "You are a geometry master..."
            messages = [
                Message(role="system", content=system_content),
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
