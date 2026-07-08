"""
Thin wrapper around the OpenAI SDK used by every agent node.

All pipeline nodes ask the model to return *only* JSON matching a described
shape, then parse it. This keeps the LangGraph state machine deterministic
and lets the frontend render structured data (tables/charts) instead of
free-form prose.
"""
import json
from typing import Any

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings

settings = get_settings()
_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY, base_url=settings.OPENAI_BASE_URL or None)
    return _client


@retry(wait=wait_exponential(min=1, max=10), stop=stop_after_attempt(3))
def generate_json(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> dict[str, Any]:
    """Call the chat completions API and parse a strict-JSON response."""
    client = get_client()
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        temperature=temperature,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    content = response.choices[0].message.content or "{}"
    
    # Clean markdown formatting if present
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    try:
        parsed = json.loads(content)
        if not isinstance(parsed, dict):
            return {}
        return parsed
    except json.JSONDecodeError:
        # Fall back to an empty structure rather than crashing the pipeline;
        # the caller is responsible for validating required keys.
        return {}


@retry(wait=wait_exponential(min=1, max=10), stop=stop_after_attempt(3))
def generate_text(system_prompt: str, user_prompt: str, temperature: float = 0.5) -> str:
    client = get_client()
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        temperature=temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content or ""
