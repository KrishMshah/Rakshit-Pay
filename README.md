# Rakshit-Pay

Rakshit Pay
An Agentic AI System for Real-Time Payment Operations

Rakshit Pay is a production-inspired agentic control system that autonomously monitors live payment traffic, detects issuer-level degradation, and safely intervenes using controlled micro-experiments.

It demonstrates how payment platforms can evolve from dashboard-driven monitoring to self-healing, explainable decision systems.

This project is designed to feel like something you would expect to find inside a modern fintech reliability or payments infrastructure team.

Why This Exists

Most payment failures are:

Detected too late

Diagnosed manually

Mitigated with blunt switches (hard failovers)

Rakshit Pay shows how agentic decision loops can:

Detect degradation early

Act with bounded risk

Learn from outcomes

Remain fully observable and explainable

This is not a rules engine.
This is not a black-box ML demo.

This is agent-driven payment operations.

Core Concept

Rakshit Pay implements a continuous control loop:

Observe → Reason → Decide → Act → Learn

Each step is explicit, logged, and visible in both backend APIs and the frontend dashboard.

System Architecture
Multi-Agent Design

Rakshit Pay uses two cooperating agents with strict separation of concerns.

Analyst Agent (Observer)

Continuously evaluates route + issuer performance

Detects statistically meaningful degradation

Emits structured hypotheses with confidence scores

Never executes actions

Pilot Agent (Actor)

Validates hypotheses against safety guardrails

Runs controlled shadow experiments (e.g. 5% traffic diversion)

Publishes active experiments to shared system state

Never makes unbounded changes

Guardrails (Hard Constraints)

All actions are bounded by:

Minimum confidence thresholds

Maximum traffic shift limits

Cooldown periods between experiments

This ensures safety by construction.

What the System Actually Does

When issuer performance degrades:

Analyst detects a success-rate drop

A hypothesis is generated with:

Route

Issuer

Confidence score

Suspected cause

Pilot validates safety conditions

A shadow experiment diverts a small portion of traffic

Results are evaluated and logged

Policy decisions are updated

All of this happens autonomously.

Features

Real-time route and issuer metrics

Degradation detection with confidence scoring

Safe micro-experimentation

Explainable decisions (no hidden logic)

Backend + frontend observability

Clear separation of control and data planes

Tech Stack
Backend

Python

FastAPI

Uvicorn

Agent-based architecture

In-memory feature store (extensible)

Frontend

React

Vite

Lightweight ops dashboard

Live experiment visibility

Design Philosophy

Safety before optimization

Small, reversible actions

Humans can always understand the system

Decisions are observable, not implicit

Production realism over toy examples