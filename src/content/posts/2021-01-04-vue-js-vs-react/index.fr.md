---
title: Vue.JS vs React
date: 2022-01-23
featuredImage: /photos/vue-vs-react.jpg
description: Comparaison entre deux des technologies les plus utilisées pour le frontend ces dernières années
tags:
  - React
  - Development
  - Tecnología
  - Javascript
---
Si vous travaillez dans le développement web, il est plus que probable que vous ayez entendu parler de React, VueJS et Angular. Dans cet article, je fournirai un contexte et une comparaison entre les deux options avec lesquelles j'ai eu l'occasion de travailler, ainsi que leurs avantages et inconvénients.

## Contexte

Il y a quelques années, j'ai décidé de moderniser ma façon habituelle de construire des applications, en particulier en ce qui concerne le frontend. J'étais resté trop longtemps dans ma zone de confort avec [Drupal](https://www.drupal.org/) qui, bien qu'il reste un outil extrêmement utile, présentait des projets où la configuration initiale seule prenait bien plus de temps que ce qu'il me faudrait pour créer une application simple.

J'entendais parler de nouvelles alternatives pour créer des interfaces, et une grande partie du marché expérimentait avec les SPAs (Single Page Applications) et la JAM Stack (Javascript APIs et Markup). J'ai donc commencé à explorer ce qui était disponible.

J'ai initialement débuté avec AngularJS, qui est ensuite devenu simplement [Angular 2](https://angular.io/) (au moment de la rédaction de cet article, ils en sont à la version 13 et la version initiale a été complètement abandonnée). Développé et soutenu par Google, il s'agit d'un framework pour applications web assez facile à apprendre car il fonctionne en étendant le HTML que nous connaissons avec des directives pour simplifier le travail. Un des principaux inconvénients que beaucoup lui ont trouvé était qu'il imposait l'utilisation de TypeScript au lieu de JavaScript, et bien que cela représente des avantages fondamentaux, cela supprimait l'option de choisir. De plus, il modifiait directement le DOM (ce n'est plus le cas à partir de la version 2), ce qui rendait ses performances lentes.

L'équipe de développement d'Angular a fini par "accepter sa défaite" et a déclaré que l'équipe de [React](https://reactjs.org/) (la bibliothèque développée par Facebook) avait une meilleure conception.

C'est pourquoi (en plus d'avoir rencontré d'innombrables problèmes de performance en utilisant Angular sur mobile lorsque les applications commençaient à prendre de l'ampleur), j'ai décidé de sauter le pas et d'apprendre React.

## React

React est une bibliothèque JavaScript extrêmement flexible, spécifiquement axée sur la construction d'interfaces utilisateur. Elle n'est pas "opinionated", c'est-à-dire qu'elle nous offre la liberté d'utiliser les composants que nous souhaitons pour la gestion des données, de l'état, du routage, etc. Bien que cette liberté puisse parfois se retourner contre nous si nous passons trop de temps à choisir le schéma à utiliser – au début, la liste des options est trop longue – l'expérience rend ce choix plus facile et permet de définir une liste de préférences très claire.

Il permet de créer des interfaces et des expériences complexes en créant des pièces de code isolées appelées "composants". Une bonne pratique recommandée est d'intégrer cela avec un outil comme [Storybook](https://storybook.js.org/), ce qui vous permet de visualiser l'apparence et le comportement des composants sans même avoir à vous connecter à une source de données. Cela permet de travailler la logique complètement isolée du style.

Pour créer la représentation de ses composants, il utilise une syntaxe spécifique, appelée JSX, qui ressemble visuellement à du HTML (j'en parlerai plus en détail) mais permet ensuite de la traduire en l'élément qui sera affiché à l'écran, et qui, dans le cas du web, est finalement une balise HTML.

Ce concept permet la séparation entre la logique de visualisation et l'implémentation, et c'est pour cette raison que la naissance de React Native a également été facilitée. Ce dernier conserve les mêmes concepts que React, mais permet de "traduire" les composants vers d'autres appareils, tels que le Web, les applications de bureau ou les téléphones mobiles.

## VueJS

Vue, contrairement à React, a été conçu pour avoir une définition plus complète et se rapprocher davantage du modèle MVC, non seulement en gérant une simple couche de présentation, mais aussi en incluant davantage d'outils, comme la gestion des états. L'un de ses avantages est qu'il peut être utilisé de manière progressive, c'est-à-dire qu'il n'est pas nécessaire de migrer entièrement une application pour en tirer parti. Il se concentre sur la simplicité, en fournissant le minimum ou ce que nous appellerions le "juste nécessaire" pour créer une application fonctionnelle.

Il gère le même concept de composants que React (il cherche à tirer parti du meilleur de ses prédécesseurs) et l'intègre avec l'utilisation de directives, ce qui nous permet d'intégrer un composant avec le HTML que nous connaissons et pouvons utiliser. Une autre caractéristique de Vue est qu'il permet de travailler avec du CSS qui n'existe que dans un scope ou également de manière globale (pour ceux qui viennent de React, il intègre déjà ses propres Styled Components dans sa conception).

### Syntaxe

L'une des grandes différences entre Vue et React réside dans la manière dont la couche de visualisation est construite. Par défaut, Vue utilise des templates HTML, mais il existe également l'option de l'écrire en JSX. Avec React, en revanche, seul le JSX peut être utilisé, ce qui nous oblige d'abord à nous habituer à cette syntaxe.

Vue, de son côté, gère une "séparation des préoccupations" (separation of concerns) en utilisant HTML, CSS et JS, ce qui permet même à un développeur frontend débutant d'apprendre à créer une application Web avec très peu de connaissances. Il est même possible de créer une application avec Vue sans avoir besoin d'installer d'outils, simplement en incluant Vue depuis un CDN.

Un autre avantage est que les templates HTML facilitent grandement la compréhension de la structure de l'application pour les Designers Web et favorisent la collaboration entre développeurs et designers.

React, avec ses "JavaScript Expressions" (JSX), combine HTML et CSS au sein de JavaScript. Ce qui déroute souvent les néophytes de React, car il a l'apparence de l'XML mais se traduit en objets une fois transformé par le "moteur" de React. Au fond, c'est l'un des aspects les plus puissants du framework, car il permet de créer des composants d'interface utilisateur "autonomes" qui peuvent être partagés et réutilisés dans différentes applications.

La manière dont les développeurs travaillent avec ces deux outils peut aider à décider lequel est le mieux adapté à leurs attentes et capacités.

Ce que les développeurs qui utilisent Vue.js apprécient :

*   Courbe d'apprentissage très facile
*   Style de programmation élégant qui permet l'utilisation de patterns.
*   Bonne documentation

Les développeurs qui utilisent React, de leur côté, apprécient :

*   Un style de programmation élégant et de bons patterns de conception
*   Un écosystème de paquets/composants étendu
*   Utilisation généralisée (plus d'opportunités d'emploi et de support)

Alors que dans l'enquête [Stack Overflow de 2020,](https://insights.stackoverflow.com/survey/2020#most-popular-technologies) concernant les frameworks les plus utilisés, React était à la 2ème place avec 35,9%, en [2021,](https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-web-frameworks) il est passé à la première place avec 40,14% (dépassant jQuery qui était auparavant le premier).

![Most used Web Frameworks in 2021](/photos/screen-shot-2022-01-24-at-01.44.51.png "Most used Web Frameworks in 2021")

### Facilité d'intégration

**Vue.js** est considéré comme un framework progressif, c'est-à-dire qu'il peut être intégré de manière incrémentielle dans un projet existant sans qu'il soit nécessaire de migrer toute l'application. Un exemple simple serait de créer un widget d'interaction spécifique pour une application web qui contient déjà du code legacy. L'application peut être maintenue telle quelle, et seule la nouvelle fonctionnalité peut être ajoutée avec VueJS.

**React.js**, en revanche, a été conçu à l'origine pour des projets à grande échelle. Par conséquent, si l'on souhaitait simplement ajouter une petite fonctionnalité, ce serait plus un casse-tête qu'un avantage. La configuration initiale et la sélection des composants prendraient probablement plus de temps que ce qu'il faut pour réaliser une fonctionnalité rapide, mais il permet d'avoir une meilleure architecture pour les grands projets, de sorte que les avantages se manifestent sur le long terme.

## Le bon outil dépendra de vos besoins

Vue.js et React sont tous deux d'excellents outils pour construire des interfaces utilisateur et des interactions. Pour choisir le meilleur pour votre prochain projet, il faut analyser de multiples facteurs, à commencer par le cas d'utilisation spécifique, les besoins de l'entreprise, l'environnement, la disponibilité des développeurs à disposition, le budget et le temps disponible.

Vue est très léger, facile à apprendre et agréable à utiliser. Grâce à sa syntaxe simple, si vous débutez dans l'utilisation des composants ou si vous venez du monde jQuery, l'utiliser sera très facile et la transition ne sera pas douloureuse. Il fonctionne bien pour les petits projets, mais peut également être utilisé pour des applications de grande envergure.

En termes de performances, Vue.js est au même niveau que React, mais cela dépend davantage des optimisations et de la taille de l'application ; il dispose d'une très bonne documentation, expliquant chaque élément et fournissant des instructions détaillées étape par étape.

Vue est livré avec les "batteries incluses", disposant de paquets officiels pour la gestion des états, le routage, le rendu côté serveur (SSR) et se maintient extrêmement actif. Tout cela combiné permet de créer des MVPs de manière rapide et efficace.

React, quant à lui, est un "vétéran" parmi les outils JavaScript. Avec un support corporatif, une communauté immense et un écosystème extrêmement vaste, React devient un excellent outil pour construire des applications de niveau entreprise. Un autre point important est que, précisément en raison de son utilisation et de son adoption généralisée, le marché du travail propose de très nombreuses offres pour ceux qui maîtrisent cet outil. De la même manière, chercher des informations ou essayer d'obtenir de l'aide ne sera absolument pas un problème.

Il y a sans aucun doute de plus en plus de nouveaux concurrents dans le domaine des outils front-end : [Angular](https://angular.io/) continue de bénéficier du support de Google, [Svelte](https://svelte.dev/) a gagné beaucoup de terrain, [Alpine.js](https://alpine.js.dev/) se présente comme le futur remplaçant de jQuery, [Stimulus](https://stimulus.hotwired.dev/) apparaît également comme un autre concurrent, la liste pourrait continuer sans fin.

Au final, le plus important sera de pouvoir résoudre un problème de la meilleure manière possible et avec le moins d'impact sur l'utilisation des ressources. C'est pourquoi je recommanderais toujours de maintenir une approche pragmatique et de choisir l'outil qui correspond le mieux au projet et à l'équipe, et si vous avez l'occasion d'expérimenter et de tester, faites-le.

Une recommandation professionnelle pour les projets de taille moyenne à grande : soyez attentif aux tendances du marché. Vous ne voudriez pas vous retrouver avec un outil qui perd de sa "vigueur", n'a plus de support ou dont le développement stagne, compliquant ainsi votre propre projet.