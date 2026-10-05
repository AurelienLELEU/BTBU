# BTBU · Built To Be Used

Site commun de CashDraft et Idle Crystal Corp. Il reprend les informations publiques des deux dépôts, avec un accueil commun, une présentation de chaque application, des guides utilisateurs, une assistance et des pages légales séparées.

Le site est statique : aucun serveur Node.js, base de données ou compte utilisateur n’est nécessaire en production. Les polices, images et icônes sont locales. Le site ne charge aucun outil publicitaire ou d’analyse et ne dépose aucun cookie. Les publicités AdMob concernent uniquement le jeu, pas le site.

## Voir le site

Ouvrir [l’accueil généré](dist/index.html) dans un navigateur. Toutes les pages et la navigation fonctionnent sans serveur. Le dossier `dist/` contient la version livrable déjà générée.

## Modifier et reconstruire

Node.js 20.9 ou plus récent est nécessaire pour la génération uniquement. Depuis ce dossier :

```powershell
npm ci
npm run build
npm test
```

Les descriptions, contacts, politiques de confidentialité, guides et textes de vente sont dans [src/content.mjs](src/content.mjs). Les mises en page sont dans [scripts/build.mjs](scripts/build.mjs), les styles dans [src/styles.css](src/styles.css) et le bouton d’impression dans [src/site.js](src/site.js). Ne pas modifier directement le HTML de `dist/` : il est remplacé à la génération.

Les images d’origine sont conservées dans `assets/`. La première génération les importe depuis les dépôts voisins ; elles sont désormais présentes dans ce dossier, ce qui rend les générations suivantes indépendantes de ces dépôts. Sharp génère les versions WebP. Lucide fournit les icônes et Fontsource les polices DM Sans et Space Grotesk.

## Avant publication

Les **CGV et mentions légales sont provisoires**, signalées dans les pages et exclues de l’indexation par `noindex`. Elles n’existaient pas dans les GitHub Pages fournis. Elles ne doivent pas être considérées comme juridiquement validées. Compléter le statut de l’éditeur, son adresse professionnelle, son immatriculation et sa TVA le cas échéant, le directeur de la publication et les coordonnées du médiateur de la consommation si applicable. Faire vérifier leur adéquation au statut réel de l’éditeur, aux offres et aux territoires de distribution avant de retirer les avertissements.

La partie concernant le site dans [la confidentialité](dist/confidentialite/index.html) doit aussi être confirmée : identité de l’hébergeur, journaux techniques, durée de conservation et base juridique. Le nom de domaine enregistré chez OVHcloud ne permet pas de déduire qui héberge le site.

Les politiques des applications conservent les dates d’origine : 2 octobre 2026 pour CashDraft et 30 septembre 2026 pour Idle Crystal Corp. Les deux e-mails de support sont conservés séparément. Aucun tarif, lien App Store, identifiant d’entreprise ou adresse non fourni n’a été inventé. Les conditions Apple au moment de l’achat font référence pour les prix. Aucun achat n’est proposé sur le site.

## Publier avec Cloudflare Pages

Configuration retenue : dépôt GitHub privé `AurelienLELEU/BTBU`, site public sur `https://btbu.aurelienleleu.fr`, domaine et DNS conservés chez OVHcloud. Aucun hébergement web OVH n’est nécessaire. Le dépôt contient uniquement ce projet ; sa racine correspond donc au dossier WebSite local.

Dans Cloudflare, utiliser **Workers & Pages → Create application → Continue to Pages → Connect to Git**, puis sélectionner `AurelienLELEU/BTBU`. Ne pas utiliser le formulaire « Configure your Worker project », qui appartient au parcours Workers.

Dans le formulaire Pages, choisir les paramètres suivants :

| Paramètre | Valeur |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm test` |
| Build output directory | `dist` |
| Root directory | vide, racine du dépôt |
| Environment variable `NODE_VERSION` | `22` |
| Environment variable `SITE_URL` | `https://btbu.aurelienleleu.fr` |

Cloudflare installe les dépendances avant le build. `npm test` génère les pages puis bloque la publication si les tests échouent. Les prévisualisations sont facultatives ; elles peuvent être protégées avec Cloudflare Access. Le site de production doit rester public pour rendre les pages de support et légales accessibles aux utilisateurs et aux stores. Ne pas activer Cloudflare Web Analytics sans revoir la politique de confidentialité.

Après le premier déploiement, ajouter `btbu.aurelienleleu.fr` dans **Custom domains → Set up a domain** du projet Pages. Ensuite, dans la zone DNS OVH, ajouter un **CNAME** nommé `btbu` vers l’adresse exacte du projet fournie par Cloudflare, de la forme `nom-du-projet.pages.dev`. Ne pas mettre `https://` ni de chemin dans la cible DNS. Ne pas modifier les serveurs DNS, les enregistrements du domaine racine ni la messagerie pour cette opération. Cloudflare gère le certificat HTTPS du sous-domaine.

