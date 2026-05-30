"""
strategies.py — The three routing algorithms.
 
CONCEPT: A "strategy" is just a function that receives a list of healthy
agents and returns ONE agent to send the request to.
 
Round Robin   → take turns: Agent1, Agent2, Agent3, Agent1, Agent2 ...
Random        → pick any healthy agent at random
Least Conn.   → pick the agent currently handling the fewest requests
"""
 
import random
import threading
 
 
class RoundRobinStrategy:
    """
    Cycles through agents in order.
    Uses a counter and modulo arithmetic to wrap around.
    
    Example with 3 agents:
      counter=0 → agents[0 % 3] = Agent1
      counter=1 → agents[1 % 3] = Agent2
      counter=2 → agents[2 % 3] = Agent3
      counter=3 → agents[3 % 3] = Agent1  ← wraps back
    """
    def __init__(self):
        self.counter = 0
        self.lock = threading.Lock()  # Thread-safe counter increment
 
    def pick(self, healthy_agents):
        if not healthy_agents:
            return None
        with self.lock:
            agent = healthy_agents[self.counter % len(healthy_agents)]
            self.counter += 1
        return agent
 
 
class RandomStrategy:
    """
    Picks a random healthy agent.
    Simple but can be uneven with small request counts.
    Good demo for showing contrast with round robin.
    """
    def pick(self, healthy_agents):
        if not healthy_agents:
            return None
        return random.choice(healthy_agents)
 
 
class LeastConnectionsStrategy:
    """
    Picks the agent with the fewest ACTIVE (in-progress) connections.
    
    This is the smartest strategy: if Agent1 is handling a slow request
    and Agent2+3 are free, new requests go to Agent2 or Agent3.
    
    The load balancer must call:
      - increment(agent) when a request STARTS
      - decrement(agent) when a request FINISHES
    """
    def __init__(self):
        self.active_connections = {}  # { port: count }
        self.lock = threading.Lock()
 
    def increment(self, agent):
        """Call this when a request is sent to an agent."""
        with self.lock:
            port = agent["port"]
            self.active_connections[port] = self.active_connections.get(port, 0) + 1
 
    def decrement(self, agent):
        """Call this when the agent finishes handling a request."""
        with self.lock:
            port = agent["port"]
            if self.active_connections.get(port, 0) > 0:
                self.active_connections[port] -= 1
 
    def get_connections(self, port):
        return self.active_connections.get(port, 0)
 
    def pick(self, healthy_agents):
        if not healthy_agents:
            return None
        with self.lock:
            # Sort agents by their active connection count, pick the lowest
            return min(
                healthy_agents,
                key=lambda a: self.active_connections.get(a["port"], 0)
            )
 
 
# ── Strategy registry ───────────────────────────────────────────────
# A simple dict makes it easy to switch strategies via the API.
# The load balancer just does: strategies[name].pick(healthy_agents)
 
round_robin = RoundRobinStrategy()
random_strategy = RandomStrategy()
least_connections = LeastConnectionsStrategy()
 
STRATEGIES = {
    "round_robin": round_robin,
    "random": random_strategy,
    "least_connections": least_connections,
}