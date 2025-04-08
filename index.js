// =====================
// VARIABLES PRINCIPALES
// =====================
const pokemons = ["pikachu", "bulbasur", "cubone", "squirtel", "abra", "magikarp"];
const fondosList = ["hierba", "verde", "arena", "nieve"];
let Minicio = getRandomInt(10, 15);
let Mreset = getRandomInt(10, 15);

const delay = ms => new Promise(res => setTimeout(res, ms));

// =====================
// FUNCIONES DE INICIO
// =====================
window.onload = iniciar;

function iniciar() {
  cambiarFondo();

  document.querySelector("#reset").onclick = () => resetear();
  document.querySelector("#background").onclick = cambiarFondo;
  document.querySelector("#lanzar").onclick = lanzar;
  document.querySelector("#cruz").onclick = cerrarCruz;

  document.querySelectorAll(".boton").forEach(btn => btn.onclick = cambiarPokemon);

  moneda(Minicio);
}

// =====================
// FUNCIONES UTILITARIAS
// =====================
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cambiarFondo() {
  const i = getRandomInt(0, fondosList.length - 1);
  document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.53)), url(img/${fondosList[i]}.png)`;
}

// =====================
// MONEDAS Y CREDITOS
// =====================
function moneda(credito) {
  Minicio = credito;
  Mreset = getRandomInt(10, 15);
  
  const dineroEl = document.getElementById("dinero");
  const monedasEl = document.getElementById("monedas");

  dineroEl.textContent = credito;
  monedasEl.innerHTML = "";

  for (let i = 0; i < credito; i++) {
    if (i % 5 === 0 && i > 0 && i <= 15) {
      monedasEl.appendChild(document.createElement("br"));
    }
    const ficha = document.createElement("img");
    ficha.src = "img/ficha.png";
    monedasEl.appendChild(ficha);
  }
}

// =====================
// FUNCION ASÍNCRONA PARA LA ANIMACIÓN
// =====================
async function esperarAnimacion() {
  document.getElementById("lanzar").disabled = true;
  await delay(2000);
  document.getElementById("animacion").style.visibility = "hidden";
  document.getElementById("animacion1").style.visibility = "hidden";
  document.getElementById("animacion2").style.visibility = "hidden";
  document.getElementById("lanzar").disabled = false;
}

// =====================
// LANZAMIENTO DE TIRADA
// =====================
function lanzar() {
  if (Minicio <= 0) {
    document.getElementById("lanzar").disabled = true;
    return;
  }

  document.getElementById("audio").play();
  document.getElementById("animacion").style.visibility = "visible";
  document.getElementById("animacion1").style.visibility = "visible";
  document.getElementById("animacion2").style.visibility = "visible";
  esperarAnimacion();

  for (let i = 0; i < 3; i++) {
    const poke = pokemons[getRandomInt(0, pokemons.length - 1)];
    setPokemonImage(i, poke);
  }

  comprobarTirada();
}

// =====================
// CAMBIAR POKÉMON CON BOTÓN
// =====================
function cambiarPokemon() {
  if (Minicio <= 0 || (imagen(0) === imagen(1) && imagen(1) === imagen(2))) return;

  const index = Array.from(this.parentNode.children).indexOf(this);
  const actual = palabra(imagen(index));
  const posibles = pokemons.filter(p => p !== actual);
  const nuevo = posibles[getRandomInt(0, posibles.length - 1)];

  document.getElementById("audio4").play();
  setPokemonImage(index, nuevo);
  comprobarTirada();
}

// =====================
// GANAR / PERDER
// =====================
function cerrarCruz() {
  document.querySelector("#velo").style.display = "none";
  if (imagen(0) === imagen(1) && imagen(1) === imagen(2)) {
    Minicio += 3;
    moneda(Minicio);
  }
}

function ganar() {
  document.querySelector("#velo").style.display = "flex";
  document.querySelector("#mensaje").innerHTML = `
    <img src="img/ice.png"> ¡Has ganado tres 
    <img src="img/ficha.png"> fichas extra! <img src="img/ice.png">`;
  document.querySelector("#mensaje").style.paddingTop = "5%";
  document.getElementById("audio3").play();
}

function perder() {
  document.querySelector("#dinero").textContent = "0";
  document.querySelector("#velo").style.display = "flex";
  document.querySelector("#mensaje").innerHTML = `
    <img src="img/pokedoll.png"> Te has quedado sin fichas 
    <img src="img/pokedoll.png">`;
  document.querySelector("#mensaje").style.paddingTop = "5%";
  document.querySelector("#cuadro_mensaje").style.backgroundImage = "url(img/fondolose.png)";
  document.getElementById("audio2").play();
}

// =====================
// COMPROBAR TIRADA
// =====================
function comprobarTirada() {
  Minicio--;
  moneda(Minicio);

  if (imagen(0) === imagen(1) && imagen(1) === imagen(2)) {
    ganar();
  } else if (Minicio <= 0) {
    Minicio = 0; // Aseguramos que Minicio no sea negativo
    moneda(Minicio); // Refrescamos las fichas en pantalla
    document.getElementById("lanzar").disabled = true;
    perder();
  }
}

// =====================
// FUNCIONES AUXILIARES
// =====================
function imagen(index) {
  const img = document.querySelectorAll(".ventana")[index].querySelector("img");
  return img ? img.src : "";
}

function palabra(url) {
  const match = url.match(/\/([^\/]+)\.png/);
  return match ? match[1] : "";
}

function setPokemonImage(index, nombre) {
  document.querySelectorAll(".ventana")[index].innerHTML = `<img src="img/${nombre}.png">`;
}

// =====================
// FUNCION RESET
// =====================
function resetear() {
  Minicio = Mreset;  // Restablece el crédito al valor de Mreset
  moneda(Minicio);    // Actualiza las monedas en pantalla
  document.getElementById("lanzar").disabled = false;  // Vuelve a habilitar el botón de lanzar
  document.querySelector("#velo").style.display = "none"; // Oculta el mensaje de pérdida
  document.querySelector("#mensaje").innerHTML = "";  // Limpia el mensaje de pérdida
}