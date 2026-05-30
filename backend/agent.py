"""
agent.py — A simple agent server.
 
Run three times like this:
  python agent.py 8001
  python agent.py 8002
  python agent.py 8003
 
Each agent has two endpoints:
  GET /process  — simulates doing work, returns which agent handled it
  GET /health   — returns {"status": "healthy"} so the load balancer can check it
"""
 
import sys
import time
import random
import threading
from flask import Flask, jsonify
from flask_cors import CORS
 
app = Flask(__name__)
CORS(app)  # Allow the React frontend to call this server
 
# Read the port from command line: python agent.py 8001
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
AGENT_ID = PORT - 8000  # Agent 1, 2, or 3
 
# Track how many requests this agent has handled
request_count = 0
request_lock = threading.Lock()
 
 
@app.route("/process")
def process():
    """
    Simulate doing some work.
    random.uniform(0.1, 0.5) adds a small random delay so you can
    see that requests genuinely take different amounts of time.
    """
    global request_count
 
    start_time = time.time()
    time.sleep(random.uniform(0.05, 0.2))  # Simulate work
    duration = round(time.time() - start_time, 3)
 
    with request_lock:
        request_count += 1
        count = request_count
 
    return jsonify({
        "agent_id": AGENT_ID,
        "port": PORT,
        "message": f"Agent {AGENT_ID} processed your request",
        "request_number": count,
        "duration_seconds": duration,
        "timestamp": time.time()
    })
 
 
@app.route("/health")
def health():
    """
    Health check endpoint.
    The load balancer calls this every 5 seconds.
    If it gets a 200 response → agent is healthy.
    If it gets no response (timeout/error) → agent is unhealthy.
    """
    return jsonify({
        "status": "healthy",
        "agent_id": AGENT_ID,
        "port": PORT,
        "total_requests": request_count
    })
 
 
@app.route("/stats")
def stats():
    """Returns this agent's statistics."""
    return jsonify({
        "agent_id": AGENT_ID,
        "port": PORT,
        "total_requests": request_count
    })
 
 
if __name__ == "__main__":
    print(f"🤖 Agent {AGENT_ID} starting on port {PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=False)