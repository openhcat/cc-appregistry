# cc-wiki

A CoolCloud app published through the [Official App Registry](../registry.json).

A small Markdown wiki backed by the filesystem: every page is a `.md` file in
`Files/Wiki`, so it can be opened in the Editor or downloaded like any other
document. Pages autosave, preview beside the editor, and deletions go to the
Files trash.

- Entry point: `web/index.html` (single-file app, no build step)
- Uses the Files API (`files:read`, `files:write`); no separate database
- Reuses the CoolCloud design system stylesheets from `/css/`
- Install: Admin → App Store → Explore → Official App Registry, or
  `coolcloud --install cc-wiki`

The app is optional and is never installed by default. Because pages live in
Files, everyone who can read that folder can read the wiki.

See [PUBLISHING.md](../../PUBLISHING.md) to publish your own app.
