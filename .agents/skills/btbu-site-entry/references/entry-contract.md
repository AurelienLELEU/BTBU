# Contrat d'une entrée application

Référence détaillée maintenue avec le générateur : `BTBU-Website/docs/NEW_APP_ENTRY.md` (ou `docs/NEW_APP_ENTRY.md` depuis ce dépôt). Lire le schéma de code actuel avant de modifier une entrée ; ne pas supposer une liste de champs figée dans ce skill.

Structure visible commune :

1. Carte dans le catalogue : icône, nom, promesse courte, statut, plateforme, tags, liens utiles.
2. Page app : header BTBU, navigation produit, titre/positionnement, CTA réel, plateforme/statut, fonctions, aperçu réel ou illustration explicitement nommée, limites, FAQ/support.
3. Pages sœurs : documentation, confidentialité, conditions et support, dans la même arborescence que les autres apps.
4. Footer partagé, mentions d'édition et liens légaux ; titres/descriptions/canonical et sitemap cohérents. Un brouillon légal reste indiqué comme tel et non indexé selon les règles existantes.

Le contenu est propre à l'app, la structure est commune. Ne pas copier politique de confidentialité, politique de prix ou conditions d'achat d'un produit à l'autre. Les informations inconnues restent « non disponible / à vérifier », sans nombres ni promesses inventés. Un dépôt privé n'est pas une documentation publique : privilégier les pages du site pour le lecteur non connecté.

Pour MyPrivateMap : stockage local de favoris/profils mais requêtes à des fournisseurs carto/recherche/routage/stations ; pas de claim « toutes les données ne quittent jamais le téléphone », ni disponibilité App Store, trafic Waze intégré ou couverture exhaustive de bornes.

Ajouter au minimum une assertion pour l'entrée catalogue, ses routes, ses CTA/statuts et ses points de confidentialité distinctifs. Vérifier l'absence de régression sur les entrées existantes. Copier une icône originale existante est préférable à générer un faux écran du produit.
