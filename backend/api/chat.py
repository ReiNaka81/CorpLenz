from fastapi import APIRouter
from rag.retriever import retrieve
from rag.chain import answer_with_context
from models.models import ChatRequest

router = APIRouter()

@router.post("/chat")
def chat(req: ChatRequest): 
    contexts = retrieve(req.query, req.ticker)
    answer = answer_with_context(req.query, contexts)

    return {"answer": answer}