import { mkdir, readFile, writeFile, copyFile, cp } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { icons } from 'lucide';
import sharp from 'sharp';
import { publisher, apps, sections, documents, salesTerms } from '../src/content.mjs';
import { validateRecipeFeed } from '../src/stockchef/validate.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const assetOutput = resolve(output, 'assets');
const sourceAssets = resolve(root, 'assets');
const siteUrl = (process.env.SITE_URL || 'https://btbu.aurelienleleu.fr').replace(/\/$/, '');
if (siteUrl && (new URL(siteUrl).protocol !== 'https:' || new URL(siteUrl).pathname !== '/' || new URL(siteUrl).search || new URL(siteUrl).hash)) {
  throw new Error('SITE_URL doit être une origine HTTPS, sans chemin, paramètre ni fragment.');
}
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
function renderNode([tag, attributes, children = []]) {
  return `<${tag} ${Object.entries(attributes).map(([name, value]) => `${name}="${escape(value)}"`).join(' ')}>${children.map(renderNode).join('')}</${tag}>`;
}
function icon(name) {
  const [tag, attributes, children] = icons[name];
  return renderNode([tag, { ...attributes, class: 'icon', 'aria-hidden': 'true', focusable: 'false' }, children]);
}
const pages = [];
const destination = (app, section = 'index') => `${app.id}/${section === 'index' ? 'index.html' : `${section}/index.html`}`;
function prefixFor(path) {
  return '../'.repeat(path.split('/').length - 1);
}
function appImage(app, prefix, className = '') {
  return `<img class="app-icon ${className}" src="${prefix}assets/${app.id}.webp" width="96" height="96" alt="Icône ${escape(app.name)}">`;
}
function shell({ path, title, description, body, app, section, active, draft = false }) {
  const prefix = prefixFor(path);
  const link = target => `${prefix}${target}`;
  const canonical = siteUrl ? `<link rel="canonical" href="${escape(`${siteUrl}/${path.replace(/index\.html$/, '')}`)}">` : '';
  const appNav = app ? `<div class="app-nav"><div class="container app-nav-inner"><a class="app-nav-name" href="${link(destination(app))}">${appImage(app, prefix)}${escape(app.name)}</a><nav aria-label="Navigation ${escape(app.name)}">${sections.map(item => `<a href="${link(destination(app, item.id))}" ${section === item.id ? 'aria-current="page"' : ''}>${icon(item.icon)}${escape(item.label)}</a>`).join('')}</nav></div></div>` : '';
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(description)}">
  <meta name="theme-color" content="#087f5b">
  ${draft ? '<meta name="robots" content="noindex,follow">' : ''}
  ${canonical}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  ${siteUrl ? `<meta property="og:image" content="${escape(siteUrl)}/assets/social.jpg">` : ''}
  <title>${escape(title)} | BTBU</title>
  <link rel="icon" href="${link('assets/favicon.png')}" type="image/png">
  <link rel="stylesheet" href="${link('assets/styles.css')}">
  <script defer src="${link('assets/site.js')}"></script>
</head>
<body class="${app ? `app-${app.id}` : 'studio'}">
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  <header class="site-header"><div class="container header-inner">
    <a class="brand" href="${link('index.html')}" aria-label="BTBU, accueil">BTBU<span class="brand-dot">.</span><span class="brand-caption">BUILT TO BE USED</span></a>
    <nav aria-label="Navigation principale">
      <a href="${link('index.html#applications')}" ${active === 'apps' ? 'aria-current="page"' : ''}>Applications</a>
      <a href="${link('documentation/index.html')}" ${active === 'documentation' ? 'aria-current="page"' : ''}>Guides</a>
      <a class="nav-support" href="${link('support/index.html')}" ${active === 'support' ? 'aria-current="page"' : ''}>${icon('LifeBuoy')}Assistance</a>
    </nav>
  </div></header>
  ${appNav}
  <main id="contenu">${body}</main>
  <footer class="site-footer"><div class="container">
    <div class="footer-top"><div><a class="brand" href="${link('index.html')}">BTBU<span class="brand-dot">.</span></a><p>Built To Be Used.<br>Des applications faites pour servir.</p></div>
    <nav aria-label="Applications">${apps.map(item => `<a href="${link(destination(item))}">${escape(item.name)}</a>`).join('')}<a href="${link('support/index.html')}">Nous contacter</a></nav>
    <nav aria-label="Informations légales"><a href="${link('confidentialite/index.html')}">Confidentialité</a><a href="${link('conditions/index.html')}">Conditions de vente</a><a href="${link('mentions-legales/index.html')}">Mentions légales</a></nav></div>
    <div class="footer-bottom"><span>© 2026 BTBU · Aurélien LELEU</span><span>Sans publicité ni traceur sur ce site.</span></div>
  </div></footer>
