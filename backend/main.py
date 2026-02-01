from fastapi import FastAPI

from backend.lifecycle import AppLifecycle
from backend.api.ingest import router as ingest_router, init_ingest
from backend.api.metrics import router as metrics_router, init_metrics
from backend.api.decisions import router as decisions_router, init_decisions
from backend.api.websocket import router as websocket_router


app = FastAPI(title="PayOps Sentinel")

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


# Register routers
app.include_router(ingest_router)
app.include_router(metrics_router)
app.include_router(decisions_router)
app.include_router(websocket_router)
