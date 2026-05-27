/*
╔══════════════════════════════════════════════════════════════════╗
║               MATCHMAKERS — LÓGICA DEL PROTOTIPO                ║
║                                                                  ║
║  Este archivo controla TODO lo que ocurre cuando el usuario      ║
║  toca botones en la app: cambiar de pantalla, abrir menús,       ║
║  filtrar resultados, mostrar calendarios, etc.                   ║
║                                                                  ║
║  Está escrito en JavaScript, el lenguaje que hace que las        ║
║  páginas web sean interactivas (respondan a los clics).          ║
╚══════════════════════════════════════════════════════════════════╝
*/


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 1 — SISTEMA DE NAVEGACIÓN ENTRE PANTALLAS
   ══════════════════════════════════════════════════════════════════
   La app tiene múltiples "pantallas" (inicio, buscar, chat…).
   Todas están apiladas una encima de la otra en el HTML.
   Para "navegar" simplemente hacemos visible la que queremos
   y ocultamos la anterior. No hay páginas reales — todo está
   en un solo archivo HTML.
*/

// Guarda cuál es la pantalla que se ve ahora mismo.
// Empieza en null (ninguna) porque aún no ha arrancado la app.
let currentScreen = null;

// Guarda un historial de pantallas visitadas, como el botón
// "atrás" de un navegador web. Cada vez que vamos a una pantalla
// nueva, la anterior se anota aquí.
let screenHistory = [];


/*
 * goTo(screenId)
 * ──────────────
 * Cambia la pantalla visible. Recibe el ID de la pantalla
 * destino (por ejemplo 'screen-home' o 'screen-chat').
 *
 * ¿Cómo funciona?
 *   1. Si ya estamos en esa pantalla, no hace nada.
 *   2. Quita la clase 'active' de la pantalla actual (la oculta).
 *   3. Anota la pantalla anterior en el historial (para poder volver).
 *   4. Añade la clase 'active' a la pantalla destino (la muestra).
 *
 * La clase 'active' está definida en styles.css y hace que
 * la pantalla sea visible (opacity: 1) y reciba clics.
 */
function goTo(screenId) {

  // Si el usuario ya está en esta pantalla, no hacer nada
  if (currentScreen === screenId) return;

  // Si hay una pantalla activa, ocultarla
  if (currentScreen) {
    const pantallaAnterior = document.getElementById(currentScreen);
    if (pantallaAnterior) pantallaAnterior.classList.remove('active');

    // Guardar en el historial (excepto si el destino es el splash/inicio de sesión,
    // porque no tiene sentido volver a esa pantalla con el botón atrás)
    if (screenId !== 'screen-splash') {
      screenHistory.push(currentScreen);
    }
  }

  // Mostrar la pantalla de destino añadiéndole la clase 'active'
  const pantallaDestino = document.getElementById(screenId);
  if (pantallaDestino) pantallaDestino.classList.add('active');

  // Actualizar cuál es la pantalla actual
  currentScreen = screenId;
}


/*
 * goBack()
 * ────────
 * Vuelve a la pantalla anterior, como el botón "←" de un celular.
 * Saca la última pantalla del historial y la muestra.
 */
function goBack() {

  // Si no hay historial, no hay a dónde volver
  if (!screenHistory.length) return;

  // Sacar la última pantalla del historial (la que visitamos antes)
  const pantallaAnterior = screenHistory.pop();

  // Ocultar la pantalla que se ve ahora
  const pantallaActual = document.getElementById(currentScreen);
  if (pantallaActual) pantallaActual.classList.remove('active');

  // Mostrar la pantalla anterior
  const destino = document.getElementById(pantallaAnterior);
  if (destino) destino.classList.add('active');

  // Actualizar la pantalla actual
  currentScreen = pantallaAnterior;
}


/*
 * navTo(screenId, btn)
 * ────────────────────
 * Como goTo(), pero además resalta el botón del menú inferior
 * que corresponde a la sección activa (el ícono se pone verde).
 *
 * Se usa solo para los botones del menú de navegación inferior
 * (Inicio, Buscar, Comunidad, Chat).
 */
