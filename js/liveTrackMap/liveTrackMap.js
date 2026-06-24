// main.js
import { drawnTrack } from '../liveTrackMap/modules/drawTrack.js';
import { updateSession } from '../liveTrackMap/modules/session.js';

const socket = io('https://livetelemetryviewer.onrender.com', {
    transports: ['websocket']
});

socket.on('telemetry_update', (data) => {
    
    updateSession(data);
    drawnTrack(data);
});


socket.on('connect_error', () => {
    console.warn("Waiting connection with Port 3000...");
});