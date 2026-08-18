---
title: Usar IA como assistente de código sem perder o controle ou a responsabilidade
date: 2025-10-25T00:00:00.000Z
featuredImage: /photos/ia_development_header.png
description: >-
  A IA pode escrever código, mas não pode assumir sua responsabilidade. Aprender
  a usá-la bem é a nova habilidade essencial de todo desenvolvedor profissional.
tags:
  - AI
  - Desarrollo
  - Development
---

Trabalhar com inteligência artificial para escrever código não é mais algo do futuro ou saído de filmes, é parte do trabalho diário. Mas usá-la em um ambiente profissional —onde o que é liberado para produção afeta clientes, usuários e reputação— exige uma forma de pensar diferente. Não basta “pedir coisas ao chat”. É preciso aprender a trabalhar com a IA como se ela fosse parte da equipe, mas sem esquecer que a responsabilidade continua sendo humana.

## A IA não é seu substituto, é seu novo “júnior”

A forma mais saudável de encarar é assim: *a IA é como um desenvolvedor novo, rápido e muito trabalhador, mas sem experiência*. Ela não entende o contexto do negócio, não tem critério e não sabe quando algo está mal projetado. Você continua sendo quem define a direção técnica, valida os resultados e garante que o produto final seja estável e seguro.

Essa é a grande diferença entre usar IA por hobby e fazê-lo em um ambiente profissional: você não pode entregar o leme a ela.

## Seja claro com o que você pede

Os resultados da IA dependem diretamente da clareza de suas instruções. Se você pedir algo vago, ela devolverá algo igualmente vago (give it shit, and it will give you even more shit).

