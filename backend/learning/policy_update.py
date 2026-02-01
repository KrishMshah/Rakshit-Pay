from backend.actions.executor import ActionExecutor
from backend.actions.rollback import RollbackManager
from backend.actions.traffic_splitter import TrafficSplitter
from backend.learning.memory_store import MemoryStore


class PolicyUpdater:
    """
    Applies learning outcome to future actions.
    """

    def __init__(self, splitter: TrafficSplitter, memory: MemoryStore):
        self.splitter = splitter
        self.executor = ActionExecutor(splitter)
        self.rollback = RollbackManager(splitter)
        self.memory = memory

    def apply(self, hypothesis, uplift: float):
        if uplift > 0.02:
            # Scale up to 20%
            self.executor.divert_shadow_traffic(0.20)
            self.memory.record(hypothesis, "scaled_up", uplift)
            print("📈 Experiment successful → scaling traffic")

        elif uplift < -0.02:
            # Rollback
            self.rollback.rollback()
            self.memory.record(hypothesis, "rolled_back", uplift)
            print("🔁 Experiment failed → rollback executed")

        else:
            self.memory.record(hypothesis, "inconclusive", uplift)
            print("⏳ Experiment inconclusive → holding")
