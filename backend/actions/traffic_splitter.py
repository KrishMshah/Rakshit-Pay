from typing import Dict


class TrafficSplitter:
    def __init__(self):
        self.allocations: Dict[str, float] = {
            "primary_route": 1.0,
            "backup_route": 0.0
        }

    def apply_split(self, primary: float, backup: float):
        self.allocations["primary_route"] = primary
        self.allocations["backup_route"] = backup

    def get_allocations(self) -> Dict[str, float]:
        return self.allocations
