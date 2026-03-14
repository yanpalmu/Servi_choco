// COTIZADOR
const precios={Nuquí:450000,"Bahía Solano":420000,Tutunendo:180000,"Bajo Baudó":350000,Istmina:200000,Quibdó:280000,Acandí:380000,Riosucio:320000};
const mult={estandar:1,premium:1.5,aventura:1.3};
function cotizar(){
  const dest=document.getElementById('f-destino').value;
  const lleg=document.getElementById('f-llegada').value;
  const sal=document.getElementById('f-salida').value;
  const viaj=parseInt(document.getElementById('f-viajeros').value);
  const tipo=document.getElementById('f-tipo').value;
  if(!dest) return alert('Selecciona un destino 🌿');
  if(!lleg||!sal) return alert('Selecciona las fechas de tu viaje 📅');
  if(new Date(sal)<=new Date(lleg)) return alert('La salida debe ser posterior a la llegada');
  const dias=Math.ceil((new Date(sal)-new Date(lleg))/(864e5));
  const base=(precios[dest]||250000)*mult[tipo];
  const total=Math.round(base*dias*viaj);
  const fL=new Date(lleg+'T12:00:00').toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});
  const fS=new Date(sal+'T12:00:00').toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});
  document.getElementById('cotizacion-body').innerHTML=`
    <div class="detail-row"><span>Destino</span><strong>${dest}</strong></div>
    <div class="detail-row"><span>Llegada</span><strong>${fL}</strong></div>
    <div class="detail-row"><span>Salida</span><strong>${fS}</strong></div>
    <div class="detail-row"><span>Noches</span><strong>${dias}</strong></div>
    <div class="detail-row"><span>Viajeros</span><strong>${viaj}</strong></div>
    <div class="detail-row"><span>Experiencia</span><strong>${tipo.charAt(0).toUpperCase()+tipo.slice(1)}</strong></div>
    <div class="detail-row"><span>Precio/persona/noche</span><strong>COP $${Math.round(base).toLocaleString()}</strong></div>`;
  document.getElementById('cotizacion-total').textContent='COP $'+total.toLocaleString();
  openModal('modal-cotizacion');
}