</body>
</html>`;
}
async function page(options) {
  const target = resolve(output, options.path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, shell(options));
  pages.push({ path: options.path, draft: options.draft });
}
function appCard(app, prefix = '') {
  const cash = app.id === 'cashdraft';
  const game = app.id === 'idle-crystal-corp';
  return `<article class="product-card ${cash ? 'cash-card' : game ? 'crystal-card' : 'stock-card'}">
    <a class="product-media" href="${prefix}${destination(app)}" aria-label="Découvrir ${escape(app.name)}">
      ${game ? `<img class="crystal-art" src="${prefix}assets/crystal-splash.webp" width="1200" height="675" alt="Illustration officielle Idle Crystal Corp : cristal lumineux sur fond de strates cristallines">` : `<div class="cash-art">${appImage(app, prefix)}<span class="art-caption">${cash ? 'DEVIS / FACTURES / SÉRÉNITÉ' : 'TICKETS / STOCK / RECETTES'}</span></div>`}
      <span class="media-label">${icon(cash ? 'FileCheck2' : game ? 'Gem' : 'ChefHat')}${escape(app.category)}</span>
    </a>
    <div class="product-info"><div class="product-title"><h3><a href="${prefix}${destination(app)}">${escape(app.name)}</a></h3><a class="icon-link" href="${prefix}${destination(app)}" aria-label="Découvrir ${escape(app.name)}" title="Découvrir ${escape(app.name)}">${icon('ArrowUpRight')}</a></div>
    <p>${escape(app.description)}</p><div class="tag-list">${app.highlights.map(label => `<span>${escape(label)}</span>`).join('')}</div>
    <nav class="product-links" aria-label="Ressources ${escape(app.name)}"><a href="${prefix}${destination(app, 'documentation')}">Guide ${icon('ArrowRight')}</a><a href="${prefix}${destination(app, 'confidentialite')}">Confidentialité</a><a href="${prefix}${destination(app, 'support')}">Support</a></nav></div>
  </article>`;
}
function contentBlocks(blocks) {
  return blocks.map(([heading, ...paragraphs], index) => `<section id="section-${index + 1}" class="text-section"><h2>${escape(heading)}</h2>${paragraphs.map(text => `<p>${escape(text)}</p>`).join('')}</section>`).join('');
}
function documentLayout({ app, section, title, introduction, blocks, prefix, notice = '', extra = '', date = '' }) {
  return `<div class="container document-head"><p class="eyebrow">${escape(app.name)} / ${escape(sections.find(item => item.id === section).label)}</p><div class="document-title"><h1>${escape(title)}</h1><button class="print-button" type="button" data-print title="Imprimer ce document" aria-label="Imprimer ce document">${icon('Printer')}</button></div><p class="lead">${escape(introduction)}</p>${date ? `<p class="updated">Dernière mise à jour : ${escape(date)}</p>` : ''}</div>
  <div class="container document-grid"><aside class="document-sidebar"><details open><summary>Sur cette page ${icon('List')}</summary><nav aria-label="Sommaire">${blocks.map(([heading], index) => `<a href="#section-${index + 1}">${escape(heading)}</a>`).join('')}</nav></details><a class="sidebar-contact" href="${prefix}${destination(app, 'support')}">${icon('LifeBuoy')}Contacter le support ${icon('ArrowUpRight')}</a></aside>
    <article class="document-body">${notice}${contentBlocks(blocks)}${extra}<div class="document-end">${icon('Mail')}<div><h2>Une question ?</h2><a href="mailto:${escape(app.email)}">${escape(app.email)}</a></div></div></article>
  </div>`;
}

await mkdir(assetOutput, { recursive: true });
const recipeFeed = await readFile(resolve(root, 'src/stockchef/recipes.json'), 'utf8');
if (Buffer.byteLength(recipeFeed, 'utf8') > 2_000_000) throw new Error('Catalogue StockChef : limite de 2 Mo dépassée.');
validateRecipeFeed(JSON.parse(recipeFeed));
await mkdir(resolve(output, 'stockchef'), { recursive: true });
await writeFile(resolve(output, 'stockchef/recipes.json'), recipeFeed);
await cp(resolve(root, 'src/packs'), resolve(output, 'packs'), {
  recursive: true,
  force: true,
});
await mkdir(sourceAssets, { recursive: true });
const images = [
  ['cashdraft.png', '../CashDraft/CashDraft/Assets.xcassets/AppIcon.appiconset/Icon-1024.png', 'cashdraft.webp', 256],
  ['idle-crystal-corp.png', '../IdleCrystalCorp/icon.png', 'idle-crystal-corp.webp', 256],
  ['crystal-splash.png', '../IdleCrystalCorp/assets/splash.png', 'crystal-splash.webp', 1200],
  ['stockchef.png', '../StockChef/StockChefApp/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png', 'stockchef.webp', 256],
  ['stockchef-dashboard.png', '../StockChef/03_app_store/screenshots/fr-FR/iPhone-18-Pro/01-tableau-de-bord.png', 'stockchef-dashboard.webp', 720],
];
for (const [localName, original, webName, width] of images) {
  const localPath = resolve(sourceAssets, localName);
  try { await readFile(localPath); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await copyFile(resolve(root, original), localPath);
  }
  await sharp(localPath).resize({ width, withoutEnlargement: true }).webp({ quality: 88 }).toFile(resolve(assetOutput, webName));
}
await sharp(resolve(sourceAssets, 'cashdraft.png')).resize(48, 48).png().toFile(resolve(assetOutput, 'favicon.png'));
await sharp(resolve(sourceAssets, 'crystal-splash.png')).resize(1200, 630, { fit: 'contain', background: '#141123' }).jpeg({ quality: 85 }).toFile(resolve(assetOutput, 'social.jpg'));
for (const [font, weight] of [['dm-sans', 400], ['dm-sans', 500], ['dm-sans', 600], ['space-grotesk', 500], ['space-grotesk', 700]]) {
  await copyFile(resolve(root, `node_modules/@fontsource/${font}/files/${font}-latin-${weight}-normal.woff2`), resolve(assetOutput, `${font}-${weight}.woff2`));
}
for (const name of ['styles.css', 'site.js']) await copyFile(resolve(root, `src/${name}`), resolve(assetOutput, name));

await page({ path: 'index.html', title: 'BTBU · Built To Be Used', description: `${apps.map(app => app.name).join(', ')} : les applications BTBU, leurs guides, leur assistance et leurs informations de confidentialité.`, active: 'apps', body: `
  <section class="home-hero"><div class="container"><p class="eyebrow"><span class="status-dot"></span> LE STUDIO / AURÉLIEN LELEU</p><h1>BTBU<span>.</span></h1><div class="hero-bottom"><div><p class="hero-name">Built To Be Used.</p><p class="hero-description">Des apps qui vont à l’essentiel.<br>Pour votre activité. Pour votre temps libre.</p></div><a class="text-action" href="#applications">Nos applications ${icon('ArrowDown')}</a></div></div></section>
  <section id="applications" class="applications-section container"><div class="section-heading"><div><p class="eyebrow">DES UNIVERS DIFFÉRENTS. LA MÊME EXIGENCE.</p><h2>Nos applications</h2></div><span class="section-count">01 — ${String(apps.length).padStart(2, '0')}</span></div><div class="product-grid">${apps.map(app => appCard(app)).join('')}</div></section>
  <section class="resource-band"><div class="container resource-inner"><div><p class="eyebrow">À PORTÉE DE MAIN</p><h2>L’essentiel, au même endroit.</h2></div><div class="resource-links"><a href="documentation/index.html">${icon('BookOpen')}<span>Documentation</span>${icon('ArrowUpRight')}</a><a href="support/index.html">${icon('LifeBuoy')}<span>Une question ?</span>${icon('ArrowUpRight')}</a><a href="confidentialite/index.html">${icon('ShieldCheck')}<span>Vos données</span>${icon('ArrowUpRight')}</a></div></div></section>` });

for (const app of apps) {
  const cash = app.id === 'cashdraft';
  const game = app.id === 'idle-crystal-corp';
  const prefix = '../';
  const features = cash ? [
    ['FileCheck2', 'Devis & factures', 'Du brouillon au PDF partagé, vos documents et vos clients restent à portée de main.'],
    ['HardDrive', 'Local, d’abord', 'Pas de compte obligatoire ni de serveur CashDraft recevant vos données métier.'],
    ['Cloud', 'À votre rythme', 'Crédits, Pro Lifetime ou Studio : choisissez selon votre usage. iCloud reste facultatif.'],
  ] : game ? [
    ['Gem', 'De la récolte à l’empire', '20 bâtiments, 17 technologies et 31 succès pour développer votre industrie.'],
    ['Timer', 'Même pendant la pause', 'Retrouvez vos gains hors ligne à votre retour et faites grandir votre production.'],
    ['Sparkles', 'Jouer sans contrainte', 'Tout le contenu est accessible gratuitement. Publicités et achats restent facultatifs.'],
  ] : [
    ['ScanLine', 'Du ticket au stock', 'Analysez et corrigez les lignes de vos tickets avec une reconnaissance de texte locale.'],
    ['ChefHat', 'Cuisiner ce que vous avez', 'Recettes, quantités par convive et planning pour organiser vos prochains repas.'],
    ['HardDrive', 'Vos données, sur l’iPhone', 'Inventaire local, exports JSON et sauvegardes chiffrées par le mot de passe que vous choisissez.'],
  ];
  await page({ path: destination(app), app, section: 'index', title: app.name, description: app.description, body: `
    <section class="app-hero"><div class="container"><p class="eyebrow">${escape(app.category)} / BTBU</p><div class="app-title">${appImage(app, prefix)}<h1>${escape(app.name)}</h1></div><p class="app-tagline">${escape(app.tagline)}</p><p class="lead">${escape(app.description)}</p><div class="app-actions"><a class="button primary" href="documentation/index.html">${icon('BookOpen')}Consulter le guide ${icon('ArrowRight')}</a><a class="text-action" href="support/index.html">Contacter le support ${icon('ArrowUpRight')}</a></div><p class="platform-note">${icon(game ? 'Gamepad2' : 'Laptop')}${escape(app.platform)} · Aucun téléchargement proposé sur ce site.</p></div></section>
    ${game ? `<div class="game-visual"><img src="${prefix}assets/crystal-splash.webp" width="1200" height="675" alt="Illustration officielle du jeu Idle Crystal Corp, un cristal lumineux et ses strates"></div>` : app.id === 'stockchef' ? `<section class="stock-visual"><div class="container"><p class="eyebrow">DANS STOCKCHEF</p><h2>Un aperçu de votre cuisine.</h2><img src="${prefix}assets/stockchef-dashboard.webp" width="720" height="1565" loading="lazy" alt="Capture réelle de StockChef : tableau de bord de l’inventaire et des repas sur iPhone"></div></section>` : ''}
    <section class="container features-section"><h2>${cash ? 'L’essentiel pour votre activité.' : game ? 'La progression, à votre façon.' : 'Moins d’oubli. Plus d’idées.'}</h2><div class="features-grid">${features.map(([symbol, title, text]) => `<div>${icon(symbol)}<h3>${escape(title)}</h3><p>${escape(text)}</p></div>`).join('')}</div></section>
    <section class="resource-band"><div class="container resource-inner"><div><p class="eyebrow">${escape(app.name)}</p><h2>Les informations utiles.</h2></div><div class="resource-links">${sections.filter(item => item.id !== 'index').map(item => `<a href="${item.id}/index.html">${icon(item.icon)}<span>${escape(item.label)}</span>${icon('ArrowUpRight')}</a>`).join('')}</div></div></section>` });
  const data = documents[app.id];
  for (const section of ['documentation', 'confidentialite', 'conditions']) {
    const blocks = section === 'conditions' ? salesTerms(app) : data[section];
    const titles = { documentation: 'Le guide de votre application.', confidentialite: 'Politique de confidentialité', conditions: 'Conditions générales de vente' };
    const introductions = { documentation: cash ? 'Configurer, créer, sauvegarder : les étapes essentielles pour utiliser CashDraft.' : game ? 'Récolte, progression, achats et sauvegarde : les repères pour développer votre empire.' : 'Scanner, corriger, cuisiner et sauvegarder : les repères pour organiser vos aliments.', confidentialite: 'Quelles données sont utilisées, où elles sont conservées et qui les traite.', conditions: 'Les conditions relatives aux achats numériques effectués dans l’application.' };
    const notice = section === 'conditions' ? `<div class="notice warning">${icon('Info')}<div><strong>Version provisoire · à valider avant publication</strong><p>L’adresse professionnelle, le statut et l’immatriculation de l’éditeur ainsi que les informations de médiation, le cas échéant, ne sont pas encore renseignés. Ce texte ne constitue pas une validation juridique.</p></div></div>` : section === 'confidentialite' && app.privacyDraft ? `<div class="notice warning">${icon('Info')}<div><strong>Version provisoire · à confirmer par l’éditeur</strong><p>Ce texte reprend le fonctionnement documenté de l’application. Le contact de confidentialité et l’adéquation à la version distribuée doivent être confirmés avant validation.</p></div></div>` : '';
    let extra = '';
    if (section === 'confidentialite' && game) extra = `<section class="text-section"><h2>Informations des prestataires</h2><p><a href="https://policies.google.com/privacy">Politique de confidentialité de Google ${icon('ArrowUpRight')}</a></p><p><a href="https://developers.google.com/admob/ios/privacy/data-disclosure">Données du SDK Google Mobile Ads ${icon('ArrowUpRight')}</a></p></section>`;
    if (section === 'conditions') extra = `<p class="external-links"><a href="https://reportaproblem.apple.com/">Demander un remboursement à Apple ${icon('ArrowUpRight')}</a><a href="https://www.apple.com/legal/internet-services/itunes/fr/terms.html">Conditions des services Apple ${icon('ArrowUpRight')}</a></p>`;
    if (section === 'documentation') extra = `<div class="notice">${icon('Code2')}<div><strong>Documentation technique</strong><p>Le code et les instructions de développement restent disponibles dans la <a href="${app.documentationUrl || `${app.repository}#readme`}">documentation du dépôt officiel ${icon('ArrowUpRight')}</a>.</p></div></div>`;
    await page({ path: destination(app, section), app, section, title: `${titles[section]} · ${app.name}`, description: `${sections.find(item => item.id === section).label} de ${app.name}. ${introductions[section]}`, draft: section === 'conditions' || (section === 'confidentialite' && app.privacyDraft), body: documentLayout({ app, section, title: titles[section], introduction: introductions[section], blocks, prefix: '../../', notice, extra, date: section === 'confidentialite' ? app.privacyDate : '' }) });
  }
  await page({ path: destination(app, 'support'), app, section: 'support', title: `Assistance · ${app.name}`, description: `Contacter le support ${app.name} et trouver les réponses sur les achats, les données et la progression.`, body: `
    <section class="container support-head"><p class="eyebrow">${escape(app.name)} / ASSISTANCE</p><h1>Parlons de votre question.</h1><p class="lead">Une difficulté, un achat ou une suggestion ? Contactez directement le support de ${escape(app.name)}.</p>${app.supportDraft ? '<div class="notice warning"><strong>Contact BTBU proposé pour StockChef : à confirmer par l’éditeur.</strong></div>' : ''}</section>
    <div class="container support-grid"><section class="contact-panel"><p class="eyebrow">PAR E-MAIL</p><h2>Le contact direct.</h2><a class="contact-email" href="mailto:${app.email}?subject=${encodeURIComponent(`${app.name} - Assistance`)}">${escape(app.email)} ${icon('ArrowUpRight')}</a><p>Indiquez votre appareil, la version du système, la version de l’application et les étapes pour reproduire le problème. Une capture d’écran peut être utile.</p><p>Masquez les données personnelles et les informations de paiement inutiles.</p><a class="text-action" href="${app.support}">Ouvrir un ticket GitHub ${icon('ArrowUpRight')}</a><p class="small">Les tickets GitHub sont publics. N’y joignez jamais une facture, des coordonnées bancaires ou une sauvegarde personnelle.</p>${cash ? '<p class="small">Contact : Aurélien LELEU · <a href="tel:+33777260734">07 77 26 07 34</a></p>' : ''}</section>
    <section class="faq-panel"><h2>Questions fréquentes</h2>${data.faq.map(([question, answer]) => `<details><summary>${escape(question)}${icon('Plus')}</summary><p>${escape(answer)}</p></details>`).join('')}<a class="text-action" href="../documentation/index.html">Consulter la documentation ${icon('ArrowRight')}</a></section></div>` });
}

for (const [id, title, introduction, target] of [
  ['documentation', 'La documentation.', 'Les guides pratiques et les ressources techniques, pour chaque application.', 'documentation'],
  ['support', 'Comment pouvons-nous vous aider ?', 'Choisissez votre application pour consulter les questions fréquentes ou contacter son support.', 'support'],
  ['confidentialite', 'Votre confidentialité.', 'Une politique distincte par application. Retrouvez les informations qui vous concernent.', 'confidentialite'],
  ['conditions', 'Conditions générales de vente.', 'Les conditions des achats intégrés, par application. Le site ne vend aucun produit directement.', 'conditions'],
]) {
  const websiteBlocks = [
    ['Données de navigation', 'Ce site n’utilise ni compte, ni formulaire de collecte, ni publicité, ni outil de mesure d’audience. Les polices et images sont servies localement. Aucun cookie n’est déposé par le code de ce site.'],
    ['Hébergement et journaux techniques', 'Le site est hébergé avec Cloudflare Pages ; le domaine est enregistré chez OVHcloud. L’hébergeur peut traiter l’adresse IP, la date, les pages demandées et des informations techniques afin de servir les pages et de sécuriser le service. La durée de conservation de ses journaux, la base juridique et les informations applicables aux traitements et transferts doivent être confirmées avant validation définitive de cette politique.'],
    ['E-mails et liens externes', 'Si vous contactez le support par e-mail, les informations que vous transmettez servent à traiter votre demande. N’envoyez que les données utiles. Les liens Apple, Google et GitHub vous dirigent vers des services régis par leurs propres politiques. Pour une question sur ce site, écrivez à aurelienleleu.pro@gmail.com.'],
  ];
  await page({ path: `${id}/index.html`, title, description: introduction, active: id, draft: id === 'conditions', body: `<section class="container hub-head"><p class="eyebrow">BTBU / ${escape(id === 'support' ? 'ASSISTANCE' : id.toUpperCase())}</p><h1>${escape(title)}</h1><p class="lead">${escape(introduction)}</p>${id === 'conditions' ? '<div class="notice warning"><strong>CGV provisoires : informations éditeur et médiation à compléter avant publication définitive.</strong></div>' : ''}</section><section class="container hub-grid" aria-label="Choisir une application">${apps.map(app => `<a class="hub-item" href="../${destination(app, target)}">${appImage(app, '../')}<div><p class="eyebrow">${escape(app.category)}</p><h2>${escape(app.name)}</h2><p>${escape(sections.find(item => item.id === target).label)}</p></div>${icon('ArrowUpRight')}</a>`).join('')}</section>${id === 'confidentialite' ? `<article class="container website-privacy"><p class="eyebrow">LE SITE WEB</p><h2>Et sur ce site ?</h2>${contentBlocks(websiteBlocks)}</article>` : ''}` });
}
await page({ path: 'mentions-legales/index.html', title: 'Mentions légales', description: 'Informations sur l’éditeur du site BTBU et les éléments à confirmer avant publication.', draft: true, body: `<article class="container legal-page"><p class="eyebrow">BTBU / INFORMATIONS LÉGALES</p><h1>Mentions légales</h1><div class="notice warning">${icon('Info')}<div><strong>Informations à compléter avant publication</strong><p>L’identification professionnelle de l’éditeur et les coordonnées légales complètes de l’hébergeur doivent être confirmées. Les mentions ci-dessous sont provisoires.</p></div></div>${contentBlocks([
  ['Éditeur', 'Marque : BTBU · Built To Be Used. Contact identifié dans les dépôts : Aurélien LELEU. E-mail : aurelienleleu.pro@gmail.com. Téléphone : 07 77 26 07 34.'],
  ['Adresse du site', `${siteUrl} · Nom de domaine enregistré chez OVHcloud.`],
  ['Identification professionnelle', 'À compléter selon le statut de l’éditeur : raison sociale ou nom professionnel, forme juridique, adresse de l’établissement, immatriculation applicable, numéro de TVA le cas échéant et directeur de la publication. Aucune de ces informations manquantes n’est présumée.'],
  ['Hébergement', 'Plateforme d’hébergement : Cloudflare Pages. La dénomination légale, l’adresse et les coordonnées de l’entité hébergeuse applicables au service doivent être vérifiées et ajoutées. OVHcloud fournit le nom de domaine, pas l’hébergement de ce site.'],
  ['Propriété intellectuelle', `${apps.map(app => app.name).join(', ')} sont les applications présentées sur ce site. Les contenus et éléments graphiques restent soumis aux droits de leurs titulaires. Les licences applicables au code sont précisées dans les dépôts respectifs.`],
  ['Protection des données et achats', 'Les politiques de confidentialité et conditions de vente sont accessibles séparément pour chaque application. Les achats iOS sont effectués auprès de l’App Store, pas sur ce site.'],
])}<p><a href="../confidentialite/index.html">Confidentialité</a> · <a href="../conditions/index.html">Conditions de vente</a> · <a href="../support/index.html">Contacter le support</a></p></article>` });
await page({ path: '404.html', title: 'Page introuvable', description: 'Cette page n’existe pas. Retrouvez les applications et le support BTBU.', draft: true, body: `<section class="container not-found"><p class="eyebrow">ERREUR 404</p><h1>Rien par ici.</h1><p class="lead">Cette page n’existe pas ou a changé d’adresse.</p><a class="button primary" href="index.html">${icon('ArrowLeft')}Retour aux applications</a></section>` });

await writeFile(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
await writeFile(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${siteUrl ? pages.filter(item => !item.draft).map(item => `<url><loc>${escape(`${siteUrl}/${item.path.replace(/index\.html$/, '')}`)}</loc></url>`).join('') : ''}</urlset>`);
for (const name of ['.htaccess', '_headers']) await copyFile(resolve(root, 'src', name), resolve(output, name));
console.log(`${pages.length} pages générées dans ${relative(root, output).split(sep).join('/')}/. ${siteUrl ? `Domaine : ${siteUrl}` : 'SITE_URL non défini : liens canoniques et sitemap à activer avant mise en ligne.'}`);
