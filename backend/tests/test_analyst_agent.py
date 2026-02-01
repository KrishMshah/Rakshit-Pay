from backend.data.feature_store import FeatureStore
from backend.simulator.payment_generator import PaymentGenerator
from backend.agents.analyst_agent import AnalystAgent
from backend.agents.agent_state import AgentState

store = FeatureStore()
state = AgentState()
analyst = AnalystAgent(store, state)
generator = PaymentGenerator()

# simulate traffic
for _ in range(50):
    event = generator.generate_event(route_id="primary_route")
    store.ingest_event(event)

hypothesis = analyst.observe_route("primary_route")

if hypothesis:
    print("\n🚨 Hypothesis detected:")
    print(hypothesis)
else:
    print("\n✅ No degradation detected")
