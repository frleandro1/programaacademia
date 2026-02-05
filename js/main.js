const STORAGE_KEY = 'academia_treino';
const API_URL = 'http://localhost/academia_api.php';
const USE_DATABASE = false;
const USE_FIREBASE = true; // Ativar sincronização com Firebase

// Verifica se o usuário está logado
let USUARIO_ID = 1;
let CURRENT_USER = null;

// Variáveis de controle do timer
let trainingTimer = null;
let sessionStartTime = null;
let sessionElapsedSeconds = 0;

// Firebase
let db = null;
let firebaseReady = false;

function checkLogin() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
        window.location.href = 'login.html';
        return;
    }
    
    CURRENT_USER = JSON.parse(userJson);
    USUARIO_ID = CURRENT_USER.id;
    
    // Verificar se treino foi selecionado
    const selectedTreino = localStorage.getItem('selectedTreino');
    if (!selectedTreino) {
        console.log('📅 Mostrando seletor de treino');
        showInitialTreinoSelector();
        return;
    }
    
    // Atualiza informações do usuário na página
    document.getElementById('userName').textContent = CURRENT_USER.name;
    document.getElementById('userRoutine').textContent = `Treino: ${selectedTreino}`;
    document.getElementById('userGoal').textContent = `📌 ${CURRENT_USER.goal}`;
}

function handleLogout() {
    console.log('🚪 Clicou em Sair');
    if (confirm('Tem certeza que deseja sair?')) {
        console.log('✅ Confirmou logout');
        stopTrainingTimer();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('selectedTreino');
        
        // Limpar também dados de treino do usuário (ANTES de remover currentUser)
        const currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
            try {
                const currentUser = JSON.parse(currentUserStr);
                localStorage.removeItem(`training_${currentUser.username}`);
                localStorage.removeItem(`custom_training_${currentUser.username}`);
                localStorage.removeItem(`training_session_${currentUser.username}`);
            } catch (e) {
                console.warn('Erro ao limpar dados:', e);
            }
        }
        
        console.log('📤 Redirecionando para login...');
        // Redirecionar para login
        window.location.href = './login.html';
    }
    return false;
}

// Tornar global para garantir acesso do HTML
window.handleLogout = handleLogout;

// ============ INICIALIZAÇÃO FIREBASE ============

function initializeFirebase() {
    if (!USE_FIREBASE) return;
    
    console.log('🔥 Iniciando Firebase...');
    
    // Checar se Firebase já está carregado
    let retries = 0;
    const maxRetries = 20;
    
    const checkFirebase = () => {
        console.log(`Tentativa ${retries + 1}/${maxRetries}: firebase =`, typeof firebase);
        
        if (typeof firebase !== 'undefined' && typeof firebase.database === 'function') {
            console.log('✅ Firebase disponível, inicializando...');
            
            try {
                const firebaseConfig = {
                    apiKey: "AIzaSyB5CPHE4fvlkZYa0KkINr-NlhIMPYs4qAM",
                    authDomain: "academiatreinoapp-d2004.firebaseapp.com",
                    databaseURL: "https://academiatreinoapp-d2004-default-rtdb.firebaseio.com",
                    projectId: "academiatreinoapp-d2004",
                    storageBucket: "academiatreinoapp-d2004.firebasestorage.app",
                    messagingSenderId: "1075985055185",
                    appId: "1:1075985055185:web:bdaf8c84c4778361e974f0",
                    measurementId: "G-8TVK5XD653"
                };
                
                // Inicializar firebase app se não estiver inicializado
                let app;
                if (firebase.apps && firebase.apps.length === 0) {
                    app = firebase.initializeApp(firebaseConfig);
                    console.log('✅ App Firebase inicializado');
                } else {
                    app = firebase.app();
                    console.log('✅ Usando app Firebase existente');
                }
                
                // Obter referência do banco de dados
                db = firebase.database();
                firebaseReady = true;
                
                console.log('═════════════════════════════════════════════');
                console.log('✅✅✅ FIREBASE PRONTO PARA USO ✅✅✅');
                console.log('═════════════════════════════════════════════');
                
                // Sincronizar dados após Firebase estar pronto
                if (CURRENT_USER) {
                    syncFirebaseData();
                }
            } catch (error) {
                console.error('❌ Erro ao inicializar Firebase:', error);
                firebaseReady = false;
            }
        } else if (retries < maxRetries) {
            retries++;
            console.log(`⏳ Firebase não pronto, tentando novamente em 100ms...`);
            setTimeout(checkFirebase, 100);
        } else {
            console.warn('⚠️ Firebase não carregou após múltiplas tentativas, usando localStorage apenas');
            firebaseReady = false;
        }
    };
    
    // Iniciar verificação
    checkFirebase();
}

// Sincronizar dados com Firebase
function syncFirebaseData() {
    if (!firebaseReady || !CURRENT_USER) return;
    
    const username = CURRENT_USER.name;
    
    // Sincronizar treino (exercícios)
    const training = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEMO_DATA;
    if (Object.keys(training).length > 0) {
        saveToFirebase(`trainings/${username}`, training);
        // Também salvar no banco de exercícios globais
        saveToFirebase(`exercises/all`, DEMO_DATA);
    }
    
    // Sincronizar customizações
    const customTraining = JSON.parse(localStorage.getItem(`custom_training_${username}`)) || {};
    if (Object.keys(customTraining).length > 0) {
        saveToFirebase(`custom_trainings/${username}`, customTraining);
    }
    
    // Sincronizar sessão
    const session = JSON.parse(localStorage.getItem(`training_session_${username}`)) || {};
    if (Object.keys(session).length > 0) {
        saveToFirebase(`sessions/${username}`, session);
    }
    
    console.log('✅ Dados sincronizados com Firebase!');
}

// Salvar dados no Firebase
function saveToFirebase(path, data) {
    if (!firebaseReady) return;
    
    try {
        const ref = db.ref(path);
        ref.set(data).then(() => {
            console.log(`✅ Salvo em Firebase: ${path}`);
        }).catch(error => {
            console.error(`❌ Erro ao salvar em Firebase: ${path}`, error);
        });
    } catch (error) {
        console.error('Erro Firebase:', error);
    }
}

