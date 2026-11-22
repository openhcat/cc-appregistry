# cc-bookmarks

A CoolCloud app published through the [Official App Registry](../registry.json).

A card shelf for the pages you keep coming back to: titles, descriptions, tags
and a search box, all kept in your own account.

- Entry point: `web/index.html` (single-file app, no build step)
- Stores one JSON document in CoolCloud app storage (`storage` permission)
- Reuses the CoolCloud design system stylesheets from `/css/`
- Install: Admin → App Store → Explore → Official App Registry, or
  `coolcloud --install cc-bookmarks`

The app is optional and is never installed by default.

See [PUBLISHING.md](../../PUBLISHING.md) to publish your own app.
