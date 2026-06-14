# GlobalChainX Supply Chain Dashboard

GlobalChainX is a single-file Node.js and Express dashboard for supply chain operations monitoring. It serves a dark-themed operations center UI at `GET /` and exposes a Prometheus-style metrics endpoint at `GET /metrics`.

## What It Includes

- Live clock in the dashboard header
- KPI cards for shipments, warehouses, orders, and alerts
- Shipment tracking table with six sample routes
- Inventory level bar chart
- Recent alerts panel
- Plain-text metrics endpoint for monitoring systems

## Run With Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open the app in your browser:

   ```
   http://localhost:3000
   ```

## Run With Docker

Build the image:

```bash
docker build -t globalchainx-dashboard .
```

Run the container:

```bash
docker run -p 3000:3000 globalchainx-dashboard
```

Then open:

```
http://localhost:3000
```

## Run With Docker Compose

Start the service:

```bash
docker compose up --build
```

Then open:

```
http://localhost:3000
```

## `/metrics` Endpoint

The `/metrics` endpoint returns plain text in a Prometheus-style format:

```text
globalchainx_active_shipments 1284
globalchainx_warehouses_online 47
globalchainx_orders_today 98432
globalchainx_alerts_critical 3
```

## Files

- [server.js](server.js)
- [Dockerfile](Dockerfile)
- [docker-compose.yml](docker-compose.yml)
