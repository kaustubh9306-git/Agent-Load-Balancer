"""
health_checker.py — Background thread that checks agent health every 5 seconds.

CONCEPT: This runs independently of request handling.
Think of it like a doctor checking patient vitals continuously.

Flow:
  every 5 seconds →
    for each agent →
      try GET /health with 2s timeout →
        success  → mark agent as "healthy"
        failure  → mark agent as "unhealthy" (failover kicks in)
        recovery → if was unhealthy and now responds → log recovery event
"""

import threading
import time
import requests
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
logger = logging.getLogger(__name__)


class HealthChecker:
    def __init__(self, agents, check_interval=5):
        """
        agents: list of dicts like [{"id": 1, "port": 8001, "url": "http://localhost:8001"}]
        check_interval: how many seconds between checks
        """
        self.agents = agents
        self.check_interval = check_interval
        self.running = False
        self._thread = None

        # Initialize all agents as healthy (optimistic start)
        for agent in self.agents:
            agent["healthy"] = True
            agent["consecutive_failures"] = 0
            agent["last_checked"] = None

        # Event log: stores recent health events for the dashboard
        self.event_log = []
        self.event_lock = threading.Lock()

    def _log_event(self, event_type, agent_id, message):
        """Add an event to the log. Keeps last 50 events."""
        with self.event_lock:
            self.event_log.append({
                "type": event_type,       # "healthy", "unhealthy", "recovery"
                "agent_id": agent_id,
                "message": message,
                "timestamp": time.time()
            })
            # Keep only the 50 most recent events
            self.event_log = self.event_log[-50:]

    def check_agent(self, agent):
        """
        Pings one agent's /health endpoint.
        Returns True if healthy, False if not.
        """
        try:
            response = requests.get(
                f"{agent['url']}/health",
                timeout=2  # 2 second timeout — don't wait forever
            )
            return response.status_code == 200
        except requests.exceptions.RequestException:
            # This catches: connection refused, timeout, any network error
            return False

    def run_checks(self):
        """The main loop: check all agents, update their status."""
        while self.running:
            for agent in self.agents:
                was_healthy = agent["healthy"]
                is_healthy = self.check_agent(agent)

                agent["last_checked"] = time.time()

                if is_healthy:
                    agent["consecutive_failures"] = 0

                    if not was_healthy:
                        # RECOVERY: agent was down, now it's back up
                        agent["healthy"] = True
                        msg = f"Agent {agent['id']} (port {agent['port']}) recovered ✅"
                        logger.info(msg)
                        self._log_event("recovery", agent["id"], msg)
                    else:
                        self._log_event("healthy", agent["id"],
                                        f"Agent {agent['id']} is healthy ✅")
                else:
                    agent["consecutive_failures"] += 1

                    if was_healthy:
                        # FAILURE: agent was up, now it's down
                        agent["healthy"] = False
                        msg = f"Agent {agent['id']} (port {agent['port']}) is DOWN ❌"
                        logger.warning(msg)
                        self._log_event("unhealthy", agent["id"], msg)

            time.sleep(self.check_interval)

    def start(self):
        """Start the background health-check thread."""
        self.running = True
        self._thread = threading.Thread(target=self.run_checks, daemon=True)
        self._thread.start()
        logger.info(f"Health checker started (interval: {self.check_interval}s)")

    def stop(self):
        self.running = False

    def get_healthy_agents(self):
        """Returns only the agents that are currently healthy."""
        return [a for a in self.agents if a["healthy"]]

    def get_status(self):
        """Returns full status of all agents (for the dashboard API)."""
        return [
            {
                "id": a["id"],
                "port": a["port"],
                "url": a["url"],
                "healthy": a["healthy"],
                "consecutive_failures": a["consecutive_failures"],
                "last_checked": a["last_checked"],
            }
            for a in self.agents
        ]

    def get_events(self, limit=20):
        """Returns recent events for the live log in the dashboard."""
        with self.event_lock:
            return list(reversed(self.event_log[-limit:]))