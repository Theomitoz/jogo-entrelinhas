function typeText(element, text, speed) {
  clearInterval(element.typeTimer);
  element.textContent = '';
  let position = 0;
  element.typeTimer = setInterval(() => {
    element.textContent += text[position++];
    if (position >= text.length) clearInterval(element.typeTimer);
  }, speed);
}
function render() { const moment = moments[current]; $('responseText').hidden=true; $('responseText').classList.remove('is-fading'); typeText($('momentTime'), moment.time, 100); typeText($('momentTitle'), moment.title, 85); typeText($('momentCopy'), moment.copy, 38); $('choices').innerHTML = ''; moment.choices.forEach(([label, cost, response]) => { const button = document.createElement('button'); button.className='choice'; typeText(button, label, 55); button.addEventListener('click', () => choose(button, cost, response)); $('choices').appendChild(button); }); saveProgressDB({current,moments,negativeResponseCount}).catch(err => console.log('Erro ao salvar progresso:', err)); }
const momentPool = [
  { time:'07:12', titles:['O alarme tocou.'], copies:['O quarto ainda está quieto. O primeiro movimento não precisa explicar nada.'], choices:[['Ficar mais cinco minutos',-2,'Fiquei mais cinco minutos. O quarto continuou quieto e isso bastou por enquanto.'],['Sentar na cama',-5,'Sentei na cama e deixei os olhos se acostumarem com a manhã.'],['Colocar os pés no chão',-6,'Coloquei os pés no chão. O piso estava frio, mas eu já estava de pé.']] },
  { time:'08:04', titles:['A água ferveu.'], copies:['A cozinha guarda um pouco de silêncio antes das tarefas começarem.'], choices:[['Preparar algo simples',-6,'Fiz uma omelete simples. Não ficou tão boa, mas deixou a cozinha com cheiro de café da manhã.'],['Beber água primeiro',-4,'Bebi um copo de água antes de decidir o resto.'],['Deixar para depois',0,'Deixei a cozinha como estava e voltei quando pareceu possível.']] },
  { time:'09:37', titles:['Uma mensagem chegou.'], copies:['Alguém pergunta como você está. A resposta pode ser curta e ainda ser verdadeira.'], choices:[['Responder com sinceridade',-5,'Escrevi que a manhã estava difícil. A mensagem ficou ali, sem precisar ser perfeita.'],['Enviar só um coração',-2,'Enviei um coração. Foi pouco, mas chegou do outro lado.'],['Silenciar o celular',-1,'Silenciei o celular e deixei a pergunta esperando um pouco.']] },
  { time:'10:26', titles:['A luz mudou de lugar.'], copies:['O dia avançou alguns centímetros. Talvez seja possível acompanhar sem pressa.'], choices:[['Abrir a janela',-4,'Olhei pela janela. A vizinha não parecia bem, e a rua seguia seu ritmo de sempre.'],['Acender outra luz',-2,'Acendi outra luz. O canto da sala ficou menos distante.'],['Continuar onde está',0,'Fiquei onde estava e observei a luz mudar devagar.']] },
  { time:'11:48', titles:['Uma tarefa ficou esperando.'], copies:['Nem tudo precisa ser resolvido agora. Uma parte pequena já pode ser suficiente.'], choices:[['Escolher só uma parte',-7,'Escolhi uma parte pequena da tarefa e parei antes de transformar aquilo em uma lista inteira.'],['Anotar para mais tarde',-3,'Anotei a tarefa num canto. Ela não sumiu, mas parou de ocupar tudo.'],['Deixar como está',0,'Deixei a tarefa esperando. Por alguns minutos, ela não precisou de mim.']] },
  { time:'12:35', titles:['O corpo pediu uma pausa.'], copies:['O meio do dia chegou. Cuidar do básico também conta como atravessar.'], choices:[['Beber água',-3,'Bebi água devagar. O copo ficou vazio e a tarde continuou.'],['Fazer algo simples',-9,'Preparei algo simples para comer. Não era muito, mas era alguma coisa.'],['Pedir comida',-6,'Pedi comida. Quando chegou, o cheiro ocupou a cozinha por alguns instantes.']] },
  { time:'13:52', titles:['O celular ficou virado para baixo.'], copies:['Por alguns instantes, nada precisa chegar até você.'], choices:[['Manter assim',-4,'Deixei o celular virado para baixo. A mesa pareceu um pouco maior.'],['Ver as notificações',0,'Olhei as notificações e fechei a tela sem responder tudo.'],['Mandar uma mensagem',-3,'Mandei uma mensagem curta. Depois coloquei o celular de lado.']] },
  { time:'15:16', titles:['O tempo ficou mais lento.'], copies:['Há tardes que não pedem produtividade. Apenas um pouco de presença.'], choices:[['Alongar os ombros',-5,'Alonguei os ombros e percebi o quanto estavam tensos.'],['Ouvir uma música',-3,'Coloquei uma música. O café expresso continuou sendo o meu favorito.'],['Descansar sem decidir',0,'Descansei sem escolher nada por alguns minutos.']] },
  { time:'16:43', titles:['Um detalhe chamou atenção.'], copies:['Algo pequeno interrompeu o automático. Você pode ficar com ele por um instante.'], choices:[['Olhar de perto',-4,'Olhei de perto. Era só um detalhe, mas ficou comigo mais tempo do que esperava.'],['Registrar o que viu',-5,'Registrei o que vi. A imagem ficou guardada para depois.'],['Seguir adiante',0,'Segui adiante. Ainda assim, percebi que tinha notado alguma coisa.']] },
  { time:'18:09', titles:['A casa começou a escurecer.'], copies:['O fim da tarde se aproxima sem exigir que o dia tenha sido perfeito.'], choices:[['Acender uma luz',-3,'Acendi uma luz antes de a sala escurecer completamente.'],['Tomar um banho',-8,'Tomei um banho. A água levou embora pelo menos uma camada do dia.'],['Sentar um pouco',-2,'Sentei um pouco e deixei a casa fazer seus próprios sons.']] },
  { time:'20:21', titles:['O dia ficou mais quieto.'], copies:['Algumas coisas podem esperar. Por enquanto, há este instante.'], choices:[['Preparar o lugar para dormir',-6,'Arrumei o lugar para dormir. Não ficou perfeito, mas ficou pronto.'],['Avisar alguém que chegou',-3,'Avisei alguém que eu tinha chegado. A resposta veio alguns minutos depois.'],['Ficar em silêncio',0,'Fiquei em silêncio e escutei a noite se aproximar.']] },
  { time:'22:47', titles:['A noite encontrou seu lugar.'], copies:['Nada precisa ser concluído para que este momento possa terminar.'], choices:[['Guardar o celular',-5,'Guardei o celular longe da cama. A tela deixou de chamar.'],['Deixar uma luz acesa',-2,'Deixei uma luz acesa no corredor. Foi o bastante.'],['Encerrar como está',0,'Encerrei como estava. O que ficou para trás pode esperar.']] }
];
let current = 0; let moments = createSession(); let installPrompt;
let hasSavedProgress = false;
const NEGATIVE_RESPONSE_LIMIT = 30;
let negativeResponseCount = Number.parseInt(localStorage.getItem('entrelinhas-negative-responses') || '0', 10);
let helpAlertShown = localStorage.getItem('entrelinhas-help-alert-shown') === 'true';
const $ = id => document.getElementById(id);
const DB_NAME = 'EntrelinhrasDB';
const DB_VERSION = 1;
const SESSIONS_STORE = 'sessions';
const PROGRESS_STORE = 'currentProgress';

