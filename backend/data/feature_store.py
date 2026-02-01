from datetime import datetime
from collections import defaultdict
from typing import Dict, Tuple

from backend.data.schemas import PaymentEvent, RouteMetrics


class FeatureStore:
    """
    Stores rolling metrics per (route_id, issuer_bank).
    """

    def __init__(self):
        # Key: (route_id, issuer_bank)
        self.route_stats: Dict[Tuple[str, str], Dict] = defaultdict(
            lambda: {
                "total": 0,
                "success": 0,
                "failure": 0,
                "latency_sum": 0
            }
        )

    def ingest_event(self, event: PaymentEvent):
        key = (event.route_id, event.issuer_bank)
        stats = self.route_stats[key]

        stats["total"] += 1
        stats["latency_sum"] += event.latency_ms

        if event.status.value == "success":
            stats["success"] += 1
        else:
            stats["failure"] += 1

    def get_route_metrics(self, route_id: str, issuer: str) -> RouteMetrics:
        stats = self.route_stats.get((route_id, issuer))

        if not stats or stats["total"] == 0:
            return RouteMetrics(
                route_id=route_id,
                issuer_bank=issuer,
                total_count=0,
                success_count=0,
                failure_count=0,
                success_rate=0.0,
                avg_latency_ms=0.0,
                last_updated=datetime.utcnow()
            )

        success_rate = stats["success"] / stats["total"]
        avg_latency = stats["latency_sum"] / stats["total"]

        return RouteMetrics(
            route_id=route_id,
            issuer_bank=issuer,
            total_count=stats["total"],
            success_count=stats["success"],
            failure_count=stats["failure"],
            success_rate=round(success_rate, 4),
            avg_latency_ms=round(avg_latency, 2),
            last_updated=datetime.utcnow()
        )
