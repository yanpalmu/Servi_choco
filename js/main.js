// CURSOR
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
document.addEventListener('mousemove',e=>{
  cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px';
  setTimeout(()=>{ ring.style.left=e.clientX+'px'; ring.style.top=e.clientY+'px'; },60);
});
document.querySelectorAll('a,button,[class*="card"],[class*="item"]').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ cur.style.width='20px'; cur.style.height='20px'; ring.style.width='50px'; ring.style.height='50px'; });
  el.addEventListener('mouseleave',()=>{ cur.style.width='10px'; cur.style.height='10px'; ring.style.width='36px'; ring.style.height='36px'; });
});

// NAV
window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',scrollY>60));

// REVEAL
const obs=new IntersectionObserver(entries=>entries.forEach((e,i)=>{ if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'),i*80); },{threshold:.1}));
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// DATOS DESTINOS CON INFO COMPLETA

async function cargarDestinos(){

  const res = await fetch("http://localhost:3000/destinos");
  const destinos = await res.json();

  return destinos;

}

// FUNCIÓN ABRIR MODAL DESTINO
async function abrirDestino(id){

  const res = await fetch(`http://localhost:3000/destinos/${id}`);
  const data = await res.json();

  document.getElementById('dest-hero-img').src = data.hero_img;
  document.getElementById('dest-hero-img').alt = data.nombre;
  document.getElementById('dest-badge').textContent = data.badge;
  document.getElementById('dest-modal-h2').innerHTML = data.emoji + ' ' + data.nombre + ': <em>' + data.subtitulo.split(':').pop().trim() + '</em>';
  document.getElementById('dest-modal-sub').textContent = data.tipo;

  // Chips
  const chipsEl = document.getElementById('dest-chips');
  chipsEl.innerHTML = (data.chips || []).map(c =>
  `<span class="dest-chip">${c}</span>`
).join('');

  // Galería
  const gallery = document.getElementById('dest-gallery');
  gallery.innerHTML = (data.fotos || []).map((url, i) =>
  `<div class="dest-gallery-item" onclick="openLightbox('${url}')">
     <img src="${url}" alt="${data.nombre} foto ${i+1}" loading="lazy">
   </div>`
).join('');

  // Video
  const videoFrame = document.getElementById('dest-video-frame');
  if (data.video_id) {
    document.getElementById('dest-video-section').style.display = 'block';
    videoFrame.src = `https://www.youtube.com/embed/${data.video_id}?rel=0&modestbranding=1`;
  } else {
    document.getElementById('dest-video-section').style.display = 'none';
  }

  // Texto
  const textEl = document.getElementById('dest-text-content');
  textEl.innerHTML = `
  <h3>${data.texto_titulo || ''}</h3>
  ${(data.texto || []).map(p => `<p>${p}</p>`).join('')}
  <div class="dest-text-highlight">${data.highlight || ''}</div>
`;

  // Precio y CTA
  document.getElementById('dest-modal-precio').textContent = 'COP $' + data.precio.toLocaleString();
  document.getElementById('dest-modal-cta').onclick = () => {
    closeDestModal();
    document.getElementById('f-destino').value = data.nombre;
    setTimeout(() => document.getElementById('reservar').scrollIntoView({behavior:'smooth'}), 200);
  };

  document.getElementById('dest-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDestModal() {
  document.getElementById('dest-overlay').classList.remove('open');
  document.body.style.overflow = '';
  // Detener video al cerrar
  document.getElementById('dest-video-frame').src = '';
}

function closeDest(e) {
  if (e.target === document.getElementById('dest-overlay')) closeDestModal();
}

function openLightbox(url) {
  document.getElementById('lightbox-img').src = url;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

// Cerrar modal con ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeDestModal();
    closeLightbox();
  }
});

async function cargarGridDestinos(){

  const destinos = await cargarDestinos();

  const grid = document.getElementById('destinos-grid');

  destinos.forEach(d=>{

    const el=document.createElement('div');

    el.className='dest-card reveal';

    el.innerHTML=`
      <div class="dest-card-img">${d.emoji}</div>
      <div class="dest-card-body">
        <h3>${d.nombre}</h3>
        <div class="dest-tipo">${d.tipo}</div>
        <p>${d.descripcion}</p>
        <div class="dest-precio">
          COP $${Number(d.precio).toLocaleString()}
          <small>/ persona / noche</small>
        </div>
        <div class="dest-ver-mas">Ver destino →</div>
      </div>
    `;

    el.onclick=()=> abrirDestino(d.id);

    grid.appendChild(el);

    obs.observe(el);

  });

}

async function initMap(){

  const destinosData = await cargarDestinos();

  const m = L.map('choco-map',{center:[5.8,-76.9],zoom:7});

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution:'© OpenStreetMap' }
  ).addTo(m);

  const list = document.getElementById('mapa-list');

  destinosData.forEach(d=>{

    const mk = L.marker([Number(d.lat),Number(d.lng)]).addTo(m);

    mk.bindPopup(`
      <strong>${d.emoji} ${d.nombre}</strong><br>
      ${d.tipo}<br>
      Desde COP $${d.precio.toLocaleString()}
    `);

    const item = document.createElement("div");
    item.className="mapa-item";

    item.innerHTML=`
      <div class="m-name">${d.emoji} ${d.nombre}</div>
      <div class="m-tipo">${d.tipo}</div>
      <div class="m-precio">Desde $${(d.precio/1000).toFixed(0)}k</div>
    `;

    item.onclick=()=>{
      m.setView([Number(d.lat),Number(d.lng)],11);
      mk.openPopup();
    };

    list.appendChild(item);

  });

}
window.addEventListener("load",initMap);
window.addEventListener("load",cargarGridDestinos);
//window.addEventListener('load',()=>setTimeout(initMap,400));


