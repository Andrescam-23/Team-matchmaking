/* ════════════════════════════════════════════════════════════════
   SCRIPT.JS — El "cerebro" de Matchmakers

   ¿QUÉ HACE ESTE ARCHIVO?
   Controla el COMPORTAMIENTO de la app:
   · Qué pasa cuando el usuario toca un botón
   · Cómo pasar de una pantalla a otra
   · Qué pasa al abrir la app por primera vez

   A diferencia del CSS (que controla cómo se VE)
   y del HTML (que define qué HAY),
   el JavaScript controla qué HACE la app.

   MAPA DEL ARCHIVO:
   ─────────────────────────────────────────
   PARTE 1 → Variables de estado (qué pantalla estamos viendo)
   PARTE 2 → goTo() — navegar a una pantalla
   PARTE 3 → goBack() — volver a la pantalla anterior
   PARTE 4 → updateBottomNav() — actualizar el menú inferior
   PARTE 5 → Inicio automático al cargar la app
════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════
   PARTE 1 — VARIABLES DE ESTADO
   ════════════════════════════════════════════════════════════════

   ¿QUÉ ES EL "ESTADO"?
   Es la información que la app necesita recordar para funcionar.
   En este caso: en qué pantalla está el usuario y por cuáles pasó.

   Analogía: imagina que le dejas una nota a alguien que va a
   cuidar tu app mientras duermes. El "estado" es esa nota:
   "el usuario está en la pantalla Home y llegó desde Login".
════════════════════════════════════════════════════════════════ */

let currentScreen = null;
/*
  "let" declara una variable que puede cambiar de valor con el tiempo.
  (Diferencia con "const": const es para valores que nunca cambian)

  currentScreen guarda el ID de la pantalla que el usuario ve ahora.
  Empieza en "null" (vacío) porque aún no hemos mostrado ninguna pantalla.

  Ejemplos de lo que puede valer:
  · null           → ninguna pantalla activa aún
  · 'screen-splash' → viendo el splash de bienvenida
  · 'screen-home'   → viendo el feed principal
*/

let screenHistory = [];
/*
  Un arreglo (lista) que guarda el historial de pantallas visitadas.
  Funciona exactamente como el botón "← Atrás" del navegador.

  Cuando el usuario navega:
  · splash → login → home → match-detail

  El historial queda:
  · screenHistory = ['screen-login', 'screen-home']
  (El splash no se guarda porque no tiene sentido "volver" a él)

  Cuando el usuario presiona "← Volver" desde match-detail,
  sacamos 'screen-home' del final y regresamos ahí.
*/


/* ════════════════════════════════════════════════════════════════
   PARTE 2 — NAVEGAR A UNA PANTALLA: goTo()
   ════════════════════════════════════════════════════════════════

   Esta es la función más importante del archivo.
   Se llama cada vez que el usuario toca un botón de navegación.

   ¿CÓMO SE USA?
   En el HTML escribimos: onclick="goTo('screen-home')"
   Eso llama esta función con screenId = 'screen-home'

   ¿QUÉ HACE INTERNAMENTE?
   1. Verifica que no estamos ya en esa pantalla
   2. Oculta la pantalla actual (quita la clase "active")
   3. Muestra la nueva pantalla (agrega la clase "active")
   4. Guarda la pantalla anterior en el historial
   5. Actualiza el menú inferior
════════════════════════════════════════════════════════════════ */
function goTo(screenId) {
  /*
    "function" define un bloque de código reutilizable con un nombre.
    "screenId" es el parámetro: el dato que se le pasa al llamarla.
    Ejemplo: goTo('screen-home') → screenId vale 'screen-home'
  */


  /* ── PASO 1: ¿Ya estamos en esta pantalla? ── */
  if (currentScreen === screenId) {
    return; /* "return" sale de la función inmediatamente. No hace nada más. */
  }
  /*
    === es "igual estricto": compara que el valor Y el tipo sean iguales.
    Si el usuario toca "Inicio" estando ya en Inicio, no hacemos nada.
    Sin esta verificación, la app haría trabajo innecesario.
  */


  /* ── PASO 2: Ocultar la pantalla actual ── */
  if (currentScreen) {
    /*
      if (currentScreen) → solo entra si currentScreen no es null.
      La primera vez que corre, currentScreen es null, así que
      este bloque se salta (no hay pantalla previa que ocultar).
    */

    const previousScreen = document.getElementById(currentScreen);
    /*
      document.getElementById('screen-home') busca en el HTML el elemento
      que tiene id="screen-home" y nos lo devuelve como un objeto JavaScript.
      Con ese objeto podemos cambiar sus clases, estilos, texto, etc.

      "const" (constante) porque dentro de esta función no vamos a
      reasignar esta variable. Su valor no cambia una vez asignado.
    */

    if (previousScreen) {
      previousScreen.classList.remove('active');
      /*
        classList es la lista de clases CSS del elemento.
        .remove('active') quita la clase "active" de esa lista.

        Resultado en el HTML:
        Antes:  <div id="screen-home" class="screen active">
        Después: <div id="screen-home" class="screen">

        El CSS detecta que ya no tiene "active" y lo pone opacity: 0
        → desaparece con una transición suave de 0.25 segundos.
      */
    }
  }


  /* ── PASO 3: Mostrar la nueva pantalla ── */
  const newScreen = document.getElementById(screenId);

  if (newScreen) {
    newScreen.classList.add('active');
    /*
      .add('active') agrega la clase "active".

      Resultado en el HTML:
      Antes:  <div id="screen-login" class="screen">
      Después: <div id="screen-login" class="screen active">

      El CSS detecta "active" y pone opacity: 1
      → aparece con una transición suave de 0.25 segundos.
    */
  }


  /* ── PASO 4: Guardar en el historial ── */
  if (currentScreen && screenId !== 'screen-splash') {
    /*
      Guardamos en historial SOLO si se cumplen DOS condiciones:
      1. Había una pantalla anterior (currentScreen no es null)
      2. No estamos volviendo al splash ('screen-splash')
         → No tiene sentido que el usuario vuelva a la pantalla de carga

      !== es "diferente estricto" (lo opuesto de ===)
    */
    screenHistory.push(currentScreen);
    /*
      .push() agrega un elemento al FINAL del arreglo.

      Ejemplo:
      Antes de push: screenHistory = ['screen-login']
      Llamamos: goTo('screen-home')
      Después:  screenHistory = ['screen-login', 'screen-home']
                                                  ↑ se agregó al final
    */
  }


  /* ── PASO 5: Actualizar estado y menú ── */
  currentScreen = screenId;
  /*
    Actualizamos la variable para que la próxima vez que
    se llame goTo(), sepa cuál era la pantalla anterior.
  */

  updateBottomNav(screenId);
  /*
    Llama la función definida en PARTE 4 para
    que el tab correcto del menú inferior se marque como activo.
  */
}


