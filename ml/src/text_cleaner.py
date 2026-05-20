import re
import unicodedata

def clean_text(text: str) -> str:
    """
    Cleans raw text extracted from PDF.
    - Normalizes unicode characters.
    - Removes repeated headers/footers when possible.
    - Removes broken line breaks (re-joins sentences).
    - Removes excessive whitespaces and empty lines.
    - Preserves formulas, numbers, punctuation, Indonesian, and English characters.
    """
    if not text:
        return ""

    # Normalize unicode (NFC standard)
    text = unicodedata.normalize("NFC", text)
    
    # Remove repeated typical headers or footers (like page numbers or document stamps)
    text = re.sub(r'(?i)^\s*(page\s*\d+|bab\s*\d+|chapter\s*\d+)\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE) # Plain standalone page numbers

    # Remove broken line breaks: a newline followed by a lowercase letter
    # this typically means a sentence was broken across two lines.
    text = re.sub(r'(\w)\n([a-z])', r'\1 \2', text)
    
    # Replace single newlines that are not between paragraphs with single spaces
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
    
    # Normalize multiple whitespace characters into single space
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Normalize multiple consecutive newlines into double newlines (paragraphs)
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    
    # Strip whitespace from extremes
    text = text.strip()
    
    return text
