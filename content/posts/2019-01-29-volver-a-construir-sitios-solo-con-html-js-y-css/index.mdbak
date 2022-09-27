---
author: ivan
comments: false
date: 2019-01-29T01:53:00.000+00:00
layout: post
path: "/2019/01/volver-a-construir-sitios-solo-con-html-js-y-css"
slug: volver-a-construir-sitios-solo-con-html-js-y-css
title: "¿Volver a construir sitios sólo con HTML, JS y CSS?"
wordpress_id: 1822
featuredImage: "./html-css-js.png"
categories:
- Aprendizaje
- Geek
- Web Development
tags:
- Aprendizaje
- desarollo web
- javascript
- web development

---
Cuando comencé a crear sitios webs (mi primer encuentro con el HTML fue en 1996 mientras hacía prácticas del colegio) lo único con lo que contábamos era HTML y algo mínimo de Javascript o VBScript (Sí, eso existió alguna vez), los resultados eran bastante rudimentarios, pero solucionaba la necesidad básica, toda la información era estática y necesitábamos actualizar archivo por archivo si había algún cambio. En 1997 apareció el CSS y fue en ese momento la mayor mejora para comenzar a darle una apariencia agradable a un sitio web.

![El Universo](./Captura-de-pantalla-2019-01-28-a-las-19.03.16.png)