// CONFIGURAÇÕES DE USUÁRIO
const settings = {
  soundEnabled: localStorage.getItem('entrelinhas-sound') !== 'false',
  ambientMusicEnabled: localStorage.getItem('entrelinhas-ambient-music') !== 'false',
  volume: parseInt(localStorage.getItem('entrelinhas-volume') || '70'),
  animationsEnabled: localStorage.getItem('entrelinhas-animations') !== 'false',
  darkMode: localStorage.getItem('entrelinhas-dark-mode') !== 'false'
};

// SISTEMA DE MENU E NAVEGAÇÃO
function showMenu() {
  document.body.classList.add('menu-active');
  $('menuOverlay').classList.remove('hidden');
  $('menuOverlay').removeAttribute('hidden');
  $('menuOverlay').removeAttribute('aria-hidden');
  $('menuOverlay').inert = false;
  $('menuOverlay').style.display = 'flex';
  $('appShell').setAttribute('hidden', '');
  document.querySelectorAll('.modal').forEach(modal => modal.setAttribute('hidden', ''));
}
function hideMenu() {
  document.body.classList.remove('menu-active');
  $('menuOverlay').classList.add('hidden');
  $('menuOverlay').setAttribute('hidden', '');
  $('menuOverlay').setAttribute('aria-hidden', 'true');
  $('menuOverlay').inert = true;
  $('menuOverlay').style.display = 'none';
}
function showApp() {
  hideMenu();
  $('appShell').removeAttribute('hidden');
  document.querySelectorAll('.modal').forEach(modal => modal.setAttribute('hidden', ''));
}
function showModal(modalId) {
  hideMenu();
  $('appShell').setAttribute('hidden', '');
  $(modalId).removeAttribute('hidden');
}
function hideModal(modalId) {
  $(modalId).setAttribute('hidden', '');
  showMenu();
}

