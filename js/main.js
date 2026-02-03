const STORAGE_KEY = 'academia_treino';

// Mapa de imagens dos exercícios (SVG inline como data URI)
const exerciseImages = {
    'Supino Reto Máquina': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg1%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23ff6b6b%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23ee5a6f%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg1)%22/%3E%3Crect x=%2220%22 y=%22140%22 width=%22160%22 height=%2215%22 fill=%22%23333%22 rx=%223%22/%3E%3Ccircle cx=%22100%22 cy=%2260%22 r=%2215%22 fill=%22%23fff%22/%3E%3Cline x1=%2270%22 y1=%2280%22 x2=%2240%22 y2=%2270%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3Cline x1=%22130%22 y1=%2280%22 x2=%22160%22 y2=%2270%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3Crect x=%2235%22 y=%2265%22 width=%22130%22 height=%228%22 fill=%22%23ffd700%22 rx=%224%22/%3E%3Ccircle cx=%2235%22 cy=%2269%22 r=%227%22 fill=%22%23ffed4e%22/%3E%3Ccircle cx=%22165%22 cy=%2269%22 r=%227%22 fill=%22%23ffed4e%22/%3E%3Crect x=%2290%22 y=%2280%22 width=%2220%22 height=%2260%22 fill=%22%23fff%22 rx=%223%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2211%22 fill=%22%23fff%22 text-anchor=%22middle%22%3ESUPINO RETO%3C/text%3E%3C/svg%3E',
    'Supino Inclinado com Halteres': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg2%22%3E%3Cstop offset=%220%25%22 stop-color=%22%234ecdc4%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%2344a08d%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg2)%22/%3E%3Cpolygon points=%2220,160 40,140 160,140 180,160%22 fill=%22%23333%22/%3E%3Ccircle cx=%22100%22 cy=%2270%22 r=%2215%22 fill=%22%23fff%22/%3E%3Cline x1=%2265%22 y1=%2290%22 x2=%2235%22 y2=%2265%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3Cline x1=%22135%22 y1=%2290%22 x2=%22165%22 y2=%2265%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3Crect x=%2235%22 y=%2260%22 width=%22130%22 height=%228%22 fill=%22%23ffd700%22 rx=%224%22/%3E%3Ccircle cx=%2235%22 cy=%2264%22 r=%226%22 fill=%22%23ffed4e%22/%3E%3Ccircle cx=%22165%22 cy=%2264%22 r=%226%22 fill=%22%23ffed4e%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2211%22 fill=%22%23fff%22 text-anchor=%22middle%22%3ESUPINO INCLINADO%3C/text%3E%3C/svg%3E',
    'Crucifixo na Polia Média': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg3%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23f093fb%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23f5576c%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg3)%22/%3E%3Ccircle cx=%22100%22 cy=%2270%22 r=%2214%22 fill=%22%23fff%22/%3E%3Cline x1=%2240%22 y1=%2260%22 x2=%2220%22 y2=%2240%22 stroke=%22%23333%22 stroke-width=%223%22/%3E%3Cline x1=%22160%22 y1=%2260%22 x2=%22180%22 y2=%2240%22 stroke=%22%23333%22 stroke-width=%223%22/%3E%3Cline x1=%2250%22 y1=%22100%22 x2=%2230%22 y2=%2280%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3Cline x1=%22150%22 y1=%22100%22 x2=%22170%22 y2=%2280%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3Cpath d=%22M 45 110 Q 100 140 155 110%22 stroke=%22%23fff%22 stroke-width=%2220%22 fill=%22none%22 opacity=%220.6%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2211%22 fill=%22%23fff%22 text-anchor=%22middle%22%3ECRUCIFIXO POLIA%3C/text%3E%3C/svg%3E',
    'Desenvolvimento Máquina (Pegada Neutra)': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg4%22%3E%3Cstop offset=%220%25%22 stop-color=%22%234facfe%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%2300f2fe%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg4)%22/%3E%3Ccircle cx=%22100%22 cy=%2250%22 r=%2214%22 fill=%22%23fff%22/%3E%3Cline x1=%2275%22 y1=%2270%22 x2=%2245%22 y2=%2245%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3Cline x1=%22125%22 y1=%2270%22 x2=%22155%22 y2=%2245%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3Crect x=%2240%22 y=%2240%22 width=%22120%22 height=%228%22 fill=%22%23ffd700%22 rx=%224%22/%3E%3Ccircle cx=%2240%22 cy=%2244%22 r=%226%22 fill=%22%23ffed4e%22/%3E%3Ccircle cx=%22160%22 cy=%2244%22 r=%226%22 fill=%22%23ffed4e%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2210%22 fill=%22%23fff%22 text-anchor=%22middle%22%3EDESENVOLVIMENTO%3C/text%3E%3C/svg%3E',
    'Tríceps Francês na Polia com Corda': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg5%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23fa709a%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23fee140%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg5)%22/%3E%3Ccircle cx=%22100%22 cy=%2260%22 r=%2214%22 fill=%22%23fff%22/%3E%3Cline x1=%22100%22 y1=%2275%22 x2=%22100%22 y2=%22120%22 stroke=%22%23fff%22 stroke-width=%225%22/%3E%3Cpath d=%22M 85 100 Q 70 115 70 140%22 stroke=%22%23fff%22 stroke-width=%225%22 fill=%22none%22/%3E%3Cpath d=%22M 115 100 Q 130 115 130 140%22 stroke=%22%23fff%22 stroke-width=%225%22 fill=%22none%22/%3E%3Cline x1=%2250%22 y1=%2250%22 x2=%2250%22 y2=%22160%22 stroke=%22%23333%22 stroke-width=%224%22/%3E%3Cline x1=%22150%22 y1=%2250%22 x2=%22150%22 y2=%22160%22 stroke=%22%23333%22 stroke-width=%224%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2211%22 fill=%22%23fff%22 text-anchor=%22middle%22%3ETRICEPS FRANCES%3C/text%3E%3C/svg%3E',
    'Puxada Frontal': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg6%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23a8edea%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23fed6e3%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg6)%22/%3E%3Cline x1=%2260%22 y1=%2230%22 x2=%2260%22 y2=%22160%22 stroke=%22%23333%22 stroke-width=%223%22/%3E%3Cline x1=%22140%22 y1=%2230%22 x2=%22140%22 y2=%22160%22 stroke=%22%23333%22 stroke-width=%223%22/%3E%3Cline x1=%2260%22 y1=%2230%22 x2=%22140%22 y2=%2230%22 stroke=%22%23333%22 stroke-width=%224%22/%3E%3Ccircle cx=%22100%22 cy=%2270%22 r=%2214%22 fill=%22%23fff%22/%3E%3Cpath d=%22M 70 90 L 50 120%22 stroke=%22%23fff%22 stroke-width=%225%22/%3E%3Cpath d=%22M 130 90 L 150 120%22 stroke=%22%23fff%22 stroke-width=%225%22/%3E%3Crect x=%2255%22 y=%2290%22 width=%2290%22 height=%228%22 fill=%22%23ffd700%22 rx=%224%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23333%22 text-anchor=%22middle%22%3EPUXADA FRONTAL%3C/text%3E%3C/svg%3E',
    'Rosca Direta': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg7%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23ff9a56%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23ff6a88%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg7)%22/%3E%3Ccircle cx=%22100%22 cy=%2260%22 r=%2214%22 fill=%22%23fff%22/%3E%3Crect x=%2285%22 y=%2280%22 width=%2230%22 height=%2250%22 fill=%22%23fff%22 opacity=%220.7%22/%3E%3Cpath d=%22M 70 100 Q 55 110 55 140%22 stroke=%22%23fff%22 stroke-width=%225%22 fill=%22none%22/%3E%3Cpath d=%22M 130 100 Q 145 110 145 140%22 stroke=%22%23fff%22 stroke-width=%225%22 fill=%22none%22/%3E%3Ccircle cx=%2255%22 cy=%22145%22 r=%227%22 fill=%22%23ffd700%22/%3E%3Ccircle cx=%22145%22 cy=%22145%22 r=%227%22 fill=%22%23ffd700%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23fff%22 text-anchor=%22middle%22%3EROSCA DIRETA%3C/text%3E%3C/svg%3E',
    'Agachamento': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg8%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23667eea%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23764ba2%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg8)%22/%3E%3Ccircle cx=%22100%22 cy=%2260%22 r=%2214%22 fill=%22%23fff%22/%3E%3Crect x=%2290%22 y=%2280%22 width=%2220%22 height=%2235%22 fill=%22%23fff%22 rx=%223%22/%3E%3Cpath d=%22M 75 115 L 65 160%22 stroke=%22%23fff%22 stroke-width=%225%22/%3E%3Cpath d=%22M 125 115 L 135 160%22 stroke=%22%23fff%22 stroke-width=%225%22/%3E%3Crect x=%2245%22 y=%2230%22 width=%22110%22 height=%228%22 fill=%22%23ffd700%22 rx=%224%22/%3E%3Ccircle cx=%2260%22 cy=%22160%22 r=%228%22 fill=%22%23fff%22/%3E%3Ccircle cx=%22140%22 cy=%22160%22 r=%228%22 fill=%22%23fff%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23fff%22 text-anchor=%22middle%22%3EAGACHAMENTO%3C/text%3E%3C/svg%3E',
    'Leg Press': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 240%22%3E%3Cdefs%3E%3ClinearGradient id=%22bg9%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23f093fb%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23f5576c%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22200%22 height=%22240%22 fill=%22url(%23bg9)%22/%3E%3Cpolygon points=%22160,80 170,100 170,170 160,180%22 fill=%22%23333%22/%3E%3Ccircle cx=%22100%22 cy=%22100%22 r=%2214%22 fill=%22%23fff%22/%3E%3Crect x=%2285%22 y=%22120%22 width=%2230%22 height=%2240%22 fill=%22%23fff%22 opacity=%220.7%22/%3E%3Cpath d=%22M 70 150 L 55 140 L 50 160 L 65 170%22 stroke=%22%23fff%22 stroke-width=%225%22 fill=%22none%22/%3E%3Cpath d=%22M 130 150 L 145 140 L 150 160 L 135 170%22 stroke=%22%23fff%22 stroke-width=%225%22 fill=%22none%22/%3E%3Crect x=%2240%22 y=%22135%22 width=%22120%22 height=%2212%22 fill=%22%23ffd700%22 rx=%224%22/%3E%3Ctext x=%22100%22 y=%22220%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23fff%22 text-anchor=%22middle%22%3ELEG PRESS%3C/text%3E%3C/svg%3E'
};