function navTo(screenId, btn) {

  // Cambiar de pantalla
  goTo(screenId);

  // Dentro de esa pantalla, quitarle el resaltado a todos los botones del menú
  const pantalla = document.getElementById(screenId);
  if (!pantalla) return;
  pantalla.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Resaltar solo el botón que se tocó
  if (btn) btn.classList.add('active');
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 2 — MENÚ LATERAL (DRAWER DE PERFIL)
   ══════════════════════════════════════════════════════════════════
   Al tocar la foto de perfil en el inicio, se desliza un panel
   lateral desde la izquierda con la info del usuario y sus equipos.
   Un fondo oscuro (overlay) cubre el resto de la pantalla.
*/


/*
 * openDrawer()
 * ────────────
 * Abre el panel lateral de perfil.
 * Añade la clase 'open' al panel (que en CSS lo desliza hacia adentro)
 * y muestra el fondo oscuro.
 */
function openDrawer() {
  const panel  = document.getElementById('profile-drawer');
  const fondo  = document.getElementById('drawer-overlay');
  if (panel) panel.classList.add('open');
  if (fondo) fondo.classList.remove('hidden');
}


/*
 * closeDrawer()
 * ─────────────
 * Cierra el panel lateral. Al tocar el fondo oscuro o el botón
 * de cerrar, el panel se desliza de vuelta fuera de la pantalla.
 */
function closeDrawer() {
  const panel = document.getElementById('profile-drawer');
  const fondo = document.getElementById('drawer-overlay');
  if (panel) panel.classList.remove('open');
  if (fondo) fondo.classList.add('hidden');
}

/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 3 — MODAL DE CREACIÓN (BOTÓN "+" CENTRAL)
   ══════════════════════════════════════════════════════════════════
   El botón verde "+" del menú inferior abre una hoja inferior
   (bottom sheet) donde el usuario puede elegir qué quiere crear:
   un partido, reservar cancha o publicar en el feed.
*/


/*
 * openCreateModal()
 * ─────────────────
 * Muestra el modal de creación quitándole la clase 'hidden'.
 */
function openCreateModal() {
  document.getElementById('create-modal-overlay').classList.remove('hidden');
  document.getElementById('create-modal').classList.remove('hidden');
}


/*
 * closeCreateModal()
 * ──────────────────
 * Oculta el modal de creación añadiéndole la clase 'hidden'.
 */
function closeCreateModal() {
  document.getElementById('create-modal-overlay').classList.add('hidden');
  document.getElementById('create-modal').classList.add('hidden');
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 4 — TABS DE "MIS PARTIDOS"
   ══════════════════════════════════════════════════════════════════
   La pantalla "Mis Partidos" tiene tres pestañas: Próximos,
   Pasados y Estadísticas. Esta función muestra la pestaña
   seleccionada y oculta las demás.
*/


/*
 * setPartidosTab(tab)
 * ───────────────────
 * Activa la pestaña indicada en "Mis Partidos".
 * tab puede ser: 'proximos', 'pasados' o 'estadisticas'
 */
function setPartidosTab(tab) {

  ['proximos', 'pasados', 'creados'].forEach(nombre => {
    const contenido = document.getElementById('tab-' + nombre);
    if (contenido) contenido.classList.remove('active');
  });

  const contenidoActivo = document.getElementById('tab-' + tab);
  if (contenidoActivo) contenidoActivo.classList.add('active');

  const botonesPestana = document.querySelectorAll('#partidos-tabs .tab-pill');
  const indicePorNombre = { proximos: 0, pasados: 1, creados: 2 };
  botonesPestana.forEach((boton, i) => {
    boton.classList.toggle('active', i === indicePorNombre[tab]);
  });
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 5 — FILTROS DE COMUNIDAD
   ══════════════════════════════════════════════════════════════════
   La pantalla de Comunidad tiene cuatro filtros: Para ti,
   Resultados, Videos y Convocatorias. Cada post tiene data-tipo
   ('parati' | 'resultado' | 'video' | 'convocatoria').
*/


/*
 * setCommunityFilter(filtro, btnEl)
 * ──────────────────────────────────
 * Activa el filtro y muestra solo los posts correspondientes.
 * filtro puede ser: 'parati', 'resultados', 'videos', 'convocatorias'.
 */
function setCommunityFilter(filtro, btnEl) {

  // Resaltar el botón activo
  document.querySelectorAll('#community-filter-pills .tab-pill').forEach(b => {
    b.classList.remove('active');
  });
  if (btnEl) btnEl.classList.add('active');

  // Mostrar/ocultar posts según el filtro
  document.querySelectorAll('#community-feed .post-card').forEach(card => {
    const tipo = card.dataset.tipo || '';
    const visible = filtro === 'parati' || tipo === filtro;
    card.style.display = visible ? '' : 'none';
  });
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 6 — FILTROS DE CHAT
   ══════════════════════════════════════════════════════════════════
   La pantalla de Chat tiene cuatro filtros: Todos, Equipos,
   Partidos y No leídos. Cada conversación tiene data-tipo
   ('equipo' | 'partido' | 'persona') y data-unread ('true'|'false').
*/


/*
 * setChatFilter(filtro, btnEl)
 * ────────────────────────────
 * Activa el filtro indicado y muestra solo las conversaciones
 * que corresponden. filtro puede ser: 'todos', 'equipos',
 * 'partidos' o 'noleidos'.
 */
function setChatFilter(filtro, btnEl) {

  // Resaltar el botón activo
  document.querySelectorAll('#chat-filter-pills .tab-pill').forEach(b => {
    b.classList.remove('active');
  });
  if (btnEl) btnEl.classList.add('active');

  // Mostrar/ocultar conversaciones según el filtro
  document.querySelectorAll('#chat-convo-list .convo-row').forEach(fila => {
    const tipo   = fila.dataset.tipo   || '';
    const unread = fila.dataset.unread === 'true';

    let visible = false;
    if      (filtro === 'todos')    visible = true;
    else if (filtro === 'equipos')  visible = tipo === 'equipo';
    else if (filtro === 'partidos') visible = tipo === 'partido';
    else if (filtro === 'noleidos') visible = unread;

    fila.style.display = visible ? '' : 'none';
  });
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 7 — TABS DE "FICHAJES"
   ══════════════════════════════════════════════════════════════════
   La pantalla de Fichajes tiene dos pestañas: Jugadores y Equipos.
*/


/*
 * setFichajesTab(tab)
 * ───────────────────
 * Activa la pestaña indicada en Fichajes.
 * tab puede ser: 'jugadores' o 'equipos'
 */
function setFichajesTab(tab) {

  // Ocultar ambas pestañas
  ['jugadores', 'equipos'].forEach(nombre => {
    const contenido = document.getElementById('tab-' + nombre);
    if (contenido) contenido.classList.remove('active');
  });

  // Mostrar la pestaña seleccionada
  const contenidoActivo = document.getElementById('tab-' + tab);
  if (contenidoActivo) contenidoActivo.classList.add('active');

  // Resaltar el botón correcto
  const botones = document.querySelectorAll('#fichajes-tabs .tab-pill');
  const indices = { jugadores: 0, equipos: 1 };
  botones.forEach((boton, i) => {
    boton.classList.toggle('active', i === indices[tab]);
  });
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 8 — FORMULARIO: CREAR EQUIPO
   ══════════════════════════════════════════════════════════════════
   Funciones para el formulario de creación de equipo:
   elegir color, seleccionar horario y actualizar las iniciales.
*/


/*
 * selectSlot(btn)
 * ───────────────
 * En el formulario de retar a un rival, el usuario elige un
 * horario disponible. Solo se puede elegir uno a la vez.
 * Al tocar un horario, se deselecciona el anterior y se marca el nuevo.
 */
function selectSlot(btn) {
  // Buscar la grilla de horarios que contiene el botón tocado
  const grilla = btn.closest('.time-slots-grid');

  // Deseleccionar todos los horarios de esa grilla
  grilla.querySelectorAll('.time-slot.selected').forEach(slot => {
    slot.classList.remove('selected');
    slot.classList.add('free');
  });

  // Marcar como seleccionado el horario tocado
  btn.classList.remove('free');
  btn.classList.add('selected');
}


/*
 * selectColor(btn)
 * ────────────────
 * En el formulario de crear equipo, el usuario elige el color
 * del equipo tocando un círculo de color. Esta función:
 *   1. Desmarca todos los colores.
 *   2. Marca el color tocado.
 *   3. Actualiza el avatar del equipo con ese color.
 */
function selectColor(btn) {
  // Quitar la selección de todos los puntos de color
  btn.closest('.color-picker-row').querySelectorAll('.color-dot')
    .forEach(punto => punto.classList.remove('active'));

  // Marcar el punto tocado
  btn.classList.add('active');

  // Aplicar el mismo color al círculo de vista previa del equipo
  const colorElegido = btn.style.background;
  const avatarEquipo = document.getElementById('new-team-avatar');
  if (avatarEquipo) avatarEquipo.style.background = colorElegido;
}


/*
 * updateTeamInitials(name)
 * ────────────────────────
 * Mientras el usuario escribe el nombre del equipo, esta función
 * actualiza en tiempo real las iniciales que aparecen en el avatar.
 * Ejemplo: "Águilas Calvas" → "AC"
 */
function updateTeamInitials(name) {
  const avatar = document.getElementById('new-team-avatar');
  if (!avatar) return;

  const palabras = name.trim().split(/\s+/); // Separar por espacios

  const iniciales = palabras.length >= 2
    ? (palabras[0][0] + palabras[1][0]).toUpperCase() // Primera letra de cada palabra
    : (name.slice(0, 2).toUpperCase() || 'NK');       // O las primeras 2 letras si es una sola palabra

  avatar.textContent = iniciales;
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 9 — PILLS DE FORMATO Y DÍAS (GENÉRICAS)
   ══════════════════════════════════════════════════════════════════
   Algunos formularios tienen opciones de selección tipo "pastillas"
   (pills). Estas escuchan clics en cualquier parte de la pantalla
   y reaccionan cuando el usuario toca una pill.
*/


// Escucha de clicks en pills de FORMATO (Fútbol 5, 7, 11…)
// Solo una pill puede estar activa a la vez dentro del grupo.
document.addEventListener('click', e => {
  const pill = e.target.closest('.format-pill');
  if (!pill) return; // Si el clic no fue en una pill, ignorar

  // Encontrar el grupo al que pertenece esta pill
  const grupo = pill.closest('.format-pills, .format-grid');
  if (!grupo) return;

  // Desactivar todas las pills del grupo
  grupo.querySelectorAll('.format-pill').forEach(p => p.classList.remove('active'));

  // Activar solo la que se tocó
  pill.classList.add('active');
});


// Escucha de clicks en pills de DÍAS (Lun, Mar, Mié…)
// Estas sí permiten seleccionar varios días a la vez (toggle individual).
document.addEventListener('click', e => {
  const pill = e.target.closest('.day-pill');
  if (!pill) return;
  pill.classList.toggle('active'); // Alterna entre activo e inactivo
});


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 10 — FILTROS DE "BUSCAR RIVAL"
   ══════════════════════════════════════════════════════════════════
   La pantalla "Buscar Rival" tiene filtros que permiten filtrar
   equipos por:
     • Formato del partido (11v11, 8v8, 7v7, 5v5) — multi-selección
     • Barrio donde juegan — multi-selección
     • Fecha disponible — seleccionada en un mini-calendario

   "Multi-selección" significa que se pueden elegir varios a la vez.
   Por ejemplo: ver equipos de 7v7 Y de 5v5 al mismo tiempo.

   Los filtros usan "Set" — una lista sin duplicados donde podemos
   agregar y quitar valores fácilmente.
*/

// Estado actual de los filtros de Buscar Rival.
// Cada propiedad es un Set (conjunto) de valores seleccionados.
// Si el Set está vacío, ese filtro no está activo y muestra todo.
const rivalesFilters = {
  formatos: new Set(), // Ej: {'7v7', '5v5'}
  barrios:  new Set(), // Ej: {'Chapinero', 'Suba'}
  fechas:   new Set(), // Ej: {'2026-05-22', '2026-05-24'}
};

// Fecha "hoy" del prototipo — fija para que el demo sea consistente.
// Centralizada aquí para que ambos calendarios (rivales y partidos) la compartan.
const HOY = new Date(2026, 4, 22);

// Fecha que muestra el calendario (el mes visible). Empieza en mayo 2026.
// Los meses en JavaScript van de 0 (enero) a 11 (diciembre), por eso mayo = 4.
let calendarDate = new Date(2026, 4, 1);


/*
 * toggleRivalesFilters()
 * ──────────────────────
 * Muestra u oculta el panel de filtros al tocar el botón "⚙ Filtros".
 * También resalta el botón si el panel está abierto.
 */
function toggleRivalesFilters() {
  const panel = document.getElementById('rivales-filter-panel');
  const boton = document.getElementById('rivales-filter-btn');
  if (!panel) return;

  panel.classList.toggle('hidden'); // Alternar visible/oculto

  // El botón se resalta en verde cuando el panel está abierto
  if (boton) boton.classList.toggle('filter-btn-active', !panel.classList.contains('hidden'));

  if (!panel.classList.contains('hidden')) renderRivalCalendar();
}


/*
 * toggleRivalFilter(el, type)
 * ───────────────────────────
 * Agrega o quita un valor del filtro al tocar una pill.
 *
 * el   = la pill que se tocó (elemento HTML)
 * type = qué tipo de filtro es: 'formato' o 'barrio'
 *
 * Si el valor ya estaba seleccionado → lo quita (deselecciona).
 * Si no estaba seleccionado → lo agrega.
 * Después aplica los filtros para actualizar la lista.
 */
function toggleRivalFilter(el, type) {
  const key   = type + 's'; // 'formato' → 'formatos', 'barrio' → 'barrios'
  const valor = el.dataset.val; // El valor guardado en la pill (ej: '7v7')

  if (rivalesFilters[key].has(valor)) {
    rivalesFilters[key].delete(valor); // Ya estaba → quitarlo
    el.classList.remove('active');
  } else {
    rivalesFilters[key].add(valor);    // No estaba → agregarlo
    el.classList.add('active');
  }

  applyRivalesFilters(); // Actualizar la lista de equipos
}


/*
 * renderCalendar(config)
 * ──────────────────────
 * Función unificada que dibuja el mini-calendario de cualquier
 * panel de filtros. Recibe un objeto de configuración con los
 * parámetros que difieren entre el calendario de rivales y el de partidos.
 *
 * config = {
 *   containerId   — ID del div donde se inserta el calendario
 *   calDate       — objeto Date con el mes visible
 *   fechasSet     — Set con las fechas seleccionadas por el usuario
 *   dataSelector  — selector CSS para leer qué días tienen datos
 *   navFn         — nombre de la función de navegación (string)
 *   selectFn      — nombre de la función de selección de día (string)
 *   clearFn       — nombre de la función de limpiar fechas (string)
 * }
 *
 * El calendario muestra puntos verdes en los días que tienen datos
 * y resalta en verde los días seleccionados por el usuario.
 */
function renderCalendar(config) {
  const contenedor = document.getElementById(config.containerId);
  if (!contenedor) return;

  const year  = config.calDate.getFullYear();
  const month = config.calDate.getMonth();

  const nombresMes = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  // Día de la semana en que empieza el mes (0=Domingo, 6=Sábado)
  const primerDia  = new Date(year, month, 1).getDay();

  // Cantidad de días que tiene el mes
  const diasDelMes = new Date(year, month + 1, 0).getDate();

  // Recopilar todas las fechas que tienen datos disponibles
  const fechasConDatos = new Set(
    Array.from(document.querySelectorAll(config.dataSelector))
      .map(el => el.dataset.fecha)
  );

  // Construir el HTML del calendario pieza por pieza
  let html = `
    <div class="cal-header">
      <button class="cal-nav" onclick="${config.navFn}(-1)">‹</button>
      <span class="cal-month-label">${nombresMes[month]} ${year}</span>
      <button class="cal-nav" onclick="${config.navFn}(1)">›</button>
    </div>
    <div class="cal-grid">
      <span class="cal-dow">D</span>
      <span class="cal-dow">L</span>
      <span class="cal-dow">M</span>
      <span class="cal-dow">M</span>
      <span class="cal-dow">J</span>
      <span class="cal-dow">V</span>
      <span class="cal-dow">S</span>
  `;

  // Añadir celdas vacías para alinear el primer día con su columna correcta
  for (let i = 0; i < primerDia; i++) {
    html += `<span class="cal-day cal-empty"></span>`;
  }

  // Añadir cada día del mes
  for (let dia = 1; dia <= diasDelMes; dia++) {

    // Formato ISO: 'AAAA-MM-DD' (ej: '2026-05-22')
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    // ¿Este día ya pasó?
    const esPasado = new Date(year, month, dia) < new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate());

    // ¿Hay datos disponibles en este día?
    const tieneDatos = fechasConDatos.has(iso);

    // ¿El usuario ya seleccionó este día?
    const estaSeleccionado = config.fechasSet.has(iso);

    // Construir la lista de clases CSS para este día
    const clases = [
      'cal-day',
      esPasado         ? 'cal-past'      : '',
      tieneDatos       ? 'cal-has-match' : '',
      estaSeleccionado ? 'cal-selected'  : '',
    ].filter(Boolean).join(' ');

    // Los días pasados no son clicables
    const alTocar = esPasado ? '' : `onclick="${config.selectFn}('${iso}')"`;

    // El punto verde aparece solo si hay datos Y el día no está seleccionado
    // (cuando está seleccionado el fondo verde ya lo indica)
    const punto = tieneDatos && !estaSeleccionado
      ? `<span class="cal-dot"></span>`
      : '';

    html += `<span class="${clases}" ${alTocar}>${dia}${punto}</span>`;
  }

  html += `</div>`;

  // Si hay fechas seleccionadas, mostrar botón para limpiarlas
  if (config.fechasSet.size > 0) {
    const n = config.fechasSet.size;
    html += `<button class="cal-clear" onclick="${config.clearFn}()">✕ Quitar ${n} fecha${n > 1 ? 's' : ''}</button>`;
  }

  // Insertar el HTML construido en el contenedor del calendario
  contenedor.innerHTML = html;
}


// Configuración del calendario de Buscar Rival
const rivalesCalConfig = {
  containerId:  'rival-calendar',
  get calDate() { return calendarDate; },
  get fechasSet() { return rivalesFilters.fechas; },
  dataSelector: '#rivales-list .team-card[data-fecha]',
  navFn:        'calNav',
  selectFn:     'selectCalDate',
  clearFn:      'clearCalDates',
};

// Configuración del calendario de Buscar Partido
const partidosCalConfig = {
  containerId:  'partidos-calendar',
  get calDate() { return partidosCalDate; },
  get fechasSet() { return partidosFilters.fechas; },
  dataSelector: '#partidos-list [data-fecha]',
  navFn:        'partidosCalNav',
  selectFn:     'selectPartidosDate',
  clearFn:      'clearPartidosDates',
};

function renderRivalCalendar()    { renderCalendar(rivalesCalConfig); }
function renderPartidosCalendar() { renderCalendar(partidosCalConfig); }


/*
 * calNav(direccion)
 * ─────────────────
 * Navega al mes anterior (-1) o siguiente (+1) en el calendario.
 */
function calNav(direccion) {
  calendarDate.setMonth(calendarDate.getMonth() + direccion);
  renderRivalCalendar();
}


/*
 * selectCalDate(iso)
 * ──────────────────
 * Selecciona o deselecciona un día en el calendario.
 * iso = fecha en formato 'AAAA-MM-DD' (ej: '2026-05-24')
 *
 * Si el día ya estaba seleccionado → lo quita.
 * Si no estaba → lo agrega.
 * Permite seleccionar varios días a la vez.
 */
function selectCalDate(iso) {
  if (rivalesFilters.fechas.has(iso)) {
    rivalesFilters.fechas.delete(iso); // Deseleccionar
  } else {
    rivalesFilters.fechas.add(iso);    // Seleccionar
  }
  renderRivalCalendar();   // Redibujar el calendario para ver el cambio
  applyRivalesFilters();   // Actualizar la lista de equipos
}


/*
 * clearCalDates()
 * ───────────────
 * Quita todas las fechas seleccionadas en el calendario.
 */
function clearCalDates() {
  rivalesFilters.fechas.clear();
  renderRivalCalendar();
  applyRivalesFilters();
}


/*
 * clearAllRivalesFilters()
 * ────────────────────────
 * Limpia TODOS los filtros de Buscar Rival de una sola vez:
 * formato, barrio, fechas y texto de búsqueda.
 */
function clearAllRivalesFilters() {
  // Vaciar todos los Sets de filtros
  rivalesFilters.formatos.clear();
  rivalesFilters.barrios.clear();
  rivalesFilters.fechas.clear();

  // Quitar el resaltado visual de todas las pills de filtro
  document.querySelectorAll('#rivales-filter-panel .filter-sel-pill')
    .forEach(pill => pill.classList.remove('active'));

  // Borrar el texto de búsqueda
  const inputBusqueda = document.getElementById('rival-search-input');
  if (inputBusqueda) inputBusqueda.value = '';

  // Redibujar calendario y actualizar lista
  renderRivalCalendar();
  applyRivalesFilters();
}


/*
 * applyRivalesFilters()
 * ─────────────────────
 * Esta es la función principal de filtrado. Se ejecuta cada vez
 * que algo cambia (se toca una pill, se selecciona una fecha,
 * se escribe en la barra de búsqueda).
 *
 * Recorre todas las tarjetas de equipo y decide cuáles mostrar
 * y cuáles ocultar según los filtros activos.
 *
 * Lógica:
 *   • Dentro de cada filtro → OR (si eliges 7v7 y 5v5, muestra ambos)
 *   • Entre filtros distintos → AND (debe cumplir formato Y barrio Y fecha)
 */
function applyRivalesFilters() {

  // Leer el texto de búsqueda (en minúsculas para comparar sin importar mayúsculas)
  const textoBusqueda = (document.getElementById('rival-search-input')?.value || '').toLowerCase();

  const formatos = rivalesFilters.formatos;
  const barrios  = rivalesFilters.barrios;
  const fechas   = rivalesFilters.fechas;

  // Obtener todas las tarjetas de equipo
  const tarjetas = document.querySelectorAll('#rivales-list .team-card[data-formato]');
  let cantidadVisible = 0;

  tarjetas.forEach(tarjeta => {

    // ¿Cumple el filtro de formato?
    // Si no hay formatos seleccionados (Set vacío) → muestra todo.
    // Si hay seleccionados → el equipo debe tener uno de ellos.
    const cumpleFormato = formatos.size === 0 || formatos.has(tarjeta.dataset.formato);

    // ¿Cumple el filtro de barrio?
    const cumpleBarrio  = barrios.size === 0  || barrios.has(tarjeta.dataset.barrio);

    // ¿Cumple el filtro de fecha?
    const cumpleFecha   = fechas.size === 0   || fechas.has(tarjeta.dataset.fecha);

    // ¿Cumple la búsqueda por texto?
    // Si no hay texto → muestra todo. Si hay → el texto debe aparecer en la tarjeta.
    const cumpleBusqueda = !textoBusqueda || tarjeta.textContent.toLowerCase().includes(textoBusqueda);

    // Solo se muestra si cumple TODOS los filtros
    const mostrar = cumpleFormato && cumpleBarrio && cumpleFecha && cumpleBusqueda;

    tarjeta.style.display = mostrar ? '' : 'none';
    if (mostrar) cantidadVisible++;
  });

  // Actualizar el contador de resultados (ej: "3 equipos encontrados")
  const contador = document.getElementById('rivales-count');
  if (contador) {
    contador.textContent = `${cantidadVisible} equipo${cantidadVisible !== 1 ? 's' : ''} encontrado${cantidadVisible !== 1 ? 's' : ''}`;
  }

  // Mostrar u ocultar el mensaje "Sin resultados"
  const mensajeVacio = document.getElementById('rivales-empty');
  if (mensajeVacio) mensajeVacio.classList.toggle('hidden', cantidadVisible > 0);

  // Resaltar el botón "Filtros" si hay algún filtro activo
  const hayFiltrosActivos = formatos.size > 0 || barrios.size > 0 || fechas.size > 0 || !!textoBusqueda;
  const botonFiltros = document.getElementById('rivales-filter-btn');
  if (botonFiltros) botonFiltros.classList.toggle('filter-btn-active', hayFiltrosActivos);
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 11 — FILTROS DE "BUSCAR PARTIDO"
   ══════════════════════════════════════════════════════════════════
   Igual que Buscar Rival, pero para partidos abiertos donde
   cualquier persona puede unirse a un equipo.
   Filtra por: Formato, Fecha (calendario) y Barrio.
   Además oculta automáticamente los encabezados de sección
   ("EN VIVO" / "PRÓXIMOS") si no hay resultados bajo ellos.
*/

// Estado de filtros para Buscar Partido
const partidosFilters = {
  formatos: new Set(),
  barrios:  new Set(),
  fechas:   new Set(),
};

// Fecha visible en el calendario de partidos (empieza en mayo 2026)
let partidosCalDate = new Date(2026, 4, 1);


/*
 * togglePartidosFilters()
 * ───────────────────────
 * Abre/cierra el panel de filtros de Buscar Partido.
 * Cuando se abre, también dibuja el calendario.
 */
function togglePartidosFilters() {
  const panel = document.getElementById('partidos-filter-panel');
  const boton = document.getElementById('partidos-filter-btn');
  if (!panel) return;

  panel.classList.toggle('hidden');
  if (boton) boton.classList.toggle('filter-btn-active', !panel.classList.contains('hidden'));

  // Dibujar el calendario solo cuando el panel se abre
  if (!panel.classList.contains('hidden')) renderPartidosCalendar();
}


/*
 * togglePartidoFilter(el, type)
 * ─────────────────────────────
 * Agrega/quita un valor de filtro al tocar una pill.
 * Funciona igual que toggleRivalFilter pero para los filtros de partidos.
 */
function togglePartidoFilter(el, type) {
  const key   = type + 's';
  const valor = el.dataset.val;

  if (partidosFilters[key].has(valor)) {
    partidosFilters[key].delete(valor);
    el.classList.remove('active');
  } else {
    partidosFilters[key].add(valor);
    el.classList.add('active');
  }

  applyPartidosFilters();
}


// Navegar mes anterior/siguiente en el calendario de partidos
function partidosCalNav(dir) {
  partidosCalDate.setMonth(partidosCalDate.getMonth() + dir);
  renderPartidosCalendar();
}

// Seleccionar/deseleccionar un día en el calendario de partidos
function selectPartidosDate(iso) {
  if (partidosFilters.fechas.has(iso)) partidosFilters.fechas.delete(iso);
  else                                 partidosFilters.fechas.add(iso);
  renderPartidosCalendar();
  applyPartidosFilters();
}

// Quitar todas las fechas seleccionadas en el calendario de partidos
function clearPartidosDates() {
  partidosFilters.fechas.clear();
  renderPartidosCalendar();
  applyPartidosFilters();
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN — GESTIÓN DE EQUIPO (Team Management)
   ══════════════════════════════════════════════════════════════════
   Funciones para la pantalla de administración del equipo.
   Se llega a ella desde el drawer lateral al tocar un equipo.
*/

/*
 * openTeamManagement(teamName)
 * ────────────────────────────
 * Cierra el drawer lateral, rellena los textos de la pantalla
 * con el nombre del equipo elegido, y navega a ella.
 */
function openTeamManagement(teamName) {
  closeDrawer();
  document.getElementById('team-management-title').textContent = teamName;
  document.querySelector('#screen-team-management .tm-team-name').textContent = teamName;
  document.getElementById('edit-team-name').value = teamName;
  goTo('screen-team-management');
}

/* openEditTeamSheet / closeEditTeamSheet
   Muestra u oculta el panel "Editar equipo" que sube desde abajo. */
function openEditTeamSheet() {
  document.getElementById('edit-team-sheet').classList.remove('hidden');
  document.getElementById('edit-team-overlay').classList.remove('hidden');
}

function closeEditTeamSheet() {
  document.getElementById('edit-team-sheet').classList.add('hidden');
  document.getElementById('edit-team-overlay').classList.add('hidden');
}

/* toggleModality(btn)
   Activa/desactiva un chip de modalidad (5v5, 7v7…) en el panel de edición. */
function toggleModality(btn) {
  btn.classList.toggle('active');
}

/*
 * saveEditTeam()
 * ──────────────
 * Lee los campos del panel "Editar equipo", actualiza los textos
 * visibles en la pantalla de gestión y cierra el panel.
 */
function saveEditTeam() {
  const name = document.getElementById('edit-team-name').value.trim();
  const zone = document.getElementById('edit-team-zone').value.trim();
  const meta = document.querySelector('#screen-team-management .tm-team-meta');
  if (name) {
    document.getElementById('team-management-title').textContent = name;
    document.querySelector('#screen-team-management .tm-team-name').textContent = name;
  }
  if (zone && meta) {
    const parts = meta.textContent.split('·').map(s => s.trim());
    parts[0] = zone;
    meta.textContent = parts.join(' · ');
  }
  closeEditTeamSheet();
}

/* showPlayerMenu(playerName) / closePlayerMenu()
   Abre/cierra el menú contextual de un jugador (Cambiar posición,
   Marcar capitán, Quitar). El nombre se inyecta en el título. */
function showPlayerMenu(playerName) {
  document.getElementById('player-menu-name').textContent = playerName;
  document.getElementById('player-menu').classList.remove('hidden');
  document.getElementById('player-menu-overlay').classList.remove('hidden');
}

function closePlayerMenu() {
  document.getElementById('player-menu').classList.add('hidden');
  document.getElementById('player-menu-overlay').classList.add('hidden');
}


/*
 * clearAllPartidosFilters()
 * ─────────────────────────
 * Limpia todos los filtros de Buscar Partido.
 */
function clearAllPartidosFilters() {
  partidosFilters.formatos.clear();
  partidosFilters.barrios.clear();
  partidosFilters.fechas.clear();

  document.querySelectorAll('#partidos-filter-panel .filter-sel-pill')
    .forEach(pill => pill.classList.remove('active'));

  const input = document.getElementById('partidos-search-input');
  if (input) input.value = '';

  renderPartidosCalendar();
  applyPartidosFilters();
}


/*
 * applyPartidosFilters()
 * ──────────────────────
 * Filtra la lista de partidos. Misma lógica que applyRivalesFilters,
 * con una diferencia: también oculta los encabezados de sección
 * ("EN VIVO AHORA" / "PRÓXIMOS PARTIDOS") cuando no hay resultados
 * visibles debajo de ellos.
 */
function applyPartidosFilters() {
  const textoBusqueda = (document.getElementById('partidos-search-input')?.value || '').toLowerCase();
  const formatos = partidosFilters.formatos;
  const barrios  = partidosFilters.barrios;
  const fechas   = partidosFilters.fechas;

  const elementos = document.querySelectorAll('#partidos-list [data-formato]');
  let cantidadVisible = 0;

  elementos.forEach(el => {
    const cumpleFormato  = formatos.size === 0 || formatos.has(el.dataset.formato);
    const cumpleBarrio   = barrios.size  === 0 || barrios.has(el.dataset.barrio);
    const cumpleFecha    = fechas.size   === 0 || fechas.has(el.dataset.fecha);
    const cumpleBusqueda = !textoBusqueda || el.textContent.toLowerCase().includes(textoBusqueda);
    const mostrar        = cumpleFormato && cumpleBarrio && cumpleFecha && cumpleBusqueda;

    el.style.display = mostrar ? '' : 'none';
    if (mostrar) cantidadVisible++;
  });

  // Ocultar encabezados de sección si ningún resultado visible está debajo de ellos
  document.querySelectorAll('#partidos-list .sp-section-label').forEach(encabezado => {
    let siguiente   = encabezado.nextElementSibling;
    let hayVisibles = false;

    // Revisar todos los elementos que siguen hasta el próximo encabezado
    while (siguiente && !siguiente.classList.contains('sp-section-label')) {
      if (siguiente.style.display !== 'none' && !siguiente.classList.contains('filter-empty-state')) {
        hayVisibles = true;
      }
      siguiente = siguiente.nextElementSibling;
    }

    encabezado.style.display = hayVisibles ? '' : 'none';
  });

  // Actualizar contador y mensaje vacío
  const contador = document.getElementById('partidos-count');
  if (contador) {
    contador.textContent = `${cantidadVisible} partido${cantidadVisible !== 1 ? 's' : ''} encontrado${cantidadVisible !== 1 ? 's' : ''}`;
  }

  const mensajeVacio = document.getElementById('partidos-empty');
  if (mensajeVacio) mensajeVacio.classList.toggle('hidden', cantidadVisible > 0);

  const hayActivos = formatos.size > 0 || barrios.size > 0 || fechas.size > 0 || !!textoBusqueda;
  const boton = document.getElementById('partidos-filter-btn');
  if (boton) boton.classList.toggle('filter-btn-active', hayActivos);
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 12 — FILTROS DE "BUSCAR CANCHAS"
   ══════════════════════════════════════════════════════════════════
   Filtra la lista de canchas por:
     • Tipo de superficie (Sintética, Césped natural)
     • Formato del partido (5v5, 7v7, 8v8, 11v11)
     • Barrio
   No tiene calendario porque las canchas no cambian por fecha.
*/

// Estado de filtros para Buscar Canchas
const canchasFilters = {
  tipos:    new Set(), // Tipo de superficie
  formatos: new Set(), // Tamaño del campo
  barrios:  new Set(), // Ubicación
};


/*
 * toggleCanchasFilters()
 * ──────────────────────
 * Abre/cierra el panel de filtros de Buscar Canchas.
 */
function toggleCanchasFilters() {
  const panel = document.getElementById('canchas-filter-panel');
  const boton = document.getElementById('canchas-filter-btn');
  if (!panel) return;

  panel.classList.toggle('hidden');
  if (boton) boton.classList.toggle('filter-btn-active', !panel.classList.contains('hidden'));
}


/*
 * toggleCanchaFilter(el, type)
 * ────────────────────────────
 * Agrega/quita un valor del filtro de canchas al tocar una pill.
 * type puede ser: 'tipo', 'formato' o 'barrio'
 */
function toggleCanchaFilter(el, type) {
  const key   = type + 's';
  const valor = el.dataset.val;

  if (canchasFilters[key].has(valor)) {
    canchasFilters[key].delete(valor);
    el.classList.remove('active');
  } else {
    canchasFilters[key].add(valor);
    el.classList.add('active');
  }

  applyCanchasFilters();
}


/*
 * clearAllCanchasFilters()
 * ────────────────────────
 * Limpia todos los filtros de Buscar Canchas.
 */
function clearAllCanchasFilters() {
  canchasFilters.tipos.clear();
  canchasFilters.formatos.clear();
  canchasFilters.barrios.clear();

  document.querySelectorAll('#canchas-filter-panel .filter-sel-pill')
    .forEach(pill => pill.classList.remove('active'));

  const input = document.getElementById('canchas-search-input');
  if (input) input.value = '';

  applyCanchasFilters();
}


/*
 * applyCanchasFilters()
 * ─────────────────────
 * Filtra la lista de canchas. Misma lógica OR-dentro AND-entre.
 */
function applyCanchasFilters() {
  const textoBusqueda = (document.getElementById('canchas-search-input')?.value || '').toLowerCase();
  const tipos    = canchasFilters.tipos;
  const formatos = canchasFilters.formatos;
  const barrios  = canchasFilters.barrios;

  const filas = document.querySelectorAll('#canchas-list .cancha-row');
  let cantidadVisible = 0;

  filas.forEach(fila => {
    const cumpleTipo     = tipos.size    === 0 || tipos.has(fila.dataset.tipo);
    const cumpleFormato  = formatos.size === 0 || formatos.has(fila.dataset.formato);
    const cumpleBarrio   = barrios.size  === 0 || barrios.has(fila.dataset.barrio);
    const cumpleBusqueda = !textoBusqueda || fila.textContent.toLowerCase().includes(textoBusqueda);
    const mostrar        = cumpleTipo && cumpleFormato && cumpleBarrio && cumpleBusqueda;

    fila.style.display = mostrar ? '' : 'none';
    if (mostrar) cantidadVisible++;
  });

  const contador = document.getElementById('canchas-count');
  if (contador) {
    contador.textContent = `${cantidadVisible} cancha${cantidadVisible !== 1 ? 's' : ''} encontrada${cantidadVisible !== 1 ? 's' : ''}`;
  }

  const mensajeVacio = document.getElementById('canchas-empty');
  if (mensajeVacio) mensajeVacio.classList.toggle('hidden', cantidadVisible > 0);

  const hayActivos = tipos.size > 0 || formatos.size > 0 || barrios.size > 0 || !!textoBusqueda;
  const boton = document.getElementById('canchas-filter-btn');
  if (boton) boton.classList.toggle('filter-btn-active', hayActivos);
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN 13 — ARRANQUE DE LA APLICACIÓN
   ══════════════════════════════════════════════════════════════════
   Este bloque se ejecuta una sola vez, cuando el navegador termina
   de cargar toda la página (DOMContentLoaded = "el HTML ya está listo").
*/

document.addEventListener('DOMContentLoaded', () => {

  // Mostrar la pantalla de bienvenida (splash) al abrir la app
  goTo('screen-splash');

  // Dibujar el calendario de rivales desde el inicio
  // para que esté listo cuando el usuario abra los filtros
  renderRivalCalendar();
});


/* ══════════════════════════════════════════════════════════════════
   FUNCIONES SUELTAS — Controles de formulario y utilidades
   ══════════════════════════════════════════════════════════════════
   Las siguientes funciones son pequeñas y muy específicas.
   No pertenecen a ninguna sección grande porque cada una
   controla un solo elemento interactivo de la interfaz.
*/

/* ── TEAM DROPDOWN — Crear partido como equipo ──
   toggleTeamDropdown() muestra/oculta la lista de equipos.
   selectTeam() actualiza el botón visible con el equipo elegido. */
function toggleTeamDropdown() {
  const list     = document.getElementById('team-dropdown-list');
  const chevron  = document.getElementById('team-dropdown-chevron');
  if (!list) return;
  list.classList.toggle('hidden');
  chevron.classList.toggle('open');
}

function selectTeam(btn, name, logoClass, initials) {
  // Actualizar selección visual en la lista
  btn.closest('.team-dropdown-list').querySelectorAll('.team-dropdown-item').forEach(el => {
    el.classList.remove('active');
    const check = el.querySelector('.team-dropdown-check');
    if (check) check.remove();
  });
  btn.classList.add('active');
  if (!btn.querySelector('.team-dropdown-check')) {
    const check = document.createElement('span');
    check.className = 'team-dropdown-check';
    check.textContent = '✓';
    btn.appendChild(check);
  }

  // Actualizar el botón principal
  const selected = btn.closest('.team-dropdown-wrap').querySelector('.team-dropdown-selected');
  selected.querySelector('.team-logo-sm').className = 'team-logo-sm ' + logoClass;
  selected.querySelector('.team-logo-sm').textContent = initials;
  selected.querySelector('.team-dropdown-name').textContent = name;

  // Cerrar dropdown
  document.getElementById('team-dropdown-list').classList.add('hidden');
  document.getElementById('team-dropdown-chevron').classList.remove('open');
}


/* ── LÍMITE DE JUGADORES ──
   Los botones −/+ del formulario de crear partido.
   delta = -1 (restar) o +1 (sumar). Mínimo 2, máximo 22. */
function changeLimit(btn, delta) {
  const val = btn.closest('.player-limit-wrap').querySelector('.player-limit-val');
  const current = parseInt(val.textContent);
  const next = Math.min(22, Math.max(2, current + delta));
  val.textContent = next;
}


/* ── TABS DE GESTIÓN DE EQUIPO ──
   Cambia entre las pestañas de la pantalla de gestión:
   "equipo", "partidos", "gestion" o "estadisticas". */
function setTmTab(tab, btn) {
  ['equipo', 'partidos', 'gestion', 'estadisticas'].forEach(t => {
    const el = document.getElementById('tm-tab-' + t);
    if (el) el.classList.remove('active');
  });
  const active = document.getElementById('tm-tab-' + tab);
  if (active) active.classList.add('active');

  if (btn) {
    document.querySelectorAll('#tm-tabs .tab-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}


/* ── CAMPO POSICIONAL — VER / OCULTAR LISTA ──
   Muestra u oculta la lista de jugadores debajo del campo SVG.
   El botón cambia su texto entre "Ver lista ›" y "Ocultar ‹". */
function toggleTmPlayerList() {
  const lista = document.getElementById('tm-player-list');
  const btn   = document.getElementById('tm-toggle-list-btn');
  const visible = lista.style.display !== 'none';
  lista.style.display = visible ? 'none' : 'block';
  btn.textContent = visible ? 'Ver lista ›' : 'Ocultar ‹';
}

/* ── COPIAR CÓDIGO DE INVITACIÓN ──
   Lee el código del elemento cercano, lo copia al portapapeles
   y cambia el texto del botón a "¡Copiado!" por 2 segundos. */
function copyInviteCode(btn) {
  const code = btn.closest('.invite-code-card').querySelector('.invite-code-value').textContent;
  navigator.clipboard?.writeText(code);
  btn.textContent = '¡Copiado!';
  btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000);
}


/* ── MODAL DE CANCELAR PARTIDO ──
   El botón "Cancelar partido" en el lobby abre este modal
   de confirmación. Si confirma, vuelve al home y cierra el modal. */
function openCancelModal() {
  document.getElementById('cancel-modal-overlay').classList.remove('hidden');
  document.getElementById('cancel-modal').classList.remove('hidden');
}
function closeCancelModal() {
  document.getElementById('cancel-modal-overlay').classList.add('hidden');
  document.getElementById('cancel-modal').classList.add('hidden');
}

function toggleChatAttach(btn) {
  const menu = document.getElementById('chat-attach-menu');
  if (!menu) return;
  menu.classList.toggle('hidden');
}


/* ══════════════════════════════════════════════════════════════════
   PANEL DE NOTIFICACIONES
   ══════════════════════════════════════════════════════════════════
   Lleva la cuenta de notificaciones no leídas por categoría y
   actualiza el badge de la campana en el top bar.
*/

// Contadores de no leídas por categoría
const notifCounts = { fichajes: 3, retos: 2 };

function openNotifPanel() {
  document.getElementById('notif-overlay').classList.remove('hidden');
  document.getElementById('notif-panel').classList.add('open');
}

function closeNotifPanel() {
  document.getElementById('notif-overlay').classList.add('hidden');
  document.getElementById('notif-panel').classList.remove('open');
}

// Cambia entre las pestañas del panel de notificaciones
function setNotifTab(tab, btnEl) {
  // Desactivar todas las pestañas y contenidos
  document.querySelectorAll('.notif-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.notif-tab-content').forEach(c => c.classList.remove('active'));

  // Activar la seleccionada
  if (btnEl) btnEl.classList.add('active');
  const content = document.getElementById('ntab-content-' + tab);
  if (content) content.classList.add('active');
}

// Actualiza el badge global de la campana con el total de no leídas
function updateNotifBadge() {
  const total = notifCounts.fichajes + notifCounts.retos;
  const badge = document.getElementById('notif-count-badge');
  if (!badge) return;
  if (total > 0) {
    badge.textContent = total;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
  // Actualizar badge de cada pestaña
  const bf = document.getElementById('ntab-badge-fichajes');
  const br = document.getElementById('ntab-badge-retos');
  if (bf) bf.textContent = notifCounts.fichajes > 0 ? notifCounts.fichajes : '';
  if (br) br.textContent = notifCounts.retos > 0 ? notifCounts.retos : '';
}

// Acepta una solicitud de fichaje: marca como leída y oculta acciones
function acceptFichaje(itemId) {
  const item = document.getElementById(itemId);
  if (!item) return;
  resolveNotif(item, 'fichajes', '✅ Solicitud aceptada — jugador añadido al equipo.');
}

// Acepta un reto: navega al detalle del reto y cierra el panel
function acceptReto(itemId) {
  const item = document.getElementById(itemId);
  if (!item) return;
  resolveNotif(item, 'retos', '⚔️ Reto aceptado — el rival ha sido notificado.');
}

// Rechaza cualquier notificación
function rejectNotif(itemId) {
  const item = document.getElementById(itemId);
  if (!item) return;
  // Detectar categoría según el prefijo del id
  const cat = itemId.startsWith('nfich') ? 'fichajes' : 'retos';
  resolveNotif(item, cat, null);
}

// Lógica común: marca la notif como resuelta, descuenta el badge y
// muestra estado vacío si ya no quedan notificaciones en esa categoría
function resolveNotif(item, cat, feedbackMsg) {
  // Mostrar feedback breve si hay mensaje
  if (feedbackMsg) {
    showNotifToast(feedbackMsg);
  }

  // Animar salida y eliminar del DOM
  item.style.transition = 'opacity 0.25s, max-height 0.3s';
  item.style.overflow = 'hidden';
  item.style.opacity = '0';
  item.style.maxHeight = item.offsetHeight + 'px';
  setTimeout(() => { item.style.maxHeight = '0'; item.style.padding = '0'; }, 50);
  setTimeout(() => {
    item.remove();
    // Reducir contador
    if (notifCounts[cat] > 0) notifCounts[cat]--;
    updateNotifBadge();
    // Mostrar estado vacío si no quedan items en esa categoría
    const content = document.getElementById('ntab-content-' + cat);
    if (content) {
      const remaining = content.querySelectorAll('.notif-item');
      const emptyEl = document.getElementById('n' + (cat === 'fichajes' ? 'fich' : 'reto') + '-empty');
      if (remaining.length === 0 && emptyEl) emptyEl.classList.remove('hidden');
    }
  }, 350);
}

// Marca todas las notificaciones visibles como leídas (quita punto y estilo unread)
function markAllRead() {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
    item.classList.add('read');
    const dot = item.querySelector('.notif-unread-dot');
    if (dot) dot.remove();
  });
  notifCounts.fichajes = 0;
  notifCounts.retos = 0;
  updateNotifBadge();
}

// Toast temporal de confirmación
function showNotifToast(msg) {
  let toast = document.getElementById('notif-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'notif-toast';
    toast.style.cssText = [
      'position:absolute', 'bottom:100px', 'left:50%',
      'transform:translateX(-50%)',
      'background:#1e2d1e', 'color:#3dd68c',
      'border:1px solid rgba(61,214,140,0.3)',
      'border-radius:20px', 'padding:10px 18px',
      'font-size:12px', 'font-weight:600',
      'white-space:nowrap', 'z-index:300',
      'transition:opacity 0.3s', 'pointer-events:none'
    ].join(';');
    document.getElementById('phone-container').appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2200);
}


/* ══════════════════════════════════════════════════════════════════
   MODAL DE PUBLICACIÓN EN FEED
   ══════════════════════════════════════════════════════════════════
   Flujo de 2 pasos: elegir tipo → formulario específico → publicar.
*/

function openPublishModal() {
  document.getElementById('publish-modal-overlay').classList.remove('hidden');
  document.getElementById('publish-modal').classList.remove('hidden');
  showPublishStep(1);
}

function closePublishModal() {
  document.getElementById('publish-modal-overlay').classList.add('hidden');
  document.getElementById('publish-modal').classList.add('hidden');
}

function showPublishStep(step) {
  document.getElementById('publish-step-1').style.display = step === 1 ? '' : 'none';
  ['convocatoria', 'resultado', 'video'].forEach(function(tipo) {
    var el = document.getElementById('publish-form-' + tipo);
    if (el) el.classList.add('hidden');
  });
}

function openPublishForm(tipo) {
  document.getElementById('publish-step-1').style.display = 'none';
  var form = document.getElementById('publish-form-' + tipo);
  if (form) form.classList.remove('hidden');
  document.getElementById('publish-modal').scrollTop = 0;
}

function backToPublishStep1() {
  showPublishStep(1);
}

function selectPublishPos(btn) {
  btn.closest('.publish-pos-grid').querySelectorAll('.publish-pos-pill')
    .forEach(function(p) { p.classList.remove('active'); });
  btn.classList.add('active');
}

function selectPublishFormat(btn) { selectPublishPos(btn); }

function submitConvocatoria() {
  var posEl  = document.querySelector('#publish-form-convocatoria .publish-pos-pill.active');
  var grids  = document.querySelectorAll('#publish-form-convocatoria .publish-pos-grid');
  var fmtEl  = grids[1] ? grids[1].querySelector('.active') : null;
  var zona   = (document.getElementById('conv-zona') || {}).value || '';
  var desc   = (document.getElementById('conv-desc') || {}).value || '';
  zona = zona.trim(); desc = desc.trim();

  var pos   = posEl ? posEl.textContent : 'Jugador';
  var fmt   = fmtEl ? fmtEl.textContent : '11v11';
  var lugar = zona || 'Bogotá';
  var abbr  = pos.slice(0, 3).toUpperCase();

  var descHtml = desc ? '<div class="conv-meta" style="margin-top:4px;color:var(--text2)">' + desc + '</div>' : '';
  var postHtml = '<div class="post-card" data-tipo="convocatorias" style="animation:fadeInPost 0.35s ease">'
    + '<div class="post-header">'
    + '<span class="post-type-badge" style="background:#3B82F622;color:#3B82F6">&#128100; Convocatoria</span>'
    + '<div class="post-author-info">'
    + '<div class="post-avatar" style="background:linear-gradient(135deg,#4CAF50,#2e7d32)">AV</div>'
    + '<div><div class="post-author-name">Andrés Vega</div>'
    + '<div class="post-author-sub">&#193;guilas Calvas &middot; Cap.</div></div></div>'
    + '<span class="post-time">Ahora</span></div>'
    + '<div class="conv-body">'
    + '<div class="conv-pos-row"><span class="pill-green">' + abbr + '</span>'
    + '<span class="conv-title">Se busca ' + pos.toLowerCase() + '</span></div>'
    + '<div class="conv-meta">' + fmt + ' &middot; &#193;guilas Calvas &middot; ' + lugar + '</div>'
    + descHtml
    + '<div class="conv-pills"><span class="filter-pill">' + lugar + '</span>'
    + '<span class="filter-pill">0 Postulados</span></div></div>'
    + '<button class="btn-green w-full mt-8">Postular</button></div>';

  prependPostToFeed(postHtml);
  closePublishModal();
  goTo('screen-community');
  showNotifToast('¡Convocatoria publicada!');
}

function submitResultado() {
  var teamHome  = ((document.getElementById('res-team-home') || {}).value || '').trim() || 'Mi equipo';
  var teamAway  = ((document.getElementById('res-team-away') || {}).value || '').trim() || 'Rival';
  var scoreHome = (document.getElementById('res-score-home') || {}).value || '0';
  var scoreAway = (document.getElementById('res-score-away') || {}).value || '0';
  var lugar     = ((document.getElementById('res-lugar') || {}).value || '').trim();
  var desc      = ((document.getElementById('res-desc') || {}).value || '').trim();

  var h = parseInt(scoreHome), a = parseInt(scoreAway);
  var resultado   = h > a ? 'Victoria' : h < a ? 'Derrota' : 'Empate';
  var badgeColor  = h > a ? '#4CAF50'  : h < a ? '#F05050'  : '#F5A623';

  var lugarHtml = lugar ? '<div class="rc-meta">' + lugar + '</div>' : '';
  var descHtml  = desc  ? '<div class="rc-meta" style="color:var(--text2);margin-top:4px">' + desc + '</div>' : '';

  var postHtml = '<div class="post-card" data-tipo="resultados" style="animation:fadeInPost 0.35s ease">'
    + '<div class="post-header">'
    + '<span class="post-type-badge" style="background:#F59E0B22;color:#F59E0B">&#127942; Resultado</span>'
    + '<div class="post-author-info">'
    + '<div class="post-avatar" style="background:linear-gradient(135deg,#4CAF50,#2e7d32)">AV</div>'
    + '<div><div class="post-author-name">Andrés Vega</div>'
    + '<div class="post-author-sub">&#193;guilas Calvas &middot; Cap.</div></div></div>'
    + '<span class="post-time">Ahora</span></div>'
    + '<div class="result-card" style="margin:0;border:none;padding:0;background:transparent">'
    + '<span class="result-badge" style="background:' + badgeColor + '22;color:' + badgeColor + '">' + resultado + '</span>'
    + '<div class="rc-score-row">'
    + '<div class="rc-score-team-col"><span class="team-logo-sm logo-green">AV</span><span class="rc-score-name">' + teamHome + '</span></div>'
    + '<span class="rc-big-score">' + scoreHome + ' - ' + scoreAway + '</span>'
    + '<div class="rc-score-team-col"><span class="team-logo-sm logo-brown">RV</span><span class="rc-score-name">' + teamAway + '</span></div>'
    + '</div>' + lugarHtml + descHtml + '</div>'
    + '<div class="post-actions" style="margin-top:8px">'
    + '<button class="post-action-btn">&#9825; 0</button>'
    + '<button class="post-action-btn">&#128172; 0</button>'
    + '<button class="post-action-btn">&#8599; Compartir</button></div></div>';

  prependPostToFeed(postHtml);
  closePublishModal();
  goTo('screen-community');
  showNotifToast('¡Resultado publicado!');
}

function submitVideo() {
  var titulo = ((document.getElementById('vid-titulo') || {}).value || '').trim() || 'Mi clip';
  var lugar  = ((document.getElementById('vid-lugar') || {}).value || '').trim();
  var desc   = ((document.getElementById('vid-desc') || {}).value || '').trim();

  var descHtml  = desc  ? '<div class="post-subcap">' + desc + '</div>' : '';
  var lugarSpan = lugar ? lugar : 'Partido reciente';

  var postHtml = '<div class="post-card" data-tipo="videos" style="animation:fadeInPost 0.35s ease">'
    + '<div class="post-header">'
    + '<span class="post-type-badge" style="background:#A855F722;color:#A855F7">&#9654; Video</span>'
    + '<div class="post-author-info">'
    + '<div class="post-avatar" style="background:linear-gradient(135deg,#4CAF50,#2e7d32)">AV</div>'
    + '<div><div class="post-author-name">Andrés Vega</div>'
    + '<div class="post-author-sub">&#193;guilas Calvas &middot; Cap.</div></div></div>'
    + '<span class="post-time">Ahora</span></div>'
    + '<div class="post-video-thumb">'
    + '<div class="video-play-btn">&#9654;</div>'
    + '<div class="video-meta-bottom"><span>' + lugarSpan + '</span><span>0:00</span></div></div>'
    + '<div class="post-caption">' + titulo + '</div>'
    + descHtml
    + '<div class="post-actions">'
    + '<button class="post-action-btn">&#9825; 0</button>'
    + '<button class="post-action-btn">&#128172; 0</button>'
    + '<button class="post-action-btn">&#8599; Compartir</button></div></div>';

  prependPostToFeed(postHtml);
  closePublishModal();
  goTo('screen-community');
  showNotifToast('¡Video publicado!');
}

function prependPostToFeed(html) {
  var feed = document.getElementById('community-feed');
  if (!feed) return;
  feed.insertAdjacentHTML('afterbegin', html);
}

function simulateVideoUpload(el) {
  el.classList.add('selected');
  el.querySelector('.publish-video-label').textContent = '✓ clip_partido.mp4';
  el.querySelector('.publish-video-sub').textContent = 'Listo para publicar';
}


/* ══════════════════════════════════════════════════════════════════
   SECCIÓN — UNIRME A UN EQUIPO
   ══════════════════════════════════════════════════════════════════
   Lógica para la pantalla screen-join-team:
   · Tabs buscar / código
   · Filtros rápidos por formato y barrio
   · Modal de confirmación de solicitud
   · Modal de éxito
*/

const joinFilters = { formatos: new Set(), barrios: new Set() };

function toggleJoinFilters() {
  const panel = document.getElementById('join-filter-panel');
  const boton = document.getElementById('join-filter-btn');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (boton) boton.classList.toggle('filter-btn-active', !panel.classList.contains('hidden'));
}

function clearAllJoinFilters() {
  joinFilters.formatos.clear();
  joinFilters.barrios.clear();
  document.querySelectorAll('#join-filter-panel .filter-sel-pill')
    .forEach(p => p.classList.remove('active'));
  const input = document.getElementById('join-search-input');
  if (input) input.value = '';
  applyJoinFilters();
}

// Cambia entre la pestaña "Buscar" y "Código"
function setJoinTab(tab, btnEl) {
  document.querySelectorAll('#join-team-tabs .tab-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  ['buscar', 'codigo'].forEach(t => {
    const el = document.getElementById('join-tab-' + t);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById('join-tab-' + tab);
  if (target) target.classList.add('active');
}

// Activa/desactiva un filtro rápido (formato o barrio)
function toggleJoinFilter(el, type) {
  const key   = type + 's';
  const valor = el.dataset.val;

  if (joinFilters[key].has(valor)) {
    joinFilters[key].delete(valor);
    el.classList.remove('active');
  } else {
    joinFilters[key].add(valor);
    el.classList.add('active');
  }
  applyJoinFilters();
}

// Filtra la lista de equipos según texto y pills activas
function applyJoinFilters() {
  const texto    = (document.getElementById('join-search-input')?.value || '').toLowerCase();
  const formatos = joinFilters.formatos;
  const barrios  = joinFilters.barrios;

  const cards = document.querySelectorAll('#join-team-list .join-team-card[data-formato]');
  let visible = 0;

  cards.forEach(card => {
    const cumpleFormato  = formatos.size === 0 || formatos.has(card.dataset.formato);
    const cumpleBarrio   = barrios.size  === 0 || barrios.has(card.dataset.barrio);
    const cumpleTexto    = !texto || card.textContent.toLowerCase().includes(texto);
    const mostrar = cumpleFormato && cumpleBarrio && cumpleTexto;
    card.style.display = mostrar ? '' : 'none';
    if (mostrar) visible++;
  });

  const contador = document.getElementById('join-count');
  if (contador) contador.textContent = `${visible} equipo${visible !== 1 ? 's' : ''} encontrado${visible !== 1 ? 's' : ''}`;

  const empty = document.getElementById('join-empty');
  if (empty) empty.classList.toggle('hidden', visible > 0);

  const hayActivos = joinFilters.formatos.size > 0 || joinFilters.barrios.size > 0 || !!texto;
  const boton = document.getElementById('join-filter-btn');
  if (boton) boton.classList.toggle('filter-btn-active', hayActivos);
}

// Códigos de prueba conocidos (simulación)
const KNOWN_CODES = {
  'RC-4829': { name: 'Real Chapinero', logo: 'RC', cls: 'logo-green', sub: 'Amateur B · 11v11 · 📍 Chapinero', meta: '👥 14/18 · 4 cupos disponibles', cupos: 4 },
  'LS-7731': { name: 'Los Sabaderos',  logo: 'LS', cls: 'logo-purple', sub: 'Amateur C · 7v7 · 📍 Suba',      meta: '👥 9/11 · 2 cupos disponibles', cupos: 2 },
};

// Valida el código ingresado y muestra la info del equipo
function checkJoinCode() {
  const raw  = (document.getElementById('join-code-value')?.value || '').trim().toUpperCase();
  const hint = document.getElementById('join-code-hint');
  const btn  = document.getElementById('join-code-btn');
  const result = document.getElementById('join-code-result');

  if (raw.length < 4) {
    if (hint) hint.textContent = '';
    if (btn) btn.disabled = true;
    if (result) result.classList.add('hidden');
    return;
  }

  const team = KNOWN_CODES[raw];
  if (team) {
    if (hint)   { hint.textContent = '✓ Equipo encontrado'; hint.style.color = 'var(--green)'; }
    if (btn)    btn.disabled = false;
    // Rellenar la tarjeta de resultado
    const logo = document.getElementById('jcr-logo');
    if (logo)  { logo.textContent = team.logo; logo.className = 'team-logo-md ' + team.cls; }
    const nameEl = document.getElementById('jcr-name');
    if (nameEl) nameEl.textContent = team.name;
    const subEl  = document.getElementById('jcr-sub');
    if (subEl)  subEl.textContent = team.sub;
    const metaEl = document.getElementById('jcr-meta');
    if (metaEl) metaEl.textContent = team.meta;
    if (result) result.classList.remove('hidden');
  } else {
    if (hint)   { hint.textContent = 'Código no encontrado'; hint.style.color = 'var(--red)'; }
    if (btn)    btn.disabled = true;
    if (result) result.classList.add('hidden');
  }
}

// Guarda el equipo seleccionado temporalmente para el modal
let _joinTarget = {};

// Navega a la pantalla de confirmación con los datos del equipo
function openJoinConfirm(name, initials, logoClass, formato, barrio, cupos) {
  _joinTarget = { name, initials, logoClass, formato, barrio, cupos };

  const logo = document.getElementById('jc-logo');
  if (logo) { logo.textContent = initials; logo.className = 'team-logo-lg ' + logoClass; }

  const nameEl = document.getElementById('jc-name');
  if (nameEl) nameEl.textContent = name;

  const subEl = document.getElementById('jc-sub');
  if (subEl) subEl.textContent = `${formato} · ${barrio}`;

  const cuposEl = document.getElementById('jc-cupos');
  if (cuposEl) cuposEl.textContent = cupos;

  const msg = document.getElementById('jc-msg');
  if (msg) msg.value = '';

  goTo('screen-join-confirm');
}

// Navega a confirmación desde el flujo de código
function openJoinConfirmCode() {
  const raw  = (document.getElementById('join-code-value')?.value || '').trim().toUpperCase();
  const team = KNOWN_CODES[raw];
  if (!team) return;
  openJoinConfirm(team.name, team.logo, team.cls, team.sub.split('·')[1]?.trim() || '11v11', team.sub.split('📍')[1]?.trim() || '', team.cupos);
}

// Envía la solicitud → cierra confirmación y navega a la pantalla de éxito
function submitJoinRequest() {
  closeJoinConfirm();

  const nameEl = document.getElementById('jss-team-name');
  if (nameEl) nameEl.textContent = _joinTarget.name || 'el equipo';

  const logoEl = document.getElementById('jss-logo');
  if (logoEl) {
    logoEl.textContent  = _joinTarget.initials  || '??';
    logoEl.className    = 'team-logo-lg ' + (_joinTarget.logoClass || '');
  }

  goTo('screen-join-request-success');
}