// MODALES
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function irAPago(){closeModal('modal-cotizacion');document.getElementById('pago').scrollIntoView({behavior:'smooth'});}
document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));

// PSE
function selBank(btn){document.querySelectorAll('.bank-btn').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');}
function confirmarPSE(){alert('✅ Redirigiendo al portal seguro de tu banco.\n\n⚠️ Para PSE real: regístrate en achcolombia.com.co');closeModal('modal-pse');}
function confirmarTarjeta(){alert('✅ Procesando pago.\n\n⚠️ Para producción: integra Wompi (wompi.com) o PayU Colombia.');closeModal('modal-tarjeta');}
function fmtCard(i){let v=i.value.replace(/\D/g,'').substring(0,16);i.value=v.replace(/(.{4})/g,'$1 ').trim();}

// CONTADORES
const cObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animCount(e.target);cObs.unobserve(e.target);}},{threshold:.5}));
document.querySelectorAll('.stat-num').forEach(el=>cObs.observe(el));
function animCount(el){const t=+el.dataset.target;let c=0;const s=t/60;const iv=setInterval(()=>{c=Math.min(c+s,t);el.textContent=Math.floor(c).toLocaleString();if(c>=t)clearInterval(iv);},25);}

// GEMINI IA
const GEMINI_KEY='TU_API_KEY_AQUI';
const SYS=`Eres "Chocó Guide", asistente de SERVI_CHOCO, turismo comunitario en el Chocó, Colombia. Destinos: Nuquí (ballenas, surf), Bahía Solano (buceo), Tutunendo (cascadas), Bajo Baudó (Emberá), Acandí (Caribe), Sipí (cascada 70m). Precios: $160,000–$450,000/persona/noche. Responde en español, cálido, máx 3 oraciones.`;
let hist=[];
function toggleAI(){document.getElementById('ai-window').classList.toggle('open');}
function chip(btn){document.getElementById('ai-inp').value=btn.textContent;sendAI();}
async function sendAI(){
  const inp=document.getElementById('ai-inp');
  const msg=inp.value.trim();
  if(!msg)return;
  addMsg(msg,'user');inp.value='';
  const typing=addMsg('Escribiendo…','bot');
  try{
    hist.push({role:"user",parts:[{text:msg}]});
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:SYS}]},contents:hist})});
    const d=await r.json();
    typing.remove();
    const reply=d.candidates?.[0]?.content?.parts?.[0]?.text||'Configura tu API Key de Gemini para activar el asistente. 🔧';
    if(d.candidates)hist.push({role:"model",parts:[{text:reply}]});
    addMsg(reply,'bot');
  }catch(e){typing.remove();addMsg('Configura tu API Key de Google Gemini en el archivo index.html para activar el asistente. 🌿','bot');}
}
function addMsg(text,type){const b=document.getElementById('ai-msgs');const el=document.createElement('div');el.className=`ai-msg ${type}`;el.textContent=text;b.appendChild(el);b.scrollTop=b.scrollHeight;return el;}

/////////////////////////// 

(function(){
  // State
  const state = {
    musicOn: false,
    currentSong: 0,
  };

  // Reproductor simple (sin fuente de audio real aquí; placeholder)
  window.toggleMusic = function() {
    state.musicOn = !state.musicOn;
    const btn = document.getElementById('music-toggle');
    const icon = document.getElementById('music-icon');
    if(state.musicOn){
      icon.textContent = '❚❚';
      btn.setAttribute('aria-label','Pausar música');
      //iniciar un Audio
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
    //renderMapaList();
  });
})();

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a:not(.nav-cta)");

const observer = new IntersectionObserver((entries)=>{

  entries.forEach(entry=>{

    if(entry.isIntersecting){

      const id = entry.target.id;

      navLinks.forEach(link=>{
        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + id){
          link.classList.add("active");
        }

      });

    }

  });

},{
  threshold:0.4
});

sections.forEach(section=>{
  observer.observe(section);
});