import os
import logging
import sys
from typing import List, Literal, Optional
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field
from restack_ai.function import function, NonRetryableError, stream_to_websocket

load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class LlmChatInput(BaseModel):
    system_content: Optional[str] = None
    model: Optional[str] = None
    messages: List[Message] = Field(default_factory=list)
    stream: bool = False

@function.defn()
async def llm_chat(function_input: LlmChatInput) -> str:
    logger.info("llm_chat invocation started")
    logger.info("LlmChatInput: %s", function_input.json())
    try:
        api_key = os.environ.get("RESTACK_API_KEY") or os.environ.get("OPENAI_API_KEY")
        if not api_key:
            logger.error("API key not found")
            raise NonRetryableError("LLM API key not found")
        base_url = "https://ai.restack.io" if os.environ.get("RESTACK_API_KEY") else "https://api.openai.com/v1"
        client = OpenAI(base_url=base_url, api_key=api_key)

        model = function_input.model or "gpt-4.1-mini"
        logger.info("Calling OpenAI model=%s stream=%s", model, function_input.stream)

        # Build messages payload
        messages_payload = []
        if function_input.system_content:
            messages_payload.append({"role": "system", "content": function_input.system_content})
        for m in function_input.messages:
            messages_payload.append(m.model_dump())

        # Log the full outgoing payload for debugging
        logger.info("Outgoing messages_payload: %s", messages_payload)

        response = client.chat.completions.create(
            model=model,
            messages=messages_payload,
            stream=function_input.stream
        )

        if function_input.stream:
            logger.info("Streaming response to websocket")
            api_address = os.environ.get("RESTACK_API_ADDRESS") or os.environ.get("API_ADDRESS")
            return await stream_to_websocket(api_address=api_address, data=response)
        else:
            result = response.choices[0].message.content
            logger.info("Received response: %s", result)
            return result

    except Exception as e:
        logger.exception("Error in llm_chat")
        raise NonRetryableError(f"Error in llm_chat function: {e}") from e