// GERENCIAR TEMA CLARO/ESCURO
function applyTheme() {
  if (settings.darkMode) {
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
  }
}

function toggleTheme() {
  settings.darkMode = !settings.darkMode;
  localStorage.setItem('entrelinhas-dark-mode', settings.darkMode);
  applyTheme();
}

// GERENCIAR VOLUME
function setVolume(value) {
  settings.volume = value;
  localStorage.setItem('entrelinhas-volume', value);
  if ($('volumeValue')) $('volumeValue').textContent = value + '%';
}

// INICIALIZAR CONFIGURAÇÕES SALVAS
function loadSettings() {
  try {
    $('soundToggle').checked = settings.soundEnabled;
    $('ambientMusicToggle').checked = settings.ambientMusicEnabled;
    $('animationToggle').checked = settings.animationsEnabled;
    $('darkModeToggle').checked = settings.darkMode;
    $('volumeSlider').value = settings.volume;
    if ($('volumeValue')) $('volumeValue').textContent = settings.volume + '%';
    applyTheme();
  } catch (error) {
    console.log('Erro ao carregar configurações:', error);
  }
}

async function checkSavedProgress() {
  try {
    await initDB();
    const saved = await loadProgressDB();
    if (saved && saved.current >= 0 && saved.moments?.length === 12) {
      hasSavedProgress = true;
      $('continueButton').removeAttribute('hidden');
      $('continueButton').removeAttribute('disabled');
      $('continueDesc').textContent = 'Sessão salva';
      return true;
    } else {
      hasSavedProgress = false;
      $('continueButton').setAttribute('disabled', '');
      $('continueDesc').textContent = 'Nenhum jogo salvo';
    }
  } catch (error) {
    console.log('Erro ao verificar progresso salvo:', error);
    hasSavedProgress = false;
    $('continueButton').removeAttribute('hidden');
    $('continueButton').setAttribute('disabled', '');
    $('continueDesc').textContent = 'Nenhum jogo salvo';
  }
  return false;
}

// ABRIR APOIO APOS 30 RESPOSTAS NEGATIVAS
function registerNegativeResponse(cost) {
  if (cost >= 0) return;
  negativeResponseCount++;
  localStorage.setItem('entrelinhas-negative-responses', String(negativeResponseCount));
  if (negativeResponseCount >= NEGATIVE_RESPONSE_LIMIT && !helpAlertShown) {
    helpAlertShown = true;
    localStorage.setItem('entrelinhas-help-alert-shown', 'true');
    setTimeout(() => showModal('helpModal'), 1500);
  }
}

