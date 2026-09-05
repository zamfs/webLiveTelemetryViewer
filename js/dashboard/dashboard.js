// main.js

import { updateSession } from '../dashboard/modules/session.js';
import { updateControls } from '../dashboard/modules/controls.js';

const urlParams = new URLSearchParams(window.location.search);
let activeSessionKey = urlParams.get('sessionKey');


if (activeSessionKey) {
    sessionStorage.setItem('activeSessionKey', activeSessionKey);
} else {
    activeSessionKey = sessionStorage.getItem('activeSessionKey');
}

if (activeSessionKey) {
    document.querySelectorAll('nav a').forEach(link => {
        const currentHref = link.getAttribute('href');
        const cleanHref = currentHref.split('?')[0];

        link.setAttribute('href', `${cleanHref}?sessionKey=${activeSessionKey}`); 
    });
}


const socket = io('https://transmissorlivetelemetry.onrender.com', {
    transports: ['websocket']
});

socket.on('telemetry_update', (data) => {
  
    if (activeSessionKey !== null && data.sessionKey !== activeSessionKey) {
        return;
    }

    updateSession(data);
    updateControls(data);
});


socket.on('connect_error', () => {
    console.warn("Waiting connection with Port 3000...");
});