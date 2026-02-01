from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from backend.lifecycle import AppLifecycle
from backend.api.ingest import router as ingest_router, init_ingest
from backend.api.metrics import router as metrics_router, init_metrics
from backend.api.decisions import router as decisions_router, init_decisions
from backend.api.websocket import router as websocket_router
from backend.api import experiments



app = FastAPI(title="Rakshit Pay")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(experiments.router)

lifecycle = AppLifecycle()


@app.on_event("startup")
async def on_startup():
    lifecycle.start()

    # Inject shared objects into APIs
    init_ingest(lifecycle.feature_store)
    init_metrics(lifecycle.feature_store)
    init_decisions(lifecycle.agent_loop.state)


@app.on_event("shutdown")
async def on_shutdown():
    lifecycle.stop()

from backend.data.feature_store import FeatureStore
from backend.agents.agent_loop import AgentLoop

feature_store = FeatureStore()
agent_loop = AgentLoop(feature_store, interval_seconds=5)

@app.on_event("startup")
def start_agent_loop():
    agent_loop.start_async(route_id="primary_route")



# Register routers
app.include_router(ingest_router)
app.include_router(metrics_router)
app.include_router(decisions_router)
app.include_router(websocket_router)