Por exemplo, em vez de dizer “faça um componente para login”, é melhor dizer “crie um componente React chamado LoginForm com email e password, usando hooks e validação com zod, empregando [Mantine](https://mantine.dev/) como biblioteca de componentes”.

Ser específico não é apenas uma boa prática, é uma forma de documentar o que você realmente espera do sistema.

## Use um plano, não uma conversa infinita

Um dos erros mais comuns é tentar resolver tudo em uma conversa caótica com o modelo. Em um ambiente formal, isso não funciona.

O que funciona é literalmente voltar às bases da engenharia, o que aprendemos ao estudar, ou seja, voltar a fazer Análise, Design e finalmente Desenvolvimento (ainda me lembro do que foi nosso “libro gordo de petete”, Análise e design de sistemas de Kendall e Kendall).

Ou seja, para que a IA funcione, ela deve ter um plano de trabalho documentado, incluindo algo tão simples como um arquivo `plan.md` onde você explique o que será alterado, quais arquivos serão afetados e quais passos a IA deve seguir.

Isso lhe dá controle, torna o processo repetível e permite que outros membros da equipe entendam como você chegou a uma solução. Em poucas palavras: protege você e organiza.

Nos meus experimentos, um dos modelos mais equilibrados é o gemini-pro, contudo, usando o Gemini Cli para tentar fazer algo tão “simples” como migrar de uma versão do React para outra, ele poderia levar horas e ficar bloqueado, repetindo e repetindo o mesmo erro.

Alguns dirão, então qual é a graça? Mesmo assim, economizará muito, mas muito trabalho e produzirá código de melhor qualidade. Mas há um truque importante, existem ferramentas de software que ajudam você (também com IA) a realizar todo esse processo, são seus pequenos assistentes que seguem essas regras de análise e design, inclusive a Amazon lançou sua própria ferramenta ([Kiro](https://kiro.dev/)).

## Pesquisar antes de executar

Este é um “truque” que me ajudou muito em casos onde preciso lidar com desenvolvimentos relacionados a algum tópico que não conheço, algum novo framework ou até mesmo uma migração para uma nova versão.

Para poder guiar a IA, primeiro eu tenho que entender o que é necessário, mas para acelerar esse processo, uso [Gemini](https://gemini.google.com/) com sua opção de Deep Research (o Perplexity também faz isso muito bem) e peço que me faça um relatório detalhado especificando o caso, o que preciso aprender e estabelecendo o plano de pesquisa.

Esse relatório serve para duas coisas: estudar, porque me permite, como “timoneiro”, obter um resumo rápido e altamente focado, e ao mesmo tempo serve (baixando-o como markdown) como contexto base para entregar à IA para executar a tarefa.

Isso me permitiu realizar trabalhos que talvez eu mesmo precisaria de pelo menos uma ou duas semanas para concluir, em apenas 1 ou 2 dias.

## Não confie cegamente

O código que a IA gera pode compilar, mas isso não significa que esteja correto. Pode ter problemas de segurança, erros lógicos ou usar bibliotecas obsoletas.

O código de IA deve passar exatamente pelos mesmos filtros que o seu: revisão, testes e validação.

Um bom conselho: se você não entende o que a IA escreveu, não o envie para produção. Se você não consegue mantê-lo depois, não deveria aprová-lo agora.

Um grande aliado para evitar problemas com documentação obsoleta (o que geralmente acontece com a IA) é utilizar [Context7](https://context7.com/) como MCP, é uma ferramenta que permite ao LLM buscar a documentação atualizada sobre a linguagem, framework ou biblioteca que você está usando, permitindo que ele se “atualize” sem a necessidade de um novo treinamento, é perfeito para casos onde você tem funções “depreciadas” (deprecated).

## Nem tudo é sobre velocidade

Sim, a IA pode acelerar tarefas, mas se você a usar mal, só vai acelerar seus erros.

Em ambientes corporativos ou de produto, o objetivo não é escrever mais código, mas entregar soluções confiáveis. A IA pode ajudar você a eliminar tarefas repetitivas ou explorar alternativas, mas a qualidade e a arquitetura continuam sendo sua responsabilidade.

## Adote uma mentalidade de orquestrador

O novo papel do desenvolvedor não é “quem digita mais rápido”, mas quem sabe guiar a IA com propósito.

O valor real está em definir o que deve ser construído, como é validado e como é mantido. Em outras palavras, passamos de ser produtores de código a estrategistas técnicos.

## Qual é a melhor ferramenta?

A resposta a esta pergunta sempre será: Aquela que melhor se adapta a você. No entanto, fazendo uma comparação destas 3 (não são as únicas, poderia ter incluído Deepseek Coder, Qwen, GPT-5, Mamba, etc). Mas acredito que isso serve para ter uma ideia das forças de 3 das mais populares: Copilot da Microsoft, Gemini do Google e Claude Code da Anthropic.

Em poucas palavras, pelo menos para programação, eu daria um 7/10 para o Gemini, um 9/10 para o Claude, e embora o Copilot fique um pouco atrás, com a assinatura básica ele permite usar diferentes modelos (entre eles o Claude Sonnet 4.5) e a grande vantagem é a integração “nativa” com o Github.

![Comparação de ferramentas de IA: Gemini, Claude, Copilot](/photos/2025/ia-tools-comparison.png "Comparação de ferramentas de IA")

## Conselho final

Em um mundo onde as máquinas podem escrever código em segundos, o verdadeiro valor humano não está na velocidade, mas no critério.

A IA pode gerar milhares de linhas, mas não entende de prioridades, contexto ou impacto. Essa continua sendo a nossa parte do trabalho.

Usar IA não nos torna menos desenvolvedores, nos obriga a ser melhores profissionais. Pede-nos para pensar mais, planejar melhor e ser mais conscientes das decisões que tomamos.

Porque, no final, a IA não substitui a experiência: ela a amplifica. Mas só se houver alguém por trás que saiba para onde quer ir.

### Recursos Adicionais

Alguns dos cursos que me ajudaram a melhorar e entender IA em geral, e também como usá-la para desenvolvimento:

*   [ChatGPT Prompt Engineering for Developers](https://learn.deeplearning.ai/courses/chatgpt-prompt-eng)
*   [Generative AI: OpenAI API, DeepSeek, and ChatGPT in Python](https://www.udemy.com/course/genai-openai-chatgpt/)
*   [Pair Programming with a Large Language Model](https://learn.deeplearning.ai/courses/pair-programming-llm)
*   [Claude Code: A Highly Agentic Coding Assistant](https://learn.deeplearning.ai/courses/claude-code-a-highly-agentic-coding-assistant)

Quanto às ferramentas, as mais populares e conhecidas são Cursor, Claude Code e ZenCode, mas recomendo dar uma olhada no [Kilo Code](https://kilocode.ai/). Ele permite usar múltiplos modelos (incluindo Claude Code) e pode ser usado dentro do VSCode para arquitetura, planejamento e execução.

### Ferramentas MCP

Atualmente, os LLM podem se comunicar com outros serviços ou até mesmo executar ferramentas que lhes permitem obter contexto adicional e, com isso, conseguir melhores respostas. As básicas que eu recomendaria são:

*   [mcp-read-website-fast](https://github.com/just-every/mcp-read-website-fast) (Permite baixar páginas web e usá-las como contexto)
*   [context7](https://github.com/upstash/context7) (baixa documentação atualizada sobre as bibliotecas/frameworks que você está usando).
*   [sequentialthinking](https://mcpservers.org/servers/modelcontextprotocol/sequentialthinking) (Ferramenta que permite às LLMs registrar seus “pensamentos” e decompor melhor tarefas complexas).