export const publisher = {
  brand: 'BTBU',
  name: 'Built To Be Used',
  author: 'Aur\u00e9lien LELEU',
  email: 'aurelienleleu.pro@gmail.com',
};

export const apps = [
  {
    id: 'cashdraft',
    name: 'CashDraft',
    category: 'Devis & facturation',
    platform: 'iOS 17+ / Mac Catalyst',
    tagline: 'Votre travail. Vos factures. Vos donn\u00e9es.',
    description: 'Devis et factures pour les ind\u00e9pendants fran\u00e7ais. Une application locale, sans compte obligatoire, avec des sauvegardes sous votre contr\u00f4le.',
    email: 'aurelienleleu.pro@gmail.com',
    repository: 'https://github.com/AurelienLELEU/CashDraft',
    support: 'https://github.com/AurelienLELEU/CashDraft/issues/new/choose',
    privacyDate: '2 octobre 2026',
    highlights: ['Donn\u00e9es locales', 'Sans publicit\u00e9', 'iCloud facultatif'],
  },
  {
    id: 'idle-crystal-corp',
    name: 'Idle Crystal Corp',
    category: 'Jeu idle & strat\u00e9gie',
    platform: 'Projet mobile / ordinateur',
    tagline: 'Un cristal. Puis tout un empire.',
    description: 'R\u00e9coltez, automatisez et d\u00e9veloppez votre industrie cristalline. Un jeu incr\u00e9mental dont tout le contenu est accessible sans achat ni publicit\u00e9.',
    email: 'aurelien.leleu78@gmail.com',
    repository: 'https://github.com/AurelienLELEU/IdleCrystalCorp',
    support: 'https://github.com/AurelienLELEU/IdleCrystalCorp/issues/new',
    privacyDate: '30 septembre 2026',
    highlights: ['20 b\u00e2timents', 'Gains hors ligne', 'Achats facultatifs'],
  },
  {
    id: 'stockchef',
    name: 'StockChef',
    category: 'Cuisine & anti-gaspillage',
    platform: 'iPhone / iOS 16+',
    tagline: 'Vos courses. Votre stock. Votre prochain repas.',
    description: 'Scannez vos tickets, organisez vos aliments et trouvez des recettes avec ce que vous avez. OCR local, planning de repas et liste de courses, sans compte utilisateur.',
    email: publisher.email,
    repository: 'https://github.com/AurelienLELEU/StockChef',
    documentationUrl: 'https://github.com/AurelienLELEU/StockChef/blob/HEAD/01_app/implementation.md',
    support: 'https://github.com/AurelienLELEU/StockChef/issues/new',
    supportDraft: true,
    privacyDraft: true,
    privacyDate: '6 octobre 2026',
    highlights: ['OCR hors ligne', 'Stock & recettes', 'Sauvegardes chiffrées'],
  },
];

export const sections = [
  { id: 'index', label: 'Pr\u00e9sentation', icon: 'LayoutGrid' },
  { id: 'documentation', label: 'Documentation', icon: 'BookOpen' },
  { id: 'support', label: 'Assistance', icon: 'LifeBuoy' },
  { id: 'confidentialite', label: 'Confidentialit\u00e9', icon: 'ShieldCheck' },
  { id: 'conditions', label: 'Conditions de vente', icon: 'FileText' },
];

