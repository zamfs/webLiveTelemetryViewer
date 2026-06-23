// modules/session.js
const parseTimeStr = (timeStr, prefixId) => {
    if (!timeStr || timeStr === "") return;
    const cleanStr = timeStr.replace('.', ':');
    const parts = cleanStr.split(':');
    if (parts.length >= 3) {
        document.getElementById(prefixId + 'Min').innerText = parts[0];
        document.getElementById(prefixId + 'Sec').innerText = parts[1];
        document.getElementById(prefixId + 'Mil').innerText = parts[2];
    }
};

export function updateSession(data) {
    // 1. Basic Informations
    document.getElementById('headerSessionInfo').innerText = `${data.car.model} @ ${data.track.name}`;

    // 3. Lap times
    parseTimeStr(data.lap.current_time, 'lapTime');
    parseTimeStr(data.lap.last_time, 'lastLap');
    parseTimeStr(data.lap.best_time, 'bestLap'); 

    // 4. Fuel and consumption
    document.getElementById('fuel').innerText = data.fuel.current.toFixed(1) + "L (-" + data.fuel.consumption_per_lap.toFixed(2) + ")";
    document.getElementById('lapCount').innerText = data.lap.current_lap;
}