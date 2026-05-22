let currentScreen = null;
let screenHistory = [];

function goTo(screenId) {
  if (currentScreen === screenId) return;
  if (currentScreen) {
    const prev = document.getElementById(currentScreen);
    if (prev) prev.classList.remove('active');
    if (screenId !== 'screen-splash') screenHistory.push(currentScreen);
  }
  const next = document.getElementById(screenId);
  if (next) next.classList.add('active');
  currentScreen = screenId;
}

function goBack() {
  if (!screenHistory.length) return;
  const prev = screenHistory.pop();
  const cur = document.getElementById(currentScreen);
  if (cur) cur.classList.remove('active');
  const target = document.getElementById(prev);
  if (target) target.classList.add('active');
  currentScreen = prev;
}

function navTo(screenId, btn) {
  goTo(screenId);
  // update active nav in this screen's bottom-nav
  const screen = document.getElementById(screenId);
  if (!screen) return;
  screen.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function toggleDropdown() {
  const d = document.getElementById('profile-dropdown');
  if (d) d.classList.toggle('hidden');
}

function closeDropdown() {
  const d = document.getElementById('profile-dropdown');
  if (d) d.classList.add('hidden');
}

function setSearchTab(tab, btn) {
  // hide all tab contents in search screen
  ['rivales','partidos','canchas'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.remove('active');
  });
  const active = document.getElementById('tab-' + tab);
  if (active) active.classList.add('active');

  // update pill buttons
  const pills = document.querySelectorAll('#search-tabs .tab-pill');
  const map = { rivales: 0, partidos: 1, canchas: 2 };
  pills.forEach((p, i) => p.classList.toggle('active', i === map[tab]));

  goTo('screen-search');
}

function setPartidosTab(tab, btn) {
  ['proximos','pasados','estadisticas'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.remove('active');
  });
  const active = document.getElementById('tab-' + tab);
  if (active) active.classList.add('active');

  const pills = document.querySelectorAll('#partidos-tabs .tab-pill');
  const map = { proximos: 0, pasados: 1, estadisticas: 2 };
  pills.forEach((p, i) => p.classList.toggle('active', i === map[tab]));
}

function setFichajesTab(tab, btn) {
  ['jugadores','equipos'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.remove('active');
  });
  const active = document.getElementById('tab-' + tab);
  if (active) active.classList.add('active');

  const pills = document.querySelectorAll('#fichajes-tabs .tab-pill');
  const map = { jugadores: 0, equipos: 1 };
  pills.forEach((p, i) => p.classList.toggle('active', i === map[tab]));
}

function selectSlot(btn) {
  btn.closest('.time-slots-grid').querySelectorAll('.time-slot.selected')
    .forEach(s => { s.classList.remove('selected'); s.classList.add('free'); });
  btn.classList.remove('free');
  btn.classList.add('selected');
}

function selectColor(btn) {
  btn.closest('.color-picker-row').querySelectorAll('.color-dot')
    .forEach(d => d.classList.remove('active'));
  btn.classList.add('active');
  const color = btn.style.background;
  const avatar = document.getElementById('new-team-avatar');
  if (avatar) avatar.style.background = color;
}

function updateTeamInitials(name) {
  const avatar = document.getElementById('new-team-avatar');
  if (!avatar) return;
  const words = name.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : (name.slice(0, 2).toUpperCase() || 'NK');
  avatar.textContent = initials;
}

// format pill toggles
document.addEventListener('click', e => {
  const pill = e.target.closest('.format-pill');
  if (!pill) return;
  const group = pill.closest('.format-pills, .format-grid');
  if (!group) return;
  group.querySelectorAll('.format-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
});

// day pill toggles
document.addEventListener('click', e => {
  const pill = e.target.closest('.day-pill');
  if (!pill) return;
  pill.classList.toggle('active');
});

// close dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('#profile-dropdown') && !e.target.closest('.avatar-btn')) {
    closeDropdown();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  goTo('screen-splash');
});