El ejemplo del diseño de una web [bastante conocida](https://www.eluniverso.com) en 1997 con los elementos básicos que había. (gracias a [The Internet Archive Wayback Machine](https://web.archive.org/web/19970430004359/http://www.eluniverso.com/)).

Pero fuera de la apariencia el proceso era bastante sencillo, había que crear un documento de texto con las etiquetas para dar algo de formato, enlazar los contenidos, cargar unas cuantas imágenes en el servidor y listo, teníamos una página web que podía ser visitada por quien quisiera en cualquier parte del mundo. Hoy en día tenemos páginas sumamente vistosas, que requieren componentes del lado del servidor para procesar nuestros datos y pueden demandar mucho de la máquina cliente.

Sin embargo, hay algo que conecta estas dos épocas y es la escasez de recursos, en 1997 las computadoras tenían procesadores lentos comparados contra los de hoy en día, poco espacio en disco, poca memoria y el consumo de internet podía hacer que las cuentas de teléfono hicieran que nuestros padres nos quitaran el preciado acceso a Internet. Había que preocuparse al hacer una web que no consumiera tantos recursos. Ahora diríamos que todo ha cambiado, o quizá no tanto como creemos...

En la actualidad el dispositivo que más se utiliza para acceder al Internet no es una computadora de escritorio, sino un teléfono celular que si bien supera en capacidad a un computador del 97, sigue teniendo procesador lento (en comparación a una de escritorio), tiene poco espacio en disco, poca memoria y si te descuidas **"te quedas sin megas"**.

![IBM Aptiva](./Aptiva-complete-1.jpg)

No es la foto real, pero era el mismo modelo (IBM Aptiva 2144) con el que sobreviví durante esos años.

Estamos en 2019, alguno probablemente dirá: nah' ahora no hay que pensar en eso, las máquinas son mucho más rápidas y Google se hace cargo de todo. Pues justamente por eso han aparecido propuestas como [**Google AMP (Accelerated Mobile Pages)**](https://www.ampproject.org/es/) que buscan simplificar y pre-cargar la información para poder entregar resultados más rápidos y sin consumir muchos recursos. Especialmente enfocándose en los dispositivos móviles pues a la fecha representan entre el 50 y el 60% del tráfico de los sitios webs, es decir, se utilizan tanto o más que una computadora para acceder a los contenidos.

Otro factor importante es que no todos tienen un teléfono celular de gama alta (de los costosos), gracias a Android hay teléfonos que se pueden conectar a Internet y navegar teniendo costos tan bajos como $30 o $40 dólares, obviamente con capacidades bastante limitadas. Sin embargo, si vemos el siguiente gráfico se entiende de manera más clara por qué es importante pensar en los dispositivos de menos recursos.

![](./Captura-de-pantalla-2019-01-28-a-las-19.27.24.png)Tiempo necesario para cargar la web de [CNN.com](https://edition.cnn.com/) dependiendo del tipo de celular que tenemos.

Un iPhone 8 puede cargar este sitio web de muestra en menos de 10 segundos, mientras que un celular de menos de $100 va a tardarse aproximadamente 42 segundos, tiempo suficiente para que el usuario se aburra, cierre la página y siga adelante o si le estábamos tratando de vender algo, se vaya con el competidor.

Tratar de optimizar un sitio web para que funcione bien en un computador de escritorio, al mismo tiempo se vea bien y entregue la información correcta en un móvil puede convertirse en una tarea complicada para un desarrollador web, especialmente con el nivel de fragmentación de dispositivos, velocidades y condiciones. Además de que necesitamos poder mantener la información actualizada y hacer que el sitio sea seguro y estemos protegidos contra ataques de seguridad.

Si se analiza la mayor parte de los sitios webs corporativos y personales, realmente no hay una producción de contenido que requiera tener un manejador de contenidos ([CMS](https://es.wikipedia.org/wiki/Sistema_de_gesti%C3%B3n_de_contenidos)) avanzado, pero tampoco podríamos a estas alturas regresar al punto original de sólo construir sitios webs con HTML, Javascript y CSS... O sí?

Verdaderamente no se puede regresar por completo a eso, pero un grupo de desarrolladores pensaron en un punto medio y después de probarlo, como desarrollador web quedé agradecido.

Gatsby es un generador de sitios estáticos que utilizando una fuente de datos (puede ser otro sitio, archivos físicos, una base de datos, etc... hasta una hoja de excel!) genera una página web que incluye las buenas prácticas y mejoras que necesitamos para tener un sitio web rápido y atractivo.

[![GatsbyJS](./gatsby-logo-150x150.png)Gatsby JS](https://gatsbyjs.org "Gatsby Logo") un creador de sitios estáticos

Lo mejor es que al final lo que genera son archivos estáticos (HTML, JS y CSS) así que el costo de los recursos para poder tener un sitio web vuelven a ser los de 1997, sólo un espacio donde publicar archivos, sin necesidad de ningún lenguaje de programación y sin los riesgos de seguridad de una aplicación completa. De esa forma por ejemplo [una compañía](https://www.gatsbyjs.org/blog/2018-06-14-escalade-sports-from-5000-to-5-in-hosting/) pasó de pagar $5,000 dólares al mes en hosting a apenas $5

Todo el sitio se optimiza dependiendo del dispositivo y consume la menor cantidad de recursos, en las pruebas con [Lighthouse](https://developers.google.com/web/tools/lighthouse/) (la herramienta de pruebas de rendimiento de Google), casi todos los sitios hechos con Gatsby tienen una calificación que llega al 100/100 o muy cercana.

![Lighthouse Test](./lighthouse-audit-results.png)Resultado de una prueba básica con Lighthouse a un sitio de ejemplo con Gatsby.

Para los más técnicos si quieren saber qué hay por detrás, lo que hace Gatsby es generar una **Single Page Application (SPA)** que una vez realizada la carga inicial se convierte en una aplicación de React completa, con lo cual tenemos todas las herramientas modernas (Lazy loading, optimización de imágenes, Pre-carga, historial de navegación, etc...) para construir un sitio web, pero sin la sobrecarga de un sitio pesado.

Si no se han metido en el mundo de **React**, esta es una buena forma de experimentar y aprender en el camino, les aseguro que no se van a arrepentir y para tener idea de qué tan complejos pueden ser los resultados, esta es una pequeña galería de sitios construidos con Gatsby:

* [Hopper](https://www.hopper.com)
* [2019 NYC Pride](https://2019-worldpride-stonewall50.nycpride.org/)
* [ATTN Entertainment that informs](https://www.attn.com/)
* [Nike Just Do it](https://justdoit.nike.com/)
* [McDonalds Feel Good Design](https://design.mcdonalds.com/)

¿Vamos a dejar de utilizar CMSs? Para nada, aún necesitaremos herramientas como Wordpress, Drupal, Django, etc. Pero utilizar una solución como esta nos permite integrar lo mejor de los dos mundos y obtener excelentes resultados. De hecho podemos crear sitios webs que utilicen alguna de estas herramientas como fuentes de datos.

Una de las cosas importantes para los creadores de webs al trabajar con una herramienta como esta es que nos devuelve la flexibilidad de poder usar los componentes que querramos, darle el formato que se nos ocurra, sin perder las ventajas de utilizar motores de gestión de contenido y mantener el proceso sencillo para quienes realmente producen la información (redactores y dueños de sitios web).

¿Es una solución para todo el mundo? No, pero puede cubrir gran parte de las necesidades para sitios que necesiten entregar información de manera accesible y rápida a la mayor cantidad de personas posible.
