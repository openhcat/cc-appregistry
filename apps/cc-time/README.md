# cc-time

A CoolCloud app published through the [Official App Registry](../registry.json).

A timer for billable and non-billable work: projects with clients and hourly
rates, a running timer that survives a page reload, manual entries, weekly
totals and a CSV timesheet export.

- Entry point: `web/index.html` (single-file app, no build step)
- Stores projects, entries and the running timer in CoolCloud app storage
  (`storage` permission)
- Reuses the CoolCloud design system stylesheets from `/css/`
- Install: Admin → App Store → Explore → Official App Registry, or
  `coolcloud --install cc-time`

The app is optional and is never installed by default.

See [PUBLISHING.md](../../PUBLISHING.md) to publish your own app.