/* ════════════════════════════════════════════════════════════════
   PARTE 3 — VOLVER ATRÁS: goBack()
   ════════════════════════════════════════════════════════════════

   Simula el botón "← Atrás" del teléfono.
   Consulta el historial y regresa a la última pantalla visitada.

   ¿CUÁNDO SE LLAMA?
   En el HTML: onclick="goBack()"
   Está en el botón "← Volver" de las pantallas de detalle.

   ¿POR QUÉ NO USAMOS goTo()?
   goTo() guarda en el historial. Si lo usáramos para "volver",
   crearíamos un historial infinito:
   home → detail → home → detail → home → ...

   goBack() saca del historial sin volver a agregar, evitando ese ciclo.
════════════════════════════════════════════════════════════════ */
function goBack() {

  /* ¿Hay pantallas en el historial? */
  if (screenHistory.length === 0) {
    /*
      .length es la cantidad de elementos en el arreglo.
      Si es 0, el historial está vacío — no hay a dónde volver.
    */
    return; /* Sale de la función sin hacer nada */
  }

  const previousScreen = screenHistory.pop();
  /*
    .pop() saca y devuelve el ÚLTIMO elemento del arreglo.

    Ejemplo:
    screenHistory = ['screen-login', 'screen-home']
    Después de pop():
    · screenHistory = ['screen-login']   ← se acortó
    · previousScreen = 'screen-home'     ← el que sacamos
  */


  /* Ocultar la pantalla actual */
  const current = document.getElementById(currentScreen);
  if (current) {
    current.classList.remove('active');
  }

  /* Mostrar la pantalla anterior */
  const previous = document.getElementById(previousScreen);
  if (previous) {
    previous.classList.add('active');
  }

  /* Actualizar el estado */
  currentScreen = previousScreen;
  updateBottomNav(previousScreen);
}


