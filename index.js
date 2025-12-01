const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize database tables
const InvoiceModel = require('./models/invoiceModel');
new InvoiceModel(); // This will call initializeTables()
const SyncModel = require('./models/syncModel');
new SyncModel(); // This will call initializeTables()

const invoicesRouter = require('./routers/invoicesRouter');
app.use('/api/invoices', invoicesRouter);

const syncRouter = require('./routers/syncRouter');
app.use('/api/sync', syncRouter);

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket for sync
const syncWebSocket = require('./websocket/syncWebSocket');
syncWebSocket.initialize(server);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`WebSocket sync available at ws://localhost:${port}/sync`);
});