from fastapi import APIRouter
from pydantic import BaseModel
from app.config.settings import settings
from app.agents.graph import agent

router = APIRouter()

# request body shape
class ResearchRequest(BaseModel):
    query: str

@router.get("/health")
def health_check():
    return {"status": "ok", "app": settings.app_name}

@router.post("/research")
def research(request: ResearchRequest):
    # run full agent with query, return response
    result = agent.invoke({
        "query": request.query,
        "context": [],
        "memory": [],
        "response": ""
    })
    return {"query": request.query, "response": result["response"]}

