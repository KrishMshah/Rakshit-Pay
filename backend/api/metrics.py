from fastapi import APIRouter
from backend.data.feature_store import FeatureStore

router = APIRouter(prefix="/metrics", tags=["metrics"])

feature_store: FeatureStore = None


def init_metrics(store: FeatureStore):
    global feature_store
    feature_store = store


@router.get("/route/{route_id}/issuer/{issuer}")
async def route_metrics(route_id: str, issuer: str):
    metrics = feature_store.get_route_metrics(route_id, issuer)
    return metrics
