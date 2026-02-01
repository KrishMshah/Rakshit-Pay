from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class PaymentStatus(str, Enum):
    SUCCESS = "success"
    FAILURE = "failure"


class PaymentEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    merchant_id: str
    amount: float
    currency: str = "INR"

    payment_method: str          # card, upi, netbanking
    card_network: Optional[str]  # visa, mastercard
    issuer_bank: Optional[str]   # hdfc, icici, sbi
    bin: Optional[str]

    route_id: str                # primary_route, backup_route
    status: PaymentStatus

    latency_ms: int
    error_code: Optional[str] = None


class RouteMetrics(BaseModel):
    route_id: str
    issuer_bank: Optional[str]

    total_count: int
    success_count: int
    failure_count: int

    success_rate: float
    avg_latency_ms: float
    last_updated: datetime


class Hypothesis(BaseModel):
    route_id: str
    issuer_bank: Optional[str]

    baseline_ps: float
    current_ps: float
    confidence: float

    suspected_cause: str
    recommended_backup_route: str
    suggested_traffic_shift: float  # e.g. 0.05 (5%)

    created_at: datetime = Field(default_factory=datetime.utcnow)
