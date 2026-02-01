from fastapi import APIRouter
from backend.state import state

router = APIRouter(prefix="/experiments", tags=["experiments"])

@router.get("/active")
def get_active_experiment():
    return state.active_experiment
