// Lista de nombres de Pokémon que pueden aparecer en las tiradas
const pokemons = ["pikachu", "bulbasaur", "cubone", "squirtle", "abra", "magikarp"];

// Inicialización de las fichas del jugador
let fichas = getRandomInt(10, 15);
let resetFichas = getRandomInt(10, 15);

// Historial de tiradas y última combinación triple conseguida
let historialTiradas = [];
let tripleAnterior = null;

// Frases del Profesor Oak según el contexto del juego
const frasesOak = {
  inicio: [
    "¡Hola! Bienvenido al mundo de los Pokémon... ¡de la suerte!",
    "Este mundo está habitado por criaturas llamadas Pokémon... ¡y hoy pueden darte fichas!",
    "¿Estás listo para comenzar tu aventura... en el casino Pokémon?"
  ],
  tirada: [
    "¡Veamos qué te depara la suerte, entrenador!",
    "¡La ciencia es increíble! ¡Y esta tirada también podría serlo!",
    "¡Espero que hayas entrenado tu dedo para esta tirada!"
  ],
  triple: [
    "¡Increíble! ¡Un triple! Eso no se ve todos los días.",
    "¡Eso sí que es un descubrimiento digno de mi laboratorio!",
    "¡Guau! ¡Has sincronizado los tres Pokémon perfectamente!"
  ],
  perder: [
    "¡No tan rápido! ¡Aún te falta experiencia!",
    "No todo son victorias... ¡pero cada tirada te hace mejor!",
    "A veces, incluso el mejor entrenador necesita un descanso."
  ],
  repetirTriple: [
    "¡Un fenómeno digno de estudio! ¿Dos triples seguidos?",
    "¡Eso es... casi imposible! ¡Estás desafiando la ciencia!",
    "¡Una coincidencia estadísticamente improbable! Fascinante."
  ],
  recarga: [
    "He restaurado tus fichas. ¡Úsalas sabiamente, entrenador!",
    "¡La investigación continúa! Toma más fichas.",
    "Aquí tienes más fichas. ¡Ve y consigue datos para la ciencia!"
  ]      
};

// Función para hacer pausas (usada para animaciones)
const delay = ms => new Promise(res => setTimeout(res, ms));

// Código que se ejecuta al cargar completamente la página
window.onload = () => {
  // Selecciona aleatoriamente un fondo de pantalla al cargar
  const fondosBody = ["arena.png", "hierba.png", "verde.png", "nieve.png"]; 
  const fondoAleatorio = fondosBody[getRandomInt(0, fondosBody.length - 1)];
  document.body.style.backgroundImage = `url("img/${fondoAleatorio}")`;

  // Asignación de eventos a los botones principales
  document.querySelector("#reset").onclick = () => {
    actualizarFichas(resetFichas);
    mostrarMensajeOak("recarga");
  };
  document.querySelector("#lanzar").onclick = lanzar;
  document.querySelector("#cruz").onclick = cerrarMensaje;

  // Botones para cambiar solo una de las slots
  document.querySelectorAll(".boton.volver").forEach(boton => {
    const pos = parseInt(boton.dataset.pos);
    boton.onclick = () => cambiarSlot(pos);
  });

  // Mostrar mensaje inicial y actualizar cantidad de fichas
  mostrarMensajeOak("inicio");
  actualizarFichas(fichas);

  // Asignar una imagen de Pokémon aleatoria a cada slot
  const ventanas = document.querySelectorAll(".ventana");
  ventanas.forEach(async (ventana) => {
    const poke = pokemons[getRandomInt(0, pokemons.length - 1)];
    const imgUrl = await obtenerImagenPokemon(poke);
    ventana.innerHTML = `<img src="${imgUrl}" class="poke" alt="${poke}">`;
  });
};

// Evento que permite cambiar el fondo al hacer clic en un botón
document.addEventListener("DOMContentLoaded", function () {
  const bgButton = document.getElementById("background");

  bgButton.addEventListener("click", function (e) {
    e.preventDefault(); // Previene el comportamiento por defecto del enlace
    const fondosBody = ["arena.png", "hierba.png", "verde.png", "nieve.png"]; 
    const fondoAleatorio = fondosBody[getRandomInt(0, fondosBody.length - 1)];
    document.body.style.backgroundImage = `url("img/${fondoAleatorio}")`;
  });
});

// Función para obtener un número aleatorio entero entre dos valores
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Actualiza la cantidad de fichas y muestra visualmente las monedas
function actualizarFichas(cantidad) {
  fichas = cantidad;
  document.querySelector("#dinero").textContent = fichas;
  const contenedor = document.getElementById("monedas");
  contenedor.innerHTML = "";
  for (let i = 0; i < cantidad; i++) {
    if (i % 5 === 0 && i > 0 && i <= 15) contenedor.innerHTML += "<br>";
    contenedor.innerHTML += '<img src="img/ficha.png">';
  }
  resetFichas = getRandomInt(10, 15);
}

// Lógica principal para lanzar la tirada de 3 Pokémon
async function lanzar() {
  if (fichas <= 0) return;

  mostrarMensajeOak("tirada");
  document.querySelector("#lanzar").disabled = true;
  document.getElementById("audio").play();

  // Animación de los slots
  mostrarAnimaciones(true);
  await delay(2000);
  mostrarAnimaciones(false);
  document.querySelector("#lanzar").disabled = false;

  const ventanas = document.querySelectorAll(".ventana");
  const tiradaActual = [];

  // Selecciona Pokémon aleatorios para cada slot
  for (let idx = 0; idx < ventanas.length; idx++) {
    const poke = pokemons[getRandomInt(0, pokemons.length - 1)];
    const imgUrl = await obtenerImagenPokemon(poke);
    ventanas[idx].innerHTML = `<img src="${imgUrl}"  class="poke" alt="${poke}">`;
    tiradaActual.push(poke);
  }

  // Guarda el historial de las últimas 5 tiradas
  historialTiradas.push(tiradaActual);
  if (historialTiradas.length > 5) historialTiradas.shift();

  comprobarResultado();
}