export const documents = {
  cashdraft: {
    documentation: [
      ['Configurer votre activité', 'Renseignez votre profil entreprise et vos informations professionnelles dans les réglages. Vérifiez les mentions, coordonnées et règles de TVA applicables à votre activité avant d’émettre un document. CashDraft est un outil de facturation, pas un conseil comptable ou juridique.'],
      ['Créer un devis ou une facture', 'Ajoutez votre client puis créez un document. Renseignez les prestations, quantités, prix et TVA, et vérifiez l’aperçu PDF avant l’émission. Les brouillons restent accessibles gratuitement ; un crédit est utilisé uniquement lors de la première émission d’un document dans la formule à crédits.'],
      ['Partager vos documents', 'Utilisez le partage PDF de l’application pour envoyer ou conserver un document. Le partage est déclenché par vous : aucun serveur CashDraft ne reçoit automatiquement vos factures.'],
      ['Sauvegarder vos données', 'Dans les réglages, utilisez « Exporter mes données » pour conserver une sauvegarde JSON dans un emplacement que vous contrôlez. Conservez régulièrement une copie hors de l’appareil. Le journal comptable peut également être exporté au format CSV.'],
      ['Importer une sauvegarde', 'Utilisez « Importer une sauvegarde » dans les réglages. Examinez l’aperçu avant de confirmer : l’import remplace les données actuellement présentes sur cet appareil. Exportez d’abord les données existantes si vous souhaitez les conserver.'],
      ['Activer iCloud avec Studio', 'La synchronisation iCloud est facultative et disponible avec CashDraft Studio. Lorsqu’elle est activée, une sauvegarde chiffrée est conservée dans votre espace iCloud privé via Apple CloudKit. BTBU n’accède pas à cette base privée.'],
      ['Comprendre les formules', 'Le pack de 20 crédits permet 20 émissions de documents. Pro Lifetime donne accès aux documents de base illimités. Studio est un abonnement mensuel ou annuel qui inclut notamment les fonctions avancées et iCloud. Les prix et conditions présentés par l’App Store au moment de l’achat font référence.'],
      ['Restaurer vos achats', 'Utilisez « Restaurer mes achats » dans l’écran des offres avec le compte Apple ayant effectué l’achat. Pro Lifetime est restaurable ; les abonnements dépendent de leur validité. Apple ne restaure pas les packs de crédits consommables sur un nouvel appareil. Les droits et crédits restants sont conservés dans le trousseau sur le même iPhone, sans constituer une garantie de transfert entre appareils.'],
    ],
    confidentialite: [
      ['Principe', 'CashDraft est une application de facturation locale. L’application ne crée pas de compte CashDraft et BTBU n’exploite aucun serveur recevant vos documents, clients, factures ou coordonnées professionnelles.'],
      ['Données sur l’appareil', 'Le profil entreprise, les clients, documents, lignes de facture, pièces jointes et réglages sont conservés dans le stockage local de l’appareil. Vous contrôlez les exports et importations de sauvegarde.'],
      ['Synchronisation iCloud facultative', 'Si vous activez CashDraft Studio et choisissez la synchronisation iCloud, l’application enregistre une sauvegarde chiffrée dans votre espace iCloud privé, associé à votre identifiant Apple. Cette fonction est fournie par Apple CloudKit ; BTBU n’accède pas à cette base privée.'],
      ['Achats', 'Les achats intégrés et abonnements sont traités par Apple via StoreKit. CashDraft reçoit les droits d’achat nécessaires au fonctionnement de l’application, mais ne collecte pas vos coordonnées de paiement.'],
      ['Suivi et publicité', 'CashDraft n’intègre ni publicité, ni analyse comportementale, ni traqueur tiers.'],
      ['Nous contacter', 'Pour une demande liée à la confidentialité, écrivez à aurelienleleu.pro@gmail.com ou utilisez le dépôt officiel en évitant toute donnée personnelle ou document sensible dans un ticket public. Contact : Aurélien LELEU · 07 77 26 07 34.'],
    ],
    faq: [
      ['Mes factures sont-elles envoyées à BTBU ?', 'Non. Vos données métier restent sur votre appareil. Seuls les exports et partages que vous choisissez, et la synchronisation iCloud facultative, transmettent vos données aux destinations concernées.'],
      ['Puis-je retrouver mes crédits sur un nouvel iPhone ?', 'Apple ne restaure pas les consommables sur un nouvel appareil. Ne confondez pas une sauvegarde des données métier avec une restauration des crédits. Pro Lifetime et les abonnements éligibles se restaurent via Apple.'],
      ['Un import va-t-il fusionner mes factures ?', 'Non : l’import d’une sauvegarde remplace les données de l’appareil. Exportez vos données actuelles avant de confirmer.'],
    ],
  },
  'idle-crystal-corp': {
    documentation: [
      ['Vos premiers cristaux', 'Récoltez des cristaux puis investissez-les dans des bâtiments pour automatiser votre production. Le jeu comprend 20 bâtiments, 10 améliorations de clic, 17 technologies et 31 succès.'],
      ['Développer votre production', 'Achetez des bâtiments, améliorez vos clics et débloquez les technologies. Les recherches étendent notamment certaines capacités de progression hors ligne.'],
      ['Collecter les gains hors ligne', 'Votre production continue à être calculée pendant votre absence. À votre retour, la fenêtre de gains vous permet de collecter le montant affiché ou de remettre la collecte à plus tard. Le plafond initial est de deux heures ; certaines technologies l’augmentent.'],
      ['Comprendre l’ascension', 'L’ascension devient disponible à partir d’un milliard de cristaux cumulés. Elle accorde des Éclats d’Éternité, apportant chacun un bonus permanent de production de 1 %. Les recherches sont remises à zéro ; les améliorations de clic sont conservées. Examinez la confirmation dans le jeu avant de lancer une ascension.'],
      ['Publicités et récompenses', 'Les annonces récompensées sont facultatives. Elles peuvent doubler les gains hors ligne ou offrir des bonus, avec des plafonds quotidiens. En l’absence d’annonce disponible, vous pouvez continuer à jouer normalement. Tout le contenu reste accessible sans publicité ni achat.'],
      ['Achats et restauration', 'Les achats consommables sont appliqués après confirmation par l’App Store. Les non-consommables se restaurent depuis « Boutique → Restaurer mes achats ». Si un achat n’est pas appliqué, ne le rachetez pas : contactez le support avec le reçu Apple correspondant.'],
      ['Préférences publicitaires et rappels', 'Les réglages proposent « Préférences publicitaires » lorsque requis pour modifier votre consentement. Les rappels sont des notifications locales soumises à votre autorisation ; vous pouvez également gérer cette autorisation dans les réglages de votre appareil.'],
      ['Préserver votre progression', 'La partie est sauvegardée localement, sans compte joueur. Ne désinstallez pas le jeu pour résoudre un problème avant d’avoir contacté le support : la suppression de l’application peut supprimer votre progression. Aucun transfert entre appareils n’est promis.'],
    ],
    confidentialite: [
      ['Responsable', 'Idle Crystal Corp est édité par Aurélien LELEU. Pour toute question relative à cette politique ou à vos données, contactez-nous à aurelien.leleu78@gmail.com.'],
      ['Données du jeu', 'Le jeu ne demande pas la création d’un compte joueur. Votre progression est enregistrée localement sur votre appareil afin de conserver votre partie et de calculer les gains hors ligne.'],
      ['Publicités récompensées', 'Le jeu peut afficher des publicités facultatives fournies par Google Mobile Ads/AdMob. Google et ses partenaires peuvent traiter des données techniques et publicitaires telles que des identifiants d’appareil lorsqu’ils sont disponibles, l’adresse IP et une localisation approximative, les informations sur l’appareil, les interactions avec une annonce et les données de diagnostic.', 'Ces données servent à diffuser et mesurer les annonces, prévenir la fraude et appliquer une limitation de fréquence. L’application demande explicitement un traitement non personnalisé : elle n’utilise pas de publicité comportementale fondée sur l’activité passée. Les annonces récompensées sont facultatives et ne sont jamais nécessaires pour jouer.', 'Lorsque la réglementation l’exige, l’application demande et applique vos choix de consentement avant de demander des annonces. L’entrée « Préférences publicitaires » des réglages permet de modifier ces choix lorsqu’elle est requise.'],
      ['Achats intégrés', 'Les achats intégrés sont traités par Apple via l’App Store et StoreKit. Nous ne recevons pas votre numéro de carte bancaire. Apple traite les données nécessaires au paiement, à la prévention de la fraude, à la validation des achats et à la restauration des achats non consommables.'],
      ['Notifications locales', 'Avec votre autorisation, l’application peut programmer un rappel local après une période d’absence. Ce rappel est programmé et annulé sur l’appareil ; ce n’est pas une notification push distante et aucun jeton APNs n’est utilisé.'],
      ['Partage, conservation et droits', 'Nous ne vendons pas directement vos données personnelles. Apple traite les achats et Google/AdMob traite les données nécessaires aux publicités dans les conditions décrites ci-dessus. La progression locale reste sur votre appareil jusqu’à sa suppression, la désinstallation de l’application ou les mécanismes iOS applicables.', 'Selon votre lieu de résidence, vous pouvez disposer de droits d’accès, de rectification, d’effacement, de limitation, d’opposition ou de portabilité. Pour exercer un droit ou poser une question, écrivez à aurelien.leleu78@gmail.com.'],
      ['Modifications', 'Cette politique peut être mise à jour pour refléter l’évolution de l’application, de ses prestataires ou de la réglementation. La date de mise à jour figurant en haut de page sera alors modifiée.'],
    ],
    faq: [
      ['Faut-il payer ou regarder des publicités pour avancer ?', 'Non. Tous les contenus sont accessibles sans achat ni publicité. Les achats et annonces récompensées servent uniquement à accélérer la progression.'],
      ['Mon achat n’apparaît pas. Que faire ?', 'Ne l’achetez pas une seconde fois. Pour un non-consommable, essayez « Boutique → Restaurer mes achats ». Contactez ensuite le support avec le reçu Apple correspondant, en masquant les informations inutiles.'],
      ['Puis-je jouer sur plusieurs appareils avec la même partie ?', 'La sauvegarde est locale et aucun compte joueur n’est requis. La synchronisation de progression entre appareils n’est pas annoncée.'],
      ['Aucune publicité n’est disponible. Est-ce bloquant ?', 'Non. La disponibilité dépend du fournisseur et des plafonds quotidiens. Vous pouvez continuer à jouer sans annonce.'],
    ],
  },
};