// Carregar dados do Firebase
async function loadFromFirebase(path) {
    if (!firebaseReady) return null;
    
    return new Promise((resolve) => {
        try {
            const ref = db.ref(path);
            ref.once('value').then(snapshot => {
                if (snapshot.exists()) {
                    console.log(`✅ Carregado do Firebase: ${path}`);
                    resolve(snapshot.val());
                } else {
                    resolve(null);
                }
            }).catch(error => {
                console.error(`❌ Erro ao carregar do Firebase: ${path}`, error);
                resolve(null);
            });
        } catch (error) {
            console.error('Erro Firebase:', error);
            resolve(null);
        }
    });
}

// Sincronizar banco de exercícios completo no Firebase
async function syncExercisesDatabase() {
    if (!firebaseReady) {
        console.warn('⚠️ Firebase não está pronto');
        return;
    }
    
    try {
        console.log('📤 Atualizando banco de exercícios no Firebase...');
        
        // Salvar exercícios globais
        await saveToFirebase('exercises/all', DEMO_DATA);
        
        // Salvar por categoria
        await saveToFirebase('exercises/push', DEMO_DATA.push);
        await saveToFirebase('exercises/pull', DEMO_DATA.pull);
        await saveToFirebase('exercises/legs', DEMO_DATA.legs);
        
        // Contar exercícios
        const totalExercises = DEMO_DATA.push.length + DEMO_DATA.pull.length + DEMO_DATA.legs.length;
        
        console.log(`✅ Banco sincronizado! Total: ${totalExercises} exercícios`);
        console.log(`   • Push: ${DEMO_DATA.push.length}`);
        console.log(`   • Pull: ${DEMO_DATA.pull.length}`);
        console.log(`   • Legs: ${DEMO_DATA.legs.length}`);
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao sincronizar exercícios:', error);
        return false;
    }
}

// Lista de vídeos disponíveis na pasta videos/
const AVAILABLE_VIDEOS = [
    'Agachamento Livre.mp4',
    'Cadeira Adutora.mp4',
    'Crucifixo Fly ou PecDeck máquina.mp4',
    'Crucifixo polia alta.mp4',
    'Desenvolvimento máquina.mp4',
    'Legpress Horizontal.mp4',
    'Pulley tríceps barra reta.mp4',
    'Pulley tríceps supinado.mp4',
    'Puxada frontal aberta.mp4',
    'Puxada frontal aberta (1).mp4',
    'Remada sentada máquina.mp4',
    'Rosca Bíceps Halteres.mp4',
    'Rosca Direta em Pé Polia baixa.mp4',
    'Rosca em Pé Halteres.mp4',
    'Supino inclinado 30 halteres.mp4',
    'Supino reto barra.mp4',
    'Tríceps francês barra polia baixa.mp4',
    'Tríceps francês corda polia baixa.mp4',
    'Tríceps pulley corda.mp4'
];

// Mapa de variações de nomes para vídeos
const EXERCISE_VIDEO_MAP = {
    // Crucifixo/Pecdeck
    'crucifixo fly': 'Crucifixo Fly ou PecDeck máquina.mp4',
    'pecdeck maquina': 'Crucifixo Fly ou PecDeck máquina.mp4',
    'pecdeck': 'Crucifixo Fly ou PecDeck máquina.mp4',
    'crucifixo fly ou pecdeck maquina': 'Crucifixo Fly ou PecDeck máquina.mp4',
    'fly': 'Crucifixo Fly ou PecDeck máquina.mp4',
    'pec deck': 'Crucifixo Fly ou PecDeck máquina.mp4',
    'crucifixo polia alta': 'Crucifixo polia alta.mp4',
    
    // Tríceps - Francês/Corda/Pulley
    'triceps francês': 'Tríceps francês barra polia baixa.mp4',
    'triceps francês corda palia baixa': 'Tríceps francês corda polia baixa.mp4',
    'triceps francês corda polia baixa': 'Tríceps francês corda polia baixa.mp4',
    'triceps corda palia baixa': 'Tríceps francês corda polia baixa.mp4',
    'triceps corda polia baixa': 'Tríceps francês corda polia baixa.mp4',
    'pulley triceps': 'Pulley tríceps barra reta.mp4',
    'pulley triceps supinado': 'Pulley tríceps supinado.mp4',
    'pulley triceps barra reta': 'Pulley tríceps barra reta.mp4',
    'triceps pulley corda': 'Tríceps pulley corda.mp4',
    'triceps pulley': 'Tríceps pulley corda.mp4',
    
    // Puxada Frontal
    'puxada frontal': 'Puxada frontal aberta.mp4',
    'puxada frontal aberta': 'Puxada frontal aberta.mp4',
    'puxada frontal aberta variacao': 'Puxada frontal aberta (1).mp4',
    'puxada frontal aberta (variacao)': 'Puxada frontal aberta (1).mp4',
    'puxada frontal aberta (variação)': 'Puxada frontal aberta (1).mp4',
    'puxada frontal variacao': 'Puxada frontal aberta (1).mp4',
    'puxada frontal variacao (1)': 'Puxada frontal aberta (1).mp4',
    'puxada frontal (variação)': 'Puxada frontal aberta (1).mp4',
    'pulldown': 'Puxada frontal aberta.mp4',
    'lat pulldown': 'Puxada frontal aberta.mp4',
    
    // Remada Sentada
    'remada sentada': 'Remada sentada máquina.mp4',
    'remada sentada maquina': 'Remada sentada máquina.mp4',
    'seated row': 'Remada sentada máquina.mp4',
    
    // Rosca Bíceps
    'rosca biceps': 'Rosca Bíceps Halteres.mp4',
    'rosca biceps halteres': 'Rosca Bíceps Halteres.mp4',
    'rosca em pé halteres': 'Rosca em Pé Halteres.mp4',
    'rosca direta em pé polia baixa': 'Rosca Direta em Pé Polia baixa.mp4',
    'rosca direta pé polia baixa': 'Rosca Direta em Pé Polia baixa.mp4',
    'barbell curl': 'Rosca Bíceps Halteres.mp4',
    'dumbbell curl': 'Rosca Bíceps Halteres.mp4',
    
    // Leg Press / Agachamento
    'agachamento': 'Agachamento Livre.mp4',
    'agachamento livre': 'Agachamento Livre.mp4',
    'legpress': 'Legpress Horizontal.mp4',
    'leg press': 'Legpress Horizontal.mp4',
    'legpress horizontal': 'Legpress Horizontal.mp4',
    'cadeira adutora': 'Cadeira Adutora.mp4',
    'adutora': 'Cadeira Adutora.mp4',
    
    // Desenvolvimento
    'desenvolvimento': 'Desenvolvimento máquina.mp4',
    'desenvolvimento maquina': 'Desenvolvimento máquina.mp4',
    'shoulder press': 'Desenvolvimento máquina.mp4',
    
    // Supino
    'supino': 'Supino reto barra.mp4',
    'supino reto': 'Supino reto barra.mp4',
    'supino reto barra': 'Supino reto barra.mp4',
    'supino inclinado': 'Supino inclinado 30 halteres.mp4',
    'supino inclinado halteres': 'Supino inclinado 30 halteres.mp4',
    'supino inclinado 30 halteres': 'Supino inclinado 30 halteres.mp4'
};

