// modules/controls.js
export function updateControls(data) {
    // 2. Speed and Gear
    const speedKmh = Math.round(data.speed.kmh);
    document.getElementById('speed').innerText = speedKmh;
    
    let gearDisplay = "N";
    if (data.engine.gear === 0) gearDisplay = "R";
    else if (data.engine.gear === 1) gearDisplay = "N";
    else gearDisplay = data.engine.gear - 1;
    
    document.getElementById('gear').innerText = gearDisplay;

    // 5. Eletronics
    const limiter = document.getElementById('limiterStatus');
    if (data.electronics.pit_limiter === 1){
        limiter.innerText = "ON";
    } else {
        limiter.innerText = "OFF";
    }
    limiter.style.color = data.electronics.pit_limiter === 1 ? "#ff3333" : "#fff";


    // 6. TC e ABS
    const tcActive = data.electronics.tc === 1;
    document.getElementById('tcLight1').style.backgroundColor = tcActive ? "#ffaa00" : "#333";
    document.getElementById('tcLight2').style.backgroundColor = tcActive ? "#ffaa00" : "#333";

    const absActive = data.electronics.abs === 1;
    document.getElementById('absLight1').style.backgroundColor = absActive ? "#00aaff" : "#333";
    document.getElementById('absLight2').style.backgroundColor = absActive ? "#00aaff" : "#333";

    // 7. Pedals grph
    const gasPercent = Math.round(data.pedals.gas * 100);
    document.getElementById('gasValue').innerText = gasPercent + "%";
    document.getElementById('pedalGas').style.height = gasPercent + "%";

    const brakePercent = Math.round(data.pedals.brake * 100);
    document.getElementById('brakeValue').innerText = brakePercent + "%";
    document.getElementById('pedalBrake').style.height = brakePercent + "%";

    // 8. RPM
    const currentRpm = data.engine.rpm;
    for (let i = 1; i <= 8; i++) {
        const led = document.getElementById('light' + i);
        const targetRpm = 3500 + (i * 450);
        if (currentRpm >= targetRpm) {
            led.style.backgroundColor = i <= 4 ? "#00ff00" : (i <= 6 ? "#ffff00" : "#ff0000");
        } else {
            led.style.backgroundColor = "#222";
        }
    }
}