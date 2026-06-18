const express = require('express');

const app = express();
const port = 3000;

const shipments = [
  {
    id: 'GX-10021',
    origin: 'Shanghai',
    destination: 'Rotterdam',
    status: 'In Transit',
    eta: '2026-06-16 14:30 UTC',
    carrier: 'Maersk Line',
  },
  {
    id: 'GX-10022',
    origin: 'Mumbai',
    destination: 'Los Angeles',
    status: 'Delayed',
    eta: '2026-06-18 09:00 UTC',
    carrier: 'CMA CGM',
  },
  {
    id: 'GX-10023',
    origin: 'Hamburg',
    destination: 'Chicago',
    status: 'At Customs',
    eta: '2026-06-15 22:15 UTC',
    carrier: 'Hapag-Lloyd',
  },
  {
    id: 'GX-10024',
    origin: 'Rotterdam',
    destination: 'Mumbai',
    status: 'Delivered',
    eta: '2026-06-13 18:45 UTC',
    carrier: 'MSC',
  },
  {
    id: 'GX-10025',
    origin: 'Chicago',
    destination: 'Hamburg',
    status: 'Processing',
    eta: '2026-06-17 11:20 UTC',
    carrier: 'Evergreen',
  },
  {
    id: 'GX-10026',
    origin: 'Los Angeles',
    destination: 'Shanghai',
    status: 'In Transit',
    eta: '2026-06-19 07:40 UTC',
    carrier: 'ONE',
  },
];

const inventory = [
  { label: 'Electronics', value: 72 },
  { label: 'Auto Parts', value: 45 },
  { label: 'Pharmaceuticals', value: 88 },
  { label: 'Textiles', value: 60 },
  { label: 'Perishables', value: 31 },
];

const alerts = [
  { level: 'CRITICAL', text: 'Port of Rotterdam – Customs delay 48hrs' },
  { level: 'WARNING', text: 'Warehouse Mumbai – Capacity at 91%' },
  { level: 'INFO', text: 'New carrier route Chicago–Hamburg activated' },
];

function getStatusClass(status) {
  switch (status) {
    case 'Delivered':
      return 'delivered';
    case 'In Transit':
      return 'in-transit';
    case 'Delayed':
      return 'delayed';
    case 'At Customs':
      return 'customs';
    case 'Processing':
      return 'processing';
    default:
      return 'neutral';
  }
}

function getBarClass(value) {
  if (value > 70) return 'high';
  if (value >= 40) return 'medium';
  return 'low';
}

