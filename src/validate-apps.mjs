const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const assetPathPattern = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/;
const assetNamePattern = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

function requireHTTPS(value, label) {
  let url;
  try { url = new URL(value); } catch { throw new Error(`${label} doit être une URL HTTPS valide.`); }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) {
    throw new Error(`${label} doit utiliser HTTPS, un hôte et aucun identifiant intégré.`);
  }
}

function requireAssetPath(value, label) {
  if (typeof value !== 'string' || !assetPathPattern.test(value) || value.includes('\\') ||
      value.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`${label} doit rester dans le dossier assets et ne pas contenir de traversée.`);
  }
}

export function validateAppRegistry(apps, documents) {
  if (!Array.isArray(apps) || apps.length === 0) throw new Error('Le registre apps doit être une liste non vide.');
  const ids = new Set();
  const outputNames = new Set();
  for (const app of apps) {
    if (!slugPattern.test(app.id)) throw new Error(`Slug d’application invalide : ${app.id}`);
    if (ids.has(app.id)) throw new Error(`Slug d’application dupliqué : ${app.id}`);
    ids.add(app.id);
    for (const key of ['name', 'category', 'platform', 'platformIcon', 'tagline', 'description', 'email', 'repository', 'support', 'iconAsset', 'featuresHeading', 'documentationIntro']) {
      if (typeof app[key] !== 'string' || !app[key].trim()) throw new Error(`${app.id}.${key} est requis.`);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email)) throw new Error(`${app.id}.email invalide.`);
    requireHTTPS(app.repository, `${app.id}.repository`);
    requireHTTPS(app.support, `${app.id}.support`);
    if (app.documentationUrl) requireHTTPS(app.documentationUrl, `${app.id}.documentationUrl`);
    if (typeof app.repositoryPublic !== 'boolean') throw new Error(`${app.id}.repositoryPublic doit être explicite.`);
    if (!Array.isArray(app.privacyLinks)) throw new Error(`${app.id}.privacyLinks doit être une liste.`);
    for (const [index, item] of app.privacyLinks.entries()) {
      if (!Array.isArray(item) || item.length !== 2 || !item.every(value => typeof value === 'string' && value.trim())) throw new Error(`${app.id}.privacyLinks[${index}] invalide.`);
      requireHTTPS(item[1], `${app.id}.privacyLinks[${index}]`);
    }
    if (!Array.isArray(app.assets) || app.assets.length === 0) throw new Error(`${app.id}.assets doit être une liste non vide.`);
    const localOutputs = new Set();
    for (const [index, asset] of app.assets.entries()) {
      const label = `${app.id}.assets[${index}]`;
      requireAssetPath(asset.source, `${label}.source`);
      if (asset.sourceFallback !== undefined) {
        if (asset.allowSourceFallback !== true) throw new Error(`${label}: un sourceFallback exige allowSourceFallback: true.`);
        requireAssetPath(asset.sourceFallback, `${label}.sourceFallback`);
      } else if (asset.allowSourceFallback !== undefined) {
        throw new Error(`${label}: allowSourceFallback exige un sourceFallback explicite.`);
      }
      if (typeof asset.output !== 'string' || !assetNamePattern.test(asset.output) || asset.output.includes('..')) {
        throw new Error(`${label}.output doit être un nom de fichier sans chemin ni traversée.`);
      }
      if (!Number.isFinite(asset.width) || asset.width <= 0) throw new Error(`${label}.width doit être positif et fini.`);
      if (localOutputs.has(asset.output) || outputNames.has(asset.output)) throw new Error(`${label}.output dupliqué : ${asset.output}`);
      localOutputs.add(asset.output); outputNames.add(asset.output);
    }
    if (!localOutputs.has(app.iconAsset)) throw new Error(`${app.id}.iconAsset doit référencer un asset déclaré.`);
    if (!app.card || !['icon-caption', 'image'].includes(app.card.kind) || !app.card.icon || !app.card.background) throw new Error(`${app.id}.card invalide.`);
    if (app.card.kind === 'image' && (!localOutputs.has(app.card.image) || !app.card.imageAlt)) throw new Error(`${app.id}.card.image doit référencer un asset avec un texte alternatif.`);
    if (app.card.imageFit !== undefined && !['cover', 'contain'].includes(app.card.imageFit)) throw new Error(`${app.id}.card.imageFit doit être cover ou contain.`);
    if (app.pageVisual !== null && app.pageVisual !== undefined) {
      if (!['image', 'screenshot'].includes(app.pageVisual.kind) || !localOutputs.has(app.pageVisual.image) || !app.pageVisual.alt) throw new Error(`${app.id}.pageVisual invalide ou asset non déclaré.`);
      if (app.pageVisual.kind === 'screenshot' && (!app.pageVisual.heading || !app.pageVisual.eyebrow)) throw new Error(`${app.id}.pageVisual de type screenshot exige un titre et un surtitre.`);
    }
    if (!Array.isArray(app.features) || app.features.length === 0 || !app.features.every(item => Array.isArray(item) && item.length === 3 && item.every(value => typeof value === 'string' && value.trim()))) throw new Error(`${app.id}.features invalide.`);
    if (!Array.isArray(app.highlights) || app.highlights.length === 0) throw new Error(`${app.id}.highlights invalide.`);
    if (!app.offers || typeof app.offers.appleLinks !== 'boolean' || typeof app.offers.summary !== 'string' || !app.offers.summary.trim()) throw new Error(`${app.id}.offers invalide.`);
    const content = documents?.[app.id];
    for (const section of ['documentation', 'confidentialite', 'faq']) {
      if (!Array.isArray(content?.[section]) || content[section].length === 0 || !content[section].every(item => Array.isArray(item) && item.length >= 2 && item.every(value => typeof value === 'string' && value.trim()))) {
        throw new Error(`${app.id}.documents.${section} invalide.`);
      }
    }
  }
  if (Object.keys(documents || {}).some(id => !ids.has(id))) throw new Error('documents contient une application absente du registre apps.');
  return true;
}
