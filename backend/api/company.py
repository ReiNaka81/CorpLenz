import re
from fastapi import APIRouter, HTTPException, Query
from models.models import SummaryResponse
from db.mongo import get_collection

router = APIRouter()

@router.get("/company", response_model=SummaryResponse)
def get_summary(ticker: str = Query(..., pattern=r"^\d{4,5}$")):
    companies_collection = get_collection("companies")
    financials_collection = get_collection("financials")

    company_doc = companies_collection.find_one({"ticker": ticker}, {"_id": 0})
    financials = list(financials_collection.find({"ticker": ticker}, {"_id": 0}).sort("year", 1))

    if not company_doc or not financials:
        raise HTTPException(status_code=404, detail=f"ticker {ticker} のデータが見つかりません")

    return {
        "name": company_doc["name"], 
        "sector": company_doc["sector"],
        "summary": company_doc["summary"], 
        "financials": financials,
    }