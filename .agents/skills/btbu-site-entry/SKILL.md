---
name: btbu-site-entry
description: "Créer ou mettre à jour une fiche application dans BTBU-Website avec sa structure commune, ses pages légales, ses assets et ses tests. Pas pour développer l'app mobile, refaire le site dans un autre framework ou déployer sans demande."
---

# Fiche application BTBU

1. Lire l'état Git, `README.md`, `docs/NEW_APP_ENTRY.md`, puis le descripteur et les validations du site. Préserver/sauvegarder les fichiers générés déjà modifiés avant un build.
2. Suivre `references/entry-contract.md`. Identifier nom, slug, plateforme, statut, fonctions réellement vérifiées, limites, flux de données, liens et droits des assets ; ne pas inventer URL App Store, témoignages ou disponibilité.
3. Ajouter le descripteur via le générateur commun. Si une variation produit manque, enrichir le schéma commun explicitement et tester tous les produits, sans introduire de branche implicite « autre app = StockChef ».
4. Utiliser la signature **BTBU — Built to Be Used**, les composants et styles existants. Conserver les couleurs de produit dans sa zone visuelle, pas un nouveau header/footer par app.
5. Générer et tester (`npm test` selon le README), contrôler routes/liens/métadonnées et vérifier visuellement desktop + mobile, clavier/grands textes pour la zone modifiée. Ne pas affirmer une vérification visuelle sans rendu observé.
6. Rapporter fichiers sources, pages générées, preuves, limites et état de publication distinct. Pas de push/déploiement automatique.
