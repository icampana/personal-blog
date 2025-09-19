---
author: ivan
comments: true
date: 2004-09-26 04:11:00+00:00
path: /2004/09/musik-una-aplicacin-para-manejar-tu
title: Musik | una aplicación para manejar tu biblioteca musical...
wordpress_id: 1052
categories:
  - Sin categoría
---

Dando vueltas en la red me topé casi por casualidad con este reproductor y biblioteca de audio llamado [wxMusik](https://musik.berlios.de/), a primera instancia no me pareció la gran cosa, pues casi lo mismo puede hacer el winamp, lo interesante es que es [Open Source](https://www.opensource.org/) y que corre en Windows, Linux y Mac; así que decidí probarlo a ver qué tal.

Tiene una interfaz super limpia, sin mucho lío, encuentras las cosas de forma bastante rápida, tiene shorcuts para casi todo, te permite organizar y filtrar la info por el campo que prefieras, así puedes encontrar las canciones por género, año, artista o disco de forma inmediata, editar las etiquetas de las canciones por lotes. Bueno, la mayor parte de las características de la biblioteca son las comunmente encontradas en otros programas, de hecho me recuerda un poco al i-Tunes, el punto a favor que encontré aquí es que no necesitas darle muchas vueltas para poder usarlo.

Lo que realmente me pareció muy bueno es el manejo de listas de reproducción dinámicas (dynamic playlists) y el **Auto DJ**. Ambos funcionan con un sistema de consultas (queries) interno que puedes personalizar, para los que conocen un poco de SQL pueden utilizar la misma sintáxis para decidir qué es lo que deseas que toque y qué no. Para los que no saben SQL, tampoco es nada complicado, lo pueden usar de forma básica, basta con saber un poco de inglés, por ejemplo, si le quiero decir al DJ Automático que quiero escuchar música variada, pero que no toque nada de Merengue ni Salsa y peor algo de Sharon la Retrechera.. (je je je) lo único que tendría que hacer es escribir lo siguiente en el cuadro donde se indica al DJ qué música tocar:
rating >= 0 and genre is not 'Salsa' and genre is not 'Merengue' and artist is not 'Sharon'

De esta manera se le dice al reproductor lo siguiente:

- rating >= 0 / puede tomar cualquier canción que tenga una calificación mayor a cero (puedes ponerle estrellitas a cada canción como en el winamp y el windows media player).

- genre is not 'Salsa' and genre is not 'Merengue' / que sea de género diferente a Salsa y Merengue.

- artist is not 'Sharon' / que el artista no sea Sharon
  Este es el ejemplo muy básico, jugando un poco con las combinaciones y las calificaciones puedes lograr que el DJ sea bastante bueno y no tengas que preocuparte por qué música poner.... Aprendiendo a jugar con esto puedes llegar inclusive a formar expresiones que te permitan decirle al reproductor que tome las canciones que no has escuchado desde hace más de 1 mes, que sea parte de tu colección preferida y que sea de música suave.

De la misma forma puedes crear listas automáticas, de forma que cada vez que te bajas una nueva canción, se vaya al lugar que le corresponde.

Bueno, eso es por mi lado, a mi me gustó mucho, pero creo que cada uno tiene que dar su opinión o nope?? :P En todo caso, aún le faltan algunas cosas, pero al ser Open Source cualquiera puede hechar una mano y ayudar a mejorarlo, quizá me anime y a darles una mano e incorpore un par de mejoras.

Yo por ahora contribuí al proyecto Open Source realizando la traducción al español del programa. ;)
