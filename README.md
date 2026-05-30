# Agent-Load-Balancer
Intelligent Agent Load Balancer
A real-time distributed load balancing system designed to efficiently route client requests across multiple backend agents while ensuring high availability through automated health monitoring and failover mechanisms.

Features
🔄 Multiple Load Balancing Strategies
Round Robin
Random Selection
Least Connections
❤️ Real-Time Health Monitoring
Continuous agent health checks
Automatic unhealthy node detection
Live status tracking
⚡ Automated Failover
Instantly removes failed agents from routing
Redirects traffic to healthy agents
Maintains uninterrupted service
📊 Interactive Monitoring Dashboard
Live request statistics
Agent health visualization
Traffic distribution analytics
Real-time event logs
Request flow visualization
🚦 Traffic Simulation
Generate configurable workloads
Test routing strategies under load
Demonstrate system resilience
Architecture

Client Requests → Load Balancer → Backend Agents

The load balancer continuously monitors agent health, selects routing targets using the configured strategy, and automatically reroutes traffic when failures occur.

Tech Stack
Backend: Python, Flask
Frontend: React, Vite
Visualization: Recharts
Communication: REST APIs
Monitoring: Real-time polling and health checks
Key Highlights
Distributed system concepts
Fault-tolerant architecture
Automated failover and recovery
Real-time monitoring dashboard
Infrastructure observability
