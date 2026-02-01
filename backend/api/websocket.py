from fastapi import APIRouter, WebSocket

router = APIRouter(prefix="/ws", tags=["websocket"])


@router.websocket("/events")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    await ws.send_text("WebSocket connected")
    while True:
        await ws.receive_text()
