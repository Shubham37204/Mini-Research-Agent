from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes import retrieve_memory, retrieve_context, generate_response

def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("retrieve_memory", retrieve_memory)
    graph.add_node("retrieve_context", retrieve_context)
    graph.add_node("generate_response", generate_response)

    graph.set_entry_point("retrieve_memory")
    graph.add_edge("retrieve_memory", "retrieve_context")
    graph.add_edge("retrieve_context", "generate_response")
    graph.add_edge("generate_response", END)

    return graph.compile()

agent = build_graph()

