---
title: "Feature Flags, un outil pour intégrer des changements dans vos développements"
date: 2023-10-15
featuredImage: /images/blue-featureflag.png
description: >-
  Savez-vous ce qu'est un feature flag ? Apprenez à l'intégrer dans votre flux de travail
  pour pouvoir déployer progressivement de nouvelles fonctionnalités sans
  craindre que quelque chose ne "casse" en production.
tags:
  - Development
  - Tools
  - Software Development
---

La publication d'une nouvelle fonctionnalité logicielle qui implique de nombreux changements dans l'expérience utilisateur, ou qui modifie directement le flux de travail typique de notre application, génère des doutes et beaucoup de nervosité au moment de la mise en production. Si quelque chose ne va pas, la première idée est de tout annuler et de revenir à l'état précédent, mais que se passerait-il si nous pouvions simplement "désactiver" temporairement cette fonctionnalité pendant que nous enquêtons sur ce qui s'est passé, sans avoir besoin de faire un rollback ? Ou même, et si nous ne la montrions qu'à un groupe d'utilisateurs ? C'est, en quelques mots, ce que nous permet un Feature Flag ou un Commutateur de fonctionnalité.

## Qu'est-ce que les Feature Flags ou Commutateurs de fonctionnalité ?

En quelques mots, un "Feature Flag" est comme un interrupteur qui peut être activé ou désactivé pour contrôler la visibilité et le comportement de fonctionnalités spécifiques au sein d'une application. Ces drapeaux sont généralement contrôlés en externe, souvent via un fichier de configuration ou un tableau de bord web. Ils permettent aux développeurs de modifier l'état d'une fonctionnalité sans avoir à déployer de nouveau code.

