---
title: 'Feature Flags: uma ferramenta para integrar mudanças nos seus desenvolvimentos'
date: 2023-10-15
featuredImage: /images/blue-featureflag.png
description: >-
  Sabe o que é uma feature flag? Aprenda como integrá-la ao seu fluxo de trabalho
  para que você possa fazer implantações graduais de novas funcionalidades sem
  medo de que algo "quebre" em produção.
tags:
  - Development
  - Tools
  - Software Development
---

Lançar um software com uma nova funcionalidade que envolve muitas mudanças na experiência do usuário, ou que altera diretamente o fluxo de trabalho típico da nossa aplicação, gera dúvidas e muito nervosismo no momento de colocá-lo em produção. Se algo der errado, a primeira ideia é reverter tudo e voltar ao estado anterior. Mas e se pudéssemos simplesmente "desativar" temporariamente essa funcionalidade enquanto investigamos o que aconteceu, sem a necessidade de fazer um rollback? Ou, que tal se apenas a mostrássemos a um grupo de usuários? Isso, em poucas palavras, é o que uma Feature Flag ou Feature Switch nos permite fazer.

## O que são Feature Flags ou Feature Switches?

Em poucas palavras, uma "Feature Flag" é como um interruptor que pode ser ligado ou desligado para controlar a visibilidade e o comportamento de funcionalidades específicas dentro de uma aplicação. Essas flags geralmente são controladas externamente, muitas vezes através de um arquivo de configuração ou um painel de controle web. Elas permitem que os desenvolvedores alterem o estado de uma funcionalidade sem a necessidade de implantar novo código.

![GrowthBook example](/images//feature-flags-mock.png "Exemplo de um painel de controle de FS")

### Por que Feature Flags são importantes?

As Feature Flags oferecem diversos benefícios chave:

1.  Integração Contínua e Entrega Contínua (CI/CD): As Feature Flags permitem implantações mais seguras e frequentes. Elas possibilitam isolar funcionalidades e lançá-las quando estiverem prontas, em vez de esperar por um grande lançamento. Podem, inclusive, já estar implantadas em produção, mas disponíveis apenas para um pequeno grupo de usuários, permitindo testá-las como um "focus group" e fazer melhorias antes de liberá-las para todos os usuários.
2.  Gerenciamento de Riscos: As Feature Flags reduzem o risco associado ao lançamento de novas funcionalidades. Podemos ocultar uma funcionalidade se ela estiver causando problemas inesperados, garantindo a experiência do usuário.
3.  Testes A/B: Com as Feature Flags, você pode implementar novas funcionalidades em um subconjunto de seus usuários, o que permite coletar feedback e dados antes de disponibilizá-las para todos.
4.  Lançamentos Ocultos: Você pode implantar uma funcionalidade, mas mantê-la oculta, monitorando seu desempenho e estabilidade antes de revelá-la aos usuários.
5.  Configuração em Tempo Real: Elas fornecem uma forma de realizar mudanças na configuração sem precisar reimplantar a aplicação, o que é especialmente valioso em ambientes de produção.

### Problemas Resolvidos por Feature Flags

1.  Capacidades de Reversão: Se uma funcionalidade introduzir erros críticos, você pode desativá-la rapidamente usando Feature Flags, evitando um rollback completo de toda a sua aplicação.
2.  Redução do "Time to market": As Feature Flags tornam possível lançar novas funcionalidades ou atualizações mais rapidamente e com mais frequência.
3.  Desenvolvimento Centrado no Usuário: É possível priorizar o feedback e as preferências dos usuários, adaptando a experiência do usuário com base em seu comportamento e necessidades.
4.  Experimentação Aprimorada: Os testes A/B e os lançamentos graduais permitem a tomada de decisões baseadas em dados, o que pode ser crucial, especialmente se a equipe ainda não estiver totalmente acostumada ao uso de ferramentas de CI/CD.

## Um Caso de Uso Real no E-commerce: Motor de Recomendação

Imaginemos que você esteja trabalhando em um site de e-commerce, e sua equipe acabou de desenvolver um sofisticado motor de recomendação. Este motor fornece recomendações de produtos aos usuários com base em seu histórico de navegação, hábitos de compra e preferências. É uma funcionalidade que pode melhorar significativamente a experiência do usuário e aumentar as vendas. No entanto, existem alguns riscos potenciais em sua implementação.

### Como Feature Flags são Aplicadas:

1.  Lançamento Gradual: Usando uma "Feature Flag", podemos lançar gradualmente o motor de recomendação para um pequeno subconjunto de usuários. Você quer se certificar de que a nova funcionalidade não cause problemas inesperados aos seus usuários. Ao expô-la inicialmente a apenas 5% da sua base de usuários, você pode monitorar seu desempenho e coletar feedback.
2.  Testes A/B: Para avaliar o impacto do motor de recomendação nas vendas, você pode configurar um teste A/B. Metade de seus usuários verá as recomendações e a outra metade não. Com as Feature Flags, você pode dividir facilmente sua base de usuários e medir as taxas de conversão e a satisfação do usuário.
3.  Configuração em Tempo Real: Imagine que haja um problema com o motor de recomendação. Talvez ele esteja recomendando produtos incorretos, o que poderia provocar uma queda nas vendas. Com uma "Feature Flag", você pode desligá-lo instantaneamente para todos os usuários até que o problema seja resolvido. Isso evita um impacto potencialmente negativo no seu negócio.

As Feature Flags não apenas garantem uma implementação mais suave e segura do motor de recomendação, mas também permitem que você tome decisões baseadas em dados e se adapte às características do seu público-alvo.

## Como posso implementá-lo?

Há muitas formas de fazê-lo, e dependerá dos recursos disponíveis e da forma de trabalho da equipe. A forma mais simples de implementação poderia ser definindo um arquivo público onde o status das FS é indicado, mas isso não habilita o uso de testes A/B e é bastante "rústico".

Na minha experiência profissional, as 3 formas mais comuns são:

*   Implementando um pequeno motor de FS que permita ativar ou desativar a funcionalidade com um clique, com uma variável na URL ou até mesmo definindo regras que, dependendo da requisição, ativem ou desativem essa funcionalidade.
*   Instalando uma ferramenta on-premises que cubra todas as características típicas de gerenciamento de FS. Existem muitos projetos, inclusive open source, que já oferecem isso pronto e é apenas uma questão de instalar e configurar.
*   Finalmente, uma opção muito rápida e "custo-efetiva" muitas vezes é utilizar uma ferramenta SaaS que exponha, através de uma API, o estado de cada FS, e do seu código você simplesmente acessa o estado de cada uma e esse valor é guardado em cache por um tempo determinado.

Alguns fornecedores interessantes que oferecem opções gratuitas ou de muito baixo custo:

*   [Flagsmith](https://www.flagsmith.com/ "Flagsmith")
*   [DevCycle](https://devcycle.com/ "DevCycle")
*   [PostHog](https://posthog.com/ "PostHog")
*   [Split.io](https://www.split.io/ "Split.io")
*   [GrowthBook](https://www.growthbook.io/ "GrowthBook")

Algo importante a lembrar é que a ideia das Feature Flags é que elas devem ter um tempo de vida. Uma vez que cumpriram seu propósito, é preciso "limpá-las" e removê-las do código para evitar a manutenção de código que não é mais utilizado. Isso também deve ser planejado para ter datas de corte, nas quais saibamos até quando o suporte será dado a uma funcionalidade específica.