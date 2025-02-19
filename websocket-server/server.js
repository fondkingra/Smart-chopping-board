const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const server = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

// Handle new client connections
server.on('connection', (socket) => {
  console.log('A new client connected');

  // Handle messages from clients
  socket.on('message', (message) => {
    console.log(`Received: ${message}`);

    // Broadcast the message to all connected clients
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});