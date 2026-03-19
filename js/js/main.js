// js/utils.js puede contener utilidades como query, modales, etc.
// Asegúrate de incluir este archivo antes de usar en main.js si decides separarlo.

(function(){
  // State
  const state = {
    musicOn: false,
    currentSong: 0,
    songs: [
      // Puedes enlazar a archivos reales si los tienes
      { name: 'Sonidos del Chocó', src: '' },
    ],
  };

  // Reproductor simple (sin fuente de audio real aquí; placeholder)
  window.toggleMusic = function() {
    state.musicOn = !state.musicOn;
    const btn = document.getElementById('music-toggle');
    const icon = document.getElementById('music-icon');
    if(state.musicOn){
      icon.textContent = '❚❚';
      btn.setAttribute('aria-label','Pausar música');
      // Aquí podrías iniciar un Audio(ctx) si tienes fuente
    } else {
      icon.textContent = '▶';
      btn.setAttribute('aria-label','Reproducir música');
      // Detener audio
    }
  };

  window.prevSong = function() { /* placeholder */ };
  window.nextSong = function() { /* placeholder */ };

  // Contadores
  function animateCounter(el, target){
    const duration = 1200;
    const start = 0;
    const delta = target - start;
    let t0 = null;
    function step(ts){
      if(!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      el.textContent = Math.floor(start + delta * p);
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Reveal animation (simplificado)
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(r => obs.observe(r));

  // Cotización
  window.cotizar = function() {
    const destino = document.getElementById('f-destino').value;
    const llegada = document.getElementById('f-llegada').value;
    const salida  = document.getElementById('f-salida').value;
    const viajeros = document.getElementById('f-viajeros').value;
    const tipo = document.getElementById('f-tipo').value;

    const errores = [];
    if(!destino) errores.push('Selecciona un destino.');
    if(!llegada) errores.push('Indica la fecha de llegada.');
    if(!salida) errores.push('Indica la fecha de salida.');
    if(llegada && salida && llegada > salida) errores.push('La llegada debe ser anterior a la salida.');
    if(!viajeros) errores.push('Selecciona la cantidad de viajeros.');

    const panel = document.getElementById('cotizacion-result');
    if(errores.length){
      panel.innerHTML = `<div class="error" role="alert" style="color:#c0392b;">${errores.join('<br/>')}</div>`;
      return;
    }

    // Cálculo simple (ejemplo)
    const base = 200;
    const factor = tipo === 'premium' ? 1.5 : tipo === 'aventura' ? 1.8 : 1;
    const precio = base * parseInt(viajeros,10) * factor;
    const html = `
      <div class="result-card" aria-label="Cotización estimada">
        <strong>Cotización estimada</strong><br/>
        Destino: ${destino}<br/>
        Fechas: ${llegada} a ${salida}<br/>
        Viajeros: ${viajeros}<br/>
        Tipo: ${tipo}<br/>
        Precio estimado: USD ${precio.toFixed(2)}
      </div>
    `;
    panel.innerHTML = html;
  };

  // Destinos (placeholder)
  function renderDestinos() {
    const grid = document.getElementById('destinos-grid');
    // Si tienes un JSON, podrías fetch('datos/destinos.json')
    const datos = [
      { titulo: 'Nuquí — Ballenas & Surf', descripcion: 'Playas y avistamientos de ballenas', img: '' },
      { titulo: 'Bahía Solano — Buceo', descripcion: 'Biodiversidad marina y manglares', img: '' },
      { titulo: 'Tutunendo — Cascadas', descripcion: 'Ríos y cascadas exuberantes', img: '' }
    ];
    datos.forEach(d => {
      const card = document.createElement('div');
      card.className = 'destino-card';
      card.innerHTML = `<h4>${d.titulo}</h4><p>${d.descripcion}</p>`;
      grid.appendChild(card);
    });
  }

  // Mapa listado
  function renderMapaList() {
    const list = document.getElementById('mapa-list');
    const destinos = ['Nuquí', 'Bahía Solano', 'Tutunendo', 'Bajo Baudó', 'Istmina', 'Quibdó'];
    destinos.forEach(d => {
      const item = document.createElement('div');
      item.className = 'mapa-item';
      item.textContent = d;
      list.appendChild(item);
    });
  }

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    // Contadores iniciales
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if(!isNaN(target)) animateCounter(el, target);
    });

    renderDestinos();
    renderMapaList();
  });
})();

// NAVBAR SCROLL
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if(window.scrollY > 40){
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// HERO SLIDER

const slidesData = [
  {
    img: "imagenes/IMG_20230424_160206.jpg",
    text: "Guardianes del territorio"
  },
  {
    img: "imagenes/IMG_20230727_161222.jpg",
    text: "Ríos que conectan vida"
  },
  {
    img: "imagenes/Alto_Baudo.jpeg",
    text: "Selvas que sanan el mundo"
  }
];

const slider = document.getElementById("hero-slider");
const dynamicText = document.getElementById("hero-dynamic-text");

let current = 0;

// crear slides
slidesData.forEach((s, i) => {
  const div = document.createElement("div");
  div.className = "hero-slide";
  div.style.backgroundImage = `url(${s.img})`;
  if(i === 0) div.classList.add("active");
  slider.appendChild(div);
});

const slides = document.querySelectorAll(".hero-slide");

/*******************************************************/
// ===== NAV SCROLL EFECT =====
// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  const hero = document.querySelector('#hero');

  if(hero){
    hero.style.transform = `translateY(${scroll * 0.3}px)`;
  }
}); 

// TEXTO TIPO ESCRITURA
const text = "Guardianes del Territorio";
let index = 0;

function typingEffect(){
  const el = document.querySelector('.line-small');
  if(!el) return;

  el.textContent = text.slice(0, index++);
  if(index <= text.length){
    setTimeout(typingEffect, 60);
  }
}

typingEffect();

/*****************COTIZACIÓN********************/

// CALCULAR NOCHES AUTOMÁTICO
const llegada = document.getElementById('f-llegada');
const salida = document.getElementById('f-salida');
const noches = document.getElementById('f-noches');
const nochesManual = document.getElementById('f-noches-manual');

function calcularNoches() {
  if (!llegada.value || !salida.value) return;

  const inicio = new Date(llegada.value);
  const fin = new Date(salida.value);

  if (fin <= inicio) {
    noches.value = '';
    return;
  }

  const diff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
  noches.value = diff;
}

// EVENTOS
llegada.addEventListener('change', calcularNoches);
salida.addEventListener('change', calcularNoches);

// SI USA MANUAL
nochesManual.addEventListener('input', () => {
  if (nochesManual.value > 0) {
    noches.value = nochesManual.value;
  }
});

let dias = parseInt(document.getElementById('f-noches').value);

// por si no hay cálculo automático
if (!dias || dias <= 0) {
  dias = Math.ceil((new Date(sal) - new Date(lleg)) / (864e5));
}