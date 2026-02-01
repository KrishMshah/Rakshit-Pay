from backend.agents.agent_state import AgentState
from backend.actions.guardrails import Guardrails
from backend.actions.executor import ActionExecutor
from backend.actions.rollback import RollbackManager
from backend.actions.traffic_splitter import TrafficSplitter
from backend.data.feature_store import FeatureStore
from backend.data.schemas import Hypothesis
from backend.state import state
from datetime import datetime


class PilotAgent:
    """
    Executes safe micro-experiments based on Analyst hypotheses.
    """

    def __init__(self, store: FeatureStore, state: AgentState):
        self.store = store
        self.state = state

        from backend.state import state

        self.splitter = state.traffic_splitter

        self.executor = ActionExecutor(self.splitter)
        self.rollback_mgr = RollbackManager(self.splitter)

    def act(self):
        # No hypotheses → nothing to do
        if not self.state.active_hypotheses:
            return

        hypothesis: Hypothesis = self.state.active_hypotheses[0]
        self.state.processed_hypotheses.append(hypothesis)

        # Guardrail: insufficient confidence
        if hypothesis.confidence < Guardrails.MIN_CONFIDENCE:
            return

        # Determine safe traffic shift
        shift = min(
            hypothesis.suggested_traffic_shift,
            Guardrails.MAX_TRAFFIC_SHIFT,
        )

        # Execute shadow routing
        self.executor.divert_shadow_traffic(shift)

        # 🔥 STORE ACTIVE EXPERIMENT (THIS WAS THE MISSING PART)
        state.active_experiment = {
            "issuer": hypothesis.issuer_bank,
            "route": hypothesis.route_id,
            "backup_route": hypothesis.recommended_backup_route,
            "traffic_shift": shift,
            "confidence": hypothesis.confidence,
            "started_at": datetime.utcnow().isoformat(),
        }

        # 🖥 Backend logs (always visible)
        print(
            "\n[EXPERIMENT STARTED]",
            state.active_experiment,
            flush=True,
        )

        print("🧪 Shadow experiment started")
        print(f"Traffic diverted: {shift * 100}%")
        print("Current allocations:", self.splitter.get_allocations())
