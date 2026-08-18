---
title: >-
  Cómo trabajo con los agentes de IA (una guía práctica sobre contexto y
  memoria)
featuredImage: /photos/2026/IA-Toolset.jpeg
date: 2026-08-18T00:00:00.000Z
description: >-
  Lo que separa a un agente que te ahorra horas de uno que te las hace perder
  no es el modelo que tiene debajo, es el contexto que le das y la memoria que
  conserva de lo que ustedes dos ya decidieron. Un recorrido práctico por las
  herramientas de memoria y manejo de contexto que uso hoy en cada proyecto:
  mise, Engram, context-mode y CodeGraph.
tags:
  - Development
  - IA
---

Mientras más me adentro en el universo de las herramientas de programación con IA sigo encontrando modelos, benchmarks, "razonamiento" y todo tipo de marketing y “wishful thinking”, pero antes que nada, encontré que lo que de verdad separa a un agente que te ahorra horas de uno que te las hace perder no es el modelo que tiene debajo (aunque ayuda), es el contexto que le das (junto con la memoria que conserva de lo que se decidió a priori), y la mayoría de las reseñas y guías de herramientas se olvidan de esa parte.  Comparto esto desde mi experiencia profesional, con las herramientas que actualmente uso día a día.

Para mí, es más fácil pensar en un agente de IA como un compañero rápido y capaz que acaba de llegar y todavía no ha visto tu codebase; a una persona así no le entregarías un ticket y esperarías que lo resuelva a ciegas, le pedirías que se siente, le mostrarías el proyecto, le explicarías qué se decidió la semana pasada y por qué, y recién ahí lo dejarías trabajar, y todo el juego con estas herramientas es conseguir ese comportamiento, de forma sistemática, con manejo de contexto y memoria en vez de esperanza.  Pensando en mi experiencia personal el onboarding dependiendo de la complejidad del projecto podría tomar desde 2 semanas hasta 3 meses (lo viví en carne propia), entonces cómo podríamos hacer un onboarding correcto para un IA.

## Primero el contexto, después el código

Ahora mismo el fallo más común que veo es gente que le pide a un agente que "arregle esto" sin decirle nada más, y casi nunca es culpa del agente, es nuestra, queremos un compañero inteligente y lo tratamos como un cuadro de búsqueda, así que lo hago leer primero el proyecto, el lenguaje, el framework, las convenciones existentes, y adaptarse a lo que hay de verdad en lugar de imponer algún stack preferido que aprendió en sus datos de entrenamiento, y le digo lo mismo que le diría a un ingeniero nuevo: no redescubras el codebase en cada sesión, sincronizate con la documentación y con lo que ya se decidió, porque un agente que adivina tu arquitectura es exactamente tan peligroso como un ingeniero que la adivina.

