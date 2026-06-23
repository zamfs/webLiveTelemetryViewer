// main.js

import { updateSession } from '../dashboard/modules/session.js';
import { updateControls } from '../dashboard/modules/controls.js';

const socket = io('http://localhost:3000');

socket.on('telemetry_update', (data) => {
  
    updateSession(data);
    updateControls(data);
});


socket.on('connect_error', () => {
    console.warn("Waiting connection with Port 3000...");
});