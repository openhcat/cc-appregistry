# Official CoolCloud App Registry

The registry CoolCloud installs its apps from. One JSON file lists every app; each entry names the folder that holds `manifest.json`, the files an installer downloads, and optionally its own git repository.

> **Get Enterprise for more apps.** Entries marked **ENTERPRISE ONLY** are catalogue listings: their code ships with [CoolCloud Enterprise](mailto:coolcloud.getenterprise@hatcat.me), not with this public registry.

- **Browse:** https://openhcat.github.io/cc-appregistry/
- **Registry file:** [`registry.json`](registry.json) — `https://raw.githubusercontent.com/openhcat/cc-appregistry/main/registry.json`
- **Publishing guide:** https://openhcat.github.io/cc-appregistry/publish.html

```json
{
  "schema": "coolcloud.registry/2",
  "name": "Official CoolCloud App Registry",
  "official": true,
  "categories": ["Files", "Productivity", "Business", "Communication", "Media", "AI", "Developer"],
  "apps": [
    {
      "id": "cc:crm",
      "name": "CRM",
      "developer": "cc",
      "version": "1.1.0",
      "description": "A focused contacts book for people and companies, kept in your account.",
      "icon": "fa-solid fa-handshake",
      "category": "Business",
      "runtime": "external",
      "path": "apps/cc-crm",
      "files": ["manifest.json", "web/index.html", "README.md"],
      "tags": ["crm", "contacts", "address book"]
    }
  ]
}
```

## What lives here

| Folder | Contents |
| --- | --- |
| `apps/cc-*` | App packages: core app manifests, and the full source of the Essentials Pack apps |
| `scripts/validate.mjs` | Checks every entry, manifest and listed file before a pull request |
| `assets/` | Stylesheet and browser script for the GitHub Pages catalogue |
| `index.html` | The browse page — categories, search, install commands |
| `publish.html` | The publishing guide |
| `PUBLISHING.md` | The same guide in the repository, for people who prefer git |

### Core apps

The nine core apps (`cc:files`, `cc:calendar`, `cc:mail`, `cc:contacts`, `cc:editor`, `cc:tasks`, `cc:connect`, `cc:media`, `cc:assistant`) ship as `runtime: "core"`. The platform provides their UI and HTTP routes; the registry owns their manifests, versions, categories and the list the installer pulls at setup. Every entry still names a folder here so the catalogue is complete and auditable.

### Essentials Pack apps

`cc:crm`, `cc:finance`, `cc:projects` and `cc:studio` are full app packages in this repository, installed when the installer's Essentials Pack is chosen. Each is a single-file app that reuses the CoolCloud design system and stores its data through the `storage` app API. `cc:notes` is a published extra.

## Install

On a running instance:

```bash
coolcloud --install cc:crm
```

Or in the browser: **Admin → App Store → Explore → Official App Registry**, filter by category, install. The official registry is added automatically on a new install.

## Publishing

Read [`PUBLISHING.md`](PUBLISHING.md) or the [HTML guide](https://openhcat.github.io/cc-appregistry/publish.html). The short version:

1. Build a folder with `manifest.json`, `web/index.html` and a `README.md`.
2. Install it from your own folder to test: `coolcloud --install you:app dir=./your-app`.
3. Open a pull request adding your entry to `registry.json` (and, if you host the app here, the package folder).

Every app is code that people run on their own servers. The registry is a catalogue, not a security review: publish something you would install yourself, and say what it does.

## Licensing

Registry metadata and the apps in `apps/` are MIT. Apps published by other developers keep their own licenses, named in their entry and repository.
