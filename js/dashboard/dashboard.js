// main.js

import { updateSession } from '../dashboard/modules/session.js';
import { updateControls } from '../dashboard/modules/controls.js';

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

const socket = io('http://150.230.230.27:3000', {
    transports: ['websocket']
});

socket.on('connect', () => {
    if (publicToken) {
        socket.emit('join_session', publicToken);
    }
});

socket.on('telemetry_update', (data) => {

    updateSession(data);
    updateControls(data);
});


socket.on('join_error', (msg) => {
    console.warn("Access denied: ", msg);
    alert("Session invalid or over.")
    window.location.href = '/';
});