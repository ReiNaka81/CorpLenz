from fastapi import APIRouter
from pydantic import BaseModel
from rag.retriever import retrieve
from rag.chain import answer_with_context

router = APIRouter()

class ChatRequest(BaseModel):   
    query: str
    ticker: str

@router.post("/chat")
def chat(req: ChatRequest): 
    contexts = retrieve(req.query, req.ticker)
    answer = answer_with_context(req.query, contexts)

    return {"answer": answer}