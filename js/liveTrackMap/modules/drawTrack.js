// modules/drawTrack.js

const canvas = document.getElementById('trackMapCanvas'); 
const ctx = canvas ? canvas.getContext('2d') : null;

// Array em segundo plano (onde coletamos os pontos da volta atual)
let currentLapPath = [];

// Array oficial (o mapa consolidado que será desenhado na tela)
let officialTrackMap = [];

// Limites globais para cálculo de escala baseado no mapa oficial (ou no atual enquanto o oficial não existe)
let minX = Infinity, maxX = -Infinity;
let minZ = Infinity, maxZ = -Infinity;

let lastLapRecorded = -1; 
let mapIsReady = false; // Indica se já temos pelo menos uma volta completa gravada

export function drawnTrack(data) {
    if (!ctx) {
        console.error("Canvas não encontrado! Verifique se existe um <canvas id='trackMapCanvas'> no HTML.");
        return;
    }

    const x = data.car.coordinates.x;
    const z = data.car.coordinates.z; 
    const currentLap = data.lap.current_lap;

    // Inicializa o controle na primeira execução do script
    if (lastLapRecorded === -1) {
        lastLapRecorded = currentLap;
    }

    // MUDANÇA DA VOLTA (Cruzou a linha de chegada)
    if (currentLap !== lastLapRecorded) {
        // Se a volta que acabou tinha pontos suficientes, ela se torna o novo mapa oficial
        if (currentLapPath.length > 50) {
            officialTrackMap = [...currentLapPath];
            mapIsReady = true;

            // Recalcula os limites (min/max) baseando-se EXCLUSIVAMENTE no mapa oficial perfeito
            minX = Infinity; maxX = -Infinity;
            minZ = Infinity; maxZ = -Infinity;
            for (let pt of officialTrackMap) {
                if (pt.x < minX) minX = pt.x;
                if (pt.x > maxX) maxX = pt.x;
                if (pt.z < minZ) minZ = pt.z;
                if (pt.z > maxZ) maxZ = pt.z;
            }
        }
        
        // Limpa a coleta em segundo plano para começar a gravar a próxima volta
        currentLapPath = [];
        lastLapRecorded = currentLap;
    }

    const lastPoint = currentLapPath[currentLapPath.length - 1];

    // Evita a linha reta do teletransporte vindo dos boxes/Hotlap start
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

    // Grava o ponto atual no buffer de segundo plano
    if (!lastPoint || Math.abs(lastPoint.x - x) > 1.0 || Math.abs(lastPoint.z - z) > 1.0) {
        currentLapPath.push({ x, z });
        
        if (!mapIsReady) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }
    }

    // Limpa a tela para a nova renderização
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // DEFINIÇÃO DO QUE MOSTRAR NA TELA
    if (!mapIsReady) {
        // CORREÇÃO: Enquanto o mapa não estiver pronto, mostra APENAS a mensagem.
        // A bolinha do carro não será desenhada aqui.
        ctx.fillStyle = "#ffffff"; 
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Aguardando completar a primeira volta...", canvas.width / 2, canvas.height / 2);
    } else {
        // Se o mapa está pronto, calcula a escala estável e desenha tudo junto
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

        // 1. Desenha as linhas estáveis do MAPA OFICIAL
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

        // 2. Desenha o marcador do carro (bolinha vermelha)
        // Como está dentro do bloco "else", ele só aparece quando o mapa oficial também for exibido
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