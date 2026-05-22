/* ================================================================
   SCRIPT.JS — Comportamiento de Matchmakers
   
   Este archivo controla QUÉ PASA cuando el usuario interactúa.
   Su función principal: mostrar y ocultar pantallas (simular navegación).
   
   Organización:
   1. Estado de la app (qué pantalla estamos viendo)
   2. Función principal de navegación (goTo)
   3. Función para volver atrás (goBack)
   4. Inicialización (qué pasa al cargar la app)
================================================================ */


/* ----------------------------------------------------------------
   1. ESTADO DE LA APP
   
   Una variable que rastrea cuál es la pantalla actual.
   Empieza en null porque al cargar aún no estamos en ninguna.
---------------------------------------------------------------- */
let currentScreen = null;
/*
  let: declara una variable que puede cambiar de valor.
  (A diferencia de const que es constante — no puede cambiar)
*/

let screenHistory = [];
/*
  screenHistory: un arreglo (lista) que guarda el historial de pantallas.
  Funciona como el botón "atrás" del navegador:
  cuando navegamos a una pantalla nueva, guardamos la anterior.
  Cuando el usuario toca "volver", sacamos la última de la lista.
  
  Ejemplo después de navegar:
  screenHistory = ['screen-splash', 'screen-login', 'screen-home']
*/


/* ----------------------------------------------------------------
   2. FUNCIÓN PRINCIPAL DE NAVEGACIÓN: goTo()
   
   Esta es la función más importante del archivo.
   Se llama cada vez que el usuario toca un botón de navegación.
   
   Qué hace:
   1. Oculta la pantalla actual
   2. Muestra la pantalla destino
   3. Guarda el historial
---------------------------------------------------------------- */
function goTo(screenId) {
  /*
    function: define una función — un bloque de código reutilizable.
    goTo: el nombre de la función (lo que ponemos en los onclick del HTML)
    screenId: el parámetro — el id de la pantalla a la que queremos ir.
              Por ejemplo: 'screen-home', 'screen-login', etc.
  */

  // Si ya estamos en esa pantalla, no hacemos nada
  if (currentScreen === screenId) return;
  /*
    ===: comparación estricta (verifica valor Y tipo)
    return: sale de la función inmediatamente sin ejecutar más código
  */

  // Ocultar pantalla actual
  if (currentScreen) {
    /*
      if (currentScreen): solo ejecuta si currentScreen no es null.
      La primera vez que cargamos, currentScreen es null, así que
      este bloque se saltea.
    */
    const previousScreen = document.getElementById(currentScreen);
    /*
      document.getElementById(): busca en el HTML el elemento con ese id.
      Retorna el elemento HTML como un objeto JavaScript que podemos manipular.
      
      const: variable constante — no cambiará dentro de esta función.
    */
    
    if (previousScreen) {
      previousScreen.classList.remove('active');
      /*
        classList: lista de clases CSS del elemento.
        .remove('active'): quita la clase 'active'.
        Sin 'active', el CSS pone opacity: 0 y la pantalla desaparece.
      */
    }
  }

  // Mostrar pantalla nueva
  const newScreen = document.getElementById(screenId);
  /*
    Buscamos el elemento HTML de la pantalla destino.
  */
  
  if (newScreen) {
    newScreen.classList.add('active');
    /*
      .add('active'): agrega la clase 'active'.
      Con 'active', el CSS pone opacity: 1 y la pantalla aparece.
    */
  }

  // Guardar historial (para el botón "volver")
  if (currentScreen && screenId !== 'screen-splash') {
    /*
      Solo guardamos historial si:
      - Había una pantalla anterior (currentScreen existe)
      - No estamos volviendo al splash (no tiene sentido "volver" al splash)
    */
    screenHistory.push(currentScreen);
    /*
      .push(): agrega un elemento al final del arreglo.
      screenHistory = ['screen-login'] → ['screen-login', 'screen-home']
    */
  }

  // Actualizar la pantalla actual
  currentScreen = screenId;

  // Actualizar el estado visual del nav inferior
  updateBottomNav(screenId);
}