/* ════════════════════════════════════════════════════════════════
   PARTE 4 — ACTUALIZAR EL MENÚ INFERIOR: updateBottomNav()
   ════════════════════════════════════════════════════════════════

   Cuando cambiamos de pantalla, el tab correcto del menú
   inferior debe iluminarse (ponerse "active").

   Por ejemplo:
   · Si navegamos a screen-search → el tab 🔍 Buscar se ilumina
   · Si navegamos a screen-home   → el tab 🏠 Inicio se ilumina
   · Si navegamos a screen-match-detail → ningún tab se ilumina
     (porque el detalle no es un tab del menú)
════════════════════════════════════════════════════════════════ */
function updateBottomNav(screenId) {

  /* ── Tabla de correspondencias: pantalla → posición del tab ── */
  const navMap = {
    'screen-home':      0,   /* Tab 0 → 🏠 Inicio    */
    'screen-search':    1,   /* Tab 1 → 🔍 Buscar    */
    'screen-create':    2,   /* Tab 2 → ＋ Crear     */
    'screen-community': 3,   /* Tab 3 → 👥 Comunidad */
    'screen-chat':      4,   /* Tab 4 → 💬 Chat      */
  };
  /*
    navMap es un "objeto" JavaScript: una estructura de pares clave-valor.
    Funciona como un diccionario:
    · La "clave" es el ID de la pantalla (texto entre comillas)
    · El "valor" es la posición del tab (número)

    Si screenId = 'screen-search', entonces navMap[screenId] = 1.
    Si screenId = 'screen-match-detail' (no está en el mapa), devuelve undefined.
  */


  /* ── Obtener todos los botones del menú ── */
  const navButtons = document.querySelectorAll('.nav-btn');
  /*
    querySelectorAll() busca TODOS los elementos que coincidan con '.nav-btn'.
    Devuelve una NodeList (lista de elementos), no uno solo.
    A diferencia de getElementById() que devuelve un solo elemento.
  */


  /* ── Quitar "active" de todos los tabs ── */
  navButtons.forEach(function(btn) {
    btn.classList.remove('active');
  });
  /*
    forEach() recorre cada elemento de la lista y ejecuta la función.
    Aquí le quitamos "active" a TODOS los tabs para empezar desde cero.
    Después solo le pondremos "active" al tab correcto.

    Esto es equivalente a escribir:
    navButtons[0].classList.remove('active');
    navButtons[1].classList.remove('active');
    navButtons[2].classList.remove('active');
    navButtons[3].classList.remove('active');
    navButtons[4].classList.remove('active');
    Pero más corto y escalable (si mañana hay 6 tabs, sigue funcionando).
  */


  /* ── Poner "active" solo en el tab correcto ── */
  const activeIndex = navMap[screenId];
  /*
    Busca en el navMap cuál número le corresponde a esta pantalla.
    Si screenId = 'screen-home' → activeIndex = 0
    Si screenId = 'screen-match-detail' → activeIndex = undefined
  */

  if (activeIndex !== undefined && navButtons[activeIndex]) {
    /*
      Dos condiciones:
      1. activeIndex !== undefined → la pantalla SÍ está en el mapa
      2. navButtons[activeIndex] existe → ese botón existe en el HTML
    */
    navButtons[activeIndex].classList.add('active');
    /* Ilumina el tab correcto */
  }
}


/* ════════════════════════════════════════════════════════════════
   PARTE 5 — INICIO AUTOMÁTICO AL CARGAR LA APP
   ════════════════════════════════════════════════════════════════

   Este código corre automáticamente cuando la página termina de cargar.

   SECUENCIA:
   1. La página carga → aparece el Splash
   2. Después de 3 segundos → aparece el Login

   En una app real, durante esos 3 segundos la app verificaría
   si el usuario ya tiene sesión guardada, cargaría datos del
   servidor, etc. Aquí simplemente esperamos para simular eso.
════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  /*
    addEventListener escucha un "evento" y ejecuta código cuando ocurre.

    'DOMContentLoaded' es el evento que dispara el navegador cuando
    terminó de leer y procesar todo el HTML del archivo.
    "DOM" = Document Object Model = la representación del HTML en memoria.

    ¿Por qué esperar esto si el script ya está al final del body?
    En este caso no es estrictamente necesario, pero es buena práctica.
    Hace el código más robusto frente a cambios futuros en la estructura.
  */


  /* ── PASO 1: Mostrar el Splash ── */
  goTo('screen-splash');
  /*
    Llama a goTo() para activar la pantalla de bienvenida.
    (Aunque el splash ya tiene class="active" en el HTML,
    esto también inicializa la variable currentScreen correctamente)
  */


  /* ── PASO 2: Ir al Login después de 3 segundos ── */
  setTimeout(function() {

    goTo('screen-login');

  }, 3000);
  /*
    setTimeout ejecuta una función después de X milisegundos.
    3000 milisegundos = 3 segundos.

    La función (primer argumento) es lo que se ejecuta.
    3000 (segundo argumento) es cuándo se ejecuta.

    El Splash se verá durante 3 segundos y luego, automáticamente,
    aparecerá el Login con el efecto de transición suave.
  */

});
/* ── Fin del bloque de inicialización ── */


/* ════════════════════════════════════════════════════════════════
   PRÓXIMAS FUNCIONES (se agregarán en sesiones futuras):

   · openActionSheet()  → abre el menú emergente del botón +
   · closeActionSheet() → cierra ese menú
   · openTeamDrawer()   → abre el panel lateral para cambiar equipo
   · filterMatches()    → filtra las tarjetas de partidos por criterios
   · submitMatch()      → guarda un partido nuevo creado por el usuario
════════════════════════════════════════════════════════════════ */
