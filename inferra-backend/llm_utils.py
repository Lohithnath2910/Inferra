import os
import requests
import logging
from dotenv import load_dotenv
from typing import List
from sentence_transformers import SentenceTransformer

load_dotenv()
logger = logging.getLogger(__name__)

BASE_URL = os.getenv("IBM_LLM_URL")
API_KEY = os.getenv("IBM_API_KEY")
PROJECT_ID = os.getenv("IBM_PROJECT_ID")
MODEL_ID = "meta-llama/llama-3-3-70b-instruct"
API_VERSION = "2024-05-01"

def get_token():
    resp = requests.post(
        "https://iam.cloud.ibm.com/identity/token",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": API_KEY}
    )
    resp.raise_for_status()
    return resp.json()["access_token"]

def infer_text(token: str, prompt: str) -> str:
    url = f"{BASE_URL}/ml/v1/text/generation?version={API_VERSION}"
    payload = {
        "model_id": MODEL_ID,
        "project_id": PROJECT_ID,
        "input": prompt,
        "parameters": {
            "decoding_method": "sample",
            "max_new_tokens": 1000,
            "temperature": 0.7,
            "top_k": 50,
            "top_p": 0.95
        }
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    resp = requests.post(url, headers=headers, json=payload)
    resp.raise_for_status()
    return resp.json().get("results", [{}])[0].get("generated_text", "")

def ask_ibm_llm(question: str, context_chunks: List[str]) -> str:
    if not all([BASE_URL, API_KEY, PROJECT_ID]):
        return "[ERROR] Missing IBM credentials"

    try:
        token = get_token()
        context = "\n\n".join(context_chunks)
        prompt = f"""You are a helpful assistant. Based on the following PDF content, answer the user's question clearly.

Context:
{context}

Question:
{question}

Answer:"""
        return infer_text(token, prompt).strip()
    except Exception as e:
        logger.error(e)
        return f"[ERROR] {e}"
