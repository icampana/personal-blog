---
author: ivan
categories:
- Sin categoría
comments: true
date: 2009-04-29 20:34:00+00:00
featuredImage: ./spam-mail.jpg
layout: post
path: /2009/04/correo-basura-borbotones
slug: correo-basura-borbotones
tags:
- Linux
- Publicidad
- Tecnología
title: Correo basura a borbotones
wordpress_id: 768
---

[![](/photos/spam-mail.jpg)](https://2.bp.blogspot.com/_T2UWuNJg3dQ/Sfh3yjSp6bI/AAAAAAAABeM/iH2gPNeFNdk/s1600-h/spam-mail.jpg)Esto creo que no es noticia para muchos, pero ver las estadísticas ya reales y tangibles es para volverse loco. Actualmente trabajo en una empresa que en su matriz tiene cerca de 350 empleados, cada uno con su dirección de correo y varios dominios para cada división de negocios. Esto quiere decir que recibimos un volumen constante de correos para poder trabajar, especialmente porque una de las actividades principales son las importaciones.

Hasta hace un tiempo había problemas con la cantidad de Spam que se recibía, había un software comprado desde hace mucho tiempo que funcionaba sobre Windows 2003 server y servía como intermediario para el servidor de correos (un Exchange Server), se suponía que debería atrapar todo el spam antes de que llegue a los buzones de los usuarios. Sin embargo no funcionaba y eso que había costado cerca de 7,000 dólares. Por ello decidí botarlo a la basura y reemplazarlo con un servidor Linux más las herramientas de correo y de filtrado de spam que tenía a la mano y conocía... De eso ya van 2 meses y no ha habido ni una sola falla (mientras que antes era a diario que nos reclamaban porque no llegaban correos o porque les llegaban millares de correos basura).

Lo interesante es que junto con lo que instalé puse una herramienta que me da las estadísticas de uso y rendimiento del filtro a diario, estos números me llamaron mucho la atención:

<blockquote>6202   Accepted                                   4.99%

118049 Rejected 95.01%</blockquote>

Esos números son de ayer, es decir, de todos los correos que trataron de entrar a la compañía, apenas el 5% eran válidos, el resto era basura, 118,049 correos de pura publicidad de viagra, elongamiento del pene, chicas en bikini y quien sabe qué más.

Cuantos recursos desperdiciados de manera estúpida, en fin, es contra lo que toca pelear hoy en día...
