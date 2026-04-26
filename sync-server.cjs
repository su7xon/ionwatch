const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8081 });

console.log('🚀 IonWatch Sync Server running on port 8081');

wss.on('connection', (ws) => {
  console.log('📱 New device connected');

  ws.on('message', (data) => {
    // Broadcast the sensor data to everyone else (like the laptop)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(data.toString());
      }
    });
  });

  ws.on('close', () => console.log('❌ Device disconnected'));
});
