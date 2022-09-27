---
author: ivan
comments: true
date: 2008-12-16 22:45:00+00:00
layout: post
path: /2008/12/cmo-evitar-que-el-firefox-se-lleve-e
slug: cmo-evitar-que-el-firefox-se-lleve-e
title: Cómo evitar que el firefox se lleve el "foco" al abrir una ventana
wordpress_id: 823
categories:
  - Sin categoría
tags:
  - Curiosidades
  - Tecnología
  - Tips
---

Normalmente cuando utilizas Firefox como navegador por defecto todo link al que le des clic se abre en un nuevo tab (eso es bueno), pero lo malo es que se lleva la atención o el "foco", es decir te saca de la ventana donde estás y te obliga a ir a la ventana del Firefox.

Para evitar eso hay una solución fácil, abrimos el firefox y en la barra de configuración escribimos:  
about:config

Nos va a decir que esa es la configuración del Firefox y que podemos dañar algo, blah blah... simplemente le decimos que vamos a ser cuidadosos.

En la siguiente barra se puede filtrar las miles de opciones de Firefox, buscamos la siguiente o escribimos directamente en la barra esto:

**browser.tabs.loadDivertedInBackground**

Luego de eso nos aparecerá una sola opción, el valor predeterminado de esa opción es "falso" (false), le damos doble clic para que se cambie a true y listo, cerramos esa ventana y a partir de ahora cada vez que demos clic a un link que abra un tab nuevo no perderemos el foco de lo que estamos haciendo.
