import time
from backend.simulator.payment_generator import PaymentGenerator
from backend.data.feature_store import FeatureStore


def run_simulation():
    generator = PaymentGenerator()
    store = FeatureStore()

    print("🚀 Starting payment simulation...\n")

    for i in range(100):
        event = generator.generate_event(route_id="primary_route")
        store.ingest_event(event)

        if i % 10 == 0:
            metrics = store.get_route_metrics("primary_route")
            print(metrics)

        time.sleep(0.1)


if __name__ == "__main__":
    run_simulation()
