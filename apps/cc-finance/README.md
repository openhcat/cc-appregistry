# cc-finance

The Community Finance app, published through the [Official App Registry](../registry.json).

Community keeps this app deliberately focused: invoices with a number, client,
amount, issue and due dates and a status. There are no expenses or cash reports.

- Entry point: `web/index.html` (single-file app, no build step)
- Stores data with the `storage` app API, per user
- Reuses the CoolCloud design system stylesheets from `/css/`

CoolCloud Enterprise ships a fuller Finance app under the same id — invoices,
recurring billing, expenses, cash position and CSV export.

Install: Admin → App Store → Explore → Official App Registry, or
`coolcloud --install cc-finance`
