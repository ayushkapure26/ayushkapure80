# CNG मित्र — Booking & Station Management

A React + Vite app with an authenticated Cloudflare Worker API and persistent D1 database. It extends the original CNG booking project while preserving its dark green interface and fuel savings calculator.

## Working features

- ChatGPT sign-in on hosted Sites; server-side identity and authorization.
- Station registration and editing by the station's own account.
- Operator-entered prices, pressure, working nozzles, open/closed status and hours.
- Search by station, address and city; filter by vehicle, high pressure and saved stations.
- Account-owned refill bookings, future arrival reservations (up to seven days), unique sequential tokens and locally generated downloadable QR codes.
- Durable booking history and favorites across browser sessions/devices for the same hosted account.
- Operators call the next due token, start service, complete refills and cancel waiting tokens.
- Drivers can cancel their own waiting bookings. Completed/cancelled tokens cannot be reused.
- Queue counts derive from stored bookings; screens refresh every 15 seconds.
- Server validation, same-origin JSON mutation checks, duplicate-request handling and account isolation.

## First use

1. Open the hosted site and sign in with ChatGPT.
2. Choose **My Station → Register station**. Enter details for a station you manage.
3. Open **Station Locator**, select your station and **Book refill**.
4. Find the saved pass under **My Tokens**.
5. In **My Station**, call the next token and complete its refill.

The database starts empty. No fictional stations, customer records or live pump readings are seeded. Another visitor can book after the site owner grants them access; the initial deployment is private to its owner. Station registration establishes ownership inside this app, not independent verification of a real business.

## Local development

Use Node.js 22.13+ (Node 24 used for verification), then:

```sh
npm ci
```

In one terminal:

```sh
npm run dev:api
```

In another:

```sh
npm run dev
```

Open http://localhost:3000. The local API binds only to loopback and uses one explicitly simulated development account; it does not test ChatGPT sign-in. Local records are saved in the ignored `.local-data/cng.sqlite`. Never expose the development API publicly. Hosted code never imports this development server.

## Validation and build

```sh
npm test
npm run build
```

The API integration test executes the actual handlers against SQLite, covering anonymous rejection, cross-origin rejection, station ownership, booking isolation, duplicates, invalid mobile numbers, state transitions, future reservations, closed stations and persistence after reopening the database. Browser and hosted sign-in testing are separate from this automated test.

The build emits frontend assets in `dist/client`, an ESM Worker in `dist/server/index.js`, and the hosting manifest/migrations in `dist/.openai`. `npm run preview` previews frontend assets only; use the local development instructions for the complete local application.

## Deployment architecture

- `.openai/hosting.json`: Site identity and logical `DB` binding; managed deployment supplies the actual D1 database.
- `server/index.js`: same-origin API, using trusted Sites authenticated-user headers and the `DB` binding.
- `db/schema.ts`: Drizzle schema; `npm run db:generate` creates migrations in `drizzle/`.
- `scripts/build-server.mjs`: stages the Worker and migrations with frontend output.
- `src/utils/api.js`: client requests; booking and station data are not stored in localStorage.
- `src/components/`: booking, station management, token history, station search and savings UI.

Do not deploy the Worker behind a server that accepts arbitrary client-supplied `oai-authenticated-user-*` headers. The production identity boundary is the Sites authentication dispatcher. Applied migrations must remain unchanged; append new migrations for later changes.

## Operational scope

This is a working reservation and operator management system. Station information must be maintained by participating operators; there is no automatic pump telemetry integration. Arrival reservations are queue entries, not guaranteed dispenser-capacity time slots. Payments happen at the station; online payments, SMS/OTP, business verification and external identity providers are not integrated. Operator-entered hours are descriptive; operators must set Closed when they stop accepting bookings. History views return up to the latest 500 bookings per account/operator. QR codes contain only the opaque booking ID and are generated in the browser.

The old `src/utils/storage.js`, mock station data and footer remain as original-project reference files and are not used as the booking system's source of truth.