// Função para encontrar o vídeo correspondente ao exercício
function findVideoForExercise(exerciseName) {
    if (!exerciseName) {
        console.warn('⚠️ Nome do exercício vazio');
        return null;
    }
    
    const nameNormalized = exerciseName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    console.log(`🎬 Procurando vídeo para: "${exerciseName}" (normalizado: "${nameNormalized}")`);
    
    // Primeiro, tenta encontrar uma correspondência exata no mapa
    if (EXERCISE_VIDEO_MAP[nameNormalized]) {
        const videoName = EXERCISE_VIDEO_MAP[nameNormalized];
        console.log(`✅ Encontrado no mapa (exato): ${videoName}`);
        return `./videos/${videoName}`;
    }
    
    // Segundo, tenta match parcial no mapa (útil para variações)
    for (const mapKey of Object.keys(EXERCISE_VIDEO_MAP)) {
        if (nameNormalized.includes(mapKey) || mapKey.includes(nameNormalized)) {
            const videoName = EXERCISE_VIDEO_MAP[mapKey];
            console.log(`✅ Encontrado no mapa (parcial): ${videoName}`);
            return `./videos/${videoName}`;
        }
    }
    
    // Terceiro, tenta match parcial nos vídeos disponíveis
    for (const video of AVAILABLE_VIDEOS) {
        const videoNormalized = video.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        
        // Verifica se o nome do exercício está contido no nome do vídeo ou vice-versa
        if (videoNormalized.includes(nameNormalized) || nameNormalized.includes(videoNormalized)) {
            const fullPath = `./videos/${video}`;
            console.log(`✅ Encontrado vídeo por match: ${video}`);
            return fullPath;
        }
    }
    
    console.warn(`❌ Nenhum vídeo encontrado para: "${exerciseName}"`);
    console.log('📝 Vídeos disponíveis:', AVAILABLE_VIDEOS);
    return null;
}


// Função para extrair ID do YouTube e gerar URL da miniatura
function getYoutubeThumb(url) {
    if (!url) return null;
    
    // Se for vídeo local, retorna o próprio caminho do vídeo para usar como poster
    if (url.startsWith('./videos/')) {
        return url;
    }
}

const DEMO_DATA = {
    A: [
        {
            id: 1,
            name: 'Supino reto barra',
            series: '3x12 drop set',
            load: '80kg',
            interval: '50s',
            instructions: '+3 séries normais (10-12 repetições), na última série + drop set, Reduz 30% da carga + continua até a falha, Reduz mais 30% + continua até a falha',
            completed: false,
            grupo: 'A'
        },
        {
            id: 2,
            name: 'Supino inclinado 30 halteres',
            series: '3x10/10/6',
            load: '20kg',
            interval: '50s',
            instructions: '+3 blocos: 1ª vez: 10 repetições (mesma carga), 2ª vez: 10 repetições (com carga maior, cerca de +20%), 3ª vez: 6 repetições (com carga maior, cerca de +20%)',
            completed: false,
            grupo: 'A'
        },
        {
            id: 3,
            name: 'Crucifixo Fly ou PecDeck máquina',
            series: '3x12',
            load: '40kg',
            interval: '45s',
            instructions: 'Movimento controlado, puxe em direção ao peito. Retorne com controle até sentir alongamento no peitoral.',
            completed: false,
            grupo: 'A'
        },
        {
            id: 5,
            name: 'Desenvolvimento máquina',
            series: '4x12',
            load: '60kg',
            interval: '50s',
            instructions: 'Suba os halteres acima da cabeça com controle. Cotovelos nunca trancam completamente.',
            completed: false,
            grupo: 'A'
        },
        {
            id: 6,
            name: 'Tríceps francês barra polia baixa',
            series: '4x12',
            load: '40kg',
            interval: '50s',
            instructions: 'Cotovelos fixos. Estenda completamente os braços no final com controle.',
            completed: false,
            grupo: 'A'
        }
    ],
    B: [
        {
            id: 11,
            name: 'Puxada frontal aberta',
            series: '4x8-10',
            load: '80kg',
            interval: '60s',
            instructions: 'Puxe até o peito. Mantenha o peito erguido e puxe com a escápula.',
            completed: false,
            grupo: 'B'
        },
        {
            id: 13,
            name: 'Remada sentada máquina',
            series: '4x10-12',
            load: '90kg',
            interval: '60s',
            instructions: 'Puxe em direção ao abdômen. Mantenha as costas eretas durante todo o movimento.',
            completed: false,
            grupo: 'B'
        },
        {
            id: 14,
            name: 'Rosca em Pé Halteres',
            series: '3x8-10',
            load: '18kg',
            interval: '60s',
            instructions: 'Cotovelos fixos na lateral. Movimento só do antebraço. Sem balançar o corpo.',
            completed: false,
            grupo: 'B'
        },
        {
            id: 15,
            name: 'Rosca Bíceps Halteres',
            series: '3x8-10',
            load: '18kg',
            interval: '60s',
            instructions: 'Movimento alternado ou simultâneo. Cotovelo fixo, apenas o antebraço se move.',
            completed: false,
            grupo: 'B'
        }
    ],
    C: [
        {
            id: 4,
            name: 'Crucifixo polia alta',
            series: '1x25',
            load: '25kg',
            interval: '50s',
            instructions: '1 série só, com 20-25 repetições contínuas, carga leve-moderada, foco em alongar e contrair bem o peitoral.',
            completed: false,
            grupo: 'C'
        },
        {
            id: 7,
            name: 'Tríceps francês corda polia baixa',
            series: '3x12-15',
            load: '35kg',
            interval: '45s',
            instructions: 'Puxe a corda em direção às coxas com os cotovelos fixos. Estenda completamente no final.',
            completed: false,
            grupo: 'C'
        },
        {
            id: 8,
            name: 'Pulley tríceps barra reta',
            series: '3x12-15',
            load: '30kg',
            interval: '45s',
            instructions: 'Palmas para baixo, cotovelos fixos. Estenda os braços completamente no final do movimento.',
            completed: false,
            grupo: 'C'
        },
        {
            id: 9,
            name: 'Pulley tríceps supinado',
            series: '3x12-15',
            load: '25kg',
            interval: '45s',
            instructions: 'Palmas para cima. Movimento controlado com ênfase na contração do tríceps.',
            completed: false,
            grupo: 'C'
        },
        {
            id: 10,
            name: 'Tríceps pulley corda',
            series: '3x12-15',
            load: '35kg',
            interval: '45s',
            instructions: 'Afaste a corda no final do movimento. Controle a volta sem usar impulso.',
            completed: false,
            grupo: 'C'
        }
    ],
    D: [
        {
            id: 12,
            name: 'Puxada frontal aberta (variação)',
            series: '4x8-10',
            load: '75kg',
            interval: '60s',
            instructions: 'Pegada um pouco mais fechada. Puxe até a altura do queixo.',
            completed: false,
            grupo: 'D'
        },
        {
            id: 16,
            name: 'Rosca Direta em Pé Polia baixa',
            series: '3x10-12',
            load: '35kg',
            interval: '50s',
            instructions: 'Pegada reta. Cotovelos fixos. Movimento controlado tanto na subida quanto na descida.',
            completed: false,
            grupo: 'D'
        },
        {
            id: 17,
            name: 'Agachamento Livre',
            series: '4x8-10',
            load: '120kg',
            interval: '90s',
            instructions: 'Joelhos acompanham a direção dos pés. Peito para cima durante todo o movimento. Profundidade até paralelo.',
            completed: false,
            grupo: 'D'
        },
        {
            id: 18,
            name: 'Legpress Horizontal',
            series: '4x8-10',
            load: '280kg',
            interval: '60s',
            instructions: 'Pés ligeiramente afastados. Não tranque os joelhos na extensão total. Desça controlado.',
            completed: false,
            grupo: 'D'
        },
        {
            id: 19,
            name: 'Cadeira Adutora',
            series: '3x12-15',
            load: '80kg',
            interval: '45s',
            instructions: 'Aduto as coxas (puxe as pernas uma em direção à outra). Movimento controlado e completo.',
            completed: false,
            grupo: 'D'
        }
    ]
};

