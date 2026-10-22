# Ajouter une application au site

Le site est généré à partir du registre `apps` et de l’objet `documents` dans `src/content.mjs`. Le rendu des cartes, pages de présentation, hubs et pages partagées doit rester piloté par des données descriptives, et non par des conditions sur `app.id`. Un nouvel identifiant ne doit nécessiter aucune branche spéciale dans `scripts/build.mjs`.

## Descripteur d’application

Chaque entrée de `apps` fournit les champs suivants :

| Champ | Rôle |
| --- | --- |
| `id` | Identifiant stable utilisé dans les chemins (`/id/`) et la clé correspondante de `documents`. Minuscules et tirets, sans espaces. |
| `name`, `category` | Nom affiché et catégorie de l’application. |
| `platform`, `platformIcon` | Plateforme ou état de développement, et nom d’icône Lucide. |
| `tagline`, `description` | Résumé et description factuels, sans disponibilité, prix ou capacité non vérifiés. |
| `email`, `repository`, `support`, `repositoryPublic` | Contact et URLs HTTPS vers le dépôt et le support. `repositoryPublic` est obligatoire et contrôle l’affichage des liens vers le dépôt, la documentation technique et les tickets. Si faux, le dépôt peut rester dans les données internes mais aucune page publique ne doit l’exposer. |
| `iconAsset` | Nom du fichier d’icône rendu dans les pages, sous `dist/assets/`. |
| `assets` | Liste des sources locales `{ source, output, width }`; le build produit les images WebP. Les chemins source restent sous `assets/`, les sorties sont des noms de fichiers sans chemin. Un `sourceFallback` n’est accepté qu’avec `allowSourceFallback: true`, et lui aussi doit rester sous `assets/`. |
| `card` | Présentation de la carte d’accueil : `{ kind: 'icon-caption'|'image', icon, background, captionColor?, caption?, image?, imageAlt?, imageFit? }`. Pour `kind: 'image'`, préciser `image` et `imageAlt`; `imageFit` vaut `cover` (défaut) ou `contain`. |
| `pageVisual` | `null`, ou visuel de page `{ kind:'image', className, image, width, height, alt }`, ou capture ` { kind:'screenshot', className, heading, eyebrow, image, width, height, alt }`. Les classes ne doivent être utilisées que si le style correspondant est générique et documenté dans `src/styles.css`. |
| `featuresHeading`, `features` | Titre et liste de fonctions, chaque élément étant `[icon, title, text]`. |
| `documentationIntro` | Introduction du guide. |
| `privacyLinks` | Liens externes d’information des prestataires sous forme de paires `[label, url]`; une liste vide est valide. |
| `offers` | Objet `{ appleLinks, summary, subscription?, restoration? }`. `appleLinks` indique si la page de conditions doit présenter les liens Apple d’achat/remboursement. Pour un projet sans offre annoncée, choisir `false` : la page générée décrit alors explicitement l’absence d’offre, sans langage de commande ou de paiement. |
| `highlights` | Courtes étiquettes descriptives pour la carte d’accueil. |

Champs facultatifs pris en charge : `documentationUrl` (au lieu du README du dépôt), `supportPhone: { label, href }`, `supportDraft`, `supportNote`, `privacyDraft`, `privacyDate` et `status: { label, note }`. `status` est affiché sur la carte et la présentation. Utiliser ces indicateurs lorsque le texte est provisoire ou que le produit est en développement ; les pages provisoires sont exclues de l’indexation selon les règles du générateur.

Les textes de page configurables sont `privacyIntro`, `conditionsIntro`, `conditionsTitle`, `conditionsNotice`, `conditionsNoticeTitle`, `supportIntro`, `supportDescription` et `supportGuidance`. Ils évitent de faire supposer à une fiche qu’elle a déjà des achats, des tarifs ou un support par ticket. La validation de schéma et des URLs est centralisée dans `src/validate-apps.mjs` et exécutée avant que le build n’écrive les fichiers.

## Contenus et pages produites

Créer `documents[id]` pour chaque entrée avec les trois collections :

- `documentation`: tableaux `[titre, paragraphe, ...]` pour les sections du guide ;
- `confidentialite`: mêmes tableaux pour les usages de données et les services tiers ;
- `faq`: paires `[question, réponse]` pour l’assistance.

La page `conditions` est construite par `salesTerms(app)` à partir de `offers`. Les contenus doivent distinguer le stockage local des transmissions réseau, nommer les prestataires réellement utilisés et éviter de prétendre que toute l’application fonctionne hors ligne. N’annoncer ni tarif, disponibilité ou date sans confirmation. Les pages générées restent soumises à vérification éditoriale et juridique.

Chaque application reçoit les cinq routes `/{id}/`, `/{id}/documentation/`, `/{id}/support/`, `/{id}/confidentialite/` et `/{id}/conditions/`. Les pages communes, le sitemap, le pied de page et les hubs parcourent le registre automatiquement.

## Checklist

1. Ajouter un descripteur et les assets locaux dans `src/content.mjs` et `assets/`.
2. Ajouter `documents[id]` pour guide, confidentialité et FAQ ; vérifier chaque affirmation contre la version réelle du produit.
3. Vérifier les offres, les brouillons, les liens de politique prestataire, les contacts et les textes du support.
4. Ajouter des assertions de factualité spécifiques seulement si elles protègent une contrainte réelle; les tests génériques valident déjà la forme des descripteurs, des documents, slugs, URLs HTTPS, chemins d’assets et des cinq pages générées par application.
5. Exécuter `npm test`, examiner toutes les pages générées et faire une vérification visuelle responsive avant publication. `dist/` est produit : sauvegarder tout contenu local préexistant avant le build et ne pas éditer les pages générées à la main.

`MyPrivateMap` dans le registre fournit un exemple de projet en développement sans offre annoncée, avec statut, politique provisoire, liens réseau documentés et aucune promesse de disponibilité ou de fonctionnement intégral hors ligne.
