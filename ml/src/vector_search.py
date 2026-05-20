import numpy as np

def cosine_similarity(a, b) -> float:
    """
    Computes the cosine similarity between two vectors a and b.
    Formula: (a . b) / (||a|| * ||b||)
    """
    vec_a = np.array(a)
    vec_b = np.array(b)
    
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    
    if norm_a == 0 or norm_b == 0:
        return 0.0
        
    return float(dot_product / (norm_a * norm_b))

def search_similar_chunks(query_embedding, chunks: list[dict], top_k: int = 5) -> list[dict]:
    """
    Searches for the top_k most similar chunks using cosine similarity.
    Each chunk dictionary must contain a pregenerated 'embedding' vector field.
    
    Returns a sorted list of chunks with an added 'similarity' score field.
    """
    scored_chunks = []
    
    for chunk in chunks:
        chunk_embedding = chunk.get("embedding")
        if not chunk_embedding:
            continue
            
        similarity = cosine_similarity(query_embedding, chunk_embedding)
        
        # Create a copy of the chunk without the massive embedding list to keep output clean
        chunk_copy = {k: v for k, v in chunk.items() if k != "embedding"}
        chunk_copy["similarity"] = similarity
        scored_chunks.append(chunk_copy)
        
    # Sort by similarity in descending order
    scored_chunks.sort(key=lambda x: x["similarity"], reverse=True)
    
    return scored_chunks[:top_k]
