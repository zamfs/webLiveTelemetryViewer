function formatToTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

export function renderLapHistory(data) {
    if (!data.stints) return;

    const tbody = document.getElementById('laps-table-body');
    if(!tbody) return;

    tbody.innerHTML = '';

    data.stints.forEach(stint => {
        if (!stint.laps || stint.laps.length === 0) return;

        const stintHeaderTr = document.createElement('tr');
        stintHeaderTr.className = 'stint-header-row';
        stintHeaderTr.innerHTML = `
            <td  colspan="4">Stint ${stint.stintId}</td>
        `;
        tbody.appendChild(stintHeaderTr);

        let stintLapsCount = 0;
        let stintTimeMs = 0;
        let validLapsForAvg = 0;
        let stintFuel = 0;

        stint.laps.forEach((lap, index) => {
            stintLapsCount++;
            stintFuel += lap.fuelConsumed || 0;

            //display "outlap" instead of lap 0
            const displayLapNumber = index === 0 ? 'Outlap' : index;

            if (index > 0) {
                stintTimeMs += lap.lapTimeMs || 0;
                validLapsForAvg++;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${displayLapNumber}</td>
                <td>${lap.tyreCompound || '-'}</td>
                <td>${lap.lapTime}</td>
                <td>${lap.fuelConsumed ? lap.fuelConsumed.toFixed(2) + 'L' : '-'}</td>
            
            `;
            tbody.appendChild(tr);
        });

        //footer for each stint
        const stintFooterTr = document.createElement('tr');
        stintFooterTr.className = 'lap-total-row';

        let avgTimeDisplay = '-'
        if (validLapsForAvg > 0) {
            const avgMs = stintTimeMs / validLapsForAvg;
            avgTimeDisplay = formatToTime(avgMs);
        }

        stintFooterTr.innerHTML = `
            <td style="font-weight: 600;">Total</td>
            <td style="font-weight: 600;">${stintLapsCount} laps</td>
            <td style="font-weight: 600;">${avgTimeDisplay}</td>
            <td style="font-weight: 600;">${stintFuel.toFixed(2)}L</td>
        `;
        tbody.appendChild(stintFooterTr);
    });
}
