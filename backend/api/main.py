from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.chat import router as chat_router
from api.company import router as company_router
from api.companies import router as companies_router

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(chat_router, prefix = "/api")
app.include_router(company_router, prefix="/api")
app.include_router(companies_router, prefix="/api")
