# cc-finance

A CoolCloud Community app published through the [Official App Registry](../registry.json).

This Community edition is deliberately focused:

- CRM: a contacts book (people, companies, email, phone, notes). No pipeline.
- Finance: invoices (client, amount, dates, status). No expenses or cash reports.

CoolCloud Enterprise ships fuller variants of these apps with a deal
pipeline, forecasting, expenses, recurring invoices and CSV export.

- Entry point: `web/index.html` (single-file app, no build step)
- Stores data with the `storage` app API, per user
- Reuses the CoolCloud design system stylesheets from `/css/`

Install: Admin → App Store → Explore → Official App Registry, or
`coolcloud --install cc-finance`
