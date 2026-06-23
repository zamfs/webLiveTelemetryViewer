// modules/drawTrack.js

const canvas = document.getElementById('trackMapCanvas'); 
const ctx = canvas ? canvas.getContext('2d') : null;

// Array to collect the points of the current lap.
let currentLapPath = [];

// Array oficial (the map will be drawn with these points)
let officialTrackMap = [];

// global limits
let minX = Infinity, maxX = -Infinity;
let minZ = Infinity, maxZ = -Infinity;

let lastLapRecorded = -1; 
let mapIsReady = false; // check if theres already one lap completed

export function drawnTrack(data) {
    if (!ctx) {
        console.error("Canvas not found!");
        return;
    }

    const x = data.car.coordinates.x;
    const z = data.car.coordinates.z; 
    const currentLap = data.lap.current_lap;

    // Initialize the control of the first script execution.
    if (lastLapRecorded === -1) {
        lastLapRecorded = currentLap;
    }

    // LAP CHANGE (Crossed the finish line)
    if (currentLap !== lastLapRecorded) {
        // If the lap had enough points, it will be the next official map
        if (currentLapPath.length > 50) {
            officialTrackMap = [...currentLapPath];
            mapIsReady = true;

            // Recalculate limits (min/max) taking in consideration JUST the official map
            minX = Infinity; maxX = -Infinity;
            minZ = Infinity; maxZ = -Infinity;
            for (let pt of officialTrackMap) {
                if (pt.x < minX) minX = pt.x;
                if (pt.x > maxX) maxX = pt.x;
                if (pt.z < minZ) minZ = pt.z;
                if (pt.z > maxZ) maxZ = pt.z;
            }
        }
        
        // clean the array to do the next lap points read
        currentLapPath = [];
        lastLapRecorded = currentLap;
    }

    const lastPoint = currentLapPath[currentLapPath.length - 1];

    // Avoid some weirds straights lines in the map.
    if (lastPoint) {
        const distance = Math.sqrt(Math.pow(lastPoint.x - x, 2) + Math.pow(lastPoint.z - z, 2));
        if (distance > 150) {
            currentLapPath = [];
            if (!mapIsReady) {
                minX = Infinity; maxX = -Infinity;
                minZ = Infinity; maxZ = -Infinity;
            }
        }
    }

    // Record the current point in the secondary arrary
    if (!lastPoint || Math.abs(lastPoint.x - x) > 1.0 || Math.abs(lastPoint.z - z) > 1.0) {
        currentLapPath.push({ x, z });
        
        if (!mapIsReady) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }
    }

    // Clean the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  
    if (!mapIsReady) {
        // While the map is not ready, just shoes the message
        ctx.fillStyle = "#ffffff"; 
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Waiting for the first lap be completed...", canvas.width / 2, canvas.height / 2);
    } else {
        // If the map is ready
        const rangeX = (maxX - minX) || 1;
        const rangeZ = (maxZ - minZ) || 1;
        const scale = Math.min(canvas.width / rangeX, canvas.height / rangeZ) * 0.95;
        const offsetX = (canvas.width - rangeX * scale) / 2;
        const offsetZ = (canvas.height - rangeZ * scale) / 2;

        const mapToCanvas = (gameX, gameZ) => {
            return {
                cx: (gameX - minX) * scale + offsetX,
                cz: (gameZ - minZ) * scale + offsetZ 
            };
        };

        // 1. Drawn the lines of the official map
        if (officialTrackMap.length > 1) {
            ctx.beginPath();
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#555555'; 
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            const start = mapToCanvas(officialTrackMap[0].x, officialTrackMap[0].z);
            ctx.moveTo(start.cx, start.cz);
            
            for (let i = 1; i < officialTrackMap.length; i++) {
                const pt = mapToCanvas(officialTrackMap[i].x, officialTrackMap[i].z);
                ctx.lineTo(pt.cx, pt.cz);
            }
            ctx.stroke();
        }

        // 2. Drawn the car (red circle)
        // Just appears when the map is ready
        const carPos = mapToCanvas(x, z);
        ctx.beginPath();
        ctx.arc(carPos.cx, carPos.cz, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff3333'; 
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff'; 
        ctx.stroke();
    }
}