/* ----------------------------------------------------------------
   3. FUNCIÓN PARA VOLVER ATRÁS: goBack()
   
   Simula el botón "atrás" del teléfono.
   Saca la última pantalla del historial y navega a ella.
---------------------------------------------------------------- */
function goBack() {
  if (screenHistory.length === 0) {
    /*
      .length: cantidad de elementos en el arreglo.
      Si el historial está vacío, no hay a dónde volver.
    */
    return; // Sale de la función
  }

  const previousScreen = screenHistory.pop();
  /*
    .pop(): saca y retorna el ÚLTIMO elemento del arreglo.
    screenHistory = ['screen-login', 'screen-home']
    después de pop(): screenHistory = ['screen-login']
    previousScreen = 'screen-home'
  */

  // Navegamos a la pantalla anterior sin guardar en historial
  // (por eso no llamamos goTo — lo hacemos manual)
  const current = document.getElementById(currentScreen);
  if (current) current.classList.remove('active');

  const previous = document.getElementById(previousScreen);
  if (previous) previous.classList.add('active');

  currentScreen = previousScreen;
  updateBottomNav(previousScreen);
}


/* ----------------------------------------------------------------
   4. ACTUALIZAR NAV INFERIOR: updateBottomNav()
   
   Cuando navegamos, el botón activo del nav debe cambiar.
   Esta función pone 'active' solo en el botón correcto.
---------------------------------------------------------------- */
function updateBottomNav(screenId) {
  // Mapa de pantallas a tabs del nav
  const navMap = {
    /*
      Un objeto JavaScript: pares clave-valor.
      'screen-home': 0 → la pantalla home corresponde al botón 0 (Inicio)
    */
    'screen-home': 0,
    'screen-search': 1,
    'screen-create': 2,
    'screen-community': 3,
    'screen-chat': 4,
  };

  // Obtenemos todos los botones del nav
  const navButtons = document.querySelectorAll('.nav-btn');
  /*
    querySelectorAll(): busca TODOS los elementos que coincidan con el selector.
    Retorna una NodeList (lista de elementos).
    A diferencia de getElementById que retorna uno solo.
  */

  // Quitamos 'active' a todos los botones
  navButtons.forEach(btn => btn.classList.remove('active'));
  /*
    forEach(): itera sobre cada elemento de la lista.
    btn => ...: función flecha — para cada btn, ejecuta lo que sigue.
    Es lo mismo que escribir:
    for (let i = 0; i < navButtons.length; i++) {
      navButtons[i].classList.remove('active');
    }
    Pero más corto.
  */

  // Ponemos 'active' solo en el botón correcto
  const activeIndex = navMap[screenId];
  /*
    navMap[screenId]: accede al valor del objeto usando la clave.
    Si screenId = 'screen-home', retorna 0.
    Si screenId = 'screen-match-detail' (no está en el mapa), retorna undefined.
  */
  
  if (activeIndex !== undefined && navButtons[activeIndex]) {
    navButtons[activeIndex].classList.add('active');
  }
}


/* ----------------------------------------------------------------
   5. INICIALIZACIÓN
   
   Este código corre automáticamente cuando la página carga.
   Muestra el splash y después de 2 segundos va al login.
---------------------------------------------------------------- */

// Esperamos a que el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  /*
    addEventListener: "escucha" un evento y ejecuta código cuando ocurre.
    'DOMContentLoaded': evento que dispara cuando todo el HTML está listo.
    
    ¿Por qué necesitamos esto si el script ya está al final del body?
    Buena pregunta. En este caso técnicamente no es necesario,
    pero es buena práctica — hace el código más robusto.
  */

  // Mostrar splash
  goTo('screen-splash');

  // Después de 2000ms (2 segundos), ir al login
  setTimeout(function() {
    /*
      setTimeout: ejecuta una función después de X milisegundos.
      2000ms = 2 segundos.
      
      En el prototipo el splash simula la carga de la app.
      En producción real aquí haríamos llamadas al servidor.
    */
    goTo('screen-login');
  }, 5000);

});
/*
  Fin del DOMContentLoaded.
  Todo el código de inicialización va adentro de este bloque.
*/


/* ================================================================
   NOTAS PARA FUTURAS SESIONES:
   
   Próximas funciones que agregaremos aquí:
   - openActionSheet(): abre el modal del botón "+"
   - closeActionSheet(): cierra el modal
   - openTeamDrawer(): abre el drawer lateral de equipos
   - filterMatches(): filtra las cards del home
================================================================ */