function init() {
    checkLogin();
    initializeFirebase();
    initializeDemoData();
    
    // Sincronizar banco de exercícios no Firebase após um pequeno delay
    setTimeout(() => {
        if (firebaseReady) {
            syncExercisesDatabase();
        }
    }, 1000);
    
    loadTraining();
    startTrainingTimer();
}

async function initializeDemoData() {
    if (!USE_DATABASE) {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATA));
        }
    }
}

async function loadTraining() {
    let exercises;
    let userExerciseIds = {}; // Exercícios específicos do usuário
    
    console.log('📚 Iniciando loadTraining...');
    
    // Tentar carregar o treino específico do usuário do localStorage (salvo pelo admin)
    if (CURRENT_USER) {
        const userTraining = JSON.parse(localStorage.getItem(`training_${CURRENT_USER.username}`));
        if (userTraining) {
            userExerciseIds = userTraining;
            console.log(`📚 Treino do usuário ${CURRENT_USER.username} carregado:`, userExerciseIds);
        }
    }
    
    if (USE_DATABASE) {
        try {
            const response = await fetch(`${API_URL}?action=listar&usuario_id=${USUARIO_ID}`);
            const data = await response.json();
            
            if (data.sucesso) {
                exercises = organizarExerciciosPorGrupo(data.exercicios);
            } else {
                console.error('Erro ao carregar exercícios:', data.error);
                exercises = JSON.parse(JSON.stringify(DEMO_DATA));
            }
        } catch (error) {
            console.error('Erro na conexão com API:', error);
            exercises = JSON.parse(JSON.stringify(DEMO_DATA));
        }
    } else {
        // Se há treino do usuário, usar apenas esses exercícios
        if (Object.keys(userExerciseIds).length > 0) {
            let allExercises = JSON.parse(localStorage.getItem('allExercises')) || DEMO_DATA;
            exercises = { A: [], B: [], C: [], D: [] };
            
            // Reconstituir a estrutura ABCD com apenas os exercícios do usuário
            Object.entries(userExerciseIds).forEach(([grupo, exerciseIds]) => {
                if (Array.isArray(exerciseIds)) {
                    exercises[grupo] = exerciseIds.map(exId => {
                        // Procurar em allExercises (como objeto com chaves numéricas)
                        return allExercises[exId] || Object.values(allExercises).find(ex => ex.id === exId);
                    }).filter(Boolean);
                }
            });
            
            console.log(`✅ Exercícios do usuário carregados:`, exercises);
        } else {
            // Se não houver treino específico, usar DEMO_DATA (cópia limpa)
            exercises = JSON.parse(JSON.stringify(DEMO_DATA));
            console.log(`📚 Usando DEMO_DATA padrão`);
        }
    }
    
    // Garantir que exercises sempre tenha a estrutura ABCD com pelo menos um exercício
    if (!exercises || typeof exercises !== 'object' || !exercises.A || !exercises.B || !exercises.C || !exercises.D) {
        console.warn(`⚠️ Estrutura de exercícios inválida, restaurando DEMO_DATA`);
        exercises = JSON.parse(JSON.stringify(DEMO_DATA));
    }
    
    // Filtrar apenas o treino selecionado
    const selectedTreino = localStorage.getItem('selectedTreino');
    console.log(`📅 selectedTreino:`, selectedTreino, `| Treinos disponíveis:`, Object.keys(exercises));
    
    if (selectedTreino) {
        if (exercises[selectedTreino] && Array.isArray(exercises[selectedTreino])) {
            exercises = {
                [selectedTreino]: exercises[selectedTreino]
            };
            console.log(`📅 Carregando treino ${selectedTreino} com ${exercises[selectedTreino].length} exercícios`);
        } else {
            console.warn(`⚠️ Treino ${selectedTreino} não encontrado ou inválido. Restaurando DEMO_DATA.`);
            exercises = JSON.parse(JSON.stringify(DEMO_DATA));
            if (exercises[selectedTreino]) {
                exercises = {
                    [selectedTreino]: exercises[selectedTreino]
                };
                console.log(`✅ Treino ${selectedTreino} restaurado de DEMO_DATA`);
            }
        }
    } else {
        console.warn(`⚠️ Nenhum treino selecionado`);
    }
    
    // Debug: Verificar todos os treinos disponíveis
    console.log('✅ TREINOS DISPONÍVEIS APÓS VALIDAÇÃO:');
    Object.keys(exercises).forEach(treino => {
        if (exercises[treino] && Array.isArray(exercises[treino])) {
            console.log(`   📅 Treino ${treino}: ${exercises[treino].length} exercícios`);
        }
    });
    
    renderizarTreino(exercises);
}

