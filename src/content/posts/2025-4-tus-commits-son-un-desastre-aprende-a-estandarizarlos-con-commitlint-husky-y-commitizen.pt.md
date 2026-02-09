---
title: >-
  Seus commits são uma bagunça? Aprenda a padronizá-los com Commitlint, Husky e
  Commitizen
date: 2025-03-31
featuredImage: /photos/2025/Commits-Computador.jpeg
description: >-
  Aprenda a padronizar seus commits com Commitlint, Husky e Commitizen. Melhore
  a clareza e a colaboração em seus projetos de desenvolvimento.
tags:
  - Development
  - Clean Code
  - Programming
---

Quantas vezes você revisou o histórico de commits de um projeto e se deparou com mensagens confusas, inconsistentes ou simplesmente inúteis? Se você trabalha em equipe, sabe que isso pode se tornar um pesadelo. A falta de um padrão nos commits dificulta a compreensão das mudanças, a colaboração e a manutenção do projeto. Mas e se eu te dissesse que existem ferramentas que podem resolver esse problema?

Neste post, vou te ensinar como usar Commitlint, Husky e Commitizen para padronizar seus commits e tornar seu histórico do Git muito mais limpo e organizado.

Por que padronizar os commits?

Antes de entrarmos em detalhes, vamos falar sobre a importância de padronizar os commits:

*   Clareza: Mensagens de commit claras e concisas facilitam a compreensão das mudanças realizadas.
*   Consistência: Um padrão garante que todos os commits sigam o mesmo formato, o que melhora a legibilidade do histórico.
*   Colaboração: Um histórico de commits organizado facilita a colaboração entre os membros da equipe.
*   Manutenção: Um histórico claro facilita a identificação de erros e a realização de alterações no futuro.

Commitlint, Husky e Commitizen: o trio perfeito

Essas três ferramentas trabalham juntas para te ajudar a padronizar seus commits:

*   Commitlint: Esta ferramenta verifica se as mensagens de commit estão em conformidade com um padrão predefinido.
*   Husky: Husky permite executar scripts do Git antes de realizar um commit, o que possibilita verificar as mensagens com o Commitlint.
*   Commitizen: Esta ferramenta te guia na criação de mensagens de commit que atendem ao padrão.

Como usá-las?

Primeiro, vamos instalar as dependências:

```shell
yarn add -D @commitlint/cli @commitlint/config-conventional commitizen husky
```

Criar uma configuração base para o Commitlint:

```shell
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

Criar uma configuração base para o Commitizen:

```shell
yarn commitizen init cz-conventional-changelog --yarn--dev--exact
```

Habilitar os hooks do Husky:

```shell
npx husky install
npx husky add .husky/commit-msg 'yarn commitlint --edit $1'
npx husky add .husky/prepare-commit-msg "exec < /dev/tty && npx cz --hook || true"
```

Finalmente, habilitar os scripts para que tanto Husky quanto Commitizen sejam acionados automaticamente. Dentro do `package.json`, na seção de `scripts`, adicionamos estes dois:

```json
{
  "scripts": {
    "prepare": "husky install",
    "commit": "git-cz"
  }
}
```

Com isso, automaticamente, toda vez que tentarmos fazer um commit, a ferramenta para preenchimento das mensagens de commit será habilitada e garantirá que sigamos um padrão.

A regra é simples: tudo em minúsculas, um espaço entre os dois pontos e a descrição, e sem ponto final. Simples assim.

Geralmente, eu escrevo apenas a primeira linha, mas veja esses tipos que podemos usar para deixar tudo organizado:

*   chore: Para atualizações que não afetam o código de produção, como mudanças em ferramentas, configurações e bibliotecas.
*   feat: Quando adicionamos uma nova funcionalidade ou implementamos algo novo no código.
*   fix: Para corrigir aqueles bugs irritantes que sempre aparecem.
*   refactor: Sabe aquelas mudanças no código que não alteram a funcionalidade final? Então, é para isso.
*   docs: Quando apenas alteramos os arquivos de documentação.
*   perf: Para alterações que tornam o código mais rápido e eficiente.
*   style: Quando alteramos a formatação do código, como espaços em branco, ponto e vírgula, etc.
*   test: Para adicionar ou corrigir testes nos processos automatizados.
*   build: Para mudanças no sistema de construção ou em dependências externas.
*   ci: Para mudanças nos arquivos e scripts de configuração de CI.
*   env: Para modificações ou adições em arquivos de configuração de CI.

Exemplos de commits que você vai gostar:

*   chore: adicionar commitlint e husky
*   chore(eslint): obrigar o uso de aspas duplas no React
*   refactor: refatorando o gerenciamento de cache para usar Redis
*   feat: adicionado AlovaJS para fazer a chamada às APIs
*   feat(page/dashboard): criando o roteamento com React Router

Com esses commits padronizados, é muito mais fácil entender o que foi feito no código. E se você trabalha sozinho, consegue imaginar voltar a um projeto depois de 6 meses? Com os commits organizados, você lembrará de tudo muito mais rápido.

Conclusão:

Padronizar seus commits pode parecer uma tarefa tediosa no início, mas os benefícios a longo prazo são inegáveis. Com Commitlint, Husky e Commitizen, você pode criar um histórico do Git limpo, organizado e fácil de entender. Anime-se a experimentá-las e verá a diferença!