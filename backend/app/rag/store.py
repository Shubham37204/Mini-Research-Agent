import chromadb
from chromadb.utils import embedding_functions
from app.config.settings import settings

# init embedding model from settings
ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name=settings.embedding_model
)

# init local ChromaDB client (saves to disk)
client = chromadb.PersistentClient(path=settings.chroma_persist_dir)

# create or load collection named "research"
collection = client.get_or_create_collection(
    name="research",
    embedding_function=ef
)

