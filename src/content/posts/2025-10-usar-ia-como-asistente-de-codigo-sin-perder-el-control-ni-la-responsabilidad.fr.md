---
title: "Utiliser l'IA comme assistant de code sans perdre le contrôle ni la responsabilité"
date: 2025-10-25T00:00:00.000Z
featuredImage: /photos/ia_development_header.png
description: >-
  L'IA peut écrire du code, mais elle ne peut pas assumer votre responsabilité.
  Apprendre à bien l'utiliser est la nouvelle compétence clé de tout
  développeur professionnel.
tags:
  - AI
  - Développement
  - Development
---

Travailler avec l'intelligence artificielle pour écrire du code n'est plus une chose du futur ou sortie des films, c'est désormais une partie du travail quotidien. Mais l'utiliser dans un environnement professionnel — où ce qui est mis en production affecte les clients, les utilisateurs et la réputation — exige une façon de penser différente. Il ne suffit pas de "demander des choses au chat". Il faut apprendre à travailler avec l'IA comme si elle faisait partie de l'équipe, sans oublier que la responsabilité reste humaine.

## L'IA n'est pas votre remplaçante, c'est votre nouveau "junior"

La manière la plus saine de le voir est la suivante : *l'IA est comme un nouveau développeur, rapide et très travailleur, mais sans expérience*. Elle ne comprend pas le contexte métier, n'a pas de jugement et ne sait pas quand quelque chose est mal conçu. Vous restez celui qui définit la direction technique, valide les résultats et garantit que le produit final soit stable et sécurisé.

C'est la grande différence entre utiliser l'IA par hobby et le faire dans un environnement professionnel : vous ne pouvez pas lui lâcher les rênes.

## Soyez clair avec vos demandes

Les résultats de l'IA dépendent directement de la clarté de vos instructions. Si vous demandez quelque chose de vague, elle vous rendra quelque chose d'aussi vague (give it shit, and it will give you even more shit).

Par exemple, au lieu de dire "fais un composant pour le login", il est préférable de dire "crée un composant React nommé LoginForm avec email et password, en utilisant des hooks et la validation avec Zod, et en employant [Mantine](https://mantine.dev/) comme bibliothèque de composants".

Être spécifique n'est pas seulement une bonne pratique, c'est une manière de documenter ce que vous attendez réellement du système.

## Utilisez un plan, pas une conversation infinie

L'une des erreurs les plus courantes est d'essayer de tout résoudre dans une conversation chaotique avec le modèle. Dans un environnement formel, cela ne fonctionne pas.

Ce qui fonctionne, c'est littéralement de revenir aux bases de l'ingénierie, à ce que nous avons appris en étudiant, c'est-à-dire de refaire l'Analyse, la Conception et enfin le Développement (je me souviens encore de ce qui fut notre "gros livre de chevet", Analyse et conception des systèmes de Kendall et Kendall).

Autrement dit, pour que l'IA fonctionne, elle doit avoir un plan de travail documenté, même quelque chose d'aussi simple qu'un fichier `plan.md` où vous expliquez ce que vous allez changer, quels fichiers seront affectés et quelles étapes l'IA doit suivre.

Cela vous donne du contrôle, rend le processus répétable et permet aux autres membres de l'équipe de comprendre comment vous êtes parvenu à une solution. En quelques mots : cela vous protège et vous organise.

Dans mes expériences, l'un des modèles les plus équilibrés est `gemini-pro`. Cependant, en utilisant `Gemini Cli` pour tenter de faire quelque chose d'aussi "simple" que migrer d'une version de React à une autre, cela pourrait prendre des heures et rester bloqué à répéter la même erreur.

Certains diront, alors où est l'intérêt ? Pourtant, cela vous fera économiser beaucoup, beaucoup de travail et produira du code de meilleure qualité. Mais il y a une astuce importante : il existe des outils logiciels qui vous aident (également avec l'IA) à réaliser tout ce processus. Ce sont vos petits assistants qui suivent ces règles d'analyse et de conception, Amazon a même sorti son propre outil ([Kiro](https://kiro.dev/)).

## Rechercher avant d'exécuter

C'est une "astuce" qui m'a beaucoup aidé dans les cas où je dois gérer des développements liés à un sujet que je ne connais pas, un nouveau framework ou même une migration vers une nouvelle version.

Pour pouvoir guider l'IA, je dois d'abord comprendre ce qui est nécessaire, mais pour accélérer ce processus, j'utilise [Gemini](https://gemini.google.com/) avec son option Deep Research (Perplexity le fait très bien aussi) et je lui demande de me faire un rapport détaillé spécifiant le cas, ce que j'ai besoin d'apprendre et en établissant le plan de recherche.

Ce rapport sert à deux choses : étudier, car il me permet, en tant que "pilote", d'obtenir un résumé rapide et très ciblé, et en même temps, il sert (en le téléchargeant au format Markdown) de contexte de base à fournir à l'IA pour qu'elle puisse exécuter la tâche.

Cela m'a permis de réaliser des travaux qui m'auraient peut-être pris au moins une ou deux semaines, en seulement 1 ou 2 jours.

## Ne faites pas confiance aveuglément

