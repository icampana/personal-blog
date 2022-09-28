---
author: ivan
categories:
- Sin categoría
comments: true
date: 2006-12-29 08:46:00
featuredImage: /photos/playing_song.jpg
layout: post
path: /2006/12/controlando-tu-msica-desde-el-celular
slug: controlando-tu-msica-desde-el-celular
tags:
- Curiosidades
- Linux
- Locuras
- Tecnología
title: Controlando tu música desde el celular
wordpress_id: 916
---

[![](/photos/playing_song.jpg)](https://3.bp.blogspot.com/_T2UWuNJg3dQ/RZMYsEOJDTI/AAAAAAAAAAY/axtAb3UUdi0/s1600-h/playing_song.jpg)[![](/photos/volumen.jpg)](https://2.bp.blogspot.com/_T2UWuNJg3dQ/RZSDRkOJDWI/AAAAAAAAAA4/CN73yhngxCo/s1600-h/volumen.jpg)[![](/photos/rating.jpg)](https://2.bp.blogspot.com/_T2UWuNJg3dQ/RZSDKkOJDVI/AAAAAAAAAAw/_9sFK3s2DWQ/s1600-h/rating.jpg)[![](/photos/amarok_playing.jpg)](https://4.bp.blogspot.com/_T2UWuNJg3dQ/RZMYzUOJDUI/AAAAAAAAAAg/JjkoVB5mAcs/s1600-h/amarok_playing.jpg)

Una más de mis travesuras, este año me hice un "auto-regalo" navideño, me pasé a GSM y me compré un móvil nuevo, el [Nokia 5200](https://forum.nokia.com/devices/5200). Además de reproducir mp3, reproducir vídeo, funcionar como flash drive, tener tarjeta de expansión y otras chucherías más, es mi primer teléfono con [bluetooth.](https://es.wikipedia.org/wiki/Bluetooth)

Como buen "tecno-adicto" me puse a revisarlo de pies a cabeza para saber qué opciones extra podía agregarle, como todo Nokia resultó muy fácil de utilizar y logré sincronizar mi agenda y contactos sin problemas con el bluetooth.

Dando vueltas por la web encontré este software: "[Salling Clicker](https://www.salling.com/)", que permite utilizar un celular con bluetooth como si fuera un control remoto, cambiar de canción e inclusive cambiar de diapositivas en una presentación. Y de paso funciona en Mac y Windows.

¿El único inconveniente? No funciona con los drivers de mi dongle bluetooth (es de los económicos, de \$12) y además es privativo, es decir, no puedo hacerle modificaciones, mejoras o ver cómo funciona.

Al encontrar ese software pensé, debe haber algo parecido para Linux (sí, ya sé, otra vez el trauma). No me equivoqué, me topé con un software llamado [Remuco](https://remuco.sourceforge.net/) que justamente está en desarrollo. Lo descargué, lo instalé y funcionó de maravilla. El único "detalle" es que el único reproductor de música que soportaba al momento es el XMMS (es como el winamp de hace 5 años).

Personalmente utilizo [Amarok](https://amarok.kde.org/) para reproducir mi música y no quería quedarme con las ganas de sacarle provecho a esta herramienta, así que comencé a leer un poco sobre el modo de funcionamiento, protocolo, etc. Al final me quedó claro que al proyecto le falta mejorar la documentación, pero entendí cómo podía lograr mi cometido.

Puse manos a la obra y creé un "conector" o "adaptador" que se comunica con Remuco y me permite usar mi móvil para controlar mi Amarok, desde subir y bajar el volumen, cambiar de canción, ver el playlist, pausar, detener e inclusive ponerle un "rating"(en base a estrellas) a cada canción. Ya logré comunicarme con el creador original del proyecto y para la siguiente versión del software ya vendrá incluido el adaptador que creé y lo mejor es que es totalmente libre y gratuito.

En todas las fotos se puede ver cómo se usa, por ahora la interfaz en el teléfono es sencilla, pero útil en todo caso, pronto habrá una interfaz más agradable. Los que tengan Linux, se los recomiendo, ya pueden tener una fiesta en su casa y cambiar de canción mientras bailan sin necesidad de acercarse a la compu siquiera. Y los que no tengan Linux, pos se esperan o se dan una vuelta por [acá](https://www.ubuntu.com/)... je je je.