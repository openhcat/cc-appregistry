# cc-sitebuilder

A CoolCloud app published through the [Official App Registry](../registry.json).

Drag headings, text, images, buttons and dividers into place, then publish the
page at `/s/<token>` on your own CoolCloud server or export it as one HTML file.

- Entry point: `web/index.html` (single-file app, no build step)
- One JSON site in CoolCloud app storage (`storage` permission)
- Public pages are served by the server at `/s/<token>`; no account is needed
- Live chat is an **Enterprise-only** feature: the toggle is locked in Community
  and messages create Helpdesk tickets only on an Enterprise server

Install: Admin → App Store → Explore → Official App Registry, or
`coolcloud --install cc:sitebuilder`.

See [PUBLISHING.md](../../PUBLISHING.md) to publish your own app.
