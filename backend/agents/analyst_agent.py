from typing import Optional, List
from datetime import datetime

from backend.data.feature_store import FeatureStore
from backend.data.schemas import Hypothesis, RouteMetrics
from backend.agents.agent_state import AgentState
from backend.config import AppConfig


class AnalystAgent:
    """
    Observer-only agent.

    Responsibilities:
    - Observe issuer-level payment performance
    - Detect statistically meaningful degradation
    - Emit hypotheses with recommended experiments
    - NEVER execute actions
    """

    def __init__(self, feature_store: FeatureStore, state: AgentState):
        self.store = feature_store
        self.state = state

        # Config-driven thresholds
        self.baseline_success_rate = AppConfig.BASELINE_SUCCESS_RATE
        self.degradation_threshold = AppConfig.DEGRADATION_THRESHOLD
        self.min_events = AppConfig.MIN_EVENTS_FOR_DECISION
        self.issuers: List[str] = AppConfig.MONITORED_ISSUERS

    def observe_route(self, route_id: str) -> Optional[Hypothesis]:
        """
        Observe issuer-level metrics for a given route.
        Returns a Hypothesis if degradation is detected.
        """

        for issuer in self.issuers:
            metrics: RouteMetrics = self.store.get_route_metrics(
                route_id=route_id,
                issuer=issuer
            )

            # Not enough data to reason safely
            if metrics.total_count < self.min_events:
                continue

            drop = self.baseline_success_rate - metrics.success_rate

            if drop < self.degradation_threshold:
                continue

            # ✅ Deduplicate ONLY against already-processed hypotheses
            for h in self.state.processed_hypotheses:
                if h.route_id == route_id and h.issuer_bank == issuer:
                    return None

            # Confidence based on evidence volume (caps at 0.95)
            confidence = min(0.95, metrics.total_count / 50)

            hypothesis = Hypothesis(
                route_id=route_id,
                issuer_bank=issuer,
                baseline_ps=self.baseline_success_rate,
                current_ps=metrics.success_rate,
                confidence=round(confidence, 2),
                suspected_cause="issuer_specific_degradation",
                recommended_backup_route=AppConfig.BACKUP_ROUTE_ID,
                suggested_traffic_shift=0.05,
                created_at=datetime.utcnow()
            )

            # ✅ Publish hypothesis into shared agent state
            self.state.active_hypotheses.append(hypothesis)
            self.state.latest_metrics[f"{route_id}:{issuer}"] = metrics

            print("🧠 Hypothesis published:", hypothesis, flush=True)

            return hypothesis

        return None
