from backend.data.feature_store import FeatureStore
from backend.simulator.payment_generator import PaymentGenerator
from backend.agents.analyst_agent import AnalystAgent
from backend.agents.pilot_agent import PilotAgent
from backend.agents.agent_state import AgentState

store = FeatureStore()
state = AgentState()

analyst = AnalystAgent(store, state)
pilot = PilotAgent(store, state)
generator = PaymentGenerator()

# Force heavy issuer degradation
generator.failure_model.inject_issuer_degradation("hdfc", 0.40)

# Generate traffic
for _ in range(100):
    event = generator.generate_event(route_id="primary_route")
    store.ingest_event(event)

print("\n--- Analyst Observation ---")
hypothesis = analyst.observe_route("primary_route")

if hypothesis:
    print("Hypothesis detected:")
    print(hypothesis)
else:
    print("No hypothesis detected by Analyst.")

print("\n--- Pilot Action ---")
pilot.act()

print("\nFinal traffic allocations:")
print(pilot.splitter.get_allocations())