const DEMO_DATA = {
    push: [
        {
            id: 1,
            name: 'Supino Reto Máquina',
            series: '3x12 drop set',
            load: '10-15',
            interval: '50s',
            instructions: '+3 séries normais (10-12 repetições), na última série + drop set, Reduz 30% da carga + continua até a falha, Reduz mais 30% + continua até a falha',
            image: exerciseImages['Supino Reto Máquina'],
            completed: false
        },
        {
            id: 2,
            name: 'Supino Inclinado com Halteres',
            series: '3x10/10/6',
            load: '10-15',
            interval: '50s',
            instructions: '+3 blocos: 1ª vez: 10 repetições (mesma carga), 2ª vez: 10 repetições (com carga maior, cerca de +20%), 3ª vez: 6 repetições (com carga maior, cerca de +20%)',
            image: exerciseImages['Supino Inclinado com Halteres'],
            completed: false
        },
        {
            id: 3,
            name: 'Crucifixo na Polia Média',
            series: '1x25',
            load: '25kg',
            interval: '50s',
            instructions: '1 série só, com 20-25 repetições contínuas, carga leve-moderada, foco em alongar e contrair bem o peitoral.',
            image: exerciseImages['Crucifixo na Polia Média'],
            completed: false
        },
        {
            id: 4,
            name: 'Desenvolvimento Máquina (Pegada Neutra)',
            series: '4x12',
            load: '25kg',
            interval: '50s',
            instructions: 'Suba os halteres acima da cabeça com controle.',
            image: exerciseImages['Desenvolvimento Máquina (Pegada Neutra)'],
            completed: false
        },
        {
            id: 5,
            name: 'Tríceps Francês na Polia com Corda',
            series: '4x12',
            load: '25kg',
            interval: '50s',
            instructions: 'Cotovelos fixos. Estenda completamente os braços no final.',
            image: exerciseImages['Tríceps Francês na Polia com Corda'],
            completed: false
        }
    ],
    pull: [
        {
            id: 6,
            name: 'Puxada Frontal',
            series: '4x8-10',
            load: '50kg',
            interval: '60s',
            instructions: 'Puxe até o peito. Mantenha o peito erguido e puxe com a escápula.',
            image: exerciseImages['Puxada Frontal'],
            completed: false
        },
        {
            id: 7,
            name: 'Rosca Direta',
            series: '3x8-10',
            load: '15kg',
            interval: '60s',
            instructions: 'Cotovelos fixos na lateral. Movimento só do antebraço.',
            image: exerciseImages['Rosca Direta'],
            completed: false
        }
    ],
    legs: [
        {
            id: 8,
            name: 'Agachamento',
            series: '4x8-10',
            load: '80kg',
            interval: '90s',
            instructions: 'Joelhos acompanham a direção dos pés. Peito para cima durante todo o movimento.',
            image: exerciseImages['Agachamento'],
            completed: false
        },
        {
            id: 9,
            name: 'Leg Press',
            series: '4x8-10',
            load: '120kg',
            interval: '60s',
            instructions: 'Pés ligeiramente afastados. Não tranque os joelhos na extensão total.',
            image: exerciseImages['Leg Press'],
            completed: false
        }
    ]
};

