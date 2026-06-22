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

    // 1. Atualização dos Tempos Principais
    document.getElementById('currentTime').innerText = formatAcTime(lapData.current_time);
    document.getElementById('lastTime').innerText = formatAcTime(lapData.last_time);
    document.getElementById('bestTime').innerText = formatAcTime(lapData.best_time);

    // 2. Correção: Tempo Restante VS Voltas Restantes
    const sessionTimeLabel = document.getElementById('sessionTimeLabel');
    const sessionTimeLeftElement = document.getElementById('sessionTimeLeft');
    const timeLeft = parseFloat(lapData.session_time_left);
    
    if (timeLeft < 0) {
        if (sessionTimeLabel) sessionTimeLabel.innerText = "Voltas Restantes:";
        
        const totalLaps = parseInt(lapData.number_of_laps) || 0;
        const currentLap = parseInt(lapData.current_lap) || 0;
        const lapsLeft = totalLaps - currentLap;
        
        sessionTimeLeftElement.innerText = lapsLeft > 0 ? `${currentLap} / ${totalLaps}` : "Última Volta!";
    } else {
        if (sessionTimeLabel) sessionTimeLabel.innerText = "Tempo Restante da Sessão:";
        sessionTimeLeftElement.innerText = lapData.session_time_left;
    }

    // 3. Lógica do Delta (Comparando a Última Volta com a Melhor Volta)
    const deltaElement = document.getElementById('deltaTime');
    
    // Atualiza a melhor volta registrada no JS
    if (lapData.i_best_time > 0) {
        currentBestLapMs = lapData.i_best_time;
    }

    // Só calcula o Delta se já tivermos uma melhor volta registrada e uma última volta válida
    if (currentBestLapMs > 0 && lapData.i_last_time > 0 && deltaElement) {
        const deltaMs = lapData.i_last_time - currentBestLapMs;
        const deltaSec = (deltaMs / 1000).toFixed(3);

        if (deltaMs > 0) {
            deltaElement.innerText = `+${deltaSec}`;
            deltaElement.style.color = "#ff4444"; // Vermelho (Mais lento)
        } else if (deltaMs < 0) {
            deltaElement.innerText = `${deltaSec}`;
            deltaElement.style.color = "#00ff00"; // Verde (Mais rápido - Novo recorde)
        } else {
            deltaElement.innerText = "+0.000";
            deltaElement.style.color = "#ffffff"; // Branco (Exatamente igual ou primeira volta)
        }
    }

    // 4. Lógica de Setores
    if (lapData.last_sector_time && data.lap.currentLap !== 0) {
        const currentSectorIndex = lapData.sector; // O jogo retorna 0, 1 ou 2
        
        // Evita re-renderizações desnecessárias a cada 100ms
        if (currentSectorIndex !== lastSectorIndex) {
            
            // Lógica de mapeamento:
            // Se o jogo diz que estamos no setor 1, acabamos de fechar o Setor 1 (S1)
            // Se diz que estamos no setor 2, acabamos de fechar o Setor 2 (S2)
            // Se diz que voltamos pro 0, acabamos de fechar a volta, ou seja, o Setor 3 (S3)
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