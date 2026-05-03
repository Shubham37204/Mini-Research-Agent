from app.rag.store import collection
import uuid

def add_documents(texts: list[str]):
    # store each text as vector in ChromaDB
    collection.add(
        documents=texts,
        ids=[str(uuid.uuid4()) for _ in texts]
    )

def retrieve(query: str, n: int = 3) -> list[str]:
    # search collection, return top n matching docs
    results = collection.query(
        query_texts=[query],
        n_results=n
    )
    return results["documents"][0]
