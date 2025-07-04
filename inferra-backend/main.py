import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from embedding_utils import extract_text_from_pdf_bytes, split_text_into_chunks
from vectorstore import store_chunks, retrieve_relevant_chunks
from llm_utils import ask_ibm_llm

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PDF Q&A Assistant", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionInput(BaseModel):
    question: str

@app.get("/")
async def root():
    return {"message": "PDF Q&A Assistant API", "status": "running"}

@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Empty file")

    full_text = extract_text_from_pdf_bytes(pdf_bytes)
    if not full_text.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted from PDF")

    text_chunks = split_text_into_chunks(full_text)
    if not text_chunks:
        raise HTTPException(status_code=400, detail="No valid text chunks found.")

    store_chunks(text_chunks)

    return {
        "status": "success",
        "filename": file.filename,
        "chunks_count": len(text_chunks),
        "text_preview": full_text[:200] + "..." if len(full_text) > 200 else full_text
    }

@app.post("/ask")
async def ask_question(input: QuestionInput):
    if not input.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    relevant_chunks = retrieve_relevant_chunks(input.question, k=3)
    if not relevant_chunks:
        raise HTTPException(status_code=404, detail="No relevant context found.")

    answer = ask_ibm_llm(input.question, relevant_chunks)
    return {
        "question": input.question,
        "answer": answer
    }

@app.delete("/clear")
async def clear_document():
    # Optional: clear ChromaDB if desired
    return {"status": "success", "message": "In-memory cleared (no-op for ChromaDB)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)