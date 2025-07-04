import chromadb
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
from sentence_transformers import SentenceTransformer

client = chromadb.Client()
collection_name = "pdf_chunks"

model = SentenceTransformer("all-MiniLM-L6-v2")

def get_collection():
    return client.get_or_create_collection(
        name=collection_name,
        embedding_function=DefaultEmbeddingFunction()
    )

def store_chunks(chunks):
    ids = [f"chunk-{i}" for i in range(len(chunks))]
    collection = get_collection()
    collection.add(documents=chunks, ids=ids)

def retrieve_relevant_chunks(query, k=3):
    query_embedding = model.encode([query])[0].tolist()
    collection = get_collection()
    results = collection.query(query_embeddings=[query_embedding], n_results=k)
    return results["documents"][0] if results["documents"] else []
