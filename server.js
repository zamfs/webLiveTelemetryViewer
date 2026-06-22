const dgram = require('dgram');
const { Server } = require("socket.io");

const io = new Server(3000, {
  cors: { origin: "*" }
});

// === LOG 1: Monitora o Navegador ===
io.on('connection', (socket) => {
  console.log(`💻 Navegador conectado ao Socket.io! ID do cliente: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log('❌ Navegador fechou ou desconectou.');
  });
});

const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
  try {
    const telemetryData = JSON.parse(msg.toString('utf-8'));
    
    // === LOG 2: Monitora o Jogo (Assetto Corsa) ===
    // Imprime a velocidade no terminal só para sabermos que o Python está enviando dados
    console.log(`🏎️ Dados recebidos do Assetto Corsa! Velocidade atual: ${telemetryData.speed.kmh} km/h`);
    
    // Repassa para o site
    io.emit('telemetry_update', telemetryData);
  } catch (error) {
    console.error("Erro ao processar dados do Python:", error);
  }
});

udpServer.bind(9996, () => {
  console.log('🚀 Ponte ativa e escutando o Assetto Corsa na porta UDP 9996...');
  console.log('📡 Servidor Socket.io pronto para o navegador na porta 3000...');
});