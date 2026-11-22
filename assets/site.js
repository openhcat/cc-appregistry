/* Official CoolCloud App Registry — browse the registry.json catalog. */
const grid = document.getElementById('grid');
const chips = document.getElementById('chips');
const search = document.getElementById('search-input');
const count = document.getElementById('count');

const icon = (name) => (name && name.startsWith('fa-') ? `<i class="${name}"></i>` : '<i class="fa-solid fa-cube"></i>');
const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

let catalog = null;
let category = 'All';
let query = '';

function categoriesFor(apps) {
  const declared = Array.isArray(catalog.categories) ? catalog.categories.filter(Boolean) : [];
  const present = [...new Set(apps.map((app) => app.category).filter(Boolean))];
  const all = [...declared];
  for (const name of present) if (!all.includes(name)) all.push(name);
  return ['All', ...all];
}

function render() {
  if (!catalog) return;
  const apps = catalog.apps || [];
  const list = apps
    .filter((app) => category === 'All' || app.category === category)
    .filter((app) => {
      if (!query) return true;
      const haystack = [app.id, app.name, app.description, app.category, ...(app.tags || [])].join(' ').toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));

  count.textContent = `${list.length} of ${apps.length} apps`;
  grid.innerHTML = list.length
    ? list
        .map(
          (app) => `<article class="card">
            <div class="top">
              <span class="icon">${icon(app.icon)}</span>
              <div style="min-width:0">
                <h3>${escapeHtml(app.name)}</h3>
                <div class="id">${escapeHtml(app.id)} · v${escapeHtml(app.version || '1.0.0')}</div>
              </div>
            </div>
            <p>${escapeHtml(app.description || '')}</p>
            <div class="foot">
              ${app.category ? `<span class="badge">${escapeHtml(app.category)}</span>` : ''}
              ${app.enterprise ? '<span class="badge enterprise">enterprise only</span>' : app.runtime === 'core' ? '<span class="badge core">core</span>' : '<span class="badge">app</span>'}
              ${app.essentials ? '<span class="badge essential">essentials</span>' : ''}
              ${app.beta ? '<span class="badge">beta</span>' : ''}
            </div>
            ${
              app.enterprise
                ? `<div class="code">Ships with CoolCloud Enterprise</div>
            <div class="foot">
              <a class="copy" style="text-decoration:none" href="${escapeHtml(app.contact || 'https://coolcloud.odoo.com/contactus')}" target="_blank" rel="noopener noreferrer">Contact us</a>
              <a class="copy" style="text-decoration:none" href="https://coolcloud.odoo.com" target="_blank" rel="noopener noreferrer">Get Enterprise</a>
            </div>`
                : `<div class="code">coolcloud --install ${escapeHtml(app.id)}</div>
            <div class="foot">
              <button class="copy" data-copy="coolcloud --install ${escapeHtml(app.id)}">Copy install</button>
              <a class="copy" style="text-decoration:none" href="https://github.com/openhcat/cc-appregistry/tree/main/${escapeHtml(app.path || '')}" target="_blank" rel="noopener noreferrer">Source</a>
            </div>`
            }
          </article>`
        )
        .join('')
    : `<div class="empty">No app matches that filter. <button class="chip" id="reset" type="button">Clear filters</button></div>`;

  document.getElementById('reset')?.addEventListener('click', () => {
    category = 'All';
    query = '';
    search.value = '';
    paintChips();
    render();
  });
  grid.querySelectorAll('[data-copy]').forEach((node) =>
    node.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(node.dataset.copy);
        const label = node.textContent;
        node.textContent = 'Copied';
        setTimeout(() => (node.textContent = label), 1400);
      } catch {
        /* clipboard is optional */
      }
    })
  );
}

function paintChips() {
  if (!catalog) return;
  const names = categoriesFor(catalog.apps || []);
  chips.innerHTML = names
    .map(
      (name) =>
        `<button class="chip" type="button" data-category="${escapeHtml(name)}" aria-pressed="${name === category}">${escapeHtml(name)}</button>`
    )
    .join('');
  chips.querySelectorAll('[data-category]').forEach((node) =>
    node.addEventListener('click', () => {
      category = node.dataset.category;
      paintChips();
      render();
    })
  );
}

async function load() {
  try {
    const response = await fetch('registry.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    catalog = await response.json();
  } catch (error) {
    grid.innerHTML = `<div class="empty">Could not read registry.json (${escapeHtml(error.message)}).</div>`;
    return;
  }
  const apps = catalog.apps || [];
  document.getElementById('stat-apps').textContent = apps.length;
  document.getElementById('stat-core').textContent = apps.filter((app) => app.runtime === 'core').length;
  document.getElementById('stat-categories').textContent = categoriesFor(apps).length - 1;
  document.getElementById('stat-updated').textContent = catalog.updated || '—';
  paintChips();
  render();
}

search.addEventListener('input', () => {
  query = search.value.trim().toLowerCase();
  render();
});

load();
