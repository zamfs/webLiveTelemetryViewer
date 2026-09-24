// main.js
import { drawnTrack } from '../liveTrackMap/modules/drawTrack.js';
import { updateSession } from '../liveTrackMap/modules/session.js';

const urlParams = new URLSearchParams(window.location.search);
let publicToken = urlParams.get('token');

if (publicToken) {
    sessionStorage.setItem('publicToken', publicToken);
} else {
    publicToken = sessionStorage.getItem('publicToken');
}

if (publicToken) {
    document.querySelectorAll('nav a').forEach(link => {
        const currentHref = link.getAttribute('href');
        const cleanHref = currentHref.split('?')[0];

        link.setAttribute('href', `${cleanHref}?token=${publicToken}`); 
    });
}

/*const socket = io('http://localhost:3000', {
    transports: ['websocket']
});*/

const socket = io('https://transmissorlivetelemetry.onrender.com', {
    transports: ['websocket']
});

socket.on('connect', () => {
    if (publicToken) {
        socket.emit('join_session', publicToken);
    }
});


socket.on('telemetry_update', (data) => {
    
    updateSession(data);
    drawnTrack(data);
});

socket.on('join_error', (msg) => {
    console.warn("Access denied: ", msg);
    alert("Session invalid or over.")
    window.location.href = '/';
});