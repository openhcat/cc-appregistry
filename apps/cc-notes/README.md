# cc-notes

A CoolCloud app published through the [Official App Registry](../registry.json).

- Entry point: `web/index.html` (single-file app, no build step)
- Talks to the CoolCloud HTTP API with the signed-in session cookie
- Reuses the CoolCloud design system stylesheets from `/css/`
- Install: Admin → App Store → Explore → Official App Registry, or
  `coolcloud --install cc-notes`

See [PUBLISHING.md](../../PUBLISHING.md) to publish your own app.
