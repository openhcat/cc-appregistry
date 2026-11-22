# cc-passwords

A CoolCloud app published through the [Official App Registry](../registry.json).

Keep logins, API keys and secure notes in one searchable list, with a password
generator, one-click copy and a CSV export for your own backup.

- Entry point: `web/index.html` (single-file app, no build step)
- Stores one JSON document in CoolCloud app storage (`storage` permission)
- Reuses the CoolCloud design system stylesheets from `/css/`
- Install: Admin → App Store → Explore → Official App Registry, or
  `coolcloud --install cc-passwords`

The app is optional: installing it adds Passwords to your launcher, and it is
never enabled without your consent.

See [PUBLISHING.md](../../PUBLISHING.md) to publish your own app.
