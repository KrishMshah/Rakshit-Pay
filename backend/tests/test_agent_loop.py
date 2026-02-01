import threading
import time

from backend.data.feature_store import FeatureStore
from backend.simulator.payment_generator import PaymentGenerator
from backend.agents.agent_loop import AgentLoop

store = FeatureStore()
generator = PaymentGenerator()

# Force degradation
generator.failure_model.inject_issuer_degradation("hdfc", 0.4)

agent_loop = AgentLoop(store, interval_seconds=3)

def generate_traffic():
    while True:
        event = generator.generate_event(route_id="primary_route")
        store.ingest_event(event)
        time.sleep(0.1)

traffic_thread = threading.Thread(target=generate_traffic, daemon=True)
agent_thread = threading.Thread(
    target=agent_loop.start,
    args=("primary_route",),
    daemon=True
)

traffic_thread.start()
agent_thread.start()

time.sleep(20)
agent_loop.stop()
