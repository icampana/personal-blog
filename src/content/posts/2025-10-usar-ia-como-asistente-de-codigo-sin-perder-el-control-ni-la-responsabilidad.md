---
title: Usar IA como asistente de codigo sin perder el control ni la responsabilidad
date: 2025-10-25T00:00:00.000Z
featuredImage: /photos/ia_development_header.png
description: >-
  La IA puede escribir código, pero no puede asumir tu responsabilidad. Aprender
  a usarla bien es la nueva habilidad clave de todo desarrollador profesional.
tags:
  - AI
  - Desarrollo
  - Development
---

Trabajar con inteligencia artificial para escribir código ya no es algo del futuro o salido de las películas, es parte del trabajo diario. Pero usarla en un entorno profesional —donde lo que se libera a producción afecta a clientes, usuarios y reputación— requiere una forma de pensar diferente. No basta con “pedirle cosas al chat”. Hay que aprender a trabajar con la IA como si fuera parte del equipo, pero sin olvidar que la responsabilidad sigue siendo humana.

## La IA no es tu reemplazo, es tu nuevo “junior”

La forma más sana de verlo es así: *la IA es como un desarrollador nuevo, rápido y muy trabajador, pero sin experiencia*. No entiende el contexto del negocio, no tiene criterio y no sabe cuándo algo está mal diseñado. Tú sigues siendo quien define la dirección técnica, valida los resultados y asegura que el producto final sea estable y seguro.

Esa es la gran diferencia entre usar IA por hobby y hacerlo en un entorno profesional: no puedes soltarle el timón.

## Sé claro con lo que pides

Los resultados de la IA dependen directamente de la claridad de tus instrucciones. Si pides algo vago, te devolverá algo igual de vago (give it shit, and it will give you even more shit).