documents.stockchef = {
  documentation: [
    ['Scanner un ticket', 'Photographiez un ticket net, posé à plat et bien éclairé, ou choisissez une photo avec le sélecteur de l’application. Ajustez le cadre de recadrage avant l’analyse. L’OCR utilise Apple Vision sur l’iPhone, sans envoyer votre photo à un serveur.'],
    ['Vérifier les aliments reconnus', 'Relisez et corrigez chaque ligne avant son ajout au stock. Les abréviations varient selon les enseignes et le dictionnaire local ne reconnaît pas tous les aliments. Ajoutez manuellement les produits manquants ; les lignes ménagères, totaux et réductions sont écartés.'],
    ['Organiser votre inventaire', 'Classez les aliments dans le frigo, le congélateur ou le placard. Corrigez les quantités et les dates et ajoutez vos restes. Les estimations de péremption et les rappels sont des aides : ils ne garantissent pas la sécurité alimentaire et ne remplacent pas les indications du fabricant.'],
    ['Choisir une recette et planifier', 'Le catalogue possède 19 recettes embarquées en secours. Les nouvelles versions de StockChef mettent le catalogue à jour depuis le site BTBU et conservent les dernières recettes valides en cache pour une consultation hors ligne. Choisissez le nombre de convives pour adapter les quantités et planifiez vos déjeuners ou dîners. Après la cuisine, confirmez le débit des ingrédients de votre stock. Vérifiez vous-même les ingrédients, allergènes et contraintes alimentaires.'],
    ['Gérer les courses', 'Utilisez la liste de courses pour suivre les aliments à acheter. L’inventaire, la liste de courses et le planning sont enregistrés localement dans l’application.'],
    ['Exporter une sauvegarde', 'Dans Réglages → Sauvegarde, choisissez « Exporter mon inventaire JSON » pour un fichier portable non chiffré, ou « Exporter une sauvegarde chiffrée » après avoir saisi un mot de passe d’au moins huit caractères. Conservez une copie dans un emplacement que vous contrôlez. Le mot de passe n’est pas mémorisé : sans lui, la sauvegarde chiffrée ne peut pas être restaurée.'],
    ['Restaurer sans perdre vos données actuelles', 'Exportez vos données actuelles avant de restaurer une sauvegarde JSON ou chiffrée. L’import remplace l’inventaire, la liste de courses et le planning présents sur l’appareil ; il ne les fusionne pas. Une sauvegarde métier ne transfère pas automatiquement les crédits de scans.'],
    ['Achats et restauration', 'Les offres prévues sont une recharge consommable de 20 scans et StockChef Pro Lifetime, une licence sans abonnement. Les offres disponibles et les prix confirmés par Apple au moment de l’achat font référence. Dans Réglages, « Restaurer mes achats » permet de retrouver Pro Lifetime avec le compte Apple de l’achat. Apple ne restaure pas les crédits consommables sur un autre appareil.'],
    ['Rappels et autorisations', 'Les rappels anti-gaspi et la caméra nécessitent votre autorisation iOS. Vous pouvez gérer ces permissions dans les réglages de l’iPhone. Les rappels sont locaux et ne nécessitent pas de compte StockChef.'],
  ],
  confidentialite: [
    ['Responsable et contact', 'StockChef est présenté par BTBU · Built To Be Used, Aurélien LELEU. Le contact BTBU proposé pour les demandes de confidentialité est aurelienleleu.pro@gmail.com ; il doit être confirmé par l’éditeur avant validation de cette politique.'],
    ['Fonctionnement local', 'StockChef ne demande pas de compte utilisateur. L’inventaire, la liste de courses, le planning, les recettes et les préférences sont traités ou conservés sur l’appareil. Les données métier sont stockées localement dans SQLite ; les crédits sont conservés dans le Trousseau iOS.'],
    ['Mises à jour des recettes', 'Les nouvelles versions iOS et Android téléchargent un catalogue JSON public depuis btbu.aurelienleleu.fr en HTTPS, à l’ouverture et au retour au premier plan. La requête ne contient ni inventaire, ni photo de ticket, ni sauvegarde. Le serveur hébergeant le site reçoit les informations techniques habituelles d’une connexion, notamment l’adresse IP ; aucune mesure d’audience n’est ajoutée par le chargeur. Un cache local conserve les dernières recettes valides pour fonctionner hors ligne.'],
    ['Photos, caméra et reconnaissance de texte', 'La caméra est soumise à votre autorisation iOS. Une photo peut également être sélectionnée avec PhotosPicker. Le recadrage et la reconnaissance de texte sont réalisés localement avec Apple Vision. StockChef ne téléverse pas automatiquement les photos de tickets vers un serveur.'],
    ['Sauvegardes et protection', 'Vous décidez de l’emplacement et du partage de vos exports. L’export JSON n’est pas chiffré par l’application. Un export chiffré par mot de passe est également proposé ; le mot de passe n’est pas mémorisé et doit être conservé par vous pour restaurer le fichier. La base locale bénéficie de la protection système d’iOS, sans chiffrement applicatif supplémentaire de la base SQLite.'],
    ['Achats intégrés', 'Les achats sont gérés par Apple via StoreKit. StockChef reçoit les informations nécessaires à la validation et à l’application des droits d’achat, mais pas vos coordonnées de carte bancaire. Apple traite les données de paiement selon ses propres conditions.'],
    ['Notifications et suivi', 'Les rappels anti-gaspi sont des notifications locales soumises à votre autorisation. StockChef n’intègre ni publicité, ni analytics, ni traqueur tiers. Les opérations Apple liées aux achats sont distinctes des données métier locales.'],
    ['Conservation et suppression', 'Vous pouvez supprimer des aliments, réinitialiser l’application ou exporter vos données. Les copies exportées restent dans les emplacements choisis jusqu’à leur suppression par vous. Une désinstallation peut supprimer les données locales ; les éléments du Trousseau suivent les mécanismes iOS et ne constituent pas une sauvegarde métier.'],
    ['Support et droits', 'Si vous transmettez volontairement un ticket ou une capture au support, vous transmettez aussi les informations qu’ils contiennent. Masquez les données inutiles et ne joignez aucune sauvegarde à un ticket GitHub public. Pour une question ou une demande relative à vos droits applicables, utilisez le contact BTBU indiqué ci-dessus.'],
  ],
  faq: [
    ['Pourquoi certains aliments ne sont-ils pas reconnus ?', 'Les abréviations dépendent des enseignes et le dictionnaire local est limité. Corrigez les lignes avant validation et ajoutez les aliments manquants manuellement.'],
    ['Mes tickets quittent-ils mon iPhone ?', 'Pas pour l’analyse : le recadrage et l’OCR sont locaux. Un envoi au support ou un partage de sauvegarde est une transmission que vous choisissez vous-même.'],
    ['Puis-je restaurer mes scans sur un autre iPhone ?', 'Apple ne restaure pas les crédits consommables sur un autre appareil. Pro Lifetime est restaurable avec le compte Apple ayant effectué l’achat ; une sauvegarde des données métier ne remplace pas la restauration des droits.'],
    ['Une restauration fusionne-t-elle les inventaires ?', 'Non. Elle remplace votre inventaire, votre liste de courses et votre planning. Exportez d’abord les données actuelles.'],
    ['J’ai oublié le mot de passe de ma sauvegarde.', 'Le mot de passe n’est pas mémorisé par l’application. Sans lui, la sauvegarde chiffrée ne peut pas être restaurée. Si vos données sont encore sur l’iPhone, vous pouvez créer un nouvel export avec un nouveau mot de passe.'],
  ],
};

