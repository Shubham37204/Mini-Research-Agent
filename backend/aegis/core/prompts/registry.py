import yaml
from pathlib import Path
from typing import Dict, Any, Optional
from pydantic import BaseModel

class PromptTemplate(BaseModel):
    name: str
    version: str
    system_prompt: str
    user_template: str
    schema_instructions: Optional[str] = None
    metadata: Dict[str, Any] = {}

class PromptRegistry:
    """Handles loading and versioning of prompts from the filesystem."""
    
    def __init__(self, root_dir: Path):
        self.root_dir = root_dir

    def load(self, task: str, version: str) -> PromptTemplate:
        """
        Load a prompt template for a specific task and version.
        
        Example path: prompts/review/v1.yaml
        """
        path = self.root_dir / task / f"{version}.yaml"
        
        if not path.exists():
            raise FileNotFoundError(f"Prompt template not found at {path}")
            
        with open(path, "r") as f:
            data = yaml.safe_load(f)
            
        return PromptTemplate(
            name=task,
            version=version,
            system_prompt=data["system_prompt"],
            user_template=data["user_template"],
            schema_instructions=data.get("schema_instructions"),
            metadata=data.get("metadata", {})
        )
