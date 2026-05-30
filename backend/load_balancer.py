"""
load_balancer.py — The central Load Balancer server (port 8000).

This file ties everything together:
  1. Starts the HealthChecker background thread
  2. Exposes GET /route  → picks an agent and forwards the /process request
  3. Exposes GET /status → returns dashboard data (agent health + stats)
  4. Exposes POST /strategy → lets the dashboard switch routing algorithms
  5. Exposes POST /reset  → resets stats (handy for demos)

CONCEPT: The load balancer itself does NO computation.
It's purely a traffic cop: it receives a request, decides
which agent should handle it, forwards it, and returns the result.
"""

import time
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

from health_checker import HealthChecker
from strategies import STRATEGIES
from stats import RequestStats

app = Flask(__name__)
CORS(app)  # Allow React dashboard to call this server

# ── Agent registry ───────────────────────────────────────────────────
# Define the three agents. The health checker and load balancer
# both read from this list.
AGENTS = [
    {"id": 1, "port": 8001, "url": "http://localhost:8001"},
    {"id": 2, "port": 8002, "url": "http://localhost:8002"},
    {"id": 3, "port": 8003, "url": "http://localhost:8003"},
]

# ── Initialize subsystems ────────────────────────────────────────────
health_checker = HealthChecker(AGENTS, check_interval=5)
stats = RequestStats(agent_ids=[1, 2, 3])

# Start with round robin; the dashboard can change this live
current_strategy_name = "round_robin"


# ── Routes ───────────────────────────────────────────────────────────

@app.route("/route")
def route_request():
    """
    Main routing endpoint.
    
    Flow:
      1. Get list of healthy agents from the health checker
      2. Pick one using the current strategy
      3. Forward the request to that agent's /process endpoint
      4. Return the agent's response + metadata to the caller
      
    If no agents are healthy → return 503 Service Unavailable
    If the chosen agent fails mid-request → record failure, return 502
    """
    global current_strategy_name

    # Step 1: Get healthy agents only
    healthy_agents = health_checker.get_healthy_agents()

    if not healthy_agents:
        stats.record(agent_id=None, success=False)
        return jsonify({
            "error": "No healthy agents available",
            "strategy": current_strategy_name
        }), 503

    # Step 2: Pick an agent using the current strategy
    strategy = STRATEGIES[current_strategy_name]
    chosen_agent = strategy.pick(healthy_agents)

    # For least connections: increment before request, decrement after
    lc = STRATEGIES["least_connections"]
    if current_strategy_name == "least_connections":
        lc.increment(chosen_agent)

    # Step 3: Forward the request to the chosen agent
    try:
        start = time.time()
        response = requests.get(
            f"{chosen_agent['url']}/process",
            timeout=5
        )
        duration = round(time.time() - start, 3)

        stats.record(chosen_agent["id"], success=True)

        # Return the agent's response + load balancer metadata
        return jsonify({
            **response.json(),                          # Everything the agent returned
            "routed_by": "load_balancer",
            "strategy": current_strategy_name,
            "response_time_seconds": duration,
            "active_connections": lc.get_connections(chosen_agent["port"])
        })

    except requests.exceptions.RequestException as e:
        stats.record(chosen_agent["id"], success=False)
        return jsonify({
            "error": f"Agent {chosen_agent['id']} failed: {str(e)}",
            "strategy": current_strategy_name
        }), 502

    finally:
        # Always decrement connection count (whether success or fail)
        if current_strategy_name == "least_connections":
            lc.decrement(chosen_agent)


@app.route("/status")
def status():
    """
    Dashboard endpoint — returns everything the React frontend needs.
    Called every 2 seconds by the dashboard's polling loop.
    """
    return jsonify({
        "strategy": current_strategy_name,
        "agents": health_checker.get_status(),
        "stats": stats.get_summary(),
        "events": health_checker.get_events(limit=15),
        "available_strategies": list(STRATEGIES.keys()),
        # Connection counts per agent (for least_connections display)
        "active_connections": {
            str(agent["port"]): STRATEGIES["least_connections"].get_connections(agent["port"])
            for agent in AGENTS
        }
    })


@app.route("/strategy", methods=["POST"])
def set_strategy():
    """
    Switch routing strategy via the dashboard.
    Body: { "strategy": "round_robin" }
    """
    global current_strategy_name
    data = request.get_json()
    strategy_name = data.get("strategy")

    if strategy_name not in STRATEGIES:
        return jsonify({"error": f"Unknown strategy: {strategy_name}"}), 400

    current_strategy_name = strategy_name
    return jsonify({
        "message": f"Strategy switched to {strategy_name}",
        "strategy": current_strategy_name
    })


@app.route("/reset", methods=["POST"])
def reset_stats():
    """Reset all request counts. Great for demo resets."""
    stats.reset()
    return jsonify({"message": "Stats reset successfully"})


@app.route("/health")
def lb_health():
    """Load balancer's own health check."""
    return jsonify({"status": "healthy", "service": "load_balancer"})


if __name__ == "__main__":
    print("⚖️  Load Balancer starting on port 8000")
    print("   Strategies: round_robin | random | least_connections")
    print("   Health checks every 5 seconds")
    health_checker.start()
    app.run(host="0.0.0.0", port=8000, debug=False)