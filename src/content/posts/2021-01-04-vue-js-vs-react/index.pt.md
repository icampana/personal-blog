---
title: Vue.JS vs React
date: 2022-01-23
featuredImage: /photos/vue-vs-react.jpg
description: Comparação entre duas das tecnologias mais utilizadas para frontend nos últimos anos
tags:
  - React
  - Development
  - Tecnología
  - Javascript
---
Se você trabalha com desenvolvimento web, é mais do que certo que já ouviu falar de React, VueJS e Angular. Neste artigo, darei um pouco de contexto e farei uma comparação entre as duas opções com as quais tive que trabalhar, abordando suas vantagens e desvantagens.

## Contexto

Há alguns anos, decidi começar a modernizar a forma como estava acostumado a construir aplicações, especialmente na parte do frontend. Havia permanecido tempo demais na minha zona de conforto com [Drupal](https://www.drupal.org/), que, embora continue sendo uma ferramenta extremamente útil, em certos projetos a configuração inicial por si só levava muito mais tempo do que provavelmente eu levaria para criar uma aplicação simples.

Eu ouvia que mais alternativas para criar interfaces estavam surgindo, e grande parte do mercado estava experimentando as SPAs (Single Page Applications) e a JAM Stack (Javascript APIs e Markup). Então, comecei a investigar o que estava disponível.

Originalmente, comecei com AngularJS, que depois se tornou simplesmente [Angular 2](https://angular.io/) (no momento da escrita deste artigo, eles estão na versão 13, e a versão inicial foi descontinuada completamente). Desenvolvido e patrocinado pelo Google, trata-se de um framework para aplicações web que é bastante fácil de aprender, pois trabalha estendendo o HTML que já conhecemos com diretivas para simplificar o trabalho. Um dos grandes 'poréns' que muitos encontraram foi que ele forçava o uso de TypeScript em vez de JavaScript, e embora isso, no fundo, represente vantagens, tirava a opção de escolha. Além disso, alterava diretamente o DOM (a partir da versão 2, isso não acontece mais), o que tornava seu desempenho lento.

A equipe de desenvolvimento do Angular chegou ao ponto de "aceitar sua derrota" e dizer que a equipe do [React](https://reactjs.org/) (a biblioteca criada pelo Facebook) havia sido mais bem pensada.

Por isso (além de ter encontrado inúmeros problemas de desempenho ao usar Angular em dispositivos móveis quando as aplicações começavam a crescer), decidi dar o salto e aprender React.

## React

React é uma biblioteca JavaScript extremamente flexível, focada especificamente na construção de interfaces de usuário. Não é "opinionativa", ou seja, nos dá a liberdade de utilizar os componentes que quisermos para gerenciamento de dados, estado, roteamento, etc. Embora às vezes essa liberdade também possa ser um tiro no pé se dedicarmos muito tempo para escolher o esquema a ser usado. No início, a lista de opções é longa demais, mas com a experiência isso se torna mais simples, e você acaba tendo sua lista de preferidos bem definida.

Permite criar interfaces e experiências complexas ao desenvolver peças de código isoladas chamadas "componentes". Uma boa prática recomendada é integrar isso com uma ferramenta como [Storybook](https://storybook.js.org/). Com ela, você pode ver como os componentes se parecem e se comportam sem sequer ter que se conectar a uma fonte de dados, o que permite trabalhar a lógica completamente isolada do estilo.

Para criar a representação de seus componentes, ele utiliza uma sintaxe específica, chamada JSX, que se assemelha visualmente ao HTML (falarei em detalhes mais adiante), mas permite traduzir posteriormente para o elemento que será mostrado na tela, que, no caso da web, é finalmente uma tag HTML.

Esse conceito permite a separação entre a lógica de visualização e a implementação, e é por essa razão que também facilitou o surgimento do React Native, que mantém os mesmos conceitos do React, mas permite "traduzir" os componentes para outros dispositivos, como a Web, o desktop ou um telefone móvel.

## Vue.js

Vue, ao contrário do React, foi pensado para ter uma definição mais completa e se aproximar mais do modelo MVC, não apenas gerenciando uma camada de apresentação simples, mas também incluindo mais ferramentas, como até mesmo o gerenciamento de estados. Uma das vantagens é que permite ser utilizado de forma progressiva, ou seja, não é necessário migrar completamente uma aplicação para poder aproveitá-lo, e foca em ser simples, entregando o mínimo ou o que diríamos "o justo e necessário" para poder criar uma aplicação funcional.

Ele gerencia o mesmo conceito de componentes do React (tenta aproveitar o melhor de seus antecessores) e o integra com o uso de diretivas, o que permite que possamos integrar um componente com o HTML que já conhecemos e podemos usar. Outra das características do Vue é que ele permite trabalhar tanto com CSS que existe apenas dentro de um escopo quanto de forma global (para quem vem do React, já possui seu próprio Styled Components integrado como parte de seu design).

### Sintaxe

Uma das grandes diferenças entre Vue e React é a forma como a camada de visualização é construída. Por padrão, Vue utiliza templates HTML, mas também existe a opção de escrevê-lo em JSX. Com React, por outro lado, só é possível utilizar JSX, o que nos obriga primeiro a nos acostumarmos a essa sintaxe.

Vue, por sua vez, gerencia uma "separação de responsabilidades" (separation of concerns) utilizando HTML, CSS e JS, o que faz com que até mesmo um desenvolvedor frontend iniciante possa aprender a criar uma aplicação Web com muito pouco conhecimento. Inclusive, é possível criar uma aplicação com Vue sem precisar instalar nenhuma ferramenta, apenas incluindo o Vue a partir de uma CDN.

Outra vantagem é que os templates HTML tornam muito simples para os Designers Web entenderem como a aplicação está estruturada, facilitando a colaboração entre desenvolvedores e designers.

React, com suas "JavaScript Expressions" (JSX), combina HTML e CSS dentro do JavaScript. Isso muitas vezes confunde os neófitos em React, pois tem a aparência de XML, mas se traduz em objetos uma vez que é transformado pelo "motor" do React. No fundo, isso é uma das coisas mais poderosas do framework, porque permite criar componentes de UI que são "autocontidos" e podem ser compartilhados e reutilizados em diferentes aplicações.

A forma como os desenvolvedores trabalham com ambas as ferramentas pode ajudar a decidir qual delas está mais alinhada às suas expectativas e capacidades.

O que os desenvolvedores que usam Vue.js gostam:

*   Curva de aprendizado muito fácil
*   Estilo de programação elegante que permite o uso de padrões.
*   Boa Documentação

Os desenvolvedores que usam React, por sua vez, desfrutam:

*   Um estilo de programação elegante e bons padrões de design
*   Um ecossistema de pacotes/componentes extenso
*   Uso generalizado (mais oportunidades de trabalho e suporte)

Enquanto na pesquisa de [2020 do Stack Overflow,](https://insights.stackoverflow.com/survey/2020#most-popular-technologies) sobre os frameworks mais utilizados, React estava em 2º lugar com 35,9%. Em [2021](https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-web-frameworks), ele passou para o primeiro lugar com 40,14% (superando o jQuery, que antes era o primeiro).

![Frameworks Web Mais Usados em 2021](/photos/screen-shot-2022-01-24-at-01.44.51.png "Frameworks Web Mais Usados em 2021")

### Facilidade de Integração

**Vue.js** é considerado um framework progressivo, ou seja, pode ser integrado de forma incremental em um projeto já existente sem a necessidade de migrar toda a aplicação. Um exemplo simples seria criar um widget de interação específico para uma aplicação web que já possui código legado. A aplicação pode ser mantida sem alterações e apenas a nova funcionalidade pode ser adicionada com Vue.js.

**React.js**, por outro lado, foi concebido originalmente para projetos de grande escala. Portanto, se você quisesse apenas adicionar uma pequena funcionalidade, seria mais uma dor de cabeça do que uma vantagem. A configuração inicial e a seleção de componentes provavelmente levariam mais tempo do que o necessário para implementar uma funcionalidade rápida, mas ele permite ter uma arquitetura melhor para grandes projetos, de modo que os benefícios são percebidos a longo prazo.

## A ferramenta correta dependerá das suas necessidades

Vue.js e React são ambas excelentes ferramentas para construir interfaces de usuário e interação. Para escolher qual é a melhor para o seu próximo projeto, é preciso analisar múltiplos fatores, começando pelo caso de uso específico, as necessidades do negócio, o ambiente, a disponibilidade de desenvolvedores que você tem à disposição, o orçamento e o tempo disponível.

Vue é muito leve, fácil de aprender e divertido de usar. Por ter uma sintaxe simples, se você está começando a aprender o uso de componentes ou vem do mundo jQuery, utilizá-lo será muito fácil e a transição não será dolorosa. Funciona bem para projetos pequenos, mas também pode ser usado para aplicações de grande porte.

Em termos de desempenho, Vue.js está no mesmo nível do React; no entanto, depende mais das otimizações e do tamanho da aplicação. Possui uma documentação muito boa, explicando cada elemento e detalhando o passo a passo.

Vue vem com as "baterias incluídas", possuindo pacotes oficiais para gerenciamento de estados, roteamento, renderização no lado do servidor (SSR) e se mantém extremamente ativo. Tudo isso somado, permite criar MVPs de forma rápida e eficiente.

React, por sua vez, é um "veterano" entre as ferramentas JavaScript. Com suporte corporativo, uma comunidade tremenda e um ecossistema extremamente vasto, o React se torna uma ferramenta muito boa para construir aplicações de nível empresarial. Outro ponto importante é que, justamente pelo uso que possui e pela adoção generalizada, o mercado de trabalho tem inúmeras ofertas disponíveis para quem domina essa ferramenta. Da mesma forma, buscar informações ou tentar conseguir ajuda não será problema algum.

Sem dúvida, há cada vez mais e novos concorrentes na área de ferramentas de front-end: [Angular](https://angular.io/) continua com o suporte do Google, [Svelte](https://svelte.dev/) ganhou muita tração, [Alpine.js](https://alpinejs.dev/) se apresenta como o futuro substituto do jQuery, [Stimulus](https://stimulus.hotwired.dev/) também surge como outro concorrente; a lista poderia continuar infinitamente.

No fim das contas, o mais importante será conseguir resolver um problema da melhor forma possível e com o menor impacto no uso de recursos. Por isso, recomendo sempre manter uma abordagem pragmática e escolher a ferramenta que melhor se ajuste ao projeto e à equipe, e se você tiver a oportunidade de experimentar e testar, faça-o.

Uma recomendação profissional para projetos de médio a grande porte: observe as tendências do mercado. Você não vai querer ficar com uma ferramenta que perde seu "furor", não tem suporte ou cujo desenvolvimento se congela e complique seu próprio projeto.