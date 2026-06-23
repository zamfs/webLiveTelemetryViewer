// modules/carStatus.js

const updateTyre = (suffix, tyreData) => {
    if (!tyreData) return;
    document.getElementById('tyrePres' + suffix).innerText = tyreData.pressure.toFixed(1);
    document.getElementById('tyreTemp' + suffix).innerText = tyreData.temperature.toFixed(0);
    document.getElementById('tyreWear' + suffix).innerText = Math.round(tyreData.wear);
};

export function updateCarStatus(data) {
    // 9. Tyre data
    updateTyre('FL', data.tyres.pressure ? {pressure: data.tyres.pressure.front_left, temperature: data.tyres.temperature.front_left, wear: data.tyres.wear.front_left} : null);
    updateTyre('FR', {pressure: data.tyres.pressure.front_right, temperature: data.tyres.temperature.front_right, wear: data.tyres.wear.front_right});
    updateTyre('RL', {pressure: data.tyres.pressure.rear_left, temperature: data.tyres.temperature.rear_left, wear: data.tyres.wear.rear_left});
    updateTyre('RR', {pressure: data.tyres.pressure.rear_right, temperature: data.tyres.temperature.rear_right, wear: data.tyres.wear.rear_right});

    // 10. Damage
    document.getElementById('dmgFront').innerText = Math.round(data.damage.front) + "%";
    document.getElementById('dmgRear').innerText = Math.round(data.damage.rear) + "%";
    document.getElementById('dmgLeft').innerText = Math.round(data.damage.left) + "%";
    document.getElementById('dmgRight').innerText = Math.round(data.damage.right) + "%";
    document.getElementById('dmgCenter').innerText = Math.round(data.damage.center) + "%";


    //Suspension Travel
    document.getElementById('suspFL').innerText = (data.suspension.front_left * 1000).toFixed(1);
    document.getElementById('suspFR').innerText = (data.suspension.front_right * 1000).toFixed(1);
    document.getElementById('suspRL').innerText = (data.suspension.rear_left * 1000).toFixed(1);
    document.getElementById('suspRR').innerText = (data.suspension.rear_right * 1000).toFixed(1);
    
}