Le fichier [src/_headers](src/_headers), copié vers `dist/_headers`, configure les en-têtes de sécurité sur Cloudflare Pages. Le fichier Apache `.htaccess` est conservé pour un éventuel autre hébergement, mais n’est pas utilisé par Pages. La page `404.html` à la racine est utilisée par Pages pour les URL inexistantes.

Le site est généré par défaut pour `https://btbu.aurelienleleu.fr`, y compris les URL canoniques, le sitemap et les métadonnées de partage. La variable `SITE_URL` permet de changer cette adresse. Les réglages de compte Cloudflare, le domaine personnalisé, le certificat et les DNS doivent être confirmés dans leurs panneaux respectifs ; ils ne sont pas activés par un simple push Git.

## Autre option : hébergement OVHcloud

Un domaine acheté seul ne fournit pas nécessairement un hébergement web. Il faut un hébergement statique ou un hébergement web OVHcloud avec accès FTP/SFTP, ou un autre hébergeur auquel faire pointer le domaine.

1. Dans le panneau OVHcloud, vérifier l’hébergement retenu et ajouter le domaine et éventuellement `www` dans la configuration multisite. Choisir le répertoire racine du site et activer le certificat SSL pour les noms utilisés.
2. Configurer la zone DNS selon les valeurs **fournies par cet hébergement** : généralement un enregistrement A pour le domaine racine, un AAAA seulement si une adresse IPv6 est fournie, et un CNAME ou les enregistrements demandés pour `www`. Ne pas modifier les enregistrements MX/TXT utilisés pour la messagerie.
3. Choisir le domaine HTTPS principal. Depuis ce dossier, générer avec sa véritable adresse :

```powershell
$env:SITE_URL = "https://btbu.aurelienleleu.fr"
npm test
```

`SITE_URL` remplace le domaine par défaut dans les liens canoniques, les métadonnées de partage et les adresses du sitemap. Ce projet prévoit une publication à la racine du domaine ou sous-domaine, pas dans un sous-dossier.

4. Transférer **le contenu de `dist/`**, y compris le fichier caché `.htaccess`, dans le répertoire racine configuré de l’hébergement. Ne pas transférer `node_modules/`, les sources ni les dépôts d’applications. Ne pas supprimer un autre site présent sans vérifier sa destination.
5. Après activation effective du certificat, activer la redirection vers HTTPS et vers le nom de domaine principal dans l’hébergement. Tester le domaine et `www`, l’ouverture directe des pages ci-dessous, les polices/images, les e-mails de support et une URL inexistante. [src/.htaccess](src/.htaccess) prévoit les en-têtes de sécurité et une page 404 pour Apache ; sur un autre serveur, configurer leurs équivalents. Ces réglages serveur ne sont pas vérifiables depuis l’aperçu local.

Le fichier `package-lock.json` fixe les dépendances de génération. Les dépendances npm ne sont pas utilisées par l’hébergement en production.

## URL des applications

Pour CashDraft :

```text
/cashdraft/
/cashdraft/documentation/
/cashdraft/support/
/cashdraft/confidentialite/
/cashdraft/conditions/
```

Pour Idle Crystal Corp :

```text
/idle-crystal-corp/
/idle-crystal-corp/documentation/
/idle-crystal-corp/support/
/idle-crystal-corp/confidentialite/
/idle-crystal-corp/conditions/
```

Les pages communes sont `/documentation/`, `/support/`, `/confidentialite/`, `/conditions/` et `/mentions-legales/`. Chaque répertoire contient un `index.html`, ce qui permet aussi les URL explicites se terminant par ce nom de fichier.

## Migrer les GitHub Pages

Après publication et vérification, renseigner les nouvelles URL de support et de confidentialité dans App Store Connect et dans les réglages des applications qui pointent actuellement sur GitHub Pages. Mettre à jour les liens publics des README et les autres fiches de distribution. Garder les anciens GitHub Pages accessibles pendant la transition et y ajouter des liens ou des redirections HTML vers les pages équivalentes du domaine définitif : GitHub Pages ne fournit pas de configuration Apache permettant des redirections HTTP 301 via `.htaccess`.

Les projets CashDraft et IdleCrystalCorp n’ont pas été modifiés. Après activation du site, les anciennes pages pourront pointer vers `https://btbu.aurelienleleu.fr/cashdraft/` et `https://btbu.aurelienleleu.fr/idle-crystal-corp/`. Les détails techniques de développement restent dans les README originaux, accessibles depuis les guides utilisateurs.

## Vérifications

`npm test` reconstruit les 17 pages et vérifie les liens internes, ancres, ressources, contacts distincts, éléments essentiels des politiques et avertissements juridiques. Les tests sont dans [tests/site.test.mjs](tests/site.test.mjs).

Une vérification navigateur a été réalisée sur les 17 pages aux largeurs 320, 390 et 1440 pixels : aucune image manquante, aucun débordement horizontal et aucun titre ou lien tronqué détecté. Les FAQ s’ouvrent nativement, les ressources locales se chargent et le bouton d’impression utilise la fonction du navigateur. Cela ne remplace pas la recette sur l’hébergement final, ni la validation juridique des textes.