Por ejemplo, en vez de decir “haz un componente para login”, es mejor decir “crea un componente React llamado LoginForm con email y password, usando hooks y validación con zod, emplea [Mantine](https://mantine.dev/) como librería de componentes”.

Ser específico no es solo una buena práctica, es una forma de documentar lo que realmente esperas del sistema.

## Usa un plan, no una conversación infinita

Uno de los errores más comunes es tratar de resolver todo en una conversación caótica con el modelo. En un entorno formal, eso no sirve.

Lo que funciona es literalmente volver a las bases de la ingeniería, lo que aprendimos al estudiar, es decir volver a hacer Análisis, Diseño y finalmente Desarrollo (aún recuerdo el que fue nuestro “libro gordo de petete”, Análisis y diseño de sistemas de Kendall y Kendall.

Es decir, para que la IA funcione debe tener un plan de trabajo documentado, incluso algo tan simple como un archivo plan.md donde expliques qué vas a cambiar, qué archivos afectará y qué pasos debe seguir la IA.

Esto te da control, hace el proceso repetible y permite que otros en el equipo entiendan cómo llegaste a una solución. En pocas palabras: te protege y organiza.

En mis experimentos, uno de los modelos más balanceados es gemini-pro, sin embargo usando Gemini Cli para tratar de hacer algo tan “sencillo” como migrar  de una versión de React a otra, podría tardarse horas y quedarse bloqueado repitiendo y repitiendo el mismo error.

Algunos dirán, entonces cuál es el chiste? Aún así te ahorrará mucho, pero muchísimo trabajo y producirá código de mejor calidad.  Pero hay un truco importante, existen herramientas de software que te ayudan (también con IA) a realizar todo ese proceso, son tus pequeños asistentes que van siguiendo esas reglas de análisis y diseño, inclusive Amazon sacó su propia herramienta ([Kiro](https://kiro.dev/)).

## Investigar antes de ejecutar

Este es un “truco” que me ha ayudado mucho en casos donde tengo que manejar desarrollos relacionados con algún tema que no conozco, algún nuevo framework o inclusive una migración a una nueva versión.

Para poder guiar a la IA, primero yo tengo que entender lo que es necesario, pero para acelerar ese proceso, uso [Gemini](https://gemini.google.com/) con su opción de Deep Research (Perplexity también hace eso muy bien) y le digo que me haga un informe detallado especificando el caso, lo que necesito aprender y estableciendo el plan de investigación.

Ese reporte sirve para dos cosas, estudiar, porque me permite a mi como “timonel” obtener un resumen rápido y altamente enfocado y al mismo tiempo sirve (bajándolo como markdown) como contexto base para poder entregarselo a la IA para poder ejecutar la tarea.

Esto me ha permitido realizar trabajos que quizá yo mismo hubiera necesitado al menos una semana o dos para lograrlo, en apenas 1 o 2 días.

## No confíes ciegamente

El código que genera la IA puede compilar, pero eso no significa que esté bien. Puede tener problemas de seguridad, errores lógicos o usar librerías obsoletas.

El código de IA debe pasar exactamente los mismos filtros que el tuyo: revisión, testing y validación.

Un buen consejo: si no entiendes lo que la IA escribió, no lo subas a producción. Si no puedes mantenerlo después, no deberías aprobarlo ahora.

Un gran aliado para evitar problemas con documentación obsoleta (que por defecto suele pasar con la IA) es utilizar [Context7](https://context7.com/) como MCP, es una herramienta que le permite al LLM buscar la documentación actualizada sobre el lenguaje, framework o librería que estás usando, le permites “actualizarse” sin necesidad de nuevo entrenamiento, es perfecto para casos donde tienes funciones “depreciadas” (deprecated).

## No todo se trata de velocidad

Sí, la IA puede acelerar tareas, pero si la usas mal, solo vas a acelerar tus errores.

En entornos corporativos o de producto, el objetivo no es escribir más código, sino entregar soluciones confiables. La IA puede ayudarte a eliminar tareas repetitivas o explorar alternativas, pero la calidad y la arquitectura siguen siendo responsabilidad tuya.

## Adopta una mentalidad de orquestador

El nuevo rol del desarrollador no es “quien teclea más rápido”, sino quien sabe guiar a la IA con propósito.

El valor real está en definir qué se debe construir, cómo se valida y cómo se mantiene. En otras palabras, pasamos de ser productores de código a estrategas técnicos.

## ¿Cuál es la mejor herramienta?

La respuesta a esta pregunta siempre va a ser: La que mejor se adapte a ti.  Sin embargo, haciendo una comparación de estas 3 (no son las únicas, podría haber incluido a Deepseek Coder, Qwen, GPT-5, Mamba, etc).  Pero esto creo que sirve para tener una idea de las fortalezas de 3 de las más populares: Copilot de Microsoft, Gemini de Google y Claude Code de Anthropic.

Poniéndolo en pocas palabras al menos para programación yo le pondría un 7/10 a Gemini, un 9/10 a Claude, y aunque Copilot se queda atrás, con la subscripción básica te permite usar diferentes modelos (entre esos Claude Sonnet 4.5) y la gran ventaja es la integración “nativa” con Github.

![IA tools comparison: Gemini, Claude, Copilot](/photos/2025/ia-tools-comparison.png "IA tools comparison")

## Consejo final

En un mundo donde las máquinas pueden escribir código en segundos, el verdadero valor humano no está en la velocidad, sino en el criterio.

La IA puede generar miles de líneas, pero no entiende de prioridades, contexto o impacto. Esa sigue siendo nuestra parte del trabajo.

Usar IA no nos hace menos desarrolladores, nos obliga a ser mejores profesionales. Nos pide pensar más, planificar mejor y ser más conscientes de las decisiones que tomamos.

Porque al final, la IA no reemplaza la experiencia: la amplifica. Pero solo si hay alguien detrás que sepa hacia dónde quiere ir.

### Recursos Adicionales

Algunos de los cursos que me ayudaron a mejorar y entender IA en general más también como usarla para desarrollo:

* [ChatGPT Prompt Engineering for Developers](https://learn.deeplearning.ai/courses/chatgpt-prompt-eng)
* [Generative AI: OpenAI API, DeepSeek, and ChatGPT in Python](https://www.udemy.com/course/genai-openai-chatgpt/)
* [Pair Programming with a Large Language Model](https://learn.deeplearning.ai/courses/pair-programming-llm)
* [Claude Code: A Highly Agentic Coding Assistant](https://learn.deeplearning.ai/courses/claude-code-a-highly-agentic-coding-assistant)

En cuanto a herramientas, las más populares y conocidas son Cursor, Claude Code y ZenCode, pero les recomiendo darle una mirada a [Kilo Code](https://kilocode.ai/) les permite usar múltiples modelos (incluido Claude Code) y pueden usarlo dentro de VSCode para hacer la arquitectura y planificación además de la ejecución.
