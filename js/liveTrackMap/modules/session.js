const formatAcTime = (timeStr) => {
    if (!timeStr || timeStr === "" || timeStr.startsWith("-")) return "--:--.---";
    
    const lastColonIndex = timeStr.lastIndexOf(':');
    if (lastColonIndex !== -1) {
        return timeStr.substring(0, lastColonIndex) + '.' + timeStr.substring(lastColonIndex + 1);
    }
    return timeStr;
};

let currentBestLapMs = 0;
let lastSectorIndex = -1;

export function updateSession(data) {
    const lapData = data.lap;
    if (!lapData) return;

    // 1. Refresh the time
    document.getElementById('currentTime').innerText = formatAcTime(lapData.current_time);
    document.getElementById('lastTime').innerText = formatAcTime(lapData.last_time);
    document.getElementById('bestTime').innerText = formatAcTime(lapData.best_time);

    // 2. Remaining time VS Remaining laps
    const sessionTimeLabel = document.getElementById('sessionTimeLabel');
    const sessionTimeLeftElement = document.getElementById('sessionTimeLeft');
    const timeLeft = parseFloat(lapData.session_time_left);
    
    if (timeLeft < 0) {
        if (sessionTimeLabel) sessionTimeLabel.innerText = "Remaining Laps:";
        
        const totalLaps = parseInt(lapData.number_of_laps) || 0;
        const currentLap = parseInt(lapData.current_lap) || 0;
        const lapsLeft = totalLaps - currentLap;
        
        sessionTimeLeftElement.innerText = lapsLeft > 0 ? `${currentLap} / ${totalLaps}` : "Last Lap!";
    } else {
        if (sessionTimeLabel) sessionTimeLabel.innerText = "Remaining Session Time:";
        sessionTimeLeftElement.innerText = lapData.session_time_left;
    }

    // 3. Delta Logic (Best Lap compared to the Last lap)
    const deltaElement = document.getElementById('deltaTime');
    
    // Refresh the best lap time
    if (lapData.i_best_time > 0) {
        currentBestLapMs = lapData.i_best_time;
    }

    // Just calculate the delta if a best lap already exists.
    if (currentBestLapMs > 0 && lapData.i_last_time > 0 && deltaElement) {
        const deltaMs = lapData.i_last_time - currentBestLapMs;
        const deltaSec = (deltaMs / 1000).toFixed(3);

        if (deltaMs > 0) {
            deltaElement.innerText = `+${deltaSec}`;
            deltaElement.style.color = "#ff4444"; // Red (Slower)
        } else if (deltaMs < 0) {
            deltaElement.innerText = `${deltaSec}`;
            deltaElement.style.color = "#00ff00"; // Green (Faster)
        } else {
            deltaElement.innerText = "+0.000";
            deltaElement.style.color = "#ffffff"; // White (Equals)
        }
    }

    // 4. Sectors Logic
    if (lapData.last_sector_time && data.lap.currentLap !== 0) {
        const currentSectorIndex = lapData.sector; // Ac returns 0, 1 or 2
        
        // Avoid unecessary re-renderizations each 100ms
        if (currentSectorIndex !== lastSectorIndex) {
            
            // Lógica de mapeamento:
            // If AC says we are on sector 1, we have just finished the sector 1
            // If AC says we are on sector 2, we have just finished sector 2
            // If we are back to 0, we have just finished sector 3
            let completedSector = currentSectorIndex === 0 ? 3 : currentSectorIndex;
            
            const sectorTimeSec = (parseInt(lapData.last_sector_time) / 1000).toFixed(3);
            
            if (sectorTimeSec !== "0.000" && sectorTimeSec !== "NaN") {
                const sectorElement = document.getElementById(`bestS${completedSector}`);
                if (sectorElement) {
                    sectorElement.innerText = `S${completedSector}: ${sectorTimeSec}`;
                }
            }
            lastSectorIndex = currentSectorIndex;
        }
    }
}