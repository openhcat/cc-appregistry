#!/usr/bin/env node
/**
 * Validate registry.json and every app it lists.
 *
 *   node scripts/validate.mjs             check files in this checkout
 *   node scripts/validate.mjs --remote    also HEAD every file on GitHub
 *
 * Exits non-zero when an entry is broken, so it can gate a pull request.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const remote = process.argv.includes('--remote');
const ID = /^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$/;
const errors = [];
const warnings = [];
let coreOnly = 0;

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

const registryPath = path.join(ROOT, 'registry.json');
if (!fs.existsSync(registryPath)) {
  console.error('registry.json not found');
  process.exit(1);
}
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

if (registry.schema !== 'coolcloud.registry/2') fail(`schema is ${registry.schema || 'missing'}`);
if (!Array.isArray(registry.categories) || !registry.categories.length) fail('categories must be a non-empty array');
if (!Array.isArray(registry.apps) || !registry.apps.length) fail('apps must be a non-empty array');

const categories = new Set(registry.categories || []);
const seen = new Set();
const repo = registry.repo || '';
const branch = registry.branch || 'main';

function rawUrl(entry, file) {
  if (!repo) return '';
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/.]+?)(?:\.git)?$/.exec(repo);
  if (!match) return '';
  const folder = String(entry.path || '.').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${entry.branch || branch}/${
    folder && folder !== '.' ? `${folder}/` : ''
  }${file}`;
}

async function remoteCheck(url) {
  if (!remote || !url) return;
  try {
    const response = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'coolcloud-registry-validator' } });
    if (!response.ok) fail(`${url}: HTTP ${response.status}`);
  } catch (err) {
    fail(`${url}: ${err.message}`);
  }
}

for (const entry of registry.apps || []) {
  const label = entry?.id || '(missing id)';
  if (!entry || typeof entry !== 'object') {
    fail('an app entry is not an object');
    continue;
  }
  if (!ID.test(String(entry.id || ''))) fail(`${label}: id must look like developer:name`);
  if (seen.has(entry.id)) fail(`${label}: duplicate id`);
  seen.add(entry.id);

  for (const field of ['name', 'developer', 'version', 'description', 'icon', 'path']) {
    if (!entry[field]) fail(`${label}: ${field} is required`);
  }
  if (entry.developer && entry.id && entry.id.split(':')[0] !== entry.developer) {
    fail(`${label}: developer must match the id prefix`);
  }
  if (typeof entry.description === 'string' && entry.description.length > 140) {
    fail(`${label}: description is ${entry.description.length} characters (max 140)`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(String(entry.version || ''))) fail(`${label}: version must be semver`);
  if (entry.category && !categories.has(entry.category)) fail(`${label}: category "${entry.category}" is not listed`);

  const files = Array.isArray(entry.files) ? entry.files : [];
  if (!files.includes('manifest.json')) fail(`${label}: files must include manifest.json`);
  if (!Array.isArray(entry.tags)) warn(`${label}: no tags`);

  const folder = path.resolve(ROOT, entry.path || '.');
  if (!folder.startsWith(ROOT + path.sep)) {
    fail(`${label}: path leaves the repository`);
    continue;
  }
  if (!fs.existsSync(folder)) {
    fail(`${label}: folder ${entry.path} does not exist`);
    continue;
  }
  const manifestPath = path.join(folder, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    fail(`${label}: ${entry.path}/manifest.json is missing`);
    continue;
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    fail(`${label}: manifest.json is not valid JSON (${err.message})`);
    continue;
  }
  for (const field of ['id', 'name', 'version', 'description', 'icon', 'entry']) {
    if (!manifest[field]) fail(`${label}: manifest ${field} is required`);
  }
  for (const field of ['id', 'name', 'version', 'description']) {
    if (manifest[field] && entry[field] && String(manifest[field]) !== String(entry[field])) {
      fail(`${label}: manifest ${field} "${manifest[field]}" does not match registry "${entry[field]}"`);
    }
  }
  if (manifest.id && manifest.id !== entry.id) fail(`${label}: manifest id "${manifest.id}" differs`);

  for (const file of files) {
    const target = path.resolve(folder, file);
    if (!target.startsWith(folder + path.sep) && target !== folder) {
      fail(`${label}: file ${file} leaves the app folder`);
      continue;
    }
    if (!fs.existsSync(target)) fail(`${label}: listed file ${file} does not exist locally`);
    await remoteCheck(rawUrl(entry, file));
  }

  if (entry.runtime === 'external') {
    if (!manifest.entry) fail(`${label}: external apps need a manifest entry point`);
    else if (!fs.existsSync(path.join(folder, manifest.entry))) fail(`${label}: entry ${manifest.entry} does not exist`);
    if (!files.includes(manifest.entry)) warn(`${label}: files does not list the entry point ${manifest.entry}`);
  } else if (manifest.entry && !fs.existsSync(path.join(folder, manifest.entry))) {
    coreOnly += 1;
  }
}

if (coreOnly) console.log(`  ${coreOnly} core manifests are catalogue-only; their code ships with CoolCloud.`);
for (const message of warnings) console.log(`  warn  ${message}`);
for (const message of errors) console.log(`  error ${message}`);
if (errors.length) {
  console.log(`\n${errors.length} error${errors.length === 1 ? '' : 's'} in ${registry.apps.length} apps.`);
  process.exit(1);
}
console.log(`\n${registry.apps.length} apps OK${remote ? ' (files reachable on GitHub)' : ''}.`);