// Muestra animaciones tipo ruleta mientras se sortean los Pokémon
async function mostrarAnimaciones(visible) {
  const ids = ["animacion", "animacion1", "animacion2"];

  if (!visible) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      el.style.visibility = "hidden";
      el.innerHTML = "";
    });
    return;
  }

  const intervalos = [];

  for (let i = 0; i < ids.length; i++) {
    const el = document.getElementById(ids[i]);
    el.style.visibility = "visible";

    const intervalo = setInterval(async () => {
      const randomPokemon = pokemons[getRandomInt(0, pokemons.length - 1)];
      const imgUrl = await obtenerImagenPokemon(randomPokemon);
      el.innerHTML = `<img src="${imgUrl}" alt="${randomPokemon}" style="width: 150px; height: 150px;">`;
    }, 150);

    intervalos.push(intervalo);
  }

  // Detiene las animaciones luego de 2 segundos
  setTimeout(() => {
    intervalos.forEach(clearInterval);
    ids.forEach(id => {
      document.getElementById(id).style.visibility = "hidden";
      document.getElementById(id).innerHTML = "";
    });
  }, 2000);
}

// Permite al jugador cambiar una de las imágenes si no hay triple
async function cambiarSlot(pos) {
  const ventanas = document.querySelectorAll(".ventana");

  if (fichas > 0 && !esTriple()) {
    const imagenActual = extraerNombreDesdeImg(ventanas[pos]);
    const opciones = pokemons.filter(p => p !== imagenActual);
    const nuevo = opciones[getRandomInt(0, opciones.length - 1)];
    const imgUrl = await obtenerImagenPokemon(nuevo);

    ventanas[pos].innerHTML = `<img src="${imgUrl}" alt="${nuevo}" style="width: 150px; height: 150px;">`;
    document.getElementById("audio4").play();

    comprobarResultado();
  }
}

// Cierra el mensaje emergente y entrega fichas si hubo triple
function cerrarMensaje() {
  document.querySelector("#velo").style.display = "none";
  if (esTriple()) {
    fichas += 3;
    actualizarFichas(fichas);
  }
}

// Comprueba si se ha obtenido una combinación ganadora
function comprobarResultado() {
  fichas--;
  actualizarFichas(fichas);

  if (esTriple()) {
    mostrarMensaje("ganar");
    mostrarMensajeOak("triple");
  } else if (fichas <= 0) {
    mostrarMensaje("perder");
    mostrarMensajeOak("perder");
  }
}

// Verifica si los tres slots tienen el mismo Pokémon
function esTriple() {
  const imgs = [...document.querySelectorAll(".ventana")].map(v => extraerNombre(v.innerHTML));
  const actual = imgs[0];
  const triple = imgs[0] === imgs[1] && imgs[1] === imgs[2];

  if (triple && actual === tripleAnterior) {
    document.querySelector("#mensaje").innerHTML += "<br><small>¡Triple repetido!</small>";
    mostrarMensajeOak("repetirTriple");
  }

  tripleAnterior = actual;
  return triple;
}

// Muestra un mensaje en pantalla (ganar o perder)
function mostrarMensaje(tipo) {
  document.querySelector("#velo").style.display = "flex";
  const mensaje = document.querySelector("#mensaje");
  const cuadro = document.querySelector("#cuadro_mensaje");

  if (tipo === "ganar") {
    mensaje.innerHTML = '<img src="img/ice.png"> Has ganado tres <img src="img/ficha.png"> fichas extra! <img src="img/ice.png">';
    cuadro.style.backgroundImage = "url(img/fondowin.png)";
    document.getElementById("audio3").play();
  } else {
    mensaje.innerHTML = '<img src="img/pokedoll.png"> Te has quedado sin fichas <img src="img/pokedoll.png">';
    cuadro.style.backgroundImage = "url(img/fondolose.png)";
    document.getElementById("audio2").play();
  }
}

// Extrae el nombre del Pokémon a partir del atributo alt en una cadena HTML
function extraerNombre(html) {
  const match = html.match(/alt="(.*?)"/);
  return match ? match[1] : "";
}

// Consulta la API de Pokémon y devuelve la URL de la imagen
async function obtenerImagenPokemon(nombre) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
    if (!response.ok) throw new Error(`No se pudo obtener el Pokémon ${nombre}`);
    const data = await response.json();
    return data.sprites.front_default;
  } catch (error) {
    console.error(error);
    return "img/default.png"; // Imagen por defecto si falla la petición
  }
}

// Extrae el nombre del Pokémon desde el elemento IMG del slot
function extraerNombreDesdeImg(elemento) {
  const img = elemento.querySelector("img");
  return img ? img.alt : "";
}

// Muestra una frase del Profesor Oak según el tipo de evento
function mostrarMensajeOak(tipo) {
  const contenedor = document.getElementById("oakmsg");
  if (!frasesOak[tipo]) return;
  const frases = frasesOak[tipo];
  const frase = frases[Math.floor(Math.random() * frases.length)];
  contenedor.textContent = `Profesor Oak: "${frase}"`;
}
