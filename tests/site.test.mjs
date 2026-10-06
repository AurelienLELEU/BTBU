import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { apps, sections, documents } from '../src/content.mjs';

const output = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => entry.isDirectory() ? htmlFiles(resolve(directory, entry.name)) : entry.name.endsWith('.html') ? [resolve(directory, entry.name)] : []));
  return groups.flat();
}

test('Chaque application possède ses cinq pages publiques et son contact', async () => {
  assert.deepEqual(apps.map(app => app.id), ['cashdraft', 'idle-crystal-corp', 'stockchef']);
  assert.notEqual(apps[0].email, apps[1].email);
  for (const app of apps) {
    for (const section of sections) {
      const file = resolve(output, app.id, section.id === 'index' ? '' : section.id, 'index.html');
      const html = await readFile(file, 'utf8');
      assert.match(html, /<html lang="fr">/);
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file);
      assert.match(html, /aria-current="page"/);
    }
  }
});

test('Tous les liens, ancres, images, scripts et styles internes existent', async () => {
  for (const file of await htmlFiles(output)) {
    const html = await readFile(file, 'utf8');
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    assert.equal(ids.size, [...html.matchAll(/\bid="([^"]+)"/g)].length, `IDs dupliqués : ${file}`);
    for (const [, reference] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:)/.test(reference)) continue;
      const [path, fragment] = reference.split('#');
      const target = path ? resolve(dirname(file), path) : file;
      await access(target);
      if (fragment) {
        const targetHtml = target === file ? html : await readFile(target, 'utf8');
        assert.ok(targetHtml.includes(`id="${fragment}"`), `Ancre absente : ${reference} dans ${file}`);
      }
    }
  }
});

test('Les politiques conservent les éléments sensibles des pages originales', () => {
  const cash = JSON.stringify(documents.cashdraft.confidentialite);
  const idle = JSON.stringify(documents['idle-crystal-corp'].confidentialite);
  for (const term of ['CloudKit', 'chiffrée', 'StoreKit', 'ni traqueur tiers', '07 77 26 07 34']) assert.ok(cash.includes(term), term);
  for (const term of ['non personnalisé', 'APNs', 'localisation approximative', 'portabilité', 'consentement', 'limitation de fréquence']) assert.ok(idle.includes(term), term);
});

test('Les documents juridiques incomplets sont explicitement provisoires et non indexables', async () => {
  for (const path of ['conditions/index.html', 'mentions-legales/index.html', 'stockchef/confidentialite/index.html', ...apps.map(app => `${app.id}/conditions/index.html`)]) {
    const html = await readFile(resolve(output, path), 'utf8');
    assert.match(html, /provisoire/i);
    assert.match(html, /noindex,follow/);
  }
});

test('Aucun service tiers, traceur ou formulaire ne se charge dans les pages', async () => {
  for (const file of await htmlFiles(output)) {
    const html = await readFile(file, 'utf8');
    assert.doesNotMatch(html, /<(?:script|img|iframe)[^>]+src="https?:/);
    assert.doesNotMatch(html, /<form\b/);
    assert.doesNotMatch(html, /<link[^>]+href="https?:[^>]+rel="stylesheet"/);
    assert.match(html, /<meta name="description"/);
  }
  const css = await readFile(resolve(output, 'assets/styles.css'), 'utf8');
  for (const [, font] of css.matchAll(/url\(([^)]+)\)/g)) await access(resolve(output, 'assets', font));
});

test('Cloudflare reçoit les en-têtes de sécurité et les URL du domaine de production', async () => {
  const domain = (process.env.SITE_URL || 'https://btbu.aurelienleleu.fr').replace(/\/$/, '');
  const headers = await readFile(resolve(output, '_headers'), 'utf8');
  assert.match(headers, /Content-Security-Policy: default-src 'self'/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  for (const file of await htmlFiles(output)) {
    const html = await readFile(file, 'utf8');
    assert.ok(html.includes(`<link rel="canonical" href="${domain}/`));
    assert.ok(html.includes(`<meta property="og:image" content="${domain}/assets/social.jpg">`));
  }
  const sitemap = await readFile(resolve(output, 'sitemap.xml'), 'utf8');
  assert.ok(sitemap.includes(`<loc>${domain}/cashdraft/</loc>`));
  assert.ok(sitemap.includes(`<loc>${domain}/idle-crystal-corp/</loc>`));
  assert.ok(sitemap.includes(`<loc>${domain}/stockchef/</loc>`));
  assert.ok(!sitemap.includes(`${domain}/stockchef/confidentialite/`));
  assert.doesNotMatch(sitemap, /conditions|mentions-legales|404/);
  const robots = await readFile(resolve(output, 'robots.txt'), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${domain}/sitemap.xml`));
});

test('StockChef possède ses propres visuels et ne reprend pas les promesses du jeu', async () => {
  assert.equal((await htmlFiles(output)).length, 7 + apps.length * sections.length);
  const home = await readFile(resolve(output, 'index.html'), 'utf8');
  assert.match(home, /01 — 03/);
  for (const section of sections) {
    const html = await readFile(resolve(output, 'stockchef', section.id === 'index' ? '' : section.id, 'index.html'), 'utf8');
    assert.match(html, /stockchef\.webp/);
    assert.doesNotMatch(html, /crystal-splash|policies\.google\.com|AdMob|20 bâtiments/);
  }
  const guide = await readFile(resolve(output, 'stockchef/documentation/index.html'), 'utf8');
  assert.match(guide, /L’import remplace/);
  assert.match(guide, /non chiffré/);
  assert.match(guide, /sans lui, la sauvegarde chiffrée ne peut pas être restaurée/i);
  const terms = await readFile(resolve(output, 'stockchef/conditions/index.html'), 'utf8');
  assert.match(terms, /recharge consommable de 20 scans/);
  assert.match(terms, /sans abonnement/);
  assert.doesNotMatch(terms, /Studio|contenu du jeu|Boutique →/);
});

test('Les mots-clés sous les logos restent présents sur l’accueil', async () => {
  const home = await readFile(resolve(output, 'index.html'), 'utf8');
  assert.ok(home.includes('<span class="art-caption">DEVIS / FACTURES / SÉRÉNITÉ</span>'));
  assert.ok(home.includes('<span class="art-caption">TICKETS / STOCK / RECETTES</span>'));
  assert.equal((home.match(/class="art-caption"/g) || []).length, 2);
});