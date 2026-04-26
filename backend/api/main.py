import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from api.chat import router as chat_router
from api.company import router as company_router
from api.companies import router as companies_router

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

if ALLOWED_ORIGINS: 
    origins = [ALLOWED_ORIGINS, "http://localhost:3000"]
else:   
    origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(chat_router, prefix = "/api")
app.include_router(company_router, prefix="/api")
app.include_router(companies_router, prefix="/api")
