---
title: >-
  ¿Tus commits son un desastre? Aprende a estandarizarlos con Commitlint, Husky
  y Commitizen
date: 2025-03-31
featuredImage: /photos/2025/Commits-Computador.jpeg
description: >-
  Aprende a estandarizar tus commits con Commitlint, Husky y Commitizen. Mejora
  la claridad y colaboración en tus proyectos de desarrollo.
tags:
  - Development
  - Clean Code
  - Programming
---

¿Cuántas veces has revisado el historial de commits de un proyecto y te has encontrado con mensajes confusos, inconsistentes o simplemente inútiles? Si trabajas en equipo, sabrás que esto puede convertirse en una pesadilla. La falta de un estándar en los commits dificulta la comprensión de los cambios, la colaboración y el mantenimiento del proyecto. Pero, ¿y si te dijera que hay herramientas que pueden solucionar este problema?

En este post, te voy a enseñar cómo usar Commitlint, Husky y Commitizen para estandarizar tus commits y hacer que tu historial de Git sea mucho más limpio y ordenado.

¿Por qué estandarizar los commits?

Antes de entrar en materia, hablemos de por qué es importante estandarizar los commits:

* Claridad: Mensajes de commit claros y concisos facilitan la comprensión de los cambios realizados.
* Consistencia: Un estándar asegura que todos los commits sigan el mismo formato, lo que mejora la legibilidad del historial.
* Colaboración: Un historial de commits ordenado facilita la colaboración entre los miembros del equipo.
* Mantenimiento: Un historial claro facilita la identificación de errores y la realización de cambios en el futuro.

Commitlint, Husky y Commitizen: el trío perfecto

Estas tres herramientas trabajan juntas para ayudarte a estandarizar tus commits:

* Commitlint: Esta herramienta verifica que los mensajes de commit cumplan con un estándar predefinido.
* Husky: Husky te permite ejecutar scripts de Git antes de realizar un commit, lo que te permite verificar los mensajes con Commitlint.
* Commitizen: Esta herramienta te guía en la creación de mensajes de commit que cumplen con el estándar.

¿Cómo usarlas?\
\
Primero instalemos las dependencias:

```shell
yarn add -D @commitlint/cli @commitlint/config-conventional commitizen husky
```

\
Crear una configuración base para commitlint:

```shell
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

Crear una configuración base para commitizen:\


```shell
yarn commitizen init cz-conventional-changelog --yarn--dev--exact
```

Habilitar los hooks de husky:

```shell
npx husky install
npx husky add .husky/commit-msg 'yarn commitlint --edit $1'
npx husky add .husky/prepare-commit-msg "exec < /dev/tty && npx cz --hook || true"
```

\
Finalmente habilitar los scripts para que tanto husky como commitizen se disparen automáticamente, dentro del package.json en la sección de scripts agregamos estos dos:

```json
{
  "scripts": {
    "prepare": "husky install",
    "commit": "git-cz"
  }
}
```

Con esto automáticamente cada vez que intentemos hacer un commit nos va a habilitar la herramienta para llenado de los mensajes de commit y se va a asegurar de que sigamos un estándar.

La regla para es sencilla: todo en minúsculas, un espacio entre los dos puntos y la descripción, y sin punto final. Así de simple.

Generalmente, solo escribo la primera línea, pero mira estos tipos que podemos usar para dejar todo organizado:

* chore: Para esas actualizaciones que no tocan el código de producción, como cambios en herramientas, configuraciones y bibliotecas.
* feat: Cuando añadimos una funcionalidad nueva o implementamos algo nuevo en el código.
* fix: Para corregir esos bugs molestos que siempre aparecen.
* refactor: ¿Sabes esos cambios en el código que no alteran la funcionalidad final? Entonces, es para eso.
* docs: Cuando solo tocamos los archivos de documentación.
* perf: Para esas alteraciones que hacen el código más rápido y eficiente.
* style: Cuando cambiamos la formatación del código, como espacios en blanco, punto y coma, etc.
* test: Para añadir o corregir pruebas en los procesos automatizados.
* build: Para cambios en el sistema de construcción o en dependencias externas.
* ci: Para cambios en los archivos y scripts de configuración de CI.
* env: Para modificaciones o adiciones en archivos de configuración de CI.

Ejemplos de commits que te van a gustar:

* chore: add commitlint y husky
* chore(eslint): obligar el uso de comillas dobles en React
* refactor: refactorizando el manejo de caché para usar Redis
* feat: agregado AlovaJS para hacer el llamado a los APIs
* feat(page/dashboard): creando el enrutamiento con React Router

Con estos commits estandarizados, es mucho más fácil entender lo que se hizo en el código. Y si trabajas solo, ¿te imaginas volver a un proyecto después de 6 meses? Con los commits organizados, recordarás todo mucho más rápido.

Conclusión:

Estandarizar tus commits puede parecer una tarea tediosa al principio, pero los beneficios a largo plazo son innegables. Con Commitlint, Husky y Commitizen, puedes crear un historial de Git limpio, ordenado y fácil de entender. ¡Anímate a probarlas y verás la diferencia!
