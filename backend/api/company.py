from fastapi import APIRouter, HTTPException
from models.models import SummaryResponse
from db.mongo import get_collection

router = APIRouter()

@router.get("/company", response_model=SummaryResponse)
def get_summary(ticker: str):
    companies_collection = get_collection("companies")
    financials_collection = get_collection("financials")

    company_doc = companies_collection.find_one({"ticker": ticker}, {"_id": 0})
    financials = list(financials_collection.find({"ticker": ticker}, {"_id": 0}))

    if not company_doc or not financials:
        raise HTTPException(status_code=404, detail=f"ticker {ticker} のデータが見つかりません")

    return {"summary": company_doc["summary"], "financials": financials}