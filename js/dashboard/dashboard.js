// main.js

import { updateSession } from '../dashboard/modules/session.js';
import { updateControls } from '../dashboard/modules/controls.js';

const socket = io('https://seu-projeto.onrender.com', {
    transports: ['websocket']
});

socket.on('telemetry_update', (data) => {
  
    updateSession(data);
    updateControls(data);
});


socket.on('connect_error', () => {
    console.warn("Waiting connection with Port 3000...");
});