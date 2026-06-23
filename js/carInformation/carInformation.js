// carInformation.js
import { updateCarStatus } from '../carInformation/modules/carStatus.js';
import { updateSession } from '../carInformation/modules/session.js';

const socket = io('http://localhost:3000');

socket.on('telemetry_update', (data) => {
   
    updateSession(data);
    updateCarStatus(data);
});


socket.on('connect_error', () => {
    console.warn("Waiting connection with Port 3000...");
});