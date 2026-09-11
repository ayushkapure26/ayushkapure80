# CNG Booking System

A React + Vite demonstration app for finding CNG stations, creating refill tokens, viewing queues, and exploring an operator dashboard.

## Run locally

Install Node.js 22 with npm, then run these commands from the folder containing `package.json`:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:3000).

## Production build

```sh
npm run build
npm run preview
```

The production files are generated in `dist/`. Open the URL printed by the preview command to check the build. Do not open `index.html` directly from the file manager: the source app requires Vite.

## Project structure

- `src/App.jsx`: application navigation and shared state
- `src/components/`: station search, booking and token modals, queue tracker, savings calculator, operator dashboard, navigation and footer
- `src/data/mockStations.js`: sample station data
- `src/utils/storage.js`: browser storage for stations, bookings and favorites
- `src/index.css`: shared styling
- `src/main.jsx`: React entry point
- `index.html`: HTML entry point
- `vite.config.js`: development server and build configuration
- `package.json` and `package-lock.json`: dependencies and reproducible installation

`node_modules/` is created by `npm ci`; `dist/` is created by `npm run build`. These generated folders are intentionally excluded from Git. The original ZIP contains 18 project files, all verified present in this repository.

## Demo scope

Station details and queue telemetry are sample data. Bookings and operator changes are stored in this browser's localStorage and are not shared across devices. The operator screen has no authentication and is for demonstration only. There is no production booking server, payment processing, or live station integration. Fonts and QR images use external services and require internet access.

## Verification

On 2026-09-11, `npm ci --ignore-scripts` completed successfully and `npm run build` passed with Vite 5.4.21. This verifies installation and compilation; it does not certify every interaction or a production backend.

If a folder appears missing, first check whether it is one of the generated folders above. For another problem, report the exact path, command/error, or screenshot in a GitHub issue.
