const WebSocket = require("ws");

class SyncWebSocket {
  constructor() {
    this.wss = null;
    this.clients = new Set();
  }

  // Initialize WebSocket server
  initialize(server) {
    this.wss = new WebSocket.Server({ server, path: "/sync" });

    this.wss.on("connection", (ws) => {
      console.log("New sync client connected");
      this.clients.add(ws);

      // Send welcome message
      ws.send(
        JSON.stringify({
          type: "connected",
          message: "Connected to sync WebSocket",
          timestamp: new Date().toISOString(),
        })
      );

      // Handle incoming messages
      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message);
          console.log("Received sync message:", data);

          // Echo back or handle specific sync requests
          if (data.type === "ping") {
            ws.send(
              JSON.stringify({
                type: "pong",
                timestamp: new Date().toISOString(),
              })
            );
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      });

      // Handle client disconnect
      ws.on("close", () => {
        console.log("Sync client disconnected");
        this.clients.delete(ws);
      });

      // Handle errors
      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(ws);
      });
    });

    console.log("Sync WebSocket server initialized on path: /sync");
  }

  // Broadcast sync notification to all connected clients
  broadcastSync(syncData) {
    const message = JSON.stringify({
      type: "sync:update",
      data: syncData,
      timestamp: new Date().toISOString(),
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`Broadcasted sync update to ${this.clients.size} clients`);
  }

  // Get number of connected clients
  getConnectedClientsCount() {
    return this.clients.size;
  }
}

// Export singleton instance
module.exports = new SyncWebSocket();
