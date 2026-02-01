from backend.data.schemas import PaymentEvent, PaymentStatus
from backend.data.feature_store import FeatureStore

store = FeatureStore()

event = PaymentEvent(
    merchant_id="m1",
    amount=500,
    payment_method="card",
    card_network="visa",
    issuer_bank="hdfc",
    bin="123456",
    route_id="primary_route",
    status=PaymentStatus.SUCCESS,
    latency_ms=120
)

store.ingest_event(event)
metrics = store.get_route_metrics("primary_route")

print(metrics)