![GrowthBook example](/images//feature-flags-mock.png "Exemple de tableau de bord de Commutateur de fonctionnalité")

### Pourquoi les "Feature Flags" sont-ils importants ?

Les "Feature Flags" offrent plusieurs avantages clés :

1. Intégration Continue et Déploiement Continu (CI/CD) : Les "Feature Flags" permettent des déploiements plus sûrs et plus fréquents. Ils permettent d'isoler les fonctionnalités et de les lancer lorsqu'elles sont prêtes, au lieu d'attendre un lancement majeur. Elles peuvent même déjà être déployées en production, mais n'être disponibles que pour un petit groupe d'utilisateurs, ce qui permet de les tester comme un "focus group" et d'apporter des améliorations avant de les rendre accessibles à tous les utilisateurs.
2. Gestion des Risques : Les "Feature Flags" réduisent le risque associé au lancement de nouvelles fonctionnalités. Nous pouvons masquer une fonctionnalité si elle provoque des problèmes inattendus, garantissant ainsi l'expérience utilisateur.
3. Tests A/B : Avec les "Feature Flags", vous pouvez implémenter de nouvelles fonctionnalités auprès d'un sous-ensemble de vos utilisateurs, ce qui vous permet de recueillir des commentaires et des données avant de les rendre accessibles à tous.
4. Lancements "Dark" : Vous pouvez déployer une fonctionnalité mais la maintenir masquée, en surveillant ses performances et sa stabilité avant de la révéler aux utilisateurs.
5. Configuration à la volée : Ils offrent un moyen d'apporter des modifications à la configuration sans avoir à redéployer l'application, ce qui est particulièrement précieux dans les environnements de production.

### Problèmes résolus par les "Feature Flags"

1. Capacités d'Annulation : Si une fonctionnalité introduit des erreurs critiques, vous pouvez la désactiver rapidement à l'aide des "Feature Flags", évitant ainsi une annulation complète de toute votre application.
2. Réduction du "Time to market" (Délai de mise sur le marché) : Les "Feature Flags" permettent de lancer de nouvelles fonctionnalités ou mises à jour plus rapidement et plus fréquemment.
3. Développement Centré sur l'Utilisateur : Il est possible de prioriser les commentaires et les préférences des utilisateurs en adaptant l'expérience utilisateur en fonction de leur comportement et de leurs besoins.
4. Expérimentation Améliorée : Les tests A/B et les lancements progressifs permettent une prise de décision basée sur les données, ce qui peut être crucial, surtout si l'équipe n'est pas encore totalement habituée à l'utilisation d'outils de CI/CD.

## Un Cas d'utilisation réel dans le Commerce Électronique : Moteur de Recommandation

Imaginons que vous travaillez sur un site web de commerce électronique, et que votre équipe vient de développer un moteur de recommandation sophistiqué. Ce moteur fournit des recommandations de produits aux utilisateurs en fonction de leur historique de navigation, de leurs habitudes d'achat et de leurs préférences. C'est une fonctionnalité qui peut améliorer considérablement l'expérience utilisateur et augmenter les ventes. Cependant, il existe certains risques potentiels liés à son implémentation.

### Comment appliquer les "Feature Flags" :

1. Lancement Progressif : En utilisant un "Feature Flag", nous pouvons lancer progressivement le moteur de recommandation à un petit sous-ensemble d'utilisateurs. Vous voulez vous assurer que la nouvelle fonctionnalité ne cause pas de problèmes inattendus à vos utilisateurs. En l'exposant initialement à seulement 5 % de votre base d'utilisateurs, vous pouvez surveiller ses performances et recueillir des commentaires.
2. Tests A/B : Pour évaluer l'impact du moteur de recommandation sur les ventes, vous pouvez configurer un test A/B. La moitié de vos utilisateurs verra les recommandations et l'autre moitié non. Avec les "Feature Flags", vous pouvez facilement diviser votre base d'utilisateurs et mesurer les taux de conversion ainsi que la satisfaction utilisateur.
3. Configuration en Temps Réel : Imaginez qu'il y ait un problème avec le moteur de recommandation. Peut-être recommande-t-il des produits incorrects, ce qui pourrait entraîner une baisse des ventes. Avec un "Feature Flag", vous pouvez l'éteindre instantanément pour tous les utilisateurs jusqu'à ce que le problème soit résolu. Cela évite un impact potentiellement négatif sur votre entreprise.

Les Feature Flags garantissent non seulement une implémentation plus fluide et sécurisée du moteur de recommandation, mais ils vous permettent également de prendre des décisions basées sur les données et de vous adapter aux caractéristiques de votre groupe cible.

## Comment puis-je l'implémenter ?

Il existe de nombreuses façons de le faire, cela dépendra des ressources disponibles et de la méthode de travail de l'équipe. La forme d'implémentation la plus simple pourrait être de définir un fichier public indiquant l'état des Commutateurs de fonctionnalité (FS), mais cela ne permet pas l'utilisation de tests A/B et est assez "rudimentaire".

Dans mon expérience professionnelle, les 3 formes les plus courantes sont :

* Implémenter un petit moteur de Commutateurs de fonctionnalité (FS) qui permet d'activer ou de désactiver la fonctionnalité en un clic, avec une variable dans l'URL ou même en définissant des règles qui, selon la requête, activent ou désactivent cette caractéristique.
* Installer un outil sur site (on-premises) qui couvre toutes les caractéristiques typiques de gestion des FS ; il existe de nombreux projets, y compris open source, qui nous fournissent cette solution clé en main et c'est juste une question d'installation et de configuration.
* Enfin, une option très rapide et "économique" est souvent d'utiliser un outil SaaS (Software as a Service) qui expose via une API l'état de chaque FS et depuis votre code, vous accédez simplement à l'état de chacune d'elles, cette valeur étant mise en cache pour une durée déterminée.

Quelques fournisseurs intéressants qui proposent des options gratuites ou à très faible coût :

* [Flagsmith](https://www.flagsmith.com/ "Flagsmith")
* [DevCycle](https://devcycle.com/ "DevCycle")
* [PostHog](https://posthog.com/ "PostHog")
* [Split.io](https://www.split.io/ "Split.io")
* [GrowthBook](https://www.growthbook.io/ "GrowthBook")

Il est important de se rappeler que l'idée des Feature Flags est qu'ils doivent avoir une durée de vie limitée. Une fois qu'ils ont rempli leur fonction, il faut les "nettoyer" et les retirer du code afin d'éviter de maintenir du code qui n'est plus utilisé. Cela doit également être planifié pour définir des dates butoirs, indiquant la fin du support d'une fonctionnalité spécifique.