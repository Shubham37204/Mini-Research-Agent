import hashlib
import json
from pathlib import Path
from typing import List, Optional
from aegis.core.domain.models import ReviewFinding, ReviewContext

class ReviewCache:
    """Filesystem-based cache for review findings."""
    
    def __init__(self, cache_dir: Path = None):
        self.cache_dir = cache_dir or Path(".aegis/cache")
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def generate_hash(self, context: ReviewContext) -> str:
        """Generate a deterministic hash for the review context."""
        # Key components: diff content, prompt version, model ID
        payload = {
            "diff": context.target.diff_content,
            "prompt_version": context.execution.prompt_version,
            "model_id": context.provider.model_id
        }
        
        hasher = hashlib.sha256()
        hasher.update(json.dumps(payload, sort_keys=True).encode())
        return hasher.hexdigest()

    def get(self, cache_hash: str) -> Optional[List[ReviewFinding]]:
        cache_file = self.cache_dir / f"{cache_hash}.json"
        if cache_file.exists():
            with open(cache_file, "r") as f:
                data = json.load(f)
                return [ReviewFinding(**item) for item in data]
        return None

    def set(self, cache_hash: str, findings: List[ReviewFinding]):
        cache_file = self.cache_dir / f"{cache_hash}.json"
        with open(cache_file, "w") as f:
            json.dump([f.model_dump(mode='json') for f in findings], f, indent=2)
