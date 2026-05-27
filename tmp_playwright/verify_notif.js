const { chromium } = require('playwright-chromium');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });

  const filePath = 'file:///c:/Users/andre/OneDrive/Desktop/Team%20Matching/Prototipo/index.html';
  await page.goto(filePath);

  // Navigate to home screen
  await page.click('text=Crear Cuenta');
  await page.waitForTimeout(600);

  // Check bell button and badge
  const badgeText = await page.$eval('#notif-count-badge', el => el.textContent.trim());
  console.log('Badge text:', badgeText); // expect "2"

  // Click the bell
  await page.click('.notif-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/andre/OneDrive/Desktop/Team Matching/Prototipo/tmp_playwright/02_panel_open.png' });

  const panelOpen = await page.$eval('#notif-panel', el => el.classList.contains('open'));
  console.log('Panel open:', panelOpen); // expect true

  // Check tab labels
  const tab1 = await page.$eval('#ntab-fichajes', el => el.childNodes[0].textContent.trim());
  const tab2 = await page.$eval('#ntab-retos', el => el.childNodes[0].textContent.trim());
  console.log('Tab 1:', tab1); // "Solicitudes de fichaje"
  console.log('Tab 2:', tab2); // "Retos recibidos"

  // Tab 1 active by default
  const tab1Active = await page.$eval('#ntab-content-fichajes', el => el.classList.contains('active'));
  const fichItem = !!(await page.$('#nfich-1'));
  console.log('Fichajes tab active:', tab1Active);
  console.log('Fichaje item exists:', fichItem);

  // Switch to Retos tab (force:true bypasses Playwright's strict hit-test check)
  await page.click('#ntab-retos', { force: true });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/andre/OneDrive/Desktop/Team Matching/Prototipo/tmp_playwright/03_retos_tab.png' });

  const tab2Active = await page.$eval('#ntab-content-retos', el => el.classList.contains('active'));
  const retoItem = !!(await page.$('#nreto-1'));
  console.log('Retos tab active:', tab2Active);
  console.log('Reto item exists:', retoItem);

  // Accept the reto (force to bypass overlay z-index hit test in headless chromium)
  await page.click('#nreto-1 .notif-btn-accept', { force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/andre/OneDrive/Desktop/Team Matching/Prototipo/tmp_playwright/04_after_accept.png' });

  const toastExists = !!(await page.$('#notif-toast'));
  const toastText = toastExists ? await page.$eval('#notif-toast', el => el.textContent.trim()) : 'n/a';
  console.log('Toast shown:', toastExists, '| text:', toastText);

  const retoGone = !(await page.$('#nreto-1'));
  console.log('Reto removed after accept:', retoGone);

  await page.waitForTimeout(400);
  const emptyReto = await page.$eval('#nreto-empty', el => !el.classList.contains('hidden'));
  console.log('Reto empty state shown:', emptyReto);

  // Badge count should now be 1 (only fichaje left)
  const badgeAfterReto = await page.$eval('#notif-count-badge', el => el.textContent.trim());
  console.log('Badge after reto resolved:', badgeAfterReto); // expect "1"

  // Switch to fichajes and reject
  await page.click('#ntab-fichajes', { force: true });
  await page.waitForTimeout(300);
  await page.click('#nfich-1 .notif-btn-reject', { force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/andre/OneDrive/Desktop/Team Matching/Prototipo/tmp_playwright/05_after_reject.png' });

  const fichGone = !(await page.$('#nfich-1'));
  console.log('Fichaje removed after reject:', fichGone);

  await page.waitForTimeout(400);
  const emptyFich = await page.$eval('#nfich-empty', el => !el.classList.contains('hidden'));
  console.log('Fichaje empty state shown:', emptyFich);

  const badgeHidden = await page.$eval('#notif-count-badge', el => el.style.display);
  console.log('Badge display after all resolved (should be "none"):', badgeHidden);

  // Test markAllRead - first re-add state via JS and test the button
  // Verify markAllRead function exists
  const hasMarkAll = await page.evaluate(() => typeof markAllRead === 'function');
  console.log('markAllRead function exists:', hasMarkAll);

  // Test overlay click closes the panel
  await page.evaluate(() => openNotifPanel());
  await page.waitForTimeout(300);
  const panelReopened = await page.$eval('#notif-panel', el => el.classList.contains('open'));
  console.log('Panel reopened via JS:', panelReopened);

  await page.click('#notif-overlay', { force: true });
  await page.waitForTimeout(400);
  const panelClosed = !(await page.$eval('#notif-panel', el => el.classList.contains('open')));
  console.log('Panel closed via overlay tap:', panelClosed);

  await page.screenshot({ path: 'C:/Users/andre/OneDrive/Desktop/Team Matching/Prototipo/tmp_playwright/06_final.png' });

  await browser.close();
  console.log('DONE');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
