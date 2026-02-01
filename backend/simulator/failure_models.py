import random


class FailureModel:
    """
    Controls failure probabilities per issuer / route.
    """

    def __init__(self):
        self.issuer_failure_rate = {
            "hdfc": 0.05,
            "icici": 0.03,
            "sbi": 0.04
        }

    def inject_issuer_degradation(self, issuer: str, new_rate: float):
        self.issuer_failure_rate[issuer] = new_rate

    def should_fail(self, issuer: str) -> bool:
        base_rate = self.issuer_failure_rate.get(issuer, 0.02)
        return random.random() < base_rate
