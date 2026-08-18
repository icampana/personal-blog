---
title: Quando Escolher NoSQL e Quando Apostar em Bancos de Dados Relacionais?
date: 2023-10-30
featuredImage: /images/NoSQL-vs-Relational.png
description: >-
  Descubra quando usar bancos de dados NoSQL e quando optar pelos relacionais.
  Encontre a chave para suas necessidades de armazenamento de dados nesta
  análise
tags:
  - NoSQL
  - Databases
  - Development
---

Nos últimos anos, o uso de bancos de dados não relacionais (NoSQL) aumentou exponencialmente. Na maioria das vezes, isso está associado a casos de uso específicos, mas também tenho visto muitos projetos simplesmente decidirem utilizá-los porque são a "moda" ou o "hot new stuff", sem entender se realmente é o que precisam, ou se talvez estejam preparando o caminho para um problema futuro por não terem analisado bem a problemática.

A escolha entre um banco de dados NoSQL e um banco de dados relacional depende das suas necessidades específicas. Aqui explicarei as principais razões para optar por NoSQL em alguns casos e por bancos de dados relacionais em outros.

## NoSQL para novos usuários

Se você é novo em NoSQL, é importante saber que esses bancos de dados são ideais quando:

1.  Escalabilidade horizontal é crucial: NoSQL oferece a capacidade de adicionar servidores facilmente para lidar com um maior volume de dados e tráfego, o que é útil se você espera um crescimento rápido.
2.  Dados não estruturados ou semiestruturados: NoSQL é excelente para dados que não se encaixam bem em tabelas e colunas tradicionais, como documentos JSON ou XML. O caso de uso mais comum para isso é quando recebemos dados de diferentes sistemas ou de diferentes fontes, dessa forma sempre poderemos armazenar o que nos enviam e em um processo à parte.
3.  Agilidade de desenvolvimento: NoSQL permite mudanças no esquema de dados sem interrupções, o que é útil em ambientes ágeis de desenvolvimento de software.

### Principais motores NoSQL

*   `MongoDB`: Amplamente utilizado, especialmente para aplicações web, é altamente escalável e suporta documentos BSON.
*   `DynamoDB`: Se você utiliza AWS, esta será sua opção "de fato", fácil de usar e utiliza o esquema de par chave-valor (key/value). Permite criar índices em mais campos, mas cada um que for adicionado aumentará o custo, então é preciso planejar bem.
*   `Cassandra`: Ideal para aplicações de alto desempenho, especialmente em tempo real e aplicações distribuídas.

## Quando convêm os Bancos de Dados Relacionais?

Escolher um banco de dados relacional faz sentido em situações onde:

1.  Integridade e consistência de dados são críticos: Se você precisa garantir que seus dados estejam sempre estruturados e relacionados de maneira específica, os bancos de dados relacionais são ideais.
2.  Transações complexas: Se sua aplicação requer transações ACID (atômicas, consistentes, isoladas e duráveis), os bancos de dados relacionais são a escolha óbvia.
3.  Consultas complexas e análise: Se suas necessidades incluem consultas SQL avançadas e análise de dados, um banco de dados relacional é mais adequado. Este costuma ser o maior obstáculo que se encontra pela primeira vez com NoSQL, quando se deseja fazer uma consulta complexa baseada em múltiplos dados relacionados. Embora já existam algumas soluções para isso (inclusive poder usar uma linguagem similar ao SQL), não foi para isso que ele foi projetado, apresentando problemas que nos fazem demorar muito mais do que deveríamos e que já estão facilmente resolvidos nos bancos de dados relacionais tradicionais.

### Principais motores de bancos de dados relacionais

*   `MySQL` / `MariaDB`: Amplamente utilizado e de código aberto, é uma excelente opção para aplicações web e empresariais. É focado em ter um alto desempenho para leitura de dados, embora ainda fique para trás em relação às ferramentas que outros bancos de dados transacionais possuem por padrão.
*   `PostgreSQL`: Com uma sólida reputação por sua integridade e suporte a dados geoespaciais, é ideal para aplicações exigentes. Leva um tempo para se acostumar com sua configuração e ferramentas, mas é uma base sólida e que pode crescer com facilidade.
*   `MS SQL Server`: O banco de dados oficial da Microsoft, teve algumas críticas ao longo do tempo, mas se você utiliza .NET e especialmente a plataforma Azure, provavelmente será sua opção por padrão.

Em resumo, a escolha entre NoSQL e bancos de dados relacionais depende das suas necessidades específicas. Para os novos usuários de NoSQL, considere a escalabilidade, a natureza dos seus dados e a agilidade de desenvolvimento. Conheça os motores principais de NoSQL.

Se a integridade, as transações e as consultas complexas são fundamentais, opte por um banco de dados relacional como MySQL ou PostgreSQL. Ambas as abordagens têm suas vantagens, então escolha sabiamente de acordo com seus requisitos.

Antes de fechar este artigo, existe uma última opção, que é a de fazer um mix. Em alguns projetos nos quais trabalhei, tivemos uma mistura de necessidades, e nenhum dos 2 tipos de motores de bancos de dados cobria nossas expectativas, então pensamos em um mix.

Os dados "brutos" não processados e com uma estrutura que podia mudar facilmente eram inseridos em um banco de dados NoSQL, onde podíamos crescer e atender a solicitações de clientes rapidamente e sem ter que esperar para dar uma resposta. E depois, em um processo em lote e em diferido, pegávamos esses dados, os processávamos, estruturávamos e movíamos para um banco de dados relacional onde podiam ser utilizados com queries avançadas e obter os resultados que esperávamos.

Em poucas palavras, não existe uma única solução. É necessário analisar qual é o objetivo do nosso projeto e projetar a solução com base nisso.