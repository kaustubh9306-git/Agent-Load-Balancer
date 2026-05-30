"""
stats.py — Tracks how many requests went to each agent.

Kept separate from the load balancer so the dashboard can ask
"show me the distribution" without touching routing logic.
"""

import threading
import time


class RequestStats:
    def __init__(self, agent_ids):
        """
        agent_ids: list of integers, e.g. [1, 2, 3]
        """
        self.lock = threading.Lock()
        self.total_requests = 0
        self.failed_requests = 0
        self.start_time = time.time()

        # Per-agent counters: { 1: 0, 2: 0, 3: 0 }
        self.agent_counts = {aid: 0 for aid in agent_ids}

    def record(self, agent_id, success=True):
        """Call this every time a request is routed."""
        with self.lock:
            self.total_requests += 1
            if success:
                if agent_id in self.agent_counts:
                    self.agent_counts[agent_id] += 1
            else:
                self.failed_requests += 1

    def get_summary(self):
        """Returns a dict suitable for JSON serialization."""
        with self.lock:
            uptime = round(time.time() - self.start_time, 1)
            return {
                "total_requests": self.total_requests,
                "failed_requests": self.failed_requests,
                "successful_requests": self.total_requests - self.failed_requests,
                "uptime_seconds": uptime,
                "agent_counts": dict(self.agent_counts),
                # For the pie/bar chart in the dashboard:
                "distribution": [
                    {"agent": f"Agent {aid}", "requests": count}
                    for aid, count in self.agent_counts.items()
                ]
            }

    def reset(self):
        """Reset all counters (useful for demo resets)."""
        with self.lock:
            self.total_requests = 0
            self.failed_requests = 0
            self.start_time = time.time()
            self.agent_counts = {aid: 0 for aid in self.agent_counts}