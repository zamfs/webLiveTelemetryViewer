# Web Live Telemetry Viewer (`webLiveTelemetryViewer`) v0.3

## Overview

`webLiveTelemetryViewer` is the frontend web dashboard for the **Live Telemetry** system. Built as a lightweight, responsive browser application, it connects directly to the Node.js telemetry bridge via WebSockets (`Socket.io`) to render real-time vehicle data, tire metrics, and physics parameters for **Assetto Corsa (v1)**.

It features a custom-built, dynamic track mapping engine using the HTML Canvas API to track vehicle positions and trace racing lines in real-time, alongside localized session handling and stint separation views.

## What's New in Version 0.2

* **Multi-Car Lobby & Grid View:** Introduces a centralized lobby dashboard that automatically detects and tracks multiple vehicles concurrently on the track, displaying live driver names, car models, and circuit information.
* **Composite Session Tracking (`sessionKey`):** Replaced legacy car identifiers with a robust composite session key (`socket.id` + `trackName` + `carModel`), completely resolving identity collision issues for multi-car tracking.
* **Optimized Real-Time DOM Rendering:** Refactored client-side rendering to eliminate visual element flickering and hover-state bugs during high-frequency telemetry updates.
* **Dynamic Navigation & URL State Propagation:** Automated parameter propagation across all dashboard views, ensuring seamless transitions between the lobby, car information panels, and live track maps.

## Features

* **Real-Time Telemetry Rendering:** Live updates for vehicle speed, engine RPM, G-forces, and pedal inputs.
* **HTML Canvas Track Mapping:** Dynamically draws scaled track maps and live vehicle coordinates.
* **Live Tire & Physics Metrics:** Visualizes tire temperatures, pressures, slip angles, and suspension telemetry.
* **Driver & Stint Separation:** Organizes and filters lap times and stints independently for drivers sharing a vehicle **(new v0.3)**.
* **Client-Side Persistence:** Manages local application state and cached views cleanly using native browser `LocalStorage` and `SessionStorage`.

---

## Architecture

1. **Assetto Corsa:** Captures internal physics and graphics data via shared memory.
2. **Telemetry Bridge (`bridge.js`):** Receives the raw data stream from the game and broadcasts parsed payloads over WebSockets.
3. **Web Dashboard (`webLiveTelemetryViewer`):** Connects to the WebSocket server to render graphics, multi-car lobbies, maps, and UI panels instantly in the browser.