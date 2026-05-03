from tavily import TavilyClient
from app.config.settings import settings

# init Tavily client with API key
client = TavilyClient(api_key=settings.tavily_api_key)

def search_web(query: str) -> list[str]:
    # search web, return top result contents
    response = client.search(query=query)
    return [r["content"] for r in response["results"]]

