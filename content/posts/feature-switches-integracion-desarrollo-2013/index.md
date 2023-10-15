---
title: 'Feature Flags, una herramienta para integrar cambios en tus desarrollos'
date: 2023-10-15T05:00:00.000Z
featuredImage: /images//blue-featureflag.png
description: >-
  Sabes qué es un feature flag? Aprende cómo integrarlo en tu flujo de trabajo
  para que puedas hacer deployments graduales de nuevas funcionalidades sin
  temor a que algo se "rompa" en producción.
tags:
  - Programming
  - Tools
  - Software Development
---

Hacer un release de software con una nueva funcionalidad en la cual hay muchos cambios en la experiencia del usuario, o que directamente alteran el flujo de trabajo típico de nuestra aplicación, genera dudas y mucho nerviosismo al momento de pasarlo a producción.  Si algo sale mal la primera idea es echar todo para atrás y volver a como las cosas estaban antes, pero qué pasaría si pudiéramos tan sólo "desactivar" temporalmente esa funcionalidad mientras investigamos qué pasó, sin necesidad de hacer un rollback.  O inclusive, qué tal si sólo se lo mostramos a un grupo de usuarios?  Esto en pocas palabras, es lo que nos permite hacer un Feature Flag o Feature Switch.

## ¿Qué son las Feature Flags o Feature Switches?

En pocas palabras, una "Feature Flag" es como un interruptor que se puede encender o apagar para controlar la visibilidad y el comportamiento de características específicas dentro de una aplicación. Estas banderas suelen ser controladas externamente, a menudo a través de un archivo de configuración o un panel de control en la web. Permiten a los desarrolladores cambiar el estado de una característica sin desplegar nuevo código.

![GrowthBook example](/images//feature-flags-mock.png "Ejemplo de un panel de control de FS")

### ¿Por qué son importantes las "Feature Flags"?

Las "Feature Flags" ofrecen varios beneficios clave:

1. Integración Continua y Despliegue Continuo (CI/CD): Las "Feature Flags" permiten despliegues más seguros y frecuentes. Permiten aislar características y lanzarlas cuando estén listas, en lugar de esperar un gran lanzamiento.  Pueden inclusive ya estar desplegadas en producción, pero sólo estar disponibles para un grupo pequeño de usuarios, de esa forma se lo puede probar a modo de "focus group" e ir haciendo mejoras, antes de liberarlo a todos los usuarios.
2. Gestión de Riesgos: Las "Feature Flags" reducen el riesgo asociado con el lanzamiento de nuevas características. Podemos ocultar una característica si está causando problemas inesperados, asegurando la experiencia del usuario.
3. Pruebas A/B: Con las "Feature Flags", puede implementar nuevas características en un subconjunto de sus usuarios, lo que le permite recopilar comentarios y datos antes de ponerlas a disposición de todos.
4. Lanzamientos en Oscuro: Puede desplegar una característica pero mantenerla oculta, monitoreando su rendimiento y estabilidad antes de revelarla a los usuarios.
5. Configuración sobre la marcha: Proporcionan una forma de realizar cambios en la configuración sin tener que volver a implementar la aplicación, lo cual es especialmente valioso en entornos de producción.

### Problemas Resueltos por las "Feature Flags"

1. Capacidades de Reversión: Si una característica introduce errores críticos, puede desactivarla rápidamente utilizando "Feature Flags", evitando un retroceso completo de toda su aplicación.
2. Reducción del "Time to market": Las "Feature Flags" hacen posible lanzar nuevas características o actualizaciones más rápido y con más frecuencia.
3. Desarrollo Centrado en el Usuario: Se puede priorizar los comentarios y preferencias de los usuarios adaptando la experiencia del usuario en función de su comportamiento y necesidades.
4. Experimentación Mejorada: Las pruebas A/B y los lanzamientos graduales permiten la toma de decisiones basadas en datos, lo cual puede ser crucial especialmente si el equipo aún no está totalmente acostumbrado al uso de herramientas de CI/CD.

## Un Caso de uso real en el Comercio Electrónico: Motor de Recomendación

Imaginemos que estás trabajando en un sitio web de comercio electrónico, y tu equipo acaba de desarrollar un sofisticado motor de recomendación. Este motor proporciona recomendaciones de productos a los usuarios en función de su historial de navegación, hábitos de compra y preferencias. Es una característica que puede mejorar significativamente la experiencia del usuario y aumentar las ventas. Sin embargo, existen algunos riesgos potenciales en su implementación.

### Cómo se Aplican las "Feature Flags":

1. Lanzamiento Gradual: Usando un "Feature Flag" podemos lanzar gradualmente el motor de recomendación a un pequeño subconjunto de usuarios. Quieres asegurarte de que la nueva característica no cause problemas inesperados a tus usuarios. Al exponerla inicialmente solo al 5% de tu base de usuarios, puedes monitorear su rendimiento y recopilar comentarios.
2. Pruebas A/B: Para evaluar el impacto del motor de recomendación en las ventas, puedes configurar una prueba A/B. La mitad de tus usuarios verá las recomendaciones y la otra mitad no. Con las "Feature Flags", puedes dividir fácilmente tu base de usuarios y medir las tasas de conversión y la satisfacción del usuario.
3. Configuración en Tiempo Real: Imagina que hay un problema con el motor de recomendación. Tal vez está recomendando productos incorrectos, lo que podría provocar una caída en las ventas. Con una "Feature Flag", puedes apagarlo instantáneamente para todos los usuarios hasta que se solucione el problema. Esto evita un impacto potencialmente negativo en tu negocio.

Los Feature Flags no solo garantizan una implementación más suave y segura del motor de recomendación, sino que también te permiten tomar decisiones basadas en datos y adaptarte a las características de tu grupo objetivo.

## ¿Cómo puedo implementarlo?

Hay muchas formas de hacerlo, y va a depender desde los recursos disponibles, hasta la forma de trabajo del equipo.  La forma más sencilla de implementación podría ser definiendo un archivo público donde se indique el estado de las FS, pero esto no habilita el uso de pruebas A/B y es bastante "rústico".

En mi experiencia profesional las 3 formas más comunes son:

* Implementando un pequeño motor de FS que permita activar o desactivar la funcionalidad con un click, con una variable en la URL o inclusive poniendo reglas que dependiendo del request activen o desactiven esa característica.
* Instalando una herramienta on-premises que cubra todas las características típicas de manejo de FS, existen muchos proyectos inclusive open source que nos dan esto ya resuelto y es sólo cuestión de instalar y configurar.
* Finalmente una opción muy rápida y "cost effective" a menudo es utilizar una herramienta SASS que exponga a través de un API el estado de cada FS y desde tu código simplemente accedes al estado de cada una y ese valor se guarda en caché por un tiempo determinado.

Algunos proveedores interesantes y que ofrecen opciones gratis o de muy bajo costo:

* [Flagsmith](https://www.flagsmith.com/ "Flagsmith")
* [DevCycle](https://devcycle.com/ "DevCycle")
* [PostHog](https://posthog.com/ "PostHog")
* [Split.io](https://www.split.io/ "Split.io")
* [GrowthBook](https://www.growthbook.io/ "GrowthBook")

Algo importante a recordar es que la idea de los Feature Flags es que deben tener un tiempo de vida, una vez que cumplieron su cometido hay que "limpiarlos" y sacarlos del código para evitar tener que mantener código que ya no se utiliza, esto también debe ser planificado para tener fechas de corte, en las que sepamos que será hasta cuando se va a dar soporte a alguna funcionalidad en específico.
