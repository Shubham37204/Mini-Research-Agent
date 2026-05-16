import litellm
import json
from typing import Dict, Any, List, Optional
from aegis.core.domain.models import ReviewFinding, ProviderContext
from pydantic import ValidationError

import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

class AIProviderError(Exception):
    pass

def repair_json(content: str) -> str:
    """Attempt to repair common LLM JSON errors."""
    content = content.strip()
    if not content.startswith("{"):
        # Find the first {
        start = content.find("{")
        if start != -1:
            content = content[start:]
    if not content.endswith("}"):
        # Find the last }
        end = content.rfind("}")
        if end != -1:
            content = content[:end+1]
    return content

class LiteLLMProvider:
    """Thin abstraction over LiteLLM with resilience."""
    
    def __init__(self, context: ProviderContext):
        self.context = context

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    async def complete_review(
        self, 
        system_prompt: str, 
        user_prompt: str,
        response_model: Any = None
    ) -> Dict[str, Any]:
        """
        Call the model with retry, repair, and timeout logic.
        """
        try:
            async with asyncio.timeout(30): # 30s timeout
                response = await litellm.acompletion(
                    model=self.context.model_id,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"} if response_model else None,
                    temperature=0.1,
                )
            
            content = response.choices[0].message.content
            
            # Repair attempt
            repaired_content = repair_json(content)
            
            try:
                data = json.loads(repaired_content)
                return data
            except json.JSONDecodeError as e:
                raise AIProviderError(f"Failed to parse LLM response after repair attempt: {e}")
                
        except asyncio.TimeoutError:
            raise AIProviderError("Provider call timed out after 30 seconds.")
        except Exception as e:
            raise AIProviderError(f"Provider call failed: {str(e)}")

def validate_findings(raw_data: Dict[str, Any]) -> List[ReviewFinding]:
    """Validate raw JSON data against ReviewFinding model."""
    findings = []
    raw_findings = raw_data.get("findings", [])
    
    for f in raw_findings:
        try:
            finding = ReviewFinding(**f, engine_id="ai_review_engine")
            findings.append(finding)
        except ValidationError as e:
            # In a production system, we might log this and attempt repair
            print(f"Validation failed for finding: {e}")
            continue
            
    return findings
