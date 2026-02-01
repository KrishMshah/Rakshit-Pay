from backend.actions.traffic_splitter import TrafficSplitter
from backend.agents.agent_state import AgentState

class GlobalState:
    def __init__(self):
        self.agent_state = AgentState()
        self.traffic_splitter = TrafficSplitter()
        self.active_experiment = None

state = GlobalState()
