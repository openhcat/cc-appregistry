# cc-crm

The Community CRM, published through the [Official App Registry](../registry.json).

Community keeps this app deliberately focused: a contacts book of people and
companies with email, phone and notes. There is no deal pipeline.

- Entry point: `web/index.html` (single-file app, no build step)
- Stores data with the `storage` app API, per user
- Reuses the CoolCloud design system stylesheets from `/css/`

CoolCloud Enterprise ships a fuller CRM under the same id — contacts plus a
five-stage pipeline, weighted forecast and CSV export.

Install: Admin → App Store → Explore → Official App Registry, or
`coolcloud --install cc-crm`