// EVENTOS DO MENU
$('startButton').addEventListener('click', () => { 
  current = 0; 
  helpAlertShown = false;
  moments = createSession(); 
  showApp(); 
  render(); 
  showToast('Um novo caminho começou.'); 
});

$('continueButton').addEventListener('click', async () => {
  try {
    await initDB();
    const saved = await loadProgressDB();
    if (saved) {
      current = saved.current;
      moments = saved.moments;
      showApp();
      render();
      showToast('Sua sessão foi restaurada.');
    }
  } catch (error) {
    console.error('Erro ao continuar:', error);
    showToast('Erro ao restaurar sessão.');
  }
});

$('aboutButton').addEventListener('click', () => showModal('aboutModal'));
$('settingsButton').addEventListener('click', () => showModal('settingsModal'));
$('exitButton').addEventListener('click', () => { 
  if (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
    showToast('Para fechar o app, use o botão de voltar do seu dispositivo.');
  } else {
    showToast('Para fechar, feche a aba do navegador.');
  }
});

$('closeAboutButton').addEventListener('click', () => hideModal('aboutModal'));
$('closeSettingsButton').addEventListener('click', () => hideModal('settingsModal'));
$('closeHelpButton').addEventListener('click', () => hideModal('helpModal'));

// EVENT LISTENERS DE CONFIGURAÇÕES
$('soundToggle').addEventListener('change', (e) => {
  settings.soundEnabled = e.target.checked;
  localStorage.setItem('entrelinhas-sound', settings.soundEnabled);
});

$('ambientMusicToggle').addEventListener('change', (e) => {
  settings.ambientMusicEnabled = e.target.checked;
  localStorage.setItem('entrelinhas-ambient-music', settings.ambientMusicEnabled);
});

$('volumeSlider').addEventListener('input', (e) => {
  setVolume(e.target.value);
});

$('animationToggle').addEventListener('change', (e) => {
  settings.animationsEnabled = e.target.checked;
  localStorage.setItem('entrelinhas-animations', settings.animationsEnabled);
  if (!settings.animationsEnabled) {
    document.body.style.setProperty('--animation-duration', '0.01ms');
  } else {
    document.body.style.removeProperty('--animation-duration');
  }
});

$('darkModeToggle').addEventListener('change', (e) => {
  settings.darkMode = e.target.checked;
  localStorage.setItem('entrelinhas-dark-mode', settings.darkMode);
  applyTheme();
});

$('notificationsToggle').addEventListener('change', async (e) => {
  if (!e.target.checked) {
    localStorage.setItem('entrelinhas-notifications', 'false');
    return;
  }
  if (!('Notification' in window)) {
    e.target.checked = false;
    showToast('Este navegador não oferece notificações.');
    return;
  }
  const permission = await Notification.requestPermission();
  const enabled = permission === 'granted';
  e.target.checked = enabled;
  localStorage.setItem('entrelinhas-notifications', enabled);
  showToast(enabled ? 'Notificações ativadas.' : 'Permissão para notificações não concedida.');
});

// EVENTOS DE CONFIGURAÇÕES
$('clearDataButton').addEventListener('click', async () => {
  if (confirm('Tem certeza? Isto apagará todo o histórico de sessões. Não pode ser desfeito.')) {
    try {
      await initDB();
      const storeNames = [SESSIONS_STORE, PROGRESS_STORE];
      for (const storeName of storeNames) {
        const tx = db.transaction([storeName], 'readwrite');
        await new Promise((r, e) => {
          const req = tx.objectStore(storeName).clear();
          req.onsuccess = r;
          req.onerror = e;
        });
      }
      localStorage.clear();
      hasSavedProgress = false;
      negativeResponseCount = 0;
      helpAlertShown = false;
      showToast('Dados apagados com sucesso.');
      hideModal('settingsModal');
    } catch (error) {
      console.error('Erro ao apagar dados:', error);
      showToast('Erro ao apagar dados.');
    }
  }
});