Le code généré par l'IA peut compiler, mais cela ne signifie pas qu'il est correct. Il peut présenter des problèmes de sécurité, des erreurs logiques ou utiliser des bibliothèques obsolètes.

Le code d'IA doit passer exactement les mêmes filtres que le vôtre : révision, tests et validation.

Un bon conseil : si vous ne comprenez pas ce que l'IA a écrit, ne le mettez pas en production. Si vous ne pouvez pas le maintenir plus tard, vous ne devriez pas l'approuver maintenant.

Un grand allié pour éviter les problèmes de documentation obsolète (ce qui arrive souvent par défaut avec l'IA) est d'utiliser [Context7](https://context7.com/) comme MCP. C'est un outil qui permet au LLM de rechercher la documentation actualisée sur le langage, le framework ou la bibliothèque que vous utilisez, lui permettant de se "mettre à jour" sans nécessiter de nouvel entraînement. C'est parfait pour les cas où vous avez des fonctions "dépréciées" (deprecated).

## Tout n'est pas une question de vitesse

Oui, l'IA peut accélérer les tâches, mais si vous l'utilisez mal, vous ne ferez qu'accélérer vos erreurs.

Dans les environnements d'entreprise ou de produit, l'objectif n'est pas d'écrire plus de code, mais de livrer des solutions fiables. L'IA peut vous aider à éliminer les tâches répétitives ou à explorer des alternatives, mais la qualité et l'architecture restent votre responsabilité.

## Adoptez une mentalité d'orchestrateur

Le nouveau rôle du développeur n'est pas "celui qui tape le plus vite", mais celui qui sait guider l'IA avec discernement.

La vraie valeur réside dans la définition de ce qui doit être construit, comment cela est validé et comment cela est maintenu. En d'autres termes, nous passons de producteurs de code à stratèges techniques.

## Quel est le meilleur outil ?

La réponse à cette question sera toujours : Celle qui vous convient le mieux. Cependant, en faisant une comparaison de ces 3 (ce ne sont pas les seules, j'aurais pu inclure Deepseek Coder, Qwen, GPT-5, Mamba, etc.). Mais je pense que cela sert à donner une idée des forces de 3 des plus populaires : Copilot de Microsoft, Gemini de Google et Claude Code d'Anthropic.

En quelques mots, du moins pour la programmation, je donnerais un 7/10 à Gemini, un 9/10 à Claude, et bien que Copilot soit en retrait, l'abonnement de base vous permet d'utiliser différents modèles (y compris Claude Sonnet 4.5) et le grand avantage est l'intégration "native" avec Github.

![Comparaison des outils IA : Gemini, Claude, Copilot](/photos/2025/ia-tools-comparison.png "Comparaison des outils IA")

## Conseil final

Dans un monde où les machines peuvent écrire du code en quelques secondes, la véritable valeur humaine ne réside pas dans la vitesse, mais dans le jugement.

L'IA peut générer des milliers de lignes, mais elle ne comprend pas les priorités, le contexte ou l'impact. Cela reste notre part du travail.

Utiliser l'IA ne nous rend pas moins développeurs, cela nous oblige à être de meilleurs professionnels. Cela nous demande de penser davantage, de mieux planifier et d'être plus conscients des décisions que nous prenons.

Car au final, l'IA ne remplace pas l'expérience : elle l'amplifie. Mais seulement s'il y a quelqu'un derrière qui sait où il veut aller.

### Ressources Additionnelles

Quelques-uns des cours qui m'ont aidé à m'améliorer et à comprendre l'IA en général, ainsi qu'à l'utiliser pour le développement :

* [ChatGPT Prompt Engineering for Developers](https://learn.deeplearning.ai/courses/chatgpt-prompt-eng)
* [Generative AI: OpenAI API, DeepSeek, and ChatGPT in Python](https://www.udemy.com/course/genai-openai-chatgpt/)
* [Pair Programming with a Large Language Model](https://learn.deeplearning.ai/courses/pair-programming-llm)
* [Claude Code: A Highly Agentic Coding Assistant](https://learn.deeplearning.ai/courses/claude-code-a-highly-agentic-coding-assistant)

En ce qui concerne les outils, les plus populaires et connus sont Cursor, Claude Code et ZenCode, mais je vous recommande de jeter un œil à [Kilo Code](https://kilocode.ai/). Il vous permet d'utiliser plusieurs modèles (y compris Claude Code) et vous pouvez l'utiliser dans VSCode pour l'architecture, la planification et l'exécution.

### Outils MCP

Actuellement, les LLM peuvent communiquer avec d'autres services ou même exécuter des outils qui leur permettent d'obtenir un contexte additionnel et ainsi de fournir de meilleures réponses. Les outils de base que je recommanderais sont :

* [mcp-read-website-fast](https://github.com/just-every/mcp-read-website-fast) (Permet de télécharger des pages web et de les utiliser comme contexte)
* [context7](https://github.com/upstash/context7) (télécharge la documentation actualisée sur les bibliothèques/frameworks que vous utilisez).
* [sequentialthinking](https://mcpservers.org/servers/modelcontextprotocol/sequentialthinking) (Outil qui permet aux LLM de suivre leurs "pensées" et de mieux décomposer les tâches complexes).