from backend.actions.traffic_splitter import TrafficSplitter


class ActionExecutor:
    def __init__(self, splitter: TrafficSplitter):
        self.splitter = splitter

    def divert_shadow_traffic(self, percent: float):
        primary = round(1.0 - percent, 2)
        backup = round(percent, 2)
        self.splitter.apply_split(primary, backup)
