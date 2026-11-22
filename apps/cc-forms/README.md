# cc-forms

A CoolCloud app published through the [Official App Registry](../registry.json).

Build a form from short text, paragraph, email, number, choice and checkbox
questions, then share its public link. Answers are collected without a
CoolCloud account and can be exported as CSV.

- Entry point: `web/index.html` (single-file app, no build step)
- Form definitions and responses use CoolCloud app storage (`storage` permission)
- Public pages are served by the server at `/f/<token>`, with no session required,
  `no-store` caching and a per-IP submission limit
- Works on Community and Enterprise: Enterprise app storage is read and written
  through the vault, so responses stay encrypted at rest
- Install: Admin → App Store → Explore → Official App Registry, or
  `coolcloud --install cc-forms`

The app is optional and is never installed by default. The public page and
`POST /api/public/forms/<token>` endpoint are added by the platform, so a server
update is required before installing Forms.

See [PUBLISHING.md](../../PUBLISHING.md) to publish your own app.
