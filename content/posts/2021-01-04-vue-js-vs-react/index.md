---
title: Vue.JS vs React
date: 2022-01-23T07:01:10.093Z
featuredImage: /photos/vue-vs-react.jpg
description: Comparación entre dos de las tecnologías más utilizadas para
  frontend en los últimos años
tags:
  - React
  - Development
  - Tecnología
  - Javascript
---
Si trabajas en desarrollo web es más que seguro que has escuchado acerca de React, VueJS y Angular, en este artículo daré algo de contexto y comparación entre las 2 opciones con las que he tenido que trabajar y cuales son las ventajas y desventajas.

## Antecedentes

Hace algunos años decidí comenzar a modernizar la forma en la que había estado acostumbrado a construir aplicaciones, especialmente en la parte del frontend, me había quedado demasiado tiempo en mi zona de comfort con [Drupal](https://www.drupal.org/) que si bien sigue siendo una herramienta sumamente útil, al mismo tiempo había proyectos en los que sólo la configuración inicial tomaba mucho más tiempo de lo que probablemente me tomaría crear una aplicación sencilla.

Escuchaba que aparecían más alternativas para crear interfaces y mucho del mercado estaban experimentando con las SPAs (Single Page Applications) y JAM Stack (Javascript APIs y Markup), así que comencé a ver qué es lo que estaba disponible.

Originalmente arranqué con AngularJS que luego pasó a ser simplemente [Angular 2](https://angular.io/) (al momento de escribir este artículo van por la versión 13 y la versión inicial ha sido descontinuada completamente), desarrollado y auspiciado por Google se trata de un framework para aplicaciones web que se aprende bastante fácil porque trabaja extendiendo el HTML que ya conocemos con directivas para simplificar el trabajo, uno de los grandes peros que muchos le encontraron fue que forzaba el uso de Typescript en lugar de Javascript y aunque esto en el fondo representa ventajas quitaba la opción de elegir, además que alteraba directamente el DOM (a partir de la versión 2 ya no es así) lo cual hacía que su rendimiento fuera lento.

El equipo de desarrollo de Angular llegó al punto de "aceptar su derrota" y decir que el equipo de [React](https://reactjs.org/) (la biblioteca hecha por Facebook) había sido mejor pensado.

Por esto (además de haber encontrado mil y un problemas de rendimiento al usar Angular en móviles cuando las aplicaciones comenzaban a crecer, decidí dar el salto y aprender React.

## React

React es una biblioteca de Javascript sumamente flexible que está enfocada específicamente en construir interfaces de usuario, no es "opinionada" es decir, nos da la libertad de utilizar los componentes que nosotros querramos para el manejo de datos, estado, ruteo, etc.  Aunque a veces esa libertad también puede irse en nuestra contra si es que dedicamos mucho tiempo a escoger cual será el esquema a usar, al principio la lista de opciones es demasiado larga, pero con la experiencia eso va siendo más sencillo y llegas a tener tu lista de preferidos bastante bien definida.

Permite crear interfaces y experiencias complejas al crear piezas aisladas de código llamadas "componentes", una buena práctica recomendada es integrar esto con una herramienta como [Storybook](https://storybook.js.org/) y puedes ver cómo lucen y se comportan los componentes sin siquiera tener que conectarte con una fuente de datos, lo cual permite trabajar la lógica completamente aislada del estilo.

Para crear la representación de sus componentes utiliza una sintaxis específica, llamada JSX que se asemeja visualmente a HTML (ya hablare en detalle) pero permite traducirlo luego al elemento será mostrado en la pantalla, que en el caso de la web, sí es una etiqueta HTML finalmente.

Este concepto permite la separación entre la lógica de visualización y la implementación, y es por esta razón que también se facilitó el nacimiento a React Native, que mantiene los mismo conceptos de React, pero permite "traducir" los componentes a otros dispositivos, como puede ser la Web, el escritorio o un teléfono móvil.

## VueJS

Vue a diferencia de React fue pensado para tener una definición más completa y acercarse más al modelo MVC, no sólo manejando una capa de presentación sencilla, sino también incluir más herramientas, como inclusive el manejo de estados.   Una de las ventajas es que permite ser utilizado de forma progresiva, es decir, no hace falta migrar completamente una aplicación para poder aprovecharlo y se enfoca en ser sencillo, entregando el mínimo o lo que diríamos lo "justo y necesario" para poder hacer una aplicación funcional.

Maneja el mismo concepto de componentes de React (trata de aprovechar lo mejor de sus antecesores) y lo integra con el uso de directivas, lo que permite que podamos integrar un componente con el HTML que ya conocemos y podemos usar.  Otra de las características de Vue es que permite trabajar tanto con CSS que sólo existe dentro de un scope o también de forma global (para los que vienen de React, ya tiene integrado su propio Styled Components como parte de su diseño).



### Sintáxis

Una de las grandes diferencias entre Vue y React es la forma en que la capa de visualización se construye.  Por defecto, Vue utiliza plantillas HTML, pero también existe la opción de escribirlo en JSX.  Con React, por el otro lado sólo se puede utilizar JSX, lo cual hace que primero tengamos que acostumbrarnos a esa sintáxis.

Vue por su lado maneja una "separación de áreas"(separation of concerns) utilizando HTML, CSS y JS lo cual hace que inclusive un desarrollador frontend principiante pueda aprender a crear una aplicación Web con muy poco conocimiento, inclusive se puede crear una aplicación con Vue sin necesitar instalar ninguna herramienta, tan sólo incluyendo Vue desde una CDN.

Otra ventaja es que las plantillas HTML hacen que sea muy sencillo para los Diseñadores Web entender cómo está estructurada la aplicación y facilita la colaboración entre desarrolladores y diseñadores.

React con sus "JavaScript Expressions" (JSX) combina HTML y CSS dentro de JavaScript.  Lo cual muchas veces confunde a los neófitos de React, pues tiene apariencia de XML pero se traduce a objetos una vez que esto es transformado por el "motor" de React.  En el fondo esto es algo de lo más poderoso del framework, porque permite crear componentes de UI que están "auto contenidos" y se pueden compartir y reutilizar en diferentes aplicaciones.

La forma en la que los desarrolladores que trabajan con ambas herramientas puede ayudar a decidir cuál está más ajustada a sus expectativas y capacidades.

Qué es lo que le gusta a los desarrolladores que usan Vue.js:

* Curva de aprendizaje muy fácil
* Estilo de programación elegante que permite el uso de patrones.
* Buena Documentación

Los desarrolladores que usan React por su lado disfrutan:

* Un estilo de programación elegante y buenos patrones de diseño
* Un ecosistema de paquetes/componentes extenso
* Uso generalizado (más oportunidades laborales y de soporte)

Mientras en la encuesta de [2020 de Stack Overflow,](https://insights.stackoverflow.com/survey/2020#most-popular-technologies) sobre los frameworks más utilizados React estaba en 2do lugar con un 35.9% en [2021](https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-web-frameworks) pasó al primer lugar con un 40.14% (superando a jQuery que antes era el primero).

![Most used Web Frameworks in 2021](/photos/screen-shot-2022-01-24-at-01.44.51.png "Most used Web Frameworks in 2021")

### Facilidad de Integración 

**Vue.js** se considera un framework progresivo, es decir se puede integrar de manera incremental en un proyecto ya existente sin necesidad de migrar toda la aplicación, un ejemplo sencillo sería crear un widget de interacción específico a una aplicación web que ya contara con código legado.  Se puede mantener la aplicación sin cambios y sólo agregar la nueva funcionalidad con VueJS.

**React.js** en cambio fue concebido originalmente para proyectos de gran escala, por lo cual si sólo quisiera agregar una pequeña funcionalidad, sería más un dolor de cabeza que una ventaja.  La configuración inicial y la selección de componentes probablemente tomaría más tiempo de lo que se necesita para hacer una funcionalidad rápida, pero permite tener una mejor arquitectura para proyectos grandes, así que los beneficios se ven al largo plazo.

## La herramienta correcta dependerá de tus necesidades

Vue.js y React son ambas muy buenas herramientas para construir interfaces de usuario e interacción.  Para escoger cual es la mejor para tu próximo proyecto, hay que analizar múltiples factores, partiendo con el caso de uso específico, las necesidades del negocio, el ambiente, la disponibilidad de desarrolladores que tienes a la mano, presupuesto y el tiempo que tienes disponible.

Vue is muy ligero, fácil de aprender y divertido de usar.  Al tener una sintaxis simple, si recién comienzas a aprender el uso de componentes o vienes del mundo jQuery, utilizarlo será muy sencillo y la transición no será dolorosa.  Funciona bien para proyectos pequeños, pero también puede funcionar para aplicaciones de gran tamaño.

En términos de rendimiento, Vue.js está a la par con React, sin embargo depende más de las optimizaciones y el tamaño de la aplicación; tiene muy buena documentación, explicando cada elemento y dando el paso a paso a detalle.

Vue viene con las "baterías incluídas" al tener paquetes oficiales para manejo de estados, enrutamiento, renderizado del lado del servidor (SSR) y se mantiene sumamente activo. Todo eso sumado, permite crear MVPs de una forma rápida y eficiente.

React, por su parte es un "veterano" entre las herramientas de Javascript.  Con soporte corporativo, una tremenda comunidad y un ecosistema extremadamente grande, React se convierte en una muy buena herramienta para construir aplicaciones de nivel empresarial.  Otro punto importante, es que justamente por el uso que tiene y la adopción generalizada, el mercado laboral tiene muchísimas ofertas disponibles para quienes manejan esta herramienta. De la misma forma, buscar información o tratar de conseguir ayuda no será para nada un problema.

Sin duda hay más y nuevos competidores cada vez en el área de herramientas de front-end, [Angular](https://angular.io/) sigue con el soporte de Google, [Svelte](https://svelte.dev/) ha ganado mucha tracción, [Alpine.js](https://alpinejs.dev/) se presenta como el futuro reemplazo de jQuery, [Stimulus](https://stimulus.hotwired.dev/) también se presenta como otro competidor, la lista podría continuar sin parar.

Al final del día lo más importante será poder resolver un problema de la mejor forma posible y con el menor impacto en el uso de recursos, por lo cual recomendaría siempre mantener un enfoque pragmático y escoger la herramienta que más se ajuste al proyecto y al equipo, y si tienes la oportunidad de experimentar y probar, hazlo.

Una recomendación profesional para proyectos medianos a grandes, fíjate en las tendencias del mercado, no querrás quedarte con una herramienta que pierde su "furor" y no tiene soporte o su desarrollo se congela y complique tu propio proyecto.
