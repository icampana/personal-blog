---
author: ivan
categories:
- Sin categoría
comments: true
date: 2006-03-19 01:14:00+00:00
featuredImage: ./ejemplo_boton.jpg
layout: post
path: /2006/03/bsqueda-rpida-en-el-diccionario-de-la
slug: bsqueda-rpida-en-el-diccionario-de-la
title: Búsqueda rápida en el diccionario de la RAE
wordpress_id: 943
---

[![](https://photos1.blogger.com/blogger/5311/455/200/ejemplo_boton.jpg)](https://photos1.blogger.com/blogger/5311/455/1600/ejemplo_boton.jpg)A pesar de que algunos por ahí parece que no conocen mucho el significado de la palabra ortografía :P (Sorry si alguien se ofende), hay otras personas a las que creo les interesará mucho este pequeño tip.

Es apenas un link con una pizca de javascript (pa los que no saben y les interesa saber leer [aquí](https://es.wikipedia.org/wiki/Javascript)), que permite buscar directamente una palabra en el diccionario de la [RAE (Real Academia Española)](https://www.rae.es/) sin necesidad de abrir la página y muestra directamente el resultado.

Si usas el navegador Firefox inclusive puedes tener un extra, lo agregas a tus links de la barra de marcadores y le especificas que se abra en la barra lateral y listo, tienes un botón que te permite buscar una palabra y se abre a un costado de la página en la que estás, de forma que no tienes que abrir otra página y no pierdes de vista lo que estabas leyendo.

Para quienes quieren el link o quieren probar cómo funciona, pueden dar ver el código aquí:

```if(document.getSelection){var palabra='';palabra=document.getSelection();}else{if(document.selection&&document.selection.createRange){var palabra=document.selection.createRange().text;}}if(palabra==''){palabra=prompt('Ingrese%20la%20palabra%20a%20buscar:');}if(palabra!=''&&palabra!=null){window.location='http://buscon.rae.es/draeI/SrvltGUIBusUsual?TIPO_HTML=2&TIPO_BUS=3&LEMA='+escape(palabra)+' '}else{eval('')};)
``` a sus favoritos.

Actualización: Corregí el link porque tenía problemas con las tildes y aparte un amigo me dijo que había algo similar en la página de la RAE, lo bueno del link de la RAE: tenían la opción para sombrear una palabra en la página y mandar a buscarla al dar clic. Lo malo es que en su link ellos tenían una opción diferente para cada navegador, en mi versión del link debe funcionar para todos los navegadores, al menos para los más famosos Internet Explorer, Mozilla y Firefox.