Para la parte estructural de ese contexto me apoyo en **CodeGraph**, que construye un grafo de conocimiento de cada símbolo, arista y archivo del workspace, analizado con tree-sitter, y responde las preguntas que grep no puede, como "¿quién llama a esto?" o "¿qué se rompería si cambio aquello?", en submilisegundos ([npmjs.com/package/@colbymchenry/codegraph](https://www.npmjs.com/package/@colbymchenry/codegraph)). Lo uso para la estructura y dejo grep para el texto literal, y convierte un contexto que el agente tendría que construir leyendo archivos completos en contexto que ya está ahí.

Lo que básicamente hace es tener de manera local un índice de funciones, llamados, estructura en general que hace que sea una búsqueda inmediata y no un eterno ciclo de grep + find eternamente.  Hay muchos proyectos similares, pero este es uno de los que tiene una comunidad bastante grande y estable.

## La memoria es la parte de la que nadie habla

Cualquier modelo olvida todo lo que hicieron en cuanto termina la sesión, para esto utilizo 2 herramientas, una memoria compartida y documentación “viva” con OpenWiki (que explico más adelante), en mi caso que terminé tratando la memoria persistente como el verdadero activo, y hay dos capas que mantengo separadas a propósito; está la memoria privada, que es como las notas que el agente guarda para sí mismo sobre tus decisiones, bugs y convenciones, almacenada por proyecto para que trabajar en un repo nunca saque a la luz las decisiones de otro repo, y está la documentación del propio repo, la wiki que vive en el codebase y que la próxima persona, o la próxima sesión, lee como fuente de verdad, la diferencia es que la privada es lo que recuerda la próxima sesión y la wiki es lo que lee la próxima persona, y necesitas ambas, no una sola.

Para la capa privada uso **Engram**, un almacén local en SQLite + FTS5 que sobrevive entre sesiones y hasta a la compactación de contexto, donde guardas observaciones tipadas y te marca un conflicto en vez de sobrescribir en silencio cuando una memoria nueva contradice a una vieja, así que terminas con una conversación que carga su propia historia en vez de un chat sin estado que empieza de cero cada lunes ([github.com/Gentleman-Programming/engram](https://github.com/Gentleman-Programming/engram)). Lo uso de forma proactiva, no cuando me lo piden: contexto al inicio de la sesión, una búsqueda antes de empezar cualquier cosa que pueda haberse tocado antes, un guardado inmediatamente después de cualquier decisión o cambio de convención, y un resumen antes de cerrar, y suena a overhead hasta que te das cuenta de que la alternativa es redescubrir, y redecidir, lo mismo cada semana.

#### ¿Qué es lo que genera esto?

Que cuando vuelves a comenzar a trabajar en el proyecto en lugar de volver a explicar lo que hiciste en las últimas sesiones, tienes un histórico que se puede buscar de forma semántica, con decisiones, ajustes, explicaciones que el agente puede encontrar fácilmente, inclusive ha llegado a pasar que pido un cambio y el agente me puede responder “Estás seguro? eso va en contra de lo que hicimos hace 2 semanas”, hasta me recuerda a mi mismo qué fue lo que entregué.

## La wiki del repo es la memoria pública

Y acá es donde entra la segunda capa de la que te hablaba, porque si Engram es lo que el agente recuerda en privado, [OpenWiki](https://github.com/langchain-ai/openwiki) es lo que el repo guarda en público, una wiki propia que vive dentro del codebase, otra vez bajo openwiki/, y que la próxima persona, o la próxima sesión, lee como fuente de verdad del estado actual del proyecto, no un changelog que nadie lee, sino la documentación real, enraizada en los archivos, la historia de git y las decisiones que ya se tomaron, la herramienta oficial se integra con github y se puede gatillar después de un merge , sin embargo si lo quieres hacer manualmente (funciona muy bien también), existe un [plugin para Claude Code](https://github.com/SoulKyu/openwiki-cc) (fácilmente adaptable como skill a cualquier otro agente que cumple la misma función.

La integración a mi flujo es una sola regla: después de cualquier cambio que mueva la arquitectura, una convención o un workflow, corro *`/openwiki:wiki update`* antes de dar el ticket por terminado, y lo bueno es que es idempotente, hace un snapshot del wiki antes y después y solo actualiza lo que de verdad cambió, así que correrlo seguido es barato y correrlo rara vez es lo que lo vuelve caro, y el patrón completo queda así: Engram es lo que recuerda la próxima sesión, OpenWiki es lo que lee la próxima persona, y necesitas ambas, no una sola.  Si sigues la estructura recomendada te ayuda a que el agente encuentre respuestas mucho más fácil, en mi caso inclusive me ha ayudado para encontrar partes obsoletas de la aplicación, secciones que necesitan actualización y se mantiene la idea de la ingeniería básica que es que siempre la documentación esté al día

## La ventana de contexto es un presupuesto, no un tacho de basura

Este es la parte cambió cómo trabajo al reducir increíblemente el consumo de tokens, porque el movimiento ingenuo es tirar cada log, cada diff, cada página web a la conversación y dejar que el modelo nade en eso, pero aprendí a darle herramientas que procesan e indexan eso en su lugar, así que la salida grande se busca en vez de pegarse, con una base de conocimiento consultable, que suena a detalle de implementación pero en la práctica es la diferencia entre un agente que sigue lúcido en la segunda hora y uno que se ahoga en tokens que ya no puede razonar.

**context-mode** es mi herramienta de cabecera acá: ejecuta la salida de las herramientas en un sandbox y la indexa, así un log enorme o un diff grande se procesa y se busca en lugar de volcarse directo a la ventana de contexto, y solo la respuesta que necesitas vuelve a la conversación ([github.com/mksglu/context-mode](https://github.com/mksglu/context-mode)). Es una de esas herramientas que no notas que funciona hasta que se la quitas y de repente el agente vuelve a leerse archivos de mil líneas en su ventana y se olvida de lo que estaba haciendo.

## Las pruebas son el instrumento, no la formalidad

Y acá es donde entra la disciplina que le da sentido a todo lo anterior, porque un agente con contexto y memoria pero sin pruebas es solo un agente que suena seguro, así que el ciclo es red, green, refactor, escribí primero la prueba que falla para el cambio, después el mínimo código para que pase, y por último limpiá lo que sobra, y no bajo al agente por eso, lo acostumbro a que cada ticket real corra la suite completa y, sobre todo, a que corra el comando real y lea la salida real antes de afirmar que algo funciona, porque yo puedo prometerte que una prueba pasó, pero si no la corriste y no viste su salida, es solo una afirmación (evidencia antes que afirmaciones).

## Los ojos que el agente necesita: Chrome DevTools

Y queda una última pieza que casi nadie usa cuando recién arranca, porque una suite de pruebas te dice si el código es lógico, no si se ve bien en un browser, así que para la pregunta "¿esto de verdad funciona en el navegador?" y no "¿compila?", le di ojos al agente con Chrome DevTools MCP, que le da un Chrome real que puede manejar: navegar, clickear, llenar formularios, tomar snapshots del DOM y del árbol de accesibilidad, revisar la red y la consola, correr trazas de performance y hasta audits de Lighthouse y screenshots. En la práctica es la diferencia entre que el agente te diga "el fix compila" a que te diga "abrí la página, el flujo de consentimiento se ve así, la consola no muestra errores y el LCP bajó dos segundos", y eso, junto con las pruebas, es lo que convierte a un asistente de terminal en algo en lo que de verdad puedes apoyarte para entregar.

## Superpowers: el proceso como extensión

Y si el proceso es donde está el valor, la forma de no olvidarlo es dejar que una biblioteca de skills, Superpowers, hay otras opciones, como los [Skills the Matt Pocock](https://github.com/mattpocock/skills) pero al menos en mi caso me resultó mucho más práctico para mis necesidades usar Superpowers, así puedo hacer el salto entre un proceso estricto y uno más relajado, superpowers permite hacer la alineación por nosotros, que se carga solo al inicio de la sesión y enruta cada tarea a su skill correcto ([github.com/obra/superpowers](https://github.com/obra/superpowers)). Los dos que más uso son el brainstorming y el planning: el primero me obliga, y obliga al agente, a convertir una idea difusa en un diseño acordado antes de que exista una sola línea de código, a discutir los requisitos y el enfoque en vez de asumirlos, y el segundo rompe ese diseño ya aprobado en un plan de implementación chico, usando TDD donde primero define las pruebas que fallan, crea un SPEC, luego un plan y recién ahí saltamos a implementar, así que no le estoy delegando el qué, le estoy delegando el cómo de un problema que ya definimos juntos, y lo que me parece importante es que usa el sistema de archivos de forma que inclusive si cierras la sesión puedes continuar a partir de los archivos con un HANDOFF, lo cual luego puede pasar a transformarse en documentación dentro de OpenWiki.

## Premortem: el skill que exige el ticket

Y a ese proceso le agregué aparte uno que no pertenece a Superpowers sino que se instala solo, porque es la puerta obligatoria antes de que cualquier ticket terminado vuelva: el premortem, donde asumes que el cambio ya falló en producción y estás trabajando hacia atrás buscando modos de fallo, regresiones y Edge cases, arreglas lo que encuentre, lo vuelves a correr, y si algo deliberadamente no se arregla, lo dejas por escrito en la entrega ([Premortem Skill](https://explainx.ai/skills/parcadei/continuous-claude-v3/premortem)).

Todo esto lo integro en mi "system prompt" de base, puede ser CLAUDE.md o AGENTS.md que se lee al inicio (de manera global, no por proyecto), para obligar al agente que antes de entregar algo lo pase por el proceso de Pre-mortem, estoy pensando en convertirlo en un subagente para que lo haga con contexto limpio, pero por lo pronto como Skill ha dado excelentes resultados.

## Todo avance es un cambio de proceso, no un cambio de modelo

Las herramientas que más me movieron no son los prompts más ingeniosos, son las disciplinas alrededor de todo el asunto, brainstorming antes de tocar código, tests con refactor, y sobre todo un premortem antes de que cualquier ticket terminado vuelva, donde asumes que el cambio ya falló en producción y trabajás hacia atrás buscando los modos de fallo, regresiones y casos borde, que es una puerta, no una sugerencia, y corro el build real y leo la salida real antes de que yo o el agente afirmemos que algo funciona, porque evidencia antes que afirmaciones.

## Por qué todas estas herramientas pasan por un gestor de runtime

Y acá hay un detalle del que nadie te advierte, que es que todas estas son de lenguajes y runtimes distintos pegados entre sí, un binario en Go para la memoria, un paquete npm para el grafo de conocimiento y el sandbox, y así, y en la máquina promedio eso significa que las herramientas globales instaladas con un `npm install -g` a secas aterrizan bajo la versión de Node que `nvm` o `fnm` tenga activa en ese momento, y en cuanto tu shell elige otro Node, en una terminal, en otro repo adentro de otro proyecto, ese path se cae de tu `PATH` y la herramienta desaparece en silencio.

Así que las gestiono con **mise**, que fija un runtime explícito para las herramientas globales y es dueño de sus shims fuera de los directorios bin por versión del gestor de versiones, así el path se mantiene estable en vez de depender de la moda de la semana en tu `.nvmrc` ([mise.jdx.dev](https://mise.jdx.dev)). La regla que mantengo en la cabeza mapea exactamente a las herramientas de esta lista: mise para todo lo que sea un paquete de lenguaje con entrada de CLI, y un único dueño por binario, porque dos gestores de paquetes actualizando la misma herramienta en cronogramas distintos van a terminar, siempre, peleando.

Quizás no soy el mejor en esto, pero después de dos años trabajando con estos agentes en proyectos reales, esto es lo que me quedé, y el resumen honesto es: debemos tratar al agente como al compañero que podría ser, darle contexto, mantener su memoria, y aplicar las mismas disciplinas que le aplicarías a una persona, porque el modelo es barato, el contexto es lo que nosotros controlamos, y la diferencia entre una herramienta que te impresiona en una demo y una que te entrega el trabajo es, en todos los casos que vi, si te tomaste el trabajo de manejar el contexto y la memoria.
