function typeText(element, text, speed) {
  clearInterval(element.typeTimer);
  element.textContent = '';
  let position = 0;
  element.typeTimer = setInterval(() => {
    element.textContent += text[position++];
    if (position >= text.length) clearInterval(element.typeTimer);
  }, speed);
}
function render() { const moment = moments[current]; $('responseText').hidden=true; $('responseText').classList.remove('is-fading'); $('nextButton').hidden=true; $('finalChoices').hidden=true; typeText($('momentTime'), moment.time, 100); typeText($('momentTitle'), moment.title, 85); typeText($('momentCopy'), moment.copy, 38); $('choices').innerHTML = ''; moment.choices.forEach(([label, cost, response, nextPath]) => { const button = document.createElement('button'); button.className='choice'; typeText(button, label, 55); button.addEventListener('click', () => choose(button, cost, response, nextPath)); $('choices').appendChild(button); }); saveProgressDB({current,moments,negativeResponseCount,stage,path}).catch(err => console.log('Erro ao salvar progresso:', err)); }
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
let current = 0; let moments = []; let installPrompt;
let hasSavedProgress = false;
let stage = 'opening';
let path = null;
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
    if (saved && saved.current >= 0 && (saved.moments?.length === 50 || saved.moments?.length === 20)) {
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
  stage = 'opening';
  path = null;
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
      stage = saved.stage || (saved.moments.length === 20 ? 'path' : 'opening');
      path = saved.path || null;
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
const routineScenes = [
  {title:'A louça ficou na pia.', copy:'Esqueci de lavar a louça. O cheiro da comida começou a ficar pela casa.', choices:[['Lavar a louça',-5,'Lavei a louça. Foi um saco, mas a casa já não parecia estar prendendo o cheiro do almoço.'],['Deixar como está',0,'Deixei como estava. A pia continuou cheia e, no fundo, eu sabia que isso não ia mudar sozinho.']]},
  {title:'A roupa ficou na cadeira.', copy:'A cadeira sumiu debaixo da roupa que eu fui deixando ali durante a semana.', choices:[['Dobrar algumas peças',-5,'Dobrei algumas peças e deixei o resto para depois. A cadeira voltou a aparecer.'],['Empurrar tudo para o canto',0,'Empurrei tudo para o canto. A bagunça ficou escondida, mas continuou ocupando espaço.']]},
  {title:'Uma mensagem ficou sem resposta.', copy:'A notificação continuou acesa, lembrando que alguém esperava uma resposta simples.', choices:[['Responder com honestidade',-5,'Respondi que não estava muito bem. Foi mais fácil do que inventar uma desculpa.'],['Deixar para depois',0,'Deixei para depois. A mensagem continuou ali, sem mudar de assunto sozinha.']]},
  {title:'O café esfriou.', copy:'Fiz café e esqueci dele na mesa enquanto olhava para o nada.', choices:[['Esquentar o café',-3,'Esquentei o café. Não ficou igual ao primeiro, mas ainda estava bom o bastante.'],['Fazer outro depois',0,'Deixei o café esfriar. A xícara ficou na mesa junto com o resto da manhã.']]},
  {title:'O lixo precisava sair.', copy:'O saco estava cheio e a cozinha começava a ficar com um cheiro difícil de ignorar.', choices:[['Levar o lixo',-6,'Levei o lixo até a rua. Voltei com as mãos vazias e a cozinha respirou melhor.'],['Fechar bem o saco',0,'Fechei bem o saco e deixei para depois. O cheiro continuou sendo um problema para mais tarde.']]},
  {title:'O mercado ficou para depois.', copy:'Faltava comida em casa, mas sair para comprar parecia uma tarefa enorme.', choices:[['Fazer uma lista curta',-4,'Fiz uma lista curta e comprei só o necessário. Não resolvi a semana inteira, mas tinha algo para comer.'],['Pedir qualquer coisa',0,'Pedi qualquer coisa. Foi mais rápido, embora a geladeira continuasse quase vazia.']]},
  {title:'A tarefa ficou aberta.', copy:'Uma tarefa simples continuou aberta na tela, como se esperasse uma versão mais disposta de mim.', choices:[['Fazer os primeiros minutos',-6,'Fiz os primeiros minutos da tarefa. O começo foi chato, mas agora havia menos para terminar.'],['Fechar a tela',0,'Fechei a tela. A tarefa continuou esperando exatamente no mesmo lugar.']]},
  {title:'A janela ficou fechada.', copy:'O ar da sala estava parado e a rua fazia um barulho distante.', choices:[['Abrir a janela',-4,'Abri a janela. O ar entrou devagar e trouxe os sons da rua para dentro.'],['Continuar no mesmo lugar',0,'Deixei a janela fechada. A sala continuou abafada, igual antes.']]},
  {title:'O celular vibrou de novo.', copy:'Outra notificação apareceu enquanto eu tentava ficar alguns minutos sem pensar em nada.', choices:[['Colocar no silencioso',-4,'Coloquei o celular no silencioso. O silêncio não resolveu tudo, mas ajudou a começar.'],['Ver a notificação',0,'Abri a notificação. Era algo pequeno, mas interrompeu o pouco de descanso que eu tinha.']]},
  {title:'A luz da sala queimou.', copy:'A sala ficou mais escura do que o normal, e a lâmpada nova estava guardada no armário.', choices:[['Trocar a lâmpada',-6,'Troquei a lâmpada. A sala não ficou diferente, mas ficou possível enxergar melhor.'],['Usar outra luz',0,'Acendi a luz do corredor. Funcionou por enquanto, embora o canto da sala continuasse escuro.']]}
];
const narrativeScenes = [
  {title:'Na cozinha, fiz meu café.', copy:'A pia estava cheia de louça como sempre. Não havia uma xícara limpa. O relógio estava parado às 12:21 desde o dia em que caiu da parede. Pela janela, vi a vizinha sentada no quintal. O tempo estava nublado e ela parecia pensando em problemas. Pelos barulhos de briga à noite, as coisas não pareciam bem. Mas, com essa vida que tenho, quem sou eu para julgar?', choices:[['Lavar uma xícara',-5,'Lavei uma xícara e fiz o café. A pia continuou cheia, mas consegui sentar com algo quente nas mãos.'],['Ir lá fora tomar um ar',-4,'Fui lá fora tomar um ar. O café ficou para depois e o quintal pareceu menos apertado que a cozinha.'],['Deixar tudo como está',0,'Deixei tudo como estava. O relógio continuou parado e a manhã não mudou muito.']]},
  {title:'A roupa ocupou a cadeira.', copy:'Eu precisava sair, mas a cadeira estava coberta pelas roupas que fui tirando durante a semana. Algumas estavam limpas, outras não. Fiquei tentando lembrar quais eram quais.', choices:[['Separar as roupas',-5,'Separei as roupas limpas das que precisavam de lavagem. A cadeira voltou a ter espaço.'],['Vestir a primeira coisa que encontrei',-2,'Vesti a primeira coisa que encontrei. Não era o que eu queria, mas servia para sair.'],['Deixar a cadeira como está',0,'Deixei a cadeira como estava. As roupas continuaram misturadas, esperando outra manhã.']]},
  {title:'Uma mensagem ficou acesa na tela.', copy:'Alguém tinha perguntado se eu estava bem. A pergunta era simples, mas eu não sabia se queria abrir tudo o que vinha junto com uma resposta.', choices:[['Responder que hoje está difícil',-5,'Escrevi que hoje estava difícil. Não expliquei tudo, mas a mensagem ficou verdadeira.'],['Responder apenas com um sinal',-2,'Mandei um coração. Foi uma resposta pequena, mas não deixei a pessoa falando sozinha.'],['Virar o celular para baixo',0,'Virei o celular para baixo. A pergunta saiu da frente, mas continuou na cabeça.']]},
  {title:'O café esfriou na mesa.', copy:'Fiz café e fui procurar alguma coisa na cozinha. Quando voltei, ele estava frio. Fiquei olhando para a xícara como se ela tivesse feito isso de propósito.', choices:[['Esquentar o café',-3,'Esquentei o café. Não ficou igual ao primeiro, mas serviu para acompanhar a manhã.'],['Fazer outro café',-4,'Fiz outro café e deixei o primeiro na pia. A segunda tentativa ficou melhor.'],['Beber mesmo frio',0,'Bebi o café frio. Não foi bom, mas não precisava virar um problema maior.']]},
  {title:'O lixo chegou ao limite.', copy:'O saco estava cheio desde ontem. A cozinha começava a ficar com um cheiro difícil de ignorar, e eu continuava passando por ele como se não estivesse ali.', choices:[['Levar o lixo para fora',-6,'Levei o lixo para fora. A cozinha não ficou bonita, mas o cheiro saiu junto.'],['Trocar apenas o saco',-3,'Troquei o saco e deixei o lixo para levar depois. Já dava para respirar melhor.'],['Continuar ignorando',0,'Continuei ignorando. O saco ficou no mesmo lugar, lembrando que não sumiria sozinho.']]},
  {title:'A geladeira estava quase vazia.', copy:'Havia meio tomate, um pote sem tampa e uma garrafa de água. Pensar no mercado parecia mais cansativo do que a fome.', choices:[['Fazer uma lista pequena',-4,'Fiz uma lista pequena e comprei o necessário para não decidir tudo hoje.'],['Preparar o que havia',-5,'Preparei o que havia. Não foi uma refeição bonita, mas foi comida.'],['Pedir qualquer coisa',0,'Pedi qualquer coisa. Foi rápido, embora a geladeira continuasse quase vazia.']]},
  {title:'A tarefa continuou aberta no computador.', copy:'O documento estava na tela desde ontem. Eu lia a mesma linha, apagava uma palavra e voltava a olhar para o cursor piscando.', choices:[['Fazer só os primeiros minutos',-6,'Fiz os primeiros minutos. O texto não ficou pronto, mas já não era exatamente o mesmo de ontem.'],['Anotar o próximo passo',-4,'Anotei o próximo passo e fechei o documento. Agora havia uma entrada para quando eu voltasse.'],['Fechar sem fazer nada',0,'Fechei o documento. A tarefa continuou esperando no mesmo ponto.']]},
  {title:'A janela estava fechada.', copy:'O ar da sala estava parado. Do lado de fora, alguém arrastava uma cadeira e um ônibus passava devagar. A casa parecia menor com tudo fechado.', choices:[['Abrir a janela',-4,'Abri a janela. O ar entrou devagar e os sons da rua ocuparam o silêncio.'],['Ficar alguns minutos do lado de fora',-5,'Fiquei alguns minutos do lado de fora. Não aconteceu nada especial, mas foi diferente da sala.'],['Continuar dentro de casa',0,'Continuei dentro de casa. A sala permaneceu abafada, igual antes.']]},
  {title:'O celular vibrou outra vez.', copy:'Eu tinha colocado o celular no silencioso, mas ainda olhava para ele sempre que a tela acendia. Talvez fosse importante. Talvez fosse apenas propaganda.', choices:[['Ativar o silêncio de verdade',-4,'Ativei o silêncio e deixei o celular longe. Não resolveu tudo, mas começou por algum lugar.'],['Ver apenas a mensagem',-2,'Olhei apenas a mensagem e fechei a tela. Não respondi tudo, só conferi o necessário.'],['Continuar olhando a tela',0,'Continuei olhando a tela. Cada notificação trouxe mais uma coisa pequena para a tarde.']]},
  {title:'A luz da sala queimou.', copy:'A lâmpada nova estava guardada no armário, atrás de uma caixa que eu não abria fazia meses. A sala ficou escura antes de anoitecer.', choices:[['Trocar a lâmpada',-6,'Troquei a lâmpada. A sala não ficou diferente, mas ficou possível enxergar melhor.'],['Acender a luz do corredor',-2,'Acendi a luz do corredor. Não era o ideal, mas clareou o caminho até a cozinha.'],['Deixar a sala escura',0,'Deixei a sala escura. O problema ficou para depois, junto com a caixa.']]}
];
function makeQuestions(count, branch) { return Array.from({length: count}, (_, index) => { const scene = narrativeScenes[index % narrativeScenes.length]; const firstPath = 'path-'+(index % 20); const secondPath = 'path-'+((index + 1) % 20); const choices = scene.choices.map(([label, cost, response], choiceIndex) => [label, cost, response, branch === null ? (choiceIndex === 0 ? firstPath : secondPath) : branch]); return {time: String(7 + Math.floor(index / 3)).padStart(2,'0')+':'+String((index * 7) % 60).padStart(2,'0'), title:scene.title, copy:scene.copy, choices}; }); }
function createSession() { return makeQuestions(50, null); }
moments = createSession();
function choose(button, cost, response, nextPath) { 
  document.querySelectorAll('.choice').forEach(item => item.disabled=true); 
  registerNegativeResponse(cost);
  if (stage === 'opening') {
    path = nextPath || (cost < 0 ? 'continue' : 'rest');
    stage = 'path';
    current = 0;
    moments = makeQuestions(20, path);
  }
  $('responseText').hidden=false;
  typeText($('responseText'), response, 120);
  setTimeout(() => $('nextButton').hidden=false, response.length * 120 + 400);
}
function nextQuestion() {
  if (stage === 'path' && current >= moments.length - 1) {
    playCompletionSound();
    $('momentCard').hidden=true;
    $('finalChoices').hidden=false;
    return;
  }
  current++;
  render();
}
function playCompletionSound() { const sound = $('completionSound'); if (sound?.src) sound.play().catch(() => {}); }
function showToast(message) { $('toast').textContent=message; $('toast').classList.add('show'); setTimeout(() => $('toast').classList.remove('show'), 3500); }
function newSession() { current=0; stage='opening'; path=null; moments=createSession(); $('momentCard').hidden=false; $('finalChoices').hidden=true; render(); showToast('Nova sessão iniciada.'); }
function chooseFinal(option) { if (option === 'rest') { document.body.classList.add('resting'); setTimeout(() => { document.body.classList.remove('resting'); showMenu(); }, 1800); return; } $('finalChoices').hidden=true; stage='path'; path='path-'+Math.floor(Math.random()*20); current=0; moments=makeQuestions(20, path); $('momentCard').hidden=false; render(); }
// Restaurar progresso e renderizar
loadSettings();
checkSavedProgress().then(() => {
  showMenu();
}).catch(err => {
  console.error('Erro ao inicializar:', err);
  showMenu();
});
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt=event; $('installButton').hidden=false; });
$('nextButton').addEventListener('click', nextQuestion);
$('continueFinalButton').addEventListener('click', () => chooseFinal('continue'));
$('restFinalButton').addEventListener('click', () => chooseFinal('rest'));
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