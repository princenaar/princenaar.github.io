# Design QA — refonte du portfolio

## Références

- Source visuelle : `C:\Users\molzl\.codex\generated_images\019ff6a7-4dd9-7b31-a9fe-413420745fc3\exec-618108b0-2452-4be5-b103-5bf86c052a7e.png`
- Source : 864 × 1821 px, direction éditoriale longue sélectionnée par l’utilisateur.
- Implémentation : `http://127.0.0.1:8767/`
- Capture desktop finale : `C:\Users\molzl\.codex\visualizations\2026\08\12\019ff6a7-4dd9-7b31-a9fe-413420745fc3\portfolio-redesign-qa\final-live-desktop.png`
- Capture de comparaison normalisée : `C:\Users\molzl\.codex\visualizations\2026\08\12\019ff6a7-4dd9-7b31-a9fe-413420745fc3\portfolio-redesign-qa\comparison-hero.png`
- Viewport CSS principal : 1440 × 900 ; capture navigateur : 1425 × 868 px à cause de l’interface du navigateur intégré. La source et l’implémentation ont été ajustées dans deux panneaux de 720 × 455 px pour la comparaison du héros.
- État : accueil français, thème bleu nuit/papier/menthe, premier écran chargé sans interaction.

## Comparaison visuelle

La comparaison pleine vue confirme la même architecture : en-tête sombre, héros scindé texte/portrait, titre sérif à accent menthe, double appel à l’action, bande de preuves, section de mission sombre et études de cas alternées. Les différences de copie et de recadrage sont intentionnelles : le site utilise les informations vérifiées et les actifs réels du portfolio, pas les contenus illustratifs de la maquette.

Une comparaison ciblée du héros a été nécessaire pour juger la hiérarchie typographique, le cadrage du portrait, la largeur des colonnes, les boutons et les couleurs. Les autres sections ont été contrôlées séparément dans `pass2-missions.png` et `pass2-cases.png`. Aucun autre gros plan n’était nécessaire : les images, libellés et séparateurs restaient lisibles dans les captures à 1440 px.

## Surfaces de fidélité

- Typographie : Georgia/Times conserve le caractère éditorial de la source ; échelle, graisse, interlignage et retours à la ligne du héros sont équilibrés aux quatre largeurs testées.
- Espacement et rythme : la grille scindée, les marges, les bandes de preuve, les séparateurs et l’alternance des projets suivent la composition retenue sans carte générique, ombre ou rayon parasite.
- Couleurs : les jetons bleu nuit, papier et menthe correspondent à l’intention ; les contrastes, focus et états ouverts ont été contrôlés.
- Images : portrait et captures de projets sont des actifs réels, nets, sans SVG ou illustration factice ; aucun chargement d’image défaillant.
- Contenu : textes FR/EN cohérents et sensibles vérifiés contre le fichier maître ; 14 régions, environ 25 000 agents, aucune mention de l’opportunité GIZ AI Advisor.

## Historique des itérations

### Passe 1 — bloquée

- [P1] Le héros chargeait une ancienne feuille de style en cache, produisant un titre surdimensionné et masquant les appels à l’action sous le premier écran.
- [P2] Le premier cas phare plaçait le texte à gauche alors que la direction retenue demandait l’image à gauche.
- [P2] La section de mission était trop haute et sa phrase manifeste cassait le rythme de la référence.

Corrections : cache invalidé sur l’accueil, héros reconstruit en grille 57/43 avec une échelle de titre réduite, alternance corrigée avec `:nth-of-type`, espacement et corps du manifeste resserrés.

### Passe 2 — validée

- Preuves : `pass2-desktop-hero.png`, `pass2-missions.png`, `pass2-cases.png`, `pass2-tablet-768.png`, `pass1-mobile-390.png`, `pass2-mobile-320.png`.
- Aucun P0, P1 ou P2 restant. Pas de débordement horizontal, image cassée, contrôle masqué ni erreur console.

## Responsive, accessibilité et interactions

- Viewports testés : 1440 × 900, 768 × 1024, 390 × 844 et 320 × 568.
- Navigation mobile : ouverture, fermeture, `aria-expanded`, `aria-hidden`, `inert`, blocage du contenu arrière-plan, focus initial, Échap et restauration du focus validés.
- Sélecteur FR/EN : navigation vers l’équivalent exact validée sur l’accueil et l’étude iHRIS.
- Étude de cas : sections, galerie, lien de projet suivant et retour à l’équivalent français validés.
- Lien d’évitement, titres, landmarks, textes alternatifs, focus visibles et réduction des animations contrôlés.
- Contenu rendu visible par défaut sans JavaScript ; les révélations ne sont masquées qu’après activation de la classe `js`.
- Zoom navigateur simulé par raccourci puis contrôle de repli avec largeur réduite ; aucun débordement aux équivalents de petits viewports.
- Console : 0 avertissement, 0 erreur.
- Réseau : 16 pages sur 16 renvoient HTTP 200.

## Résultat

final result: passed
