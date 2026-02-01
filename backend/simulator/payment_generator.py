import random
from backend.data.schemas import PaymentEvent, PaymentStatus
from backend.simulator.failure_models import FailureModel


class PaymentGenerator:
    def __init__(self):
        self.failure_model = FailureModel()

        self.issuers = ["hdfc", "icici", "sbi"]
        self.methods = ["card", "upi"]
        self.networks = ["visa", "mastercard"]

    def generate_event(self, route_id: str) -> PaymentEvent:
        issuer = random.choice(self.issuers)
        latency = random.randint(80, 400)

        failed = self.failure_model.should_fail(issuer)

        return PaymentEvent(
            merchant_id="merchant_001",
            amount=random.randint(100, 5000),
            payment_method="card",
            card_network=random.choice(self.networks),
            issuer_bank=issuer,
            bin=str(random.randint(400000, 499999)),
            route_id=route_id,
            status=PaymentStatus.FAILURE if failed else PaymentStatus.SUCCESS,
            latency_ms=latency,
            error_code="ISSUER_DOWN" if failed else None
        )