export function salesTerms(app) {
  return [
    ['Objet et champ d’application', `Ces conditions décrivent les achats numériques proposés dans ${app.name}. Aucun achat ni paiement n’est effectué sur ce site. Les transactions de la version iOS sont réalisées dans l’application via l’App Store, sous réserve des conditions Apple et des droits impératifs applicables au consommateur.`],
    ['Éditeur et contact', `L’application est présentée par ${publisher.author}, sous la marque ${publisher.brand} (${publisher.name}). Pour toute question relative à un achat : ${app.email}. L’identité juridique complète, l’adresse professionnelle et les informations d’immatriculation de l’éditeur doivent être complétées et vérifiées avant publication définitive de ces conditions.`],
    ['Offres et prix', app.id === 'stockchef' ? 'Les offres prévues pour StockChef sont une recharge consommable de 20 scans et une licence non consommable StockChef Pro Lifetime, sans abonnement, pour les scans illimités et les fonctions Pro. Leur disponibilité, leur contenu, leur prix total et les territoires de distribution doivent être confirmés dans App Store Connect. Seules les offres et les conditions affichées dans l’application et par Apple avant confirmation font référence.' : app.id === 'cashdraft' ? 'CashDraft propose un pack consommable de 20 crédits d’émission, une licence non consommable Pro Lifetime pour les documents de base illimités et des abonnements Studio mensuel ou annuel. Le contenu exact, le prix total, la devise et, le cas échéant, la durée sont affichés dans l’application et par Apple avant confirmation. La licence Pro Lifetime ne comprend pas automatiquement les fonctions Studio.' : 'Idle Crystal Corp propose des achats facultatifs pour accélérer la progression et des droits non consommables lorsqu’ils sont proposés dans la boutique. Tout le contenu du jeu reste accessible sans achat. Le contenu exact, le prix total et la devise sont affichés dans la boutique et par Apple avant confirmation.'],
    ['Commande, paiement et délivrance', 'La commande est confirmée dans l’interface d’achat Apple. Apple traite le paiement et fournit le justificatif associé. Les droits ou éléments numériques sont appliqués après validation de la transaction. En cas de retard ou d’échec, ne renouvelez pas l’achat sans vérification et contactez le support. L’éditeur ne reçoit pas vos coordonnées de carte bancaire.'],
    ...(app.id === 'cashdraft' ? [['Abonnements Studio', 'Studio est proposé par abonnement mensuel ou annuel à renouvellement automatique, sauf résiliation dans les conditions indiquées par Apple. Vous pouvez gérer ou annuler votre abonnement dans les réglages de votre compte Apple. La désinstallation de l’application ne résilie pas un abonnement. Le prix, la période et les éventuelles offres d’essai affichés lors de la souscription font référence.']] : []),
    ['Restauration et consommables', app.id === 'stockchef' ? 'Pro Lifetime est restaurable depuis « Réglages → Restaurer mes achats », avec le compte Apple utilisé pour l’achat. Les crédits de scans sont des consommables conservés localement dans le Trousseau iOS ; Apple ne les restaure pas sur un autre appareil. Une sauvegarde d’inventaire, même chiffrée, ne garantit pas le transfert des crédits.' : app.id === 'cashdraft' ? 'La licence Pro Lifetime est restaurable avec le compte Apple utilisé pour l’achat. Les abonnements sont rétablis selon leur état de validité. Les crédits sont des consommables : Apple ne les restaure pas sur un nouvel appareil. Une sauvegarde des données métier ne constitue pas une garantie de transfert des crédits.' : 'Les non-consommables éligibles peuvent être restaurés depuis « Boutique → Restaurer mes achats », avec le compte Apple utilisé pour l’achat. Les consommables déjà délivrés ne sont pas restaurables comme une licence permanente. La progression reste enregistrée localement.'],
    ['Rétractation et remboursements', 'Les droits de rétractation et les éventuelles exceptions relatives aux contenus numériques dépendent du droit applicable et des consentements recueillis lors de l’achat. Aucune renonciation générale n’est présumée par ces conditions. Une demande de remboursement d’un achat Apple peut être déposée sur reportaproblem.apple.com ; Apple l’examine selon ses conditions, sans préjudice de vos droits légaux.'],
    ['Conformité et responsabilité', 'Les garanties légales applicables aux contenus et services numériques restent applicables. Ces conditions ne limitent pas vos droits impératifs. Conservez vos sauvegardes lorsque cela est possible. Les exigences de compatibilité et les fonctionnalités disponibles sont celles de la version de l’application et de sa fiche de distribution.'],
    ['Réclamations et litiges', `Adressez d’abord votre réclamation à ${app.email}. Les coordonnées du médiateur de la consommation compétent, si ce dispositif s’applique à l’éditeur, doivent être ajoutées avant publication définitive. Les règles impératives de protection du consommateur et les juridictions compétentes selon la loi restent applicables.`],
  ];
}