from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID, uuid4
from datetime import datetime
from aegis.core.domain.models import ReviewContext, ReviewFinding, Severity
from pydantic import BaseModel

router = APIRouter(prefix="/reviews")

# DTOs to match frontend expectations
class SessionSummaryDTO(BaseModel):
    id: UUID
    timestamp: datetime
    model: str
    findings: int
    severity: str

@router.get("/sessions", response_model=List[SessionSummaryDTO])
async def get_sessions():
    # Mock data for now to sync with frontend
    return [
        SessionSummaryDTO(
            id=uuid4(),
            timestamp=datetime.now(),
            model="Llama 3.3",
            findings=10,
            severity="critical"
        )
    ]

@router.get("/sessions/{session_id}", response_model=ReviewContext)
async def get_session(session_id: UUID):
    # In a real app, we would fetch from a database or .aegis/cache
    raise HTTPException(status_code=404, detail="Session not found")

@router.get("/sessions/{session_id}/findings", response_model=List[ReviewFinding])
async def get_findings(session_id: UUID):
    return []
