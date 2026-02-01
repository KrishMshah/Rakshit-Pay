import threading

from backend.data.feature_store import FeatureStore
from backend.agents.agent_loop import AgentLoop


class AppLifecycle:
    def __init__(self):
        self.feature_store = FeatureStore()
        self.agent_loop = AgentLoop(self.feature_store, interval_seconds=5)

        self._agent_thread = None

    def start(self):
        """
        Called on FastAPI startup.
        """
        print("🚀 Starting PayOps Sentinel backend")

        self._agent_thread = threading.Thread(
            target=self.agent_loop.start,
            args=("primary_route",),
            daemon=True
        )
        self._agent_thread.start()

    def stop(self):
        """
        Called on FastAPI shutdown.
        """
        print("🛑 Stopping PayOps Sentinel backend")
        self.agent_loop.stop()
