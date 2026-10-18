import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { apps, sections, documents } from '../src/content.mjs';
import { validateRecipeFeed } from '../src/stockchef/validate.mjs';

const output = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
test('Le catalogue partagé est publié et les mises à jour invalides sont refusées', async () => {
  const source = await readFile(resolve(output, '../src/stockchef/recipes.json'), 'utf8');
  assert.equal(await readFile(resolve(output, 'stockchef/recipes.json'), 'utf8'), source);
  const feed = JSON.parse(source);
  validateRecipeFeed(feed);
  assert.ok(feed.recipes.length >= 46);
  assert.equal(new Set(feed.recipes.map(recipe => recipe.title.trim().toLocaleLowerCase('fr'))).size, feed.recipes.length);
  assert.throws(() => validateRecipeFeed({ ...feed, schemaVersion: 3 }));
  assert.throws(() => validateRecipeFeed({ ...feed, recipes: [] }));
  assert.throws(() => validateRecipeFeed({ ...feed, recipes: [feed.recipes[0], feed.recipes[0]] }));
  assert.throws(() => validateRecipeFeed({ ...feed, recipes: [{ ...feed.recipes[0], baseServings: 0 }] }));
  const imported = feed.recipes.filter(recipe => recipe.source);
  assert.ok(imported.length >= 27);
  for (let suffix = 1001; suffix <= 1027; suffix++) {
    assert.ok(imported.some(recipe => recipe.id === `8c7892ea-72f2-4f7f-a538-ec036acb${suffix}`), `Adaptation absente : ${suffix}`);
  }
  assert.ok(imported.every(recipe => recipe.source.license === 'CC BY-SA 4.0'));
  const recipe = imported[0];
  assert.throws(() => validateRecipeFeed({ ...feed, schemaVersion: 1 }));
  assert.throws(() => validateRecipeFeed({ ...feed, recipes: [{ ...recipe, source: { ...recipe.source, attribution: '' } }] }));
  assert.throws(() => validateRecipeFeed({ ...feed, recipes: [{ ...recipe, source: { ...recipe.source, url: 'javascript:alert(1)' } }] }));
  assert.throws(() => validateRecipeFeed({ ...feed, recipes: [{ ...recipe, source: { ...recipe.source, licenseURL: 'http://example.com' } }] }));
});

test('Le registre de packs signé et son archive hashée sont publiés', async () => {
  const manifestPath = resolve(output, 'packs/manifest-v1.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.schema_version, '1.0');
  assert.equal(manifest.channel, 'stable');
  assert.equal(manifest.signature_key_id, 'btbu-ed25519-2026-10-18');
  assert.match(manifest.signature, /^[A-Za-z0-9+/]+={0,2}$/);
  assert.equal(manifest.packs.length, 2);
  const [taxonomy, model] = manifest.packs;
  assert.equal(taxonomy.id, 'taxonomy.taxref-v18.fr-en.core');
  assert.match(taxonomy.sha256, /^[a-f0-9]{64}$/);
  assert.equal(taxonomy.url, 'https://aurelienleleu.github.io/BTBU/packs/taxref-v18-nomenclature-1.0.0.btbupack');
  assert.equal((await stat(resolve(output, 'packs/taxref-v18-nomenclature-1.0.0.btbupack'))).size, taxonomy.size_bytes);
  assert.equal(model.id, 'model.inaturalist.small.v25.01.15');
  assert.equal(model.kind, 'model_tflite');
  assert.match(model.sha256, /^[a-f0-9]{64}$/);
  assert.equal(model.url, 'https://aurelienleleu.github.io/BTBU/packs/inat-small-v25.01.15.tflite.btbupack');
  assert.equal((await stat(resolve(output, 'packs/inat-small-v25.01.15.tflite.btbupack'))).size, model.size_bytes);
});
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

test('Le site statique reçoit les en-têtes de sécurité et les URL de production', async () => {
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
