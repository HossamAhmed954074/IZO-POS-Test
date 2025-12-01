const express = require('express');
const router = express.Router();
const SyncController = require('../controllers/syncController');

// Get last sync time
router.get('/last', SyncController.getLastSync);

// Trigger manual sync
router.post('/trigger', SyncController.triggerSync);

// Get connected WebSocket clients count
router.get('/clients', SyncController.getConnectedClients);



module.exports = router;
