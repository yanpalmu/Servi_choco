// 1. Datos de los Destinos
const destinations = [
  { 
    name: 'Tutunendo', tag: 'Cuenca del Atrato', 
    img: './imagenes/tutunendo.jpg', 
    desc: 'Experiencia de inmersión en la selva pluvial. Restauración de senderos y protección de aguas cristalinas.',
    phone: '573100000000' 
  },
  { 
    name: 'Bajo Baudó', tag: 'Ecosistema Manglar', 
    img: './imagenes/ALto_Baudo.jpeg', 
    desc: 'Liderado por jóvenes locales, protegemos el corredor biológico donde el río se une con el mar.',
    phone: '573200000000' 
  },
  { 
    name: 'Bahía Solano', tag: 'Pacífico Norte', 
    img: './imagenes/bahia.jpg', 
    desc: 'Turismo científico y avistamiento responsable. Generando valor para la comunidad costera.',
    phone: '573000000000' 
  }
];

// 2. Renderizado de Tarjetas
function renderCards(data) {
  const container = document.getElementById('destContainer');
  if (!container) return;
  
  container.innerHTML = data.map(d => `
    <div class="dest-card">
      <div style="background-image: url('${d.img}'); height: 250px; background-size: cover; background-position: center;"></div>
      <div style="padding: 1.5rem;">
        <span style="color:var(--accent); font-size:0.7rem; font-weight:600; text-transform:uppercase; border: 1px solid var(--accent); padding: 2px 8px; border-radius: 10px;">${d.tag}</span>
        <h3 style="font-family:'Cormorant Garamond'; font-size:1.8rem; margin:15px 0;">${d.name}</h3>
        <p style="color:var(--text-dim); font-size:0.9rem; margin-bottom:1.5rem;">${d.desc}</p>
        <a href="https://wa.me/${d.phone}?text=Hola SERVI_CHOCO, quiero info de ${d.name}" 
           target="_blank"
           style="display:block; text-align:center; padding:12px; background:var(--accent); color:white; text-decoration:none; border-radius:30px; font-weight:600; transition: 0.3s;">
           Reservar Experiencia
        </a>
      </div>
    </div>
  `).join('');
}

// 3. Función de Contadores
const startCounters = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// 4. Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    renderCards(destinations);

    // Lógica Menú Móvil
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-links');

    if (menu) {
        menu.addEventListener('click', () => {
            menu.classList.toggle('is-active');
            menuLinks.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menu?.classList.remove('is-active');
            menuLinks?.classList.remove('active');
        });
    });

    // Control de Animación de Contadores con Scroll
    let started = false;
    window.addEventListener('scroll', () => {
        const section = document.querySelector('.impact-stats');
        if (section) {
            const rect = section.getBoundingClientRect();
            // Inicia cuando la sección es visible en la pantalla
            if (rect.top < window.innerHeight && !started) {
                startCounters();
                started = true;
            }
        }
    });
});