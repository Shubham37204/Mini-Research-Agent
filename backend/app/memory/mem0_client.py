from mem0 import MemoryClient
from app.config.settings import settings

# init mem0 client with API key
client = MemoryClient(api_key=settings.mem0_api_key)
USER_ID = "research-agent-user"

def save_memory(query: str, response: str):
    client.add(
        messages=[
            {"role": "user", "content": query},
            {"role": "assistant", "content": response}
        ],
        user_id=USER_ID,
        output_format="v1.1"
    )

def get_memory(query: str) -> str:
    results = client.search(
        query=query,
        filters={"user_id": USER_ID}
    )
    # results is dict with "results" key
    items = results.get("results", results)
    if not items:
        return ""
    # each item has "memory" key
    return items[0].get("memory", "")