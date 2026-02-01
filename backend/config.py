import os


class AppConfig:
    """
    Centralized configuration for PayOps Sentinel.
    """

    # Environment
    ENV = os.getenv("APP_ENV", "demo")  # demo | prod

    # Agent Loop
    AGENT_INTERVAL_SECONDS = int(
        os.getenv("AGENT_INTERVAL_SECONDS", 5)
    )

    # Analyst Agent
    BASELINE_SUCCESS_RATE = float(
        os.getenv("BASELINE_SUCCESS_RATE", 0.93)
    )

    DEGRADATION_THRESHOLD = float(
        os.getenv("DEGRADATION_THRESHOLD", 0.05)  # demo-safe
    )

    MIN_EVENTS_FOR_DECISION = int(
        os.getenv("MIN_EVENTS_FOR_DECISION", 15)
    )

    MONITORED_ISSUERS = ["hdfc", "icici", "sbi"]

    # Guardrails
    MAX_TRAFFIC_SHIFT = float(
        os.getenv("MAX_TRAFFIC_SHIFT", 0.20)
    )

    MIN_CONFIDENCE = float(
        os.getenv(
            "MIN_CONFIDENCE",
            0.70 if ENV == "demo" else 0.90
        )
    )

    # Routing
    PRIMARY_ROUTE_ID = os.getenv("PRIMARY_ROUTE_ID", "primary_route")
    BACKUP_ROUTE_ID = os.getenv("BACKUP_ROUTE_ID", "backup_route")

    # Learning
    SCALE_UP_THRESHOLD = float(
        os.getenv("SCALE_UP_THRESHOLD", 0.02)
    )

    ROLLBACK_THRESHOLD = float(
        os.getenv("ROLLBACK_THRESHOLD", -0.02)
    )
