from fastapi import APIRouter
from backend.data.schemas import PaymentEvent
from backend.data.feature_store import FeatureStore

router = APIRouter(prefix="/ingest", tags=["ingest"])

# This will be injected from main.py
feature_store: FeatureStore = None


def init_ingest(store: FeatureStore):
    global feature_store
    feature_store = store


@router.post("/payment")
async def ingest_payment(event: PaymentEvent):
    feature_store.ingest_event(event)
    return {"status": "ingested", "event_id": event.event_id}
