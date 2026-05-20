import os
import hashlib
import numpy as np
from dotenv import load_dotenv

load_dotenv()

def generate_embedding(text: str) -> list:
    """
    Generates a 1536-dimensional vector embedding for the given text.
    Uses OpenAI's 'text-embedding-3-small' model if the OPENAI_API_KEY is configured.
    Otherwise, generates a highly resilient, deterministic mock embedding based on SHA-256
    hashing, enabling robust vector search testing offline.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    
    if api_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            response = client.embeddings.create(
                input=[text],
                model="text-embedding-3-small"
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"OpenAI embedding generation failed ({e}). Falling back to mock...", flush=True)

    # Deterministic Mock Vector Fallback: 1536 dimension unit vector
    # We use hashlib to seed a random generator deterministically
    hasher = hashlib.sha256(text.encode("utf-8"))
    seed = int(hasher.hexdigest()[:8], 16)
    
    rng = np.random.default_rng(seed)
    mock_vector = rng.standard_normal(1536)
    
    # Normalize the vector to unit length (length = 1.0) so cosine similarity equals dot product
    norm = np.linalg.norm(mock_vector)
    if norm > 0:
        mock_vector = mock_vector / norm
        
    return mock_vector.tolist()
