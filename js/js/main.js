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
