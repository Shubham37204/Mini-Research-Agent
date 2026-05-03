from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    # App
    app_name: str
    debug: bool
    host: str
    port: int

    # API Keys
    groq_api_key: str
    tavily_api_key: str
    mem0_api_key: str

    # LLM
    llm_model: str
    llm_temperature: float

    # RAG
    chroma_persist_dir: str
    embedding_model: str
    chunk_size: int
    chunk_overlap: int

    #LangSmith
    langchain_tracing_v2: str
    langchain_endpoint: str
    langchain_api_key: str
    langchain_project: str

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()

