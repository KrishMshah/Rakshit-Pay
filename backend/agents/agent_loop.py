import time
from typing import List

from backend.data.feature_store import FeatureStore
from backend.agents.agent_state import AgentState
from backend.agents.analyst_agent import AnalystAgent
from backend.agents.pilot_agent import PilotAgent
from backend.learning.outcome_evaluator import OutcomeEvaluator
from backend.learning.memory_store import MemoryStore
from backend.learning.policy_update import PolicyUpdater


class AgentLoop:
    """
    Central control loop for the PayOps agent system.
    Runs continuously and coordinates agents safely.
    """

    def __init__(self, feature_store: FeatureStore, interval_seconds: int = 5):
        self.store = feature_store
        self.state = AgentState()

        self.analyst = AnalystAgent(self.store, self.state)
        self.pilot = PilotAgent(self.store, self.state)

        self.evaluator = OutcomeEvaluator(self.store)
        self.memory = MemoryStore()
        self.policy = PolicyUpdater(self.pilot.splitter, self.memory)

        self.interval = interval_seconds
        self.running = False

    def run_once(self, route_id: str):
        """
        One decision cycle.
        """

        # 1. Observe + reason
        hypothesis = self.analyst.observe_route(route_id)

        if not hypothesis:
            return

        # 2. Act (micro-experiment)
        self.pilot.act()

        # 3. Learn (if test data exists)
        uplift = self.evaluator.evaluate(
            route_id=hypothesis.route_id,
            issuer=hypothesis.issuer_bank
        )

        # 4. Policy update (scale / rollback / hold)
        self.policy.apply(hypothesis, uplift)

    def start(self, route_id: str):
        """
        Continuous loop.
        """

        print("🧠 Agent loop started")
        self.running = True

        while self.running:
            try:
                self.run_once(route_id)
            except Exception as e:
                print(f"⚠️ Agent loop error: {e}")

            time.sleep(self.interval)

    def stop(self):
        self.running = False
        print("🛑 Agent loop stopped")
