from PyPDF2 import PdfReader
import re
import io
from typing import List

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    pdf_file = io.BytesIO(pdf_bytes)
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    text = re.sub(r'\n\s*\n', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

def split_text_into_chunks(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = ""
    for sentence in sentences:
        if len(current_chunk) + len(sentence) > chunk_size:
            chunks.append(current_chunk.strip())
            current_chunk = current_chunk[-overlap:] + sentence
        else:
            current_chunk += " " + sentence
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    return [chunk for chunk in chunks if len(chunk.split()) >= 10]
