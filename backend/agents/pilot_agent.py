from backend.agents.agent_state import AgentState
from backend.actions.guardrails import Guardrails
from backend.actions.executor import ActionExecutor
from backend.actions.rollback import RollbackManager
from backend.actions.traffic_splitter import TrafficSplitter
from backend.data.feature_store import FeatureStore
from backend.data.schemas import Hypothesis


class PilotAgent:
    """
    Executes safe micro-experiments based on Analyst hypotheses.
    """

    def __init__(self, store: FeatureStore, state: AgentState):
        self.store = store
        self.state = state

        self.splitter = TrafficSplitter()
        self.executor = ActionExecutor(self.splitter)
        self.rollback_mgr = RollbackManager(self.splitter)

    def act(self):
        if not self.state.active_hypotheses:
            return

        hypothesis: Hypothesis = self.state.active_hypotheses[0]
        self.state.processed_hypotheses.append(hypothesis)


        if hypothesis.confidence < Guardrails.MIN_CONFIDENCE:
            return

        shift = min(hypothesis.suggested_traffic_shift, Guardrails.MAX_TRAFFIC_SHIFT)
        self.executor.divert_shadow_traffic(shift)

        print(f"\n🧪 Shadow experiment started: {shift*100}% traffic diverted")
        print("Current allocations:", self.splitter.get_allocations())
