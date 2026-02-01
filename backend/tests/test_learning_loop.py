from backend.data.feature_store import FeatureStore
from backend.simulator.payment_generator import PaymentGenerator
from backend.agents.analyst_agent import AnalystAgent
from backend.agents.pilot_agent import PilotAgent
from backend.agents.agent_state import AgentState
from backend.learning.outcome_evaluator import OutcomeEvaluator
from backend.learning.memory_store import MemoryStore
from backend.learning.policy_update import PolicyUpdater

store = FeatureStore()
state = AgentState()

analyst = AnalystAgent(store, state)
pilot = PilotAgent(store, state)
generator = PaymentGenerator()

# Make backup route healthier
generator.failure_model.inject_issuer_degradation("hdfc", 0.35)

# Generate control traffic
for _ in range(100):
    event = generator.generate_event(route_id="primary_route")
    store.ingest_event(event)

hypothesis = analyst.observe_route("primary_route")
pilot.act()

# Generate test traffic (backup route healthier)
generator.failure_model.inject_issuer_degradation("hdfc", 0.05)
for _ in range(50):
    event = generator.generate_event(route_id="backup_route")
    store.ingest_event(event)

evaluator = OutcomeEvaluator(store)
uplift = evaluator.evaluate("primary_route", "hdfc")

memory = MemoryStore()
policy = PolicyUpdater(pilot.splitter, memory)
policy.apply(hypothesis, uplift)

print("\nFinal allocations:", pilot.splitter.get_allocations())
print("Learning memory:", memory.history())