function organizarExerciciosPorGrupo(exercicios) {
    const grupos = { A: [], B: [], C: [], D: [] };
    
    exercicios.forEach(ex => {
        ex.completed = false; // Será atualizado pelo histórico
        if (grupos[ex.grupo]) {
            grupos[ex.grupo].push(ex);
        }
    });
    
    return grupos;
}

function renderizarTreino(exercises) {
    const plan = document.getElementById('trainingPlan');
    
    let html = '';
    let totalExercises = 0;
    let completedExercises = 0;

    const groups = {
        A: '📅 TREINO A',
        B: '📅 TREINO B',
        C: '📅 TREINO C',
        D: '📅 TREINO D'
    };

    Object.keys(groups).forEach(group => {
        if (exercises[group] && exercises[group].length > 0) {
            html += `<h2 class="section-title">${groups[group]}</h2>`;
            html += '<div class="exercises-grid">';

            exercises[group].forEach(ex => {
                totalExercises++;
                if (ex.completed) completedExercises++;

                // Carrega personalizações customizadas do admin
                let customTraining = JSON.parse(localStorage.getItem(`custom_training_${CURRENT_USER.name}`)) || {};
                let displaySeries = customTraining[ex.id] ? customTraining[ex.id].series : ex.series;
                let displayLoad = customTraining[ex.id] ? customTraining[ex.id].load : ex.load;

                // Busca o vídeo dinamicamente baseado no nome do exercício
                const videoUrl = findVideoForExercise(ex.name);
                const thumbUrl = getYoutubeThumb(videoUrl);
                
                let imageHtml;
                
                if (thumbUrl && thumbUrl.startsWith('./videos/')) {
                    // Para vídeos locais, renderiza um vídeo HTML5 com controles
                    // Otimizado para mobile com preload lazy
                    imageHtml = `
                        <video width="100%" height="100%" style="border-radius: 8px; object-fit: cover;" 
                               controls preload="metadata" 
                               onerror="console.error('Erro ao carregar vídeo: ${thumbUrl}')"
                               poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231a1a1a'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='30'%3E▶%3C/text%3E%3C/svg%3E">
                            <source src="${thumbUrl}" type="video/mp4">
                            Seu navegador não suporta vídeo HTML5.
                        </video>
                    `;
                } else if (thumbUrl) {
                    // Para YouTube, usa imagem com loading lazy
                    imageHtml = `<img src="${thumbUrl}" alt="${ex.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="console.error('Erro ao carregar imagem: ${thumbUrl}')">`;
                } else {
                    // Fallback quando não encontra vídeo
                    console.warn(`⚠️ Sem vídeo para: ${ex.name}`);
                    imageHtml = `<div class="no-image" title="Vídeo não disponível">💪</div>`;
                }

                html += `
                    <div class="exercise-card ${ex.completed ? 'completed' : ''}">
                        <div class="exercise-content">
                            <div class="exercise-header">
                                <input type="checkbox" class="exercise-checkbox" ${ex.completed ? 'checked' : ''} onchange="toggleComplete('${group}', ${ex.id})">
                                <h3 class="exercise-title">${escapeHtml(ex.name)}</h3>
                            </div>
                            <div class="exercise-meta">
                                <div class="meta-item">
                                    <span class="meta-label">Séries</span>
                                    <span class="meta-value">${escapeHtml(displaySeries)}</span>
                                </div>
                                ${displayLoad ? `
                                    <div class="meta-item">
                                        <span class="meta-label">Carga</span>
                                        <div class="load-wrapper">
                                            <input type="text" class="load-input" id="load-${ex.id}" value="${escapeHtml(displayLoad)}" onblur="saveLoad(${ex.id})" placeholder="ex: 10kg">
                                            <span class="edit-icon">✏️</span>
                                        </div>
                                    </div>
                                ` : ''}
                                ${ex.interval ? `
                                    <div class="meta-item">
                                        <span class="meta-label">Intervalo</span>
                                        <span class="meta-value time">⏱️ ${escapeHtml(ex.interval)}</span>
                                    </div>
                                ` : ''}
                            </div>
                            ${ex.instructions ? `<div class="exercise-instructions">${escapeHtml(ex.instructions)}</div>` : ''}
                            <div class="action-buttons">
                                ${videoUrl ? `<button class="btn-video" onclick="showVideoModal('${videoUrl.replace(/'/g, "\\'")}')">📹 Ver Vídeo</button>` : '<button class="btn-video" disabled style="opacity: 0.5; cursor: not-allowed;">📹 Vídeo não encontrado</button>'}
                            </div>
                        </div>
                        <div class="exercise-image">${imageHtml}</div>
                    </div>
                `;
            });

            html += '</div>';
        }
    });

    if (totalExercises === 0) {
        html = '<div class="empty-state"><div class="empty-state-icon">🏋️</div><p>Nenhum exercício disponível.</p></div>';
    }

    plan.innerHTML = html;
    document.getElementById('totalExercises').textContent = totalExercises;
    document.getElementById('completedExercises').textContent = completedExercises;
    
    // Calcular progresso
    const progressPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
    document.getElementById('progressPercent').textContent = progressPercent + '%';
}

function saveLoad(exerciseId) {
    const loadInput = document.getElementById(`load-${exerciseId}`);
    const newLoad = loadInput.value;
    const exercises = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEMO_DATA;
    let found = false;
    
    Object.keys(exercises).forEach(group => {
        const ex = exercises[group].find(e => e.id === exerciseId);
        if (ex) {
            ex.load = newLoad;
            found = true;
        }
    });
    
    if (found) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
        // Sincronizar com Firebase
        if (firebaseReady && CURRENT_USER) {
            saveToFirebase(`trainings/${CURRENT_USER.name}`, exercises);
        }
    }
}

function increaseLoad(exerciseId) {
    const exercises = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEMO_DATA;
    let found = false;
    
    Object.keys(exercises).forEach(group => {
        const ex = exercises[group].find(e => e.id === exerciseId);
        if (ex) {
            const currentLoad = parseFloat(ex.load) || 0;
            ex.load = (currentLoad + 1) + 'kg';
            document.getElementById(`load-${exerciseId}`).textContent = ex.load;
            found = true;
        }
    });
    
    if (found) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
        // Sincronizar com Firebase
        if (firebaseReady && CURRENT_USER) {
            saveToFirebase(`trainings/${CURRENT_USER.name}`, exercises);
        }
    }
}

function decreaseLoad(exerciseId) {
    const exercises = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEMO_DATA;
    let found = false;
    
    Object.keys(exercises).forEach(group => {
        const ex = exercises[group].find(e => e.id === exerciseId);
        if (ex) {
            const currentLoad = parseFloat(ex.load) || 0;
            if (currentLoad > 0) {
                ex.load = (currentLoad - 1) + 'kg';
                document.getElementById(`load-${exerciseId}`).textContent = ex.load;
                found = true;
            }
        }
    });
    
    if (found) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
        // Sincronizar com Firebase
        if (firebaseReady && CURRENT_USER) {
            saveToFirebase(`trainings/${CURRENT_USER.name}`, exercises);
        }
    }
}

function toggleComplete(group, id) {
    if (USE_DATABASE) {
        const completed = event.target.checked;
        
        fetch(`${API_URL}?action=completar&usuario_id=${USUARIO_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario_id: USUARIO_ID,
                exercicio_id: id,
                completado: completed ? 1 : 0
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                loadTraining();
            } else {
                console.error('Erro ao atualizar exercício:', data.erro);
                loadTraining();
            }
        })
        .catch(error => console.error('Erro:', error));
    } else {
        // Atualizar em ambos os localStorage: STORAGE_KEY e training_${username}
        let exercises = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        let userTraining = null;
        
        if (CURRENT_USER) {
            userTraining = JSON.parse(localStorage.getItem(`training_${CURRENT_USER.username}`)) || {};
        }
        
        // Atualizar no STORAGE_KEY (para compatibilidade)
        if (exercises[group]) {
            const ex = exercises[group].find(e => e.id === id);
            if (ex) {
                ex.completed = !ex.completed;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
            }
        }
        
        // Sincronizar com Firebase
        if (firebaseReady && CURRENT_USER) {
            saveToFirebase(`trainings/${CURRENT_USER.name}`, exercises);
        }
        
        // Verifica se todos os exercícios foram concluídos
        checkIfWorkoutComplete(exercises);
        
        loadTraining();
    }
}

function resetAllExercises() {
    if (confirm('Tem certeza que deseja resetar todos os exercícios? ⚠️')) {
        if (USE_DATABASE) {
            fetch(`${API_URL}?action=resetar&usuario_id=${USUARIO_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario_id: USUARIO_ID })
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    loadTraining();
                } else {
                    console.error('Erro ao resetar:', data.erro);
                }
            })
            .catch(error => console.error('Erro:', error));
        } else {
            const exercises = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEMO_DATA;
            Object.keys(exercises).forEach(group => {
                exercises[group].forEach(ex => {
                    ex.completed = false;
                });
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
            loadTraining();
        }
    }
}

function escapeHtml(text) {
    const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Modal para vídeos locais
function showVideoModal(videoPath) {
    if (!videoPath) return;
    
    const modal = document.createElement('div');
    modal.id = 'videoModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="position: relative; width: 90%; max-width: 800px;">
            <button onclick="document.getElementById('videoModal').remove()" style="
                position: absolute;
                top: -40px;
                right: 0;
                background: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                z-index: 1001;
            ">✕</button>
            <video width="100%" height="auto" controls autoplay style="border-radius: 8px; max-height: 80vh;">
                <source src="${videoPath}" type="video/mp4">
                Seu navegador não suporta vídeo HTML5.
            </video>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// ============ FUNÇÕES DE TIMER DE TREINO ============

function startTrainingTimer() {
    const storageKey = `training_session_${CURRENT_USER.name}`;
    const today = new Date().toDateString();
    
    // Verifica se já existe uma sessão hoje
    let sessionData = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    if (sessionData.date !== today) {
        // Nova sessão do dia
        sessionData = {
            date: today,
            startTime: Date.now(),
            elapsedSeconds: 0
        };
    } else {
        // Sessão continua do mesmo dia
        sessionStartTime = sessionData.startTime;
        sessionElapsedSeconds = sessionData.elapsedSeconds;
    }
    
    // Inicia o timer que atualiza a cada segundo
    updateTimerDisplay();
    
    trainingTimer = setInterval(() => {
        const now = Date.now();
        const totalSeconds = Math.floor((now - sessionData.startTime) / 1000) + sessionData.elapsedSeconds;
        sessionElapsedSeconds = totalSeconds;
        
        // Salva o progresso a cada 5 segundos
        if (totalSeconds % 5 === 0) {
            sessionData.elapsedSeconds = totalSeconds;
            localStorage.setItem(storageKey, JSON.stringify(sessionData));
            
            // Sincroniza com Firebase
            if (firebaseReady && USE_FIREBASE) {
                saveToFirebase(`sessions/${CURRENT_USER.name}/current`, {
                    date: today,
                    elapsedSeconds: totalSeconds,
                    timestamp: Date.now()
                });
            }
        }
        
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(sessionElapsedSeconds / 3600);
    const minutes = Math.floor((sessionElapsedSeconds % 3600) / 60);
    const seconds = sessionElapsedSeconds % 60;
    
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timeElement = document.getElementById('timeElapsed');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

function stopTrainingTimer() {
    if (trainingTimer) {
        clearInterval(trainingTimer);
        trainingTimer = null;
    }
}

// ============ FUNÇÕES DE CONCLUSÃO DE TREINO ============

function checkIfWorkoutComplete(exercises) {
    // Conta total e concluídos
    let totalExercises = 0;
    let completedExercises = 0;
    
    Object.keys(exercises).forEach(group => {
        if (Array.isArray(exercises[group])) {
            exercises[group].forEach(ex => {
                totalExercises++;
                if (ex.completed) completedExercises++;
            });
        }
    });
    
    // Se todos os exercícios foram concluídos
    if (totalExercises > 0 && completedExercises === totalExercises) {
        setTimeout(() => {
            showWorkoutSummary();
        }, 500);
    }
}

function showWorkoutSummary() {
    const exercises = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const customTraining = JSON.parse(localStorage.getItem(`custom_training_${CURRENT_USER.name}`)) || {};
    
    // Calcula dados do treino
    const trainingStats = calculateTrainingStats(exercises, customTraining);
    const weekStats = getWeekTrainingStats();
    
    const summaryHtml = `
        <div class="workout-summary-modal">
            <div class="workout-summary-content">
                <button class="close-summary" onclick="closeSummary()">✕</button>
                
                <div class="summary-header">
                    <h1>🎉 Parabéns!</h1>
                    <p>Treino Concluído com Sucesso</p>
                </div>
                
                <div class="summary-body">
                    <div class="summary-section">
                        <h2>📊 Resumo de Hoje</h2>
                        <div class="summary-stats">
                            <div class="stat-item">
                                <div class="stat-icon">✓</div>
                                <div class="stat-info">
                                    <span class="stat-label">Exercícios</span>
                                    <span class="stat-value">${trainingStats.totalExercises}</span>
                                </div>
                            </div>
                            
                            <div class="stat-item">
                                <div class="stat-icon">⏱️</div>
                                <div class="stat-info">
                                    <span class="stat-label">Tempo Total</span>
                                    <span class="stat-value">${trainingStats.time}</span>
                                </div>
                            </div>
                            
                            <div class="stat-item">
                                <div class="stat-icon">🏋️</div>
                                <div class="stat-info">
                                    <span class="stat-label">Carga Total</span>
                                    <span class="stat-value">${trainingStats.totalLoad}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="summary-section">
                        <h2>📅 Esta Semana</h2>
                        <div class="week-stats">
                            <div class="week-badge">
                                <span class="week-number">${weekStats.trainingDays}</span>
                                <span class="week-label">Dias de Treino</span>
                            </div>
                            <div class="week-chart">
                                ${generateWeekChart(weekStats.dailyTrainings)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="summary-actions">
                        <button class="btn-finish" onclick="finishSummary()">Finalizar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove modal anterior se existir
    const oldModal = document.querySelector('.workout-summary-modal');
    if (oldModal) oldModal.remove();
    
    document.body.innerHTML += summaryHtml;
}

function calculateTrainingStats(exercises, customTraining) {
    let totalExercises = 0;
    let totalLoadValue = 0;
    let totalLoadUnit = 'kg';
    
    Object.keys(exercises).forEach(group => {
        if (Array.isArray(exercises[group])) {
            exercises[group].forEach(ex => {
                if (ex.completed) {
                    totalExercises++;
                    
                    // Extrai carga customizada ou padrão
                    const customLoad = customTraining[ex.id]?.load || ex.load || '0kg';
                    const loadMatch = customLoad.match(/(\d+(?:\.\d+)?)/);
                    if (loadMatch) {
                        totalLoadValue += parseFloat(loadMatch[1]);
                    }
                }
            });
        }
    });
    
    const hours = Math.floor(sessionElapsedSeconds / 3600);
    const minutes = Math.floor((sessionElapsedSeconds % 3600) / 60);
    
    return {
        totalExercises: totalExercises,
        time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
        totalLoad: `${Math.round(totalLoadValue)} ${totalLoadUnit}`
    };
}

function getWeekTrainingStats() {
    const storageKey = `training_session_${CURRENT_USER.name}`;
    const today = new Date();
    const weekDays = {};
    let trainingDays = 0;
    
    // Verifica últimos 7 dias
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        const session = JSON.parse(localStorage.getItem(storageKey));
        if (session && session.date === dateStr && session.elapsedSeconds > 0) {
            weekDays[i] = true;
            trainingDays++;
        } else {
            weekDays[i] = false;
        }
    }
    
    return {
        trainingDays: trainingDays,
        dailyTrainings: weekDays
    };
}

function generateWeekChart(dailyTrainings) {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const today = new Date().getDay();
    
    let chart = '<div class="week-day-chart">';
    
    // Mostra os últimos 7 dias na ordem inversa
    for (let i = 6; i >= 0; i--) {
        const hasTraining = dailyTrainings[i];
        const dayIndex = (today - (6 - i) + 7) % 7;
        const dayName = days[dayIndex];
        
        chart += `
            <div class="day-bar ${hasTraining ? 'trained' : ''}">
                <div class="bar-fill"></div>
                <span class="day-label">${dayName}</span>
            </div>
        `;
    }
    
    chart += '</div>';
    return chart;
}

function closeSummary() {
    const modal = document.querySelector('.workout-summary-modal');
    if (modal) modal.remove();
}

function finishSummary() {
    closeSummary();
    
    // Salva a sessão completada no Firebase
    if (firebaseReady && USE_FIREBASE && CURRENT_USER) {
        const storageKey = `training_session_${CURRENT_USER.name}`;
        const sessionData = JSON.parse(localStorage.getItem(storageKey)) || {};
        
        // Salva no histórico de sessões
        const historyKey = `sessions/${CURRENT_USER.name}/${new Date().toISOString().split('T')[0]}`;
        saveToFirebase(historyKey, {
            ...sessionData,
            completedAt: new Date().toISOString(),
            exercises: JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
        });
        
        console.log('✅ Treino salvo no Firebase:', historyKey);
    }
    
    // Passar para o próximo treino na sequência A->B->C->D->A
    const currentTreino = localStorage.getItem('selectedTreino') || 'A';
    const treinoSequence = ['A', 'B', 'C', 'D'];
    const currentIndex = treinoSequence.indexOf(currentTreino);
    const nextIndex = (currentIndex + 1) % treinoSequence.length;
    const nextTreino = treinoSequence[nextIndex];
    
    console.log(`📅 Passando de ${currentTreino} para ${nextTreino}`);
    localStorage.setItem('selectedTreino', nextTreino);
    
    // Reseta o treino para o próximo dia
    resetAllExercises();
    
    // Recarrega a página para mostrar o próximo treino
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// ============ SELETOR DE TREINO ============

function showTreinoSelector() {
    // Remove modal anterior se existir
    let modal = document.getElementById('changeTreinoModal');
    if (modal) {
        modal.remove();
    }
    
    // Cria novo modal
    modal = document.createElement('div');
    modal.id = 'changeTreinoModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <h2 style="color: #1a3a52; margin-bottom: 10px;">Selecione seu Treino</h2>
            <p style="color: #666; margin-bottom: 25px;">Escolha qual treino você quer fazer agora</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <button onclick="switchTreino('A')" style="padding: 20px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
                    📅 TREINO A<br><small>Push Pesado</small>
                </button>
                <button onclick="switchTreino('B')" style="padding: 20px; background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
                    📅 TREINO B<br><small>Pull Pesado</small>
                </button>
                <button onclick="switchTreino('C')" style="padding: 20px; background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
                    📅 TREINO C<br><small>Push Moderado</small>
                </button>
                <button onclick="switchTreino('D')" style="padding: 20px; background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
                    📅 TREINO D<br><small>Pernas+Pull Leve</small>
                </button>
            </div>
            <button onclick="closeTreinoSelector()" style="width: 100%; padding: 10px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Cancelar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeTreinoSelector() {
    const modal = document.getElementById('changeTreinoModal');
    if (modal) {
        modal.remove();
    }
}

function switchTreino(treino) {
    console.log(`✅ Alternando para treino ${treino}`);
    localStorage.setItem('selectedTreino', treino);
    closeTreinoSelector();
    
    // Limpar dados de treino anterior (tanto user-specific quanto global)
    if (CURRENT_USER) {
        // Limpar treino específico do usuário para que use DEMO_DATA
        localStorage.removeItem(`training_${CURRENT_USER.username}`);
        localStorage.removeItem(`custom_training_${CURRENT_USER.username}`);
        console.log(`🧹 Limpando treino anterior de ${CURRENT_USER.username}`);
    }
    
    // Usar DEMO_DATA limpo (sem user training específico)
    let exercises = JSON.parse(JSON.stringify(DEMO_DATA));
    
    // Resetar todos os exercícios como não completados
    Object.keys(exercises).forEach(group => {
        if (Array.isArray(exercises[group])) {
            exercises[group].forEach(ex => {
                ex.completed = false;
            });
        }
    });
    
    // Salvar a estrutura limpa
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
    console.log(`💾 Salvando estrutura limpa de DEMO_DATA para ${treino}`);
    
    // Sincronizar com Firebase
    if (firebaseReady && CURRENT_USER) {
        saveToFirebase(`trainings/${CURRENT_USER.name}`, exercises);
    }
    
    console.log(`📚 Recarregando treino ${treino}`);
    // Recarrega o treino
    setTimeout(() => {
        loadTraining();
    }, 100);
}
    }, 100);
}

function showInitialTreinoSelector() {
    // Cria um modal de seleção inicial de treino (após login)
    const container = document.querySelector('.container');
    if (!container) return;
    
    const modal = document.createElement('div');
    modal.id = 'initialTreinoModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 50px 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); width: 90%; max-width: 550px; text-align: center;">
            <div style="font-size: 4em; margin-bottom: 25px;">📅</div>
            <h1 style="color: #1a3a52; margin-bottom: 15px; font-size: 2em;">Qual treino você quer fazer?</h1>
            <p style="color: #666; margin-bottom: 35px; font-size: 1em;">Escolha o treino de hoje</p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                <button onclick="selectInitialTreino('A')" style="padding: 25px 15px; background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%); color: white; border: none; border-radius: 10px; font-size: 1.1em; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
                    📅 TREINO A<br><small style="font-size: 0.75em; opacity: 0.9;">Push Pesado</small>
                </button>
                <button onclick="selectInitialTreino('B')" style="padding: 25px 15px; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white; border: none; border-radius: 10px; font-size: 1.1em; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
                    📅 TREINO B<br><small style="font-size: 0.75em; opacity: 0.9;">Pull Pesado</small>
                </button>
                <button onclick="selectInitialTreino('C')" style="padding: 25px 15px; background: linear-gradient(135deg, #ffa502 0%, #ff8a3d 100%); color: white; border: none; border-radius: 10px; font-size: 1.1em; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
                    📅 TREINO C<br><small style="font-size: 0.75em; opacity: 0.9;">Push Moderado</small>
                </button>
                <button onclick="selectInitialTreino('D')" style="padding: 25px 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 1.1em; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
                    📅 TREINO D<br><small style="font-size: 0.75em; opacity: 0.9;">Pernas + Pull</small>
                </button>
            </div>
            
            <button onclick="handleLogout()" style="width: 100%; padding: 12px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Sair</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectInitialTreino(treino) {
    console.log(`✅ Treino selecionado inicialmente: ${treino}`);
    localStorage.setItem('selectedTreino', treino);
    
    // Remove modal e recarrega
    const modal = document.getElementById('initialTreinoModal');
    if (modal) modal.remove();
    
    // Reinicializa a página com o treino selecionado
    window.location.reload();
}

// Fechar modal ao clicar fora dele
document.addEventListener('click', function(event) {
    const modal = document.getElementById('changeTreinoModal');
    if (modal && event.target === modal) {
        closeTreinoSelector();
    }
});

// ============ GARANTIR FUNÇÕES GLOBAIS ============
// Expor funções para o HTML (onclick)
window.handleLogout = handleLogout;
window.showTreinoSelector = showTreinoSelector;
window.resetAllExercises = resetAllExercises;
window.toggleComplete = toggleComplete;
window.showVideoModal = showVideoModal;
window.saveLoad = saveLoad;
window.switchTreino = switchTreino;
window.selectInitialTreino = selectInitialTreino;

window.addEventListener('load', init);
