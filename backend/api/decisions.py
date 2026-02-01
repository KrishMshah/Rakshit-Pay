from fastapi import APIRouter
from backend.agents.agent_state import AgentState

router = APIRouter(prefix="/decisions", tags=["decisions"])

agent_state: AgentState = None


def init_decisions(state: AgentState):
    global agent_state
    agent_state = state


@router.get("/hypotheses")
async def get_active_hypotheses():
    return agent_state.active_hypotheses
