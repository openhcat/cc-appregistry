# Publishing an app

An app is a folder with a `manifest.json` and a web entry point. No build step, no bundler, no SDK: it runs same-origin in a sandboxed frame and talks to the normal HTTP API with the signed-in session cookie.

## 1. The folder

```
my-app/
├── manifest.json
├── README.md
└── web/
    └── index.html
```

Split `index.html` into `app.js` and `app.css` if it grows.

## 2. manifest.json

```json
{
  "id": "acme:notes",
  "name": "Notes",
  "developer": "acme",
  "version": "1.2.0",
  "description": "Shared notes for the team, stored in Files.",
  "icon": "fa-solid fa-note-sticky",
  "accent": "editor",
  "category": "Productivity",
  "entry": "web/index.html",
  "permissions": ["storage"],
  "website": "https://acme.example/notes"
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | `developer:name`, lowercase, unique in the registry |
| `name` | yes | Shown in the app drawer and settings |
| `developer` | yes | Your namespace; matches the id prefix |
| `version` | yes | Semver; bump on every published change |
| `description` | yes | One sentence, under 140 characters |
| `icon` | yes | A Font Awesome class |
| `entry` | yes | Usually `web/index.html` |
| `permissions` | no | Only what the app needs: `storage`, `files:read`, … |
| `accent` | no | An app accent name |
| `category` | no | A registry category, or a new one you propose |
| `type` | no | `app` (default) or `widget` for the home page |

## 3. Use the design system

```html
<link rel="stylesheet" href="/vendor/fa/css/all.min.css" />
<link rel="stylesheet" href="/vendor/fonts/inter.css" />
<link rel="stylesheet" href="/css/tokens.css" />
<link rel="stylesheet" href="/css/base.css" />
<link rel="stylesheet" href="/css/components.css" />
```

The frame is same-origin, so `fetch('/api/...', { credentials: 'same-origin' })` works. Match the user's theme:

```js
try {
  document.documentElement.dataset.theme = window.parent.document.documentElement.dataset.theme || 'light';
} catch {
  /* opened outside CoolCloud */
}
```

## 4. Store data

Declare `"permissions": ["storage"]`. The first run asks the user to allow storage, then:

```js
const response = await fetch('/api/apps/acme:notes/storage', { credentials: 'same-origin' });
const { data } = await response.json();

await fetch('/api/apps/acme:notes/storage', {
  method: 'PUT',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'state', value: JSON.stringify({ notes: [] }) })
});
```

Values are capped at 200 KB each. A 403 with `consentRequired` means the user has not granted storage: show a button and POST `{ "scopes": ["storage"] }` to `/api/apps/<id>/grants`.

Files, calendar, mail and the rest are available through their normal endpoints, with the signed-in user's own access. The server enforces ACLs on every call.

## 5. Test

```
coolcloud --install acme:notes dir=./my-app
```

Open it from **All apps**. Check light and dark, a narrow window, the permission prompt, and the browser console. Make sure nothing under `web/` contains a secret.

## 6. Publish to this registry

Add your app object to `apps` in `registry.json`, run the registry check, and open a pull request:

```
node scripts/validate.mjs --remote
```

```json
{
  "id": "acme:notes",
  "name": "Notes",
  "developer": "acme",
  "version": "1.2.0",
  "description": "Shared notes for the team, stored in Files.",
  "icon": "fa-solid fa-note-sticky",
  "accent": "editor",
  "category": "Productivity",
  "runtime": "external",
  "repo": "https://github.com/acme/coolcloud-notes.git",
  "path": ".",
  "files": ["manifest.json", "web/index.html", "README.md"],
  "tags": ["notes", "collaboration"]
}
```

- `repo` is the git URL. `path` is the folder inside it holding `manifest.json` (`"."` for the repo root).
- `files` lists what an installer downloads when it cannot clone the repository. Keep it complete: manifests, entry point, any asset the app imports.
- `branch` is optional and defaults to `main`.
- If you host the package in this repository, add the folder under `apps/` and point `path` at it.

## Review checklist

- [ ] Unique id, bumped version.
- [ ] README says what the app stores and which endpoints it calls.
- [ ] No keys, tokens or private URLs under `web/`.
- [ ] Minimal permissions.
- [ ] Works with the keyboard, at 360 px, in both themes.
- [ ] Installed from a folder and used end to end.

## Your own registry

Internal tools do not need to be public. Any static JSON with the same shape works: **Admin → App Store → Add registry**, or point the CLI at it. The official registry is just the default.
