const SyncModel = require("../models/syncModel");
const syncWebSocket = require("../websocket/syncWebSocket");

class SyncController {
  // Get last sync time
  static getLastSync(req, res) {
    try {
      const lastSync = SyncModel.getLastSync();
      res.status(200).json({
        success: true,
        data: lastSync
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching last sync",
        error: error.message
      });
    }
  }

  // Trigger manual sync
  static triggerSync(req, res) {
    try {
      const syncTime = new Date().toISOString();
      SyncModel.addSync(syncTime);
      
      // Broadcast sync event to all connected WebSocket clients
      syncWebSocket.broadcastSync({
        last_sync: syncTime,
        triggered_by: "manual",
        message: "Sync completed successfully"
      });

      res.status(200).json({
        success: true,
        message: "Sync triggered successfully",
        sync_time: syncTime,
        connected_clients: syncWebSocket.getConnectedClientsCount()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error triggering sync",
        error: error.message
      });
    }
  }

  // Get connected WebSocket clients count
  static getConnectedClients(req, res) {
    try {
      const count = syncWebSocket.getConnectedClientsCount();
      res.status(200).json({
        success: true,
        connected_clients: count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error getting connected clients",
        error: error.message
      });
    }
  }
 
}

module.exports = SyncController;
