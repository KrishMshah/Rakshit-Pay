from typing import Dict, List
from backend.data.schemas import RouteMetrics, Hypothesis


class AgentState:
    """
    Shared state across agents.
    """

    def __init__(self):
        self.latest_metrics: Dict[str, RouteMetrics] = {}

        # Visible to API
        self.active_hypotheses: List[Hypothesis] = []

        # Internal bookkeeping
        self.processed_hypotheses: List[Hypothesis] = []
