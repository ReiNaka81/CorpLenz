from fastapi import APIRouter
from models.models import CompaniesResponse
from db.mongo import get_collection

router = APIRouter()

@router.get("/companies", response_model=CompaniesResponse)
def get_companies():
    collection = get_collection("companies")
    results = list(collection.find({}, {"_id": 0, "ticker": 1, "name": 1, "sector": 1}))
    return {"companies": results}