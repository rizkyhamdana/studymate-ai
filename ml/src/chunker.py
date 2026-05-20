import re

def chunk_text(pages: list[dict], chunk_size: int = 800, overlap: int = 150) -> list[dict]:
    """
    Splits text from pages into overlapping sliding-window chunks.
    Maintains page metadata and avoids cutting sentences aggressively.
    
    Output format:
    [
      {
        "chunk_index": 0,
        "page_number": 1,
        "content": "...",
        "token_estimate": 120
      }
    ]
    """
    chunks = []
    chunk_index = 0
    
    for page in pages:
        page_num = page["page_number"]
        text = page["text"] or ""
        
        # Split text into sentences using simple regex splits to avoid cutting sentences mid-way
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        current_chunk = []
        current_length = 0
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            sentence_len = len(sentence)
            
            # If a single sentence exceeds the chunk size, we must cut it
            if sentence_len > chunk_size:
                # If we have built-up chunk text, save it first
                if current_chunk:
                    content = " ".join(current_chunk)
                    chunks.append({
                        "chunk_index": chunk_index,
                        "page_number": page_num,
                        "content": content,
                        "token_estimate": len(content) // 4  # Standard token estimate
                    })
                    chunk_index += 1
                    current_chunk = []
                    current_length = 0
                
                # Split large sentence by words
                words = sentence.split()
                sub_chunk_words = []
                sub_chunk_len = 0
                
                for word in words:
                    sub_chunk_words.append(word)
                    sub_chunk_len += len(word) + 1
                    if sub_chunk_len >= chunk_size:
                        content = " ".join(sub_chunk_words)
                        chunks.append({
                            "chunk_index": chunk_index,
                            "page_number": page_num,
                            "content": content,
                            "token_estimate": len(content) // 4
                        })
                        chunk_index += 1
                        
                        # Retain overlap words
                        overlap_words = sub_chunk_words[-max(1, int(overlap / 10)):]
                        sub_chunk_words = list(overlap_words)
                        sub_chunk_len = sum(len(w) + 1 for w in sub_chunk_words)
                
                if sub_chunk_words:
                    current_chunk = list(sub_chunk_words)
                    current_length = sub_chunk_len
                    
            elif current_length + sentence_len + 1 > chunk_size:
                # Save the current chunk
                content = " ".join(current_chunk)
                chunks.append({
                    "chunk_index": chunk_index,
                    "page_number": page_num,
                    "content": content,
                    "token_estimate": len(content) // 4
                })
                chunk_index += 1
                
                # Form the overlapping starting text
                # We backtrack sentences to satisfy overlap
                backtrack_chunk = []
                backtrack_len = 0
                for s in reversed(current_chunk):
                    if backtrack_len + len(s) + 1 <= overlap:
                        backtrack_chunk.insert(0, s)
                        backtrack_len += len(s) + 1
                    else:
                        break
                
                current_chunk = backtrack_chunk
                current_chunk.append(sentence)
                current_length = sum(len(s) + 1 for s in current_chunk)
            else:
                current_chunk.append(sentence)
                current_length += sentence_len + 1
                
        # Save any remaining sentence content for the page
        if current_chunk:
            content = " ".join(current_chunk)
            chunks.append({
                "chunk_index": chunk_index,
                "page_number": page_num,
                "content": content,
                "token_estimate": len(content) // 4
            })
            chunk_index += 1
            
    return chunks
