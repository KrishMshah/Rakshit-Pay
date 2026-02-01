from backend.actions.traffic_splitter import TrafficSplitter


class RollbackManager:
    def __init__(self, splitter: TrafficSplitter):
        self.splitter = splitter

    def rollback(self):
        self.splitter.apply_split(primary=1.0, backup=0.0)
