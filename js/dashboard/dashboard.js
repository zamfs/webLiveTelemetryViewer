// main.js
//import { updateCarStatus } from '../dashboard/modules/carStatus.js';
import { updateSession } from '../dashboard/modules/session.js';
import { updateControls } from '../dashboard/modules/controls.js';

const socket = io('http://localhost:3000');

socket.on('telemetry_update', (data) => {
    // Sempre que o Node.js envia o pacote do Assetto Corsa, esta função roda automaticamente
    updateSession(data);
    updateControls(data);
});

// Opcional: Feedback visual no console caso o servidor local não esteja rodando
socket.on('connect_error', () => {
    console.warn("Aguardando conexão com a ponte local do Race Strategy (Porta 3000)...");
});