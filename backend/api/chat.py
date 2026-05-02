from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from rag.retriever import retrieve
from rag.chain import answer_with_context
from models.models import ChatRequest

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/chat")
@limiter.limit("10/minute")
def chat(request: Request, req: ChatRequest):
    try:
        contexts = retrieve(req.query, req.ticker)
        answer = answer_with_context(req.query, contexts, req.model)
        return {"answer": answer}
    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail="回答の生成に失敗しました")
