from typing import TypedDict, List

class AgentState(TypedDict):
    query: str        # user's question
    context: List[str]  # docs from RAG (Phase 4a)
    memory: List[str]   # past queries from mem0 (Phase 4b)
    response: str       # final answer from LLM (Phase 5)

