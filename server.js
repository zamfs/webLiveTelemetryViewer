const dgram = require('dgram');
const { Server } = require("socket.io");

const io = new Server(3000, {
  cors: { 
    // Limit the access
    origin: [
      "https://livetelemetryviewer.onrender.com",
      "http://127.0.0.1:5500", // Just for live server (it's optional)
      "http://localhost:5500"
    ],
    methods: ["GET", "POST"]
  }
});

// === LOG 1: Monitor the browser ===
io.on('connection', (socket) => {
  console.log(`💻 Browser connected to Socket.io! Client ID: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log('❌ Browser closed or disconnected.');
  });
});

const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
  try {
    const telemetryData = JSON.parse(msg.toString('utf-8'));
    
    // === LOG 2: Monitor the game (Assetto Corsa) ===
    console.log(`🏎️ Data received from Assetto Corsa!`);
    
    // Sends to the web
    io.emit('telemetry_update', telemetryData);
  } catch (error) {
    console.error("ERROR to process the data from python:", error);
  }
});

udpServer.bind(9996, () => {
  console.log('🚀 Bridge active, listening to Assetto Corsa (UDP 9996)...');
  console.log('📡 Socket.io server ready for browser (port 3000)...');
});