class AgentState:
    def __init__(self):
        # ----- Analyst Agent -----
        # Active hypotheses detected by the analyst
        self.active_hypotheses = []

        # Hypotheses already processed by the pilot
        self.processed_hypotheses = []

        # Latest metrics observed per (route, issuer)
        # key: "route_id:issuer"
        self.latest_metrics = {}

        # ----- Pilot Agent -----
        # Currently running shadow experiment (if any)
        self.active_experiment = None