function init() {
    // Limpar localStorage para forçar reload com novos dados
    localStorage.removeItem(STORAGE_KEY);
    initializeDemoData();
    loadTraining();
}

function initializeDemoData() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATA));
    }
}

function loadTraining() {
    const exercises = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEMO_DATA;
    const plan = document.getElementById('trainingPlan');
    
    let html = '';
    let totalExercises = 0;
    let completedExercises = 0;

    const groups = {
        push: '💪 Push',
        pull: '🔙 Pull',
        legs: '🦵 Legs'
    };

    Object.keys(groups).forEach(group => {
        if (exercises[group] && exercises[group].length > 0) {
            html += `<h2 class="section-title">${groups[group]}</h2>`;
            html += '<div class="exercises-grid">';

            exercises[group].forEach(ex => {
                totalExercises++;
                if (ex.completed) completedExercises++;

                const imageHtml = ex.image 
                    ? `<img src="${ex.image}" alt="${ex.name}">`
                    : `<div class="no-image">💪</div>`;

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
                                    <span class="meta-value">${escapeHtml(ex.series)}</span>
                                </div>
                                ${ex.load ? `
                                    <div class="meta-item">
                                        <span class="meta-label">Carga</span>
                                        <span class="meta-value">${escapeHtml(ex.load)}</span>
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
                                <button class="btn-video" onclick="window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent('${escapeHtml(ex.name)}'), '_blank')">📹 Ver Vídeo</button>
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
}

function toggleComplete(group, id) {
    const exercises = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const ex = exercises[group].find(e => e.id === id);
    if (ex) {
        ex.completed = !ex.completed;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
        loadTraining();
    }
}

function escapeHtml(text) {
    const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
    return text.replace(/[&<>"']/g, m => map[m]);
}

window.addEventListener('load', init);