app.get('/metrics', (req, res) => {
  res.type('text/plain').send([
    'globalchainx_active_shipments 1500',
    'globalchainx_warehouses_online 47',
    'globalchainx_orders_today 98432',
    'globalchainx_alerts_critical 3',
  ].join('\n'));
});

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GlobalChainX Supply Chain Operations Center</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0f1117;
      --panel: #1a1d27;
      --panel-2: #171a22;
      --border: rgba(255, 255, 255, 0.08);
      --text: #e8edf7;
      --muted: #9aa7bd;
      --accent: #00d4aa;
      --accent-soft: rgba(0, 212, 170, 0.14);
      --shadow: 0 18px 40px rgba(0, 0, 0, 0.34);
      --critical: #ff5c7a;
      --warning: #ffb547;
      --info: #4fa3ff;
      --delivered: #35d07f;
      --transit: #ffb547;
      --delayed: #ff5c7a;
      --customs: #4fa3ff;
      --processing: #8d96b3;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background:
        radial-gradient(circle at top left, rgba(0, 212, 170, 0.18), transparent 28%),
        radial-gradient(circle at top right, rgba(79, 163, 255, 0.14), transparent 24%),
        linear-gradient(180deg, #11131a 0%, var(--bg) 32%, #0b0d12 100%);
      color: var(--text);
      min-height: 100vh;
    }

    .page {
      max-width: 1440px;
      margin: 0 auto;
      padding: 28px 22px 40px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      padding: 24px 26px;
      background: linear-gradient(135deg, rgba(26, 29, 39, 0.96), rgba(16, 18, 25, 0.96));
      border: 1px solid var(--border);
      border-radius: 24px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(16px);
      position: sticky;
      top: 14px;
      z-index: 10;
      margin-bottom: 22px;
    }

    .title-wrap h1 {
      margin: 0;
      font-size: clamp(1.6rem, 2.4vw, 2.35rem);
      letter-spacing: -0.03em;
      line-height: 1.05;
    }

    .title-wrap p {
      margin: 10px 0 0;
      color: var(--muted);
      font-size: 0.95rem;
    }

    .clock {
      padding: 14px 18px;
      border-radius: 18px;
      border: 1px solid rgba(0, 212, 170, 0.24);
      background: linear-gradient(180deg, rgba(0, 212, 170, 0.12), rgba(0, 212, 170, 0.06));
      color: var(--text);
      min-width: 250px;
      text-align: right;
    }

    .clock .label {
      display: block;
      font-size: 0.76rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 6px;
    }

    .clock .value {
      font-size: 1rem;
      line-height: 1.4;
      font-variant-numeric: tabular-nums;
    }

    .section {
      margin-top: 22px;
      background: rgba(26, 29, 39, 0.88);
      border: 1px solid var(--border);
      border-radius: 24px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 0;
    }

    .section-header h2 {
      margin: 0;
      font-size: 1.2rem;
      letter-spacing: -0.02em;
    }

    .section-header span {
      color: var(--muted);
      font-size: 0.92rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      padding: 20px 24px 24px;
    }

    .kpi-card {
      padding: 20px;
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.015));
      border: 1px solid rgba(255, 255, 255, 0.05);
      min-height: 138px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .kpi-card::after {
      content: '';
      position: absolute;
      inset: auto -12% -42% auto;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 212, 170, 0.14), transparent 70%);
      pointer-events: none;
    }

    .kpi-label {
      color: var(--muted);
      font-size: 0.9rem;
      letter-spacing: 0.03em;
    }

    .kpi-value {
      font-size: clamp(1.9rem, 3vw, 2.6rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      margin-top: 10px;
    }

    .kpi-foot {
      margin-top: 14px;
      color: var(--accent);
      font-size: 0.85rem;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1.65fr 1fr;
      gap: 22px;
      padding: 22px 24px 24px;
    }

    .panel {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      padding: 18px;
    }

    .panel h3 {
      margin: 0 0 14px;
      font-size: 1.02rem;
      letter-spacing: -0.02em;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      overflow: hidden;
      border-radius: 16px;
    }

    thead th {
      text-align: left;
      padding: 13px 12px;
      font-size: 0.84rem;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--muted);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    tbody td {
      padding: 15px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #dfe5f2;
      font-size: 0.95rem;
    }

    tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 11px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .badge::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.04);
    }

    .badge.delivered { color: var(--delivered); background: rgba(53, 208, 127, 0.12); }
    .badge.in-transit { color: var(--transit); background: rgba(255, 181, 71, 0.12); }
    .badge.delayed { color: var(--delayed); background: rgba(255, 92, 122, 0.12); }
    .badge.customs { color: var(--customs); background: rgba(79, 163, 255, 0.12); }
    .badge.processing { color: var(--processing); background: rgba(141, 150, 179, 0.12); }

    .inventory-list {
      display: grid;
      gap: 14px;
    }

    .inventory-item {
      display: grid;
      gap: 8px;
    }

    .inventory-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      font-size: 0.94rem;
    }

    .bar-track {
      height: 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.07);
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: inherit;
      width: var(--width);
      background: var(--color);
      box-shadow: 0 0 24px color-mix(in srgb, var(--color) 30%, transparent);
    }

    .bar-fill.high { --color: #35d07f; }
    .bar-fill.medium { --color: #ffb547; }
    .bar-fill.low { --color: #ff5c7a; }

    .alerts {
      display: grid;
      gap: 12px;
    }

    .alert-item {
      border-radius: 16px;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .alert-level {
      display: inline-block;
      margin-bottom: 8px;
      font-size: 0.74rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 700;
    }

    .alert-item.critical .alert-level { color: var(--critical); }
    .alert-item.warning .alert-level { color: var(--warning); }
    .alert-item.info .alert-level { color: var(--info); }

    .alert-item p {
      margin: 0;
      color: #dce2ef;
      line-height: 1.5;
    }

    @media (max-width: 1180px) {
      .kpi-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 720px) {
      .page {
        padding: 16px 12px 28px;
      }

      .header {
        position: static;
        flex-direction: column;
        align-items: stretch;
      }

      .clock {
        min-width: 0;
        text-align: left;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
        padding: 18px;
      }

      .content-grid {
        padding: 18px;
      }

      .section-header {
        padding: 18px 18px 0;
      }

      .panel {
        padding: 14px;
      }

      table,
      thead,
      tbody,
      th,
      td,
      tr {
        display: block;
      }

      thead {
        display: none;
      }

      tbody tr {
        padding: 10px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      tbody td {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        padding: 8px 0;
        border: 0;
      }

      tbody td::before {
        content: attr(data-label);
        color: var(--muted);
        font-size: 0.8rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        flex: 0 0 42%;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="title-wrap">
        <h1>GlobalChainX – Supply Chain Operations Center</h1>
        <p>Unified visibility for shipments, warehouse capacity, operational risk, and daily throughput.</p>
      </div>
      <div class="clock" aria-live="polite">
        <span class="label">Live Clock</span>
        <div class="value" id="clock">Loading current time...</div>
      </div>
    </header>

    <section class="section">
      <div class="section-header">
        <h2>Key Performance Indicators</h2>
        <span>Real-time operations snapshot</span>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div>
            <div class="kpi-label">Active Shipments</div>
            <div class="kpi-value">1,284</div>
          </div>
          <div class="kpi-foot">+6.4% vs prior hour</div>
        </div>
        <div class="kpi-card">
          <div>
            <div class="kpi-label">Warehouses Online</div>
            <div class="kpi-value">47 / 50</div>
          </div>
          <div class="kpi-foot">94% network availability</div>
        </div>
        <div class="kpi-card">
          <div>
            <div class="kpi-label">Orders Processed Today</div>
            <div class="kpi-value">98,432</div>
          </div>
          <div class="kpi-foot">Throughput tracking enabled</div>
        </div>
        <div class="kpi-card">
          <div>
            <div class="kpi-label">Alerts</div>
            <div class="kpi-value">3 Critical</div>
          </div>
          <div class="kpi-foot">Escalation queue active</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Shipment Tracking</h2>
        <span>Six-lane global movement board</span>
      </div>
      <div class="content-grid">
        <div class="panel">
          <h3>Shipment Tracking Table</h3>
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                <th>ETA</th>
                <th>Carrier</th>
              </tr>
            </thead>
            <tbody>
              ${shipments.map((shipment) => `
                <tr>
                  <td data-label="Shipment ID">${shipment.id}</td>
                  <td data-label="Origin">${shipment.origin}</td>
                  <td data-label="Destination">${shipment.destination}</td>
                  <td data-label="Status"><span class="badge ${getStatusClass(shipment.status)}">${shipment.status}</span></td>
                  <td data-label="ETA">${shipment.eta}</td>
                  <td data-label="Carrier">${shipment.carrier}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="display: grid; gap: 22px;">
          <div class="panel">
            <h3>Inventory Levels</h3>
            <div class="inventory-list">
              ${inventory.map((item) => `
                <div class="inventory-item">
                  <div class="inventory-row">
                    <span>${item.label}</span>
                    <strong>${item.value}%</strong>
                  </div>
                  <div class="bar-track" aria-label="${item.label} stock level ${item.value}%">
                    <div class="bar-fill ${getBarClass(item.value)}" style="--width: ${item.value}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="panel">
            <h3>Recent Alerts</h3>
            <div class="alerts">
              ${alerts.map((alert) => `
                <div class="alert-item ${alert.level.toLowerCase()}">
                  <span class="alert-level">[${alert.level}]</span>
                  <p>${alert.text}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <script>
    const clockElement = document.getElementById('clock');

    function updateClock() {
      const now = new Date();
      clockElement.textContent = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      }).format(now);
    }

    updateClock();
    setInterval(updateClock, 1000);
  </script>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`GlobalChainX dashboard running on http://localhost:${port}`);
});
