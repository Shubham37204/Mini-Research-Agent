from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, ConfigDict

class Severity(str, Enum):
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class FindingCategory(str, Enum):
    SECURITY = "security"
    PERFORMANCE = "performance"
    MAINTAINABILITY = "maintainability"
    STYLE = "style"
    BUG = "bug"

class ReviewFinding(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    file_path: str
    line_start: int
    line_end: int
    category: FindingCategory
    severity: Severity
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    title: str
    description: str
    suggestion: Optional[str] = None
    engine_id: str
    cwe: Optional[str] = None
    owasp: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ReviewTarget(BaseModel):
    repo_path: str
    base_ref: str
    head_ref: str
    diff_content: str

class TokenBudget(BaseModel):
    model_limit: int
    reserved_system: int = 1000
    reserved_output: int = 2000
    available_input: int
    used_input: int = 0
    used_output: int = 0

class ProviderContext(BaseModel):
    provider_name: str
    model_id: str
    token_budget: TokenBudget
    total_cost: float = 0.0

class ExecutionContext(BaseModel):
    parallel_enabled: bool = False
    prompt_version: str
    seed: int = 42
    config_hash: str

class AnalysisContext(BaseModel):
    findings: List[ReviewFinding] = Field(default_factory=list)
    rule_results: Dict[str, Any] = Field(default_factory=dict)
    ai_results: Dict[str, Any] = Field(default_factory=dict)

class ReviewEvent(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.now)
    session_id: UUID
    event_type: str
    stage: Optional[str] = None
    payload: Dict[str, Any] = Field(default_factory=dict)

class ReviewStartedEvent(ReviewEvent):
    event_type: str = "review_started"
    target: ReviewTarget

class LLMCallCompletedEvent(ReviewEvent):
    event_type: str = "llm_call_completed"
    model_id: str
    tokens_used: int
    duration_ms: float

class TelemetryContext(BaseModel):
    events: List[ReviewEvent] = Field(default_factory=list)
    timings: Dict[str, float] = Field(default_factory=dict)

class ReviewContext(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    session_id: UUID = Field(default_factory=uuid4)
    target: ReviewTarget
    analysis: AnalysisContext = Field(default_factory=AnalysisContext)
    execution: ExecutionContext
    provider: ProviderContext
    telemetry: TelemetryContext = Field(default_factory=TelemetryContext)

class ReviewHash(BaseModel):
    diff_hash: str
    config_hash: str
    prompt_hash: str
    provider_hash: str
    seed: int