// Botão de menu no jogo
$('menuToggleButton').addEventListener('click', showMenu);

// Fechar modal ao clicar fora
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    hideModal(e.target.id);
  }
});

// Inicializar IndexedDB
let db;
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { db = request.result; resolve(db); };
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
        db.createObjectStore(SESSIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: 'id' });
      }
    };
  });
}

// Salvar progresso no IndexedDB
function saveProgressDB(data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);
    store.put({ id: 'current', ...data, timestamp: new Date().toISOString() });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Carregar progresso do IndexedDB
function loadProgressDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);
    const request = store.get('current');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Salvar sessão finalizada no histórico
function saveSessionDB(sessionData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SESSIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SESSIONS_STORE);
    store.add({ ...sessionData, timestamp: new Date().toISOString() });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Restaurar progresso ao carregar a página
async function restoreProgress() {
  try {
    await initDB();
    const saved = await loadProgressDB();
    if (saved) {
      current = saved.current;
      moments = saved.moments;
    }
  } catch (error) {
    console.log('Usando localStorage como fallback:', error);
    const savedLocal = localStorage.getItem('entrelinhas-progress');
    if (savedLocal) {
      const data = JSON.parse(savedLocal);
      current = data.current;
      moments = data.moments;
    }
  }
}

function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
function createSession() { return Array.from({length: 12}, (_, index) => { const moment = momentPool[index % momentPool.length]; return {...moment, title:shuffle(moment.titles)[0], copy:shuffle(moment.copies)[0], choices:shuffle(moment.choices).slice(0,3)}; }); }
function choose(button, cost, response) { 
  document.querySelectorAll('.choice').forEach(item => item.disabled=true); 
  registerNegativeResponse(cost);
  $('responseText').hidden=false;
  typeText($('responseText'), response, 120);
  setTimeout(() => $('responseText').classList.add('is-fading'), 19000);
  setTimeout(() => {
    current = current < moments.length - 1 ? current + 1 : 0;
    if (current === 0) moments = createSession();
    render();
  }, 20000);
}
function showToast(message) { $('toast').textContent=message; $('toast').classList.add('show'); setTimeout(() => $('toast').classList.remove('show'), 3500); }
function newSession() { current=0; moments=createSession(); $('momentCard').hidden=false; render(); showToast('Nova sessão iniciada.'); }
// Restaurar progresso e renderizar
loadSettings();
checkSavedProgress().then(() => {
  showMenu();
}).catch(err => {
  console.error('Erro ao inicializar:', err);
  showMenu();
});
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt=event; $('installButton').hidden=false; });
$('installButton').addEventListener('click', async () => { if (!installPrompt) { showToast('No navegador, abra o menu e escolha “Adicionar à tela inicial”.'); return; } installPrompt.prompt(); installPrompt=null; $('installButton').hidden=true; });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
// Detectar se é executado como PWA instalado
const isInstalledPWA = () => {
  return (window.navigator.standalone === true) || 
         (window.matchMedia('(display-mode: standalone)').matches) ||
         (window.matchMedia('(display-mode: fullscreen)').matches);
};

// Detectar mudança de status online/offline
window.addEventListener('online', () => { console.log('App online'); showToast('Conexão restaurada'); });
window.addEventListener('offline', () => { console.log('App offline'); showToast('Modo offline - dados salvos localmente'); });

// Log de informações de debug
console.log('Entrelinhas v5.1 carregado');
console.log('PWA Mode:', isInstalledPWA() ? 'Instalado' : 'Navegador');
console.log('Service Worker:', 'serviceWorker' in navigator ? 'Suportado' : 'Não suportado');
console.log('IndexedDB:', typeof indexedDB !== 'undefined' ? 'Disponível' : 'Não disponível');
console.log('Offline Storage:', typeof localStorage !== 'undefined' ? 'Disponível' : 'Não disponível');