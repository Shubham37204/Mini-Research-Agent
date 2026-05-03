from app.agents.state import AgentState
from app.memory.mem0_client import get_memory, save_memory
from app.tools.web_search import search_web
from app.rag.retriever import retrieve
from app.config.settings import settings
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

# init Groq LLM client once
llm = ChatGroq(
    api_key=settings.groq_api_key,
    model=settings.llm_model,
    temperature=settings.llm_temperature
)

def retrieve_memory(state: AgentState) -> AgentState:
    # fetch past memory relevant to current query from mem0
    memory = get_memory(state["query"])
    return {**state, "memory": [memory] if memory else []}

def retrieve_context(state: AgentState) -> AgentState:
    # search live web + local docs, combine into context list
    web_results = search_web(state["query"])
    rag_results = retrieve(state["query"])
    combined = web_results + rag_results
    return {**state, "context": combined}

def generate_response(state: AgentState) -> AgentState:
    # build prompt from query + memory + context, call Groq LLM
    memory_text = "\n".join(state["memory"]) or "None"
    context_text = "\n".join(state["context"]) or "None"

    prompt = f"""You are a research assistant.

Past memory:
{memory_text}

Context:
{context_text}

Query: {state["query"]}

Give a clear, structured answer with sources where possible."""

    response = llm.invoke([HumanMessage(content=prompt)])
    answer = response.content

    # save this query+answer to mem0 for future memory
    save_memory(state["query"], answer)

    return {**state, "response": answer}
