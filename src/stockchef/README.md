# Catalogue StockChef

La source commune aux applications est [recipes.json](recipes.json). Modifier ce fichier dans le dépôt GitHub du site BTBU, pas le dossier généré `dist/` ni le catalogue de secours embarqué dans les applications.

Après validation et push sur la branche déployée par Cloudflare Pages, le site publie le fichier à `https://btbu.aurelienleleu.fr/stockchef/recipes.json`. Le dépôt GitHub peut rester privé : les applications téléchargent le fichier public du site, sans jeton GitHub. Aucune publication ou push automatique n'est effectué par les scripts locaux.

Les nouvelles versions iOS et Android vérifient ce catalogue à l'ouverture et au retour au premier plan, au maximum une tentative toutes les 15 minutes par session. Le cache HTTP du site dure 5 minutes. Ce n'est pas du push temps réel : une application fermée ou restant longtemps au premier plan recharge à sa prochaine ouverture ou activation. Si le téléchargement, la validation ou l'écriture du cache échoue, elle conserve le catalogue précédent. Sans cache, elle utilise les 19 recettes embarquées. Le téléchargement du catalogue n'envoie ni inventaire, ni photo, ni sauvegarde.

Une mise à jour initiale des applications est nécessaire pour installer cette fonctionnalité. Ensuite, ajouter ou modifier des recettes ne nécessite plus une nouvelle version de l'application, tant que le format reste identique.

## Ajouter une recette

Dupliquer un objet de `recipes`, puis modifier son titre, ses portions de base, son temps de préparation, ses instructions et ses ingrédients. Donner à la recette un nouveau UUID et à chaque ingrédient un UUID unique dans cette recette. Sous PowerShell : `[guid]::NewGuid().ToString()`. Garder ces UUID lors des corrections ultérieures, même en renommant la recette : ils servent notamment au planning. Ne pas changer `schemaVersion: 1`.

Toutes les propriétés montrées dans les recettes existantes sont obligatoires. `baseServings` : entier entre 1 et 100. `prepTimeMinutes` : entier entre 1 et 1440. `baseQuantity` : nombre positif jusqu'à 1 000 000, quantité pour les portions de base, pas pour une portion individuelle. `isPantryStaple` : booléen pour un fond de placard que le rapprochement du stock ne compte pas. Les estimations et les allergènes restent à vérifier par l'auteur.

Unités exactes : `g`, `kg`, `ml`, `L`, `unités`. Types de recette : `Entrées`, `Plats`, `Desserts`, `Encas & à emporter`. Régimes : `Végétarien`, `Vegan`, `Sans gluten`. Allergènes : `Gluten`, `Lait`, `Œuf`, `Poisson`, `Fruits à coque`, `Soja`, `Arachides`, `Céleri`, `Moutarde`, `Sésame`, `Sulfites`, `Lupin`, `Mollusques`, `Crustacés`. Les tableaux régimes et allergènes peuvent être vides, mais pas ingrédients ni instructions.

Utiliser des noms d'ingrédients proches des noms reconnus par le stock et les tickets : le rapprochement ne traduit pas des synonymes. Retirer une recette n'efface pas les repas déjà planifiés, qui conservent leur titre.

## Valider avant publication

```powershell
npm --prefix WebSite test
```

Le build bloque le JSON invalide, les doublons, les valeurs incompatibles et les fichiers dépassant 2 Mo. Maximum 1000 recettes, 100 ingrédients et 100 étapes par recette. Le flux doit être servi directement en HTTPS avec une réponse 200, pas une page HTML ou une redirection. Ne jamais y placer de données privées : ce catalogue est public.