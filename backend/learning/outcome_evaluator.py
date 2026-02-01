from backend.data.feature_store import FeatureStore


class OutcomeEvaluator:
    """
    Evaluates experiment results.
    """

    def __init__(self, store: FeatureStore):
        self.store = store

    def evaluate(self, route_id: str, issuer: str) -> float:
        """
        Returns uplift = test_ps - control_ps
        """

        control = self.store.get_route_metrics(route_id, issuer)
        test = self.store.get_route_metrics("backup_route", issuer)

        return round(test.success_rate - control.success_rate, 4)
