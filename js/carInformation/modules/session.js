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
    // 1. Informações Básicas superiores
    document.getElementById('headerSessionInfo').innerText = `${data.car.model} @ ${data.track.name}`;

    // 3. Local para informações de tempo
    

    // 4. Combustível e Consumo

}