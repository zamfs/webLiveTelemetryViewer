// main.js
import { drawnTrack } from '../liveTrackMap/modules/drawTrack.js';
import { updateSession } from '../liveTrackMap/modules/session.js';

const socket = io('http://localhost:3000');

socket.on('telemetry_update', (data) => {
    console.log("Dado recebido do Socket!: ", data);
    // Sempre que o Node.js envia o pacote do Assetto Corsa, esta função roda automaticamente
    updateSession(data);
    drawnTrack(data);
});

// Opcional: Feedback visual no console caso o servidor local não esteja rodando
socket.on('connect_error', () => {
    console.warn("Aguardando conexão com a ponte local do Race Strategy (Porta 3000)...");
});