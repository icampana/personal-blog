---
title: "Vos commits sont-ils un désastre ? Apprenez à les standardiser avec Commitlint, Husky et Commitizen"
date: 2025-03-31
featuredImage: /photos/2025/Commits-Computador.jpeg
description: "Apprenez à standardiser vos commits avec Commitlint, Husky et Commitizen. Améliorez la clarté et la collaboration dans vos projets de développement."
tags:
  - Development
  - Clean Code
  - Programming
---

Combien de fois avez-vous consulté l'historique des commits d'un projet et rencontré des messages confus, incohérents ou simplement inutiles ? Si vous travaillez en équipe, vous savez que cela peut rapidement devenir un cauchemar. L'absence de standard pour les commits rend difficile la compréhension des changements, la collaboration et la maintenance du projet. Mais, et si je vous disais qu'il existe des outils pour résoudre ce problème ?

Dans cet article, je vais vous montrer comment utiliser Commitlint, Husky et Commitizen pour standardiser vos commits et rendre votre historique Git beaucoup plus propre et mieux organisé.

Pourquoi standardiser les commits ?

Avant d'entrer dans le vif du sujet, voyons pourquoi il est important de standardiser les commits :

*   Clarté : Des messages de commit clairs et concis facilitent la compréhension des modifications apportées.
*   Cohérence : Un standard garantit que tous les commits suivent le même format, ce qui améliore la lisibilité de l'historique.
*   Collaboration : Un historique de commits bien organisé facilite la collaboration entre les membres de l'équipe.
*   Maintenance : Un historique clair facilite l'identification des erreurs et la réalisation de modifications futures.

Commitlint, Husky et Commitizen : le trio parfait

Ces trois outils travaillent ensemble pour vous aider à standardiser vos commits :

*   Commitlint : Cet outil vérifie que les messages de commit respectent un standard prédéfini.
*   Husky : Husky vous permet d'exécuter des scripts Git avant de réaliser un commit, ce qui vous permet de vérifier les messages avec Commitlint.
*   Commitizen : Cet outil vous guide dans la création de messages de commit conformes au standard.

Comment les utiliser ?

Commençons par installer les dépendances :

```shell
yarn add -D @commitlint/cli @commitlint/config-conventional commitizen husky
```

Créer une configuration de base pour Commitlint :

```shell
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

Créer une configuration de base pour Commitizen :

```shell
yarn commitizen init cz-conventional-changelog --yarn--dev--exact
```

Activer les hooks Husky :

```shell
npx husky install
npx husky add .husky/commit-msg 'yarn commitlint --edit $1'
npx husky add .husky/prepare-commit-msg "exec < /dev/tty && npx cz --hook || true"
```

Enfin, activons les scripts afin que Husky et Commitizen se déclenchent automatiquement. Dans la section `scripts` du fichier `package.json`, ajoutons ces deux lignes :

```json
{
  "scripts": {
    "prepare": "husky install",
    "commit": "git-cz"
  }
}
```

Ainsi, chaque fois que nous tenterons de faire un commit, l'outil se lancera automatiquement pour le remplissage des messages de commit et s'assurera que nous suivons un standard.

La règle est simple : tout en minuscules, un espace entre les deux points et la description, et sans point final. C'est aussi simple que ça.

Généralement, je n'écris que la première ligne, mais voici les types que nous pouvons utiliser pour tout organiser :

*   chore : Pour les mises à jour qui n'affectent pas le code de production, comme les changements d'outils, de configurations et de bibliothèques.
*   feat : Lorsque nous ajoutons une nouvelle fonctionnalité ou implémentons quelque chose de nouveau dans le code.
*   fix : Pour corriger ces bugs gênants qui apparaissent toujours.
*   refactor : Vous savez, ces changements dans le code qui n'altèrent pas la fonctionnalité finale ? C'est pour ça.
*   docs : Lorsque nous ne touchons qu'aux fichiers de documentation.
*   perf : Pour ces modifications qui rendent le code plus rapide et plus efficace.
*   style : Lorsque nous modifions le formatage du code, comme les espaces, les points-virgules, etc.
*   test : Pour ajouter ou corriger des tests dans les processus automatisés.
*   build : Pour les changements dans le système de build ou les dépendances externes.
*   ci : Pour les changements dans les fichiers et scripts de configuration de CI.
*   env : Pour les modifications ou ajouts dans les fichiers de configuration de CI.

Exemples de commits que vous apprécierez :

*   chore: add commitlint et husky
*   chore(eslint) : imposer l'utilisation des guillemets doubles dans React
*   refactor : refactorisation de la gestion du cache pour utiliser Redis
*   feat : ajout d'AlovaJS pour l'appel des APIs
*   feat(page/dashboard) : création du routage avec React Router

Avec ces commits standardisés, il est beaucoup plus facile de comprendre ce qui a été fait dans le code. Et si vous travaillez seul, imaginez revenir sur un projet après 6 mois ? Avec des commits organisés, vous vous souviendrez de tout beaucoup plus rapidement.

Conclusion :

Standardiser vos commits peut sembler une tâche fastidieuse au début, mais les avantages à long terme sont indéniables. Avec Commitlint, Husky et Commitizen, vous pouvez créer un historique Git propre, ordonné et facile à comprendre. N'hésitez pas à les essayer et vous verrez la différence !