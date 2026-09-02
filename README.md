# Web Live Telemetry Viewer (`webLiveTelemetryViewer`)

## Overview
`webLiveTelemetryViewer` is the frontend web dashboard for the **Live Telemetry** system. Built as a lightweight, responsive browser application, it connects directly to the Node.js telemetry bridge via WebSockets (`Socket.io`) to render real-time vehicle data, tire metrics, and physics parameters for **Assetto Corsa (v1)**.

It features a custom-built, dynamic track mapping engine using the HTML Canvas API to track vehicle positions and trace racing lines in real-time, alongside localized session handling and stint separation views.

## Features
* **Real-Time Telemetry Rendering:** Live updates for vehicle speed, engine RPM, G-forces, and pedal inputs.
* **HTML Canvas Track Mapping:** Dynamically draws scaled track maps and live vehicle coordinates.
* **Live Tire & Physics Metrics:** Visualizes tire temperatures, pressures, slip angles, and suspension telemetry.
* **Driver & Stint Separation:** (In production / development) Organizes and filters lap times and stints independently for drivers sharing a vehicle.
* **Client-Side Persistence:** Manages local application state and cached views cleanly using native browser `LocalStorage`.

---

## Architecture
1. **Assetto Corsa:** Captures internal physics and graphics data via shared memory.
2. **Telemetry Bridge (`bridge.js`):** Receives the raw UDP stream from the game and broadcasts parsed payloads over WebSockets.
3. **Web Dashboard (`webLiveTelemetryViewer`):** Connects to the local WebSocket server to render graphics, maps, and UI panels instantly in the browser.