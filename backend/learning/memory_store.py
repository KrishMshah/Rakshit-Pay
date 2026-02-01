from typing import List, Dict
from backend.data.schemas import Hypothesis


class MemoryStore:
    """
    Stores past hypotheses and their outcomes.
    """

    def __init__(self):
        self.experiments: List[Dict] = []

    def record(self, hypothesis: Hypothesis, outcome: str, uplift: float):
        self.experiments.append({
            "route_id": hypothesis.route_id,
            "issuer": hypothesis.issuer_bank,
            "outcome": outcome,
            "uplift": uplift
        })

    def history(self):
        return self.experiments
