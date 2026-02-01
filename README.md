# Rakshit Pay

**Rakshit Pay** is an agentic AI system for **real-time payment operations**.  
It autonomously monitors live payment traffic, detects issuer-level degradation, and safely intervenes using controlled micro-experiments.

The system demonstrates how payment platforms can evolve from **dashboard-driven monitoring** to **self-healing, explainable decision systems**—the kind you would expect to find inside a modern fintech reliability or payments infrastructure team.

---

## Table of Contents

- [Why This Exists](#why-this-exists)
- [Core Concept](#core-concept)
- [System Architecture](#system-architecture)
  - [Multi-Agent Design](#multi-agent-design)
  - [Guardrails](#guardrails)
- [What the System Does](#what-the-system-does)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design Philosophy](#design-philosophy)
- [Future Extensions](#future-extensions)
- [License](#license)

---

## Why This Exists

Most payment failures today are:

- Detected too late  
- Diagnosed manually  
- Mitigated with blunt switches (hard failovers)

**Rakshit Pay** shows how agentic decision loops can:

- Detect degradation early  
- Act with bounded, measurable risk  
- Learn from real outcomes  
- Remain fully observable and explainable  

This is **not**:
- A rules engine  
- A black-box ML demo  

This **is** agent-driven payment operations.

---

## Core Concept

Rakshit Pay implements a continuous control loop:

**Observe → Reason → Decide → Act → Learn**

Each step is:
- Explicit
- Logged
- Inspectable via backend APIs and a frontend dashboard

No hidden logic. No implicit decisions.

---

## System Architecture

### Multi-Agent Design

Rakshit Pay uses two cooperating agents with **strict separation of concerns**.

#### Analyst Agent (Observer)

- Continuously evaluates route and issuer performance
- Detects statistically meaningful degradation
- Emits structured hypotheses including:
  - Route
  - Issuer
  - Confidence score
  - Suspected cause
- **Never executes actions**

#### Pilot Agent (Actor)

- Validates hypotheses against safety guardrails
- Runs controlled shadow experiments (e.g. diverting 5% of traffic)
- Publishes active experiments to shared system state
- **Never makes unbounded changes**

---

### Guardrails

All actions are constrained by hard safety limits:

- Minimum confidence thresholds
- Maximum traffic shift limits
- Cooldown periods between experiments

Safety is enforced **by construction**, not convention.

---

## What the System Does

When issuer performance degrades:

1. Analyst detects a statistically significant success-rate drop
2. A hypothesis is generated containing:
   - Route
   - Issuer
   - Confidence score
   - Suspected cause
3. Pilot validates the hypothesis against guardrails
4. A shadow experiment diverts a small portion of traffic
5. Results are evaluated and logged
6. Policy decisions are updated based on outcomes

All of this happens autonomously—and remains fully observable.

---

## Features

- Real-time route and issuer metrics
- Degradation detection with confidence scoring
- Safe, bounded micro-experimentation
- Explainable decisions (no hidden logic)
- Backend and frontend observability
- Clear separation of control and data planes

---

## Tech Stack

### Backend

- Python
- FastAPI
- Uvicorn
- Agent-based architecture
- In-memory feature store (extensible)

### Frontend

- React
- Vite
- Lightweight operations dashboard
- Live experiment visibility

---

## Design Philosophy

- Safety before optimization
- Small, reversible actions
- Humans can always understand the system
- Decisions are observable, not implicit
- Production realism over toy examples

---

## Future Extensions

Potential next steps:

- Persistent feature and experiment storage
- Adaptive confidence thresholds
- Multi-region or multi-PSP support
- Human-in-the-loop approval modes
- Offline replay and simulation tooling

---

## License

This project is provided for educational and demonstration purposes.  
See the `LICENSE` file for details.
