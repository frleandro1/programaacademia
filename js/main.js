const STORAGE_KEY = 'academia_treino';
const DEMO_DATA = {
    push: [
        {
            id: 1,
            name: 'Supino Reto Máquina',
            series: '3x12 drop set',
            load: '10-15',
            interval: '50s',
            instructions: '+3 séries normais (10-12 repetições), na última série + drop set, Reduz 30% da carga + continua até a falha, Reduz mais 30% + continua até a falha',
            image: 'https://via.placeholder.com/120x140?text=Supino',
            completed: false
        },
        {
            id: 2,
            name: 'Supino Inclinado com Halteres',
            series: '3x10/10/6',
            load: '10-15',
            interval: '50s',
            instructions: '+3 blocos: 1ª vez: 10 repetições (mesma carga), 2ª vez: 10 repetições (com carga maior, cerca de +20%), 3ª vez: 6 repetições (com carga maior, cerca de +20%)',
            image: 'https://via.placeholder.com/120x140?text=Supino+Inclinado',
            completed: false
        },
        {
            id: 3,
            name: 'Crucifixo na Polia Média',
            series: '1x25',
            load: '25kg',
            interval: '50s',
            instructions: '1 série só, com 20-25 repetições contínuas, carga leve-moderada, foco em alongar e contrair bem o peitoral.',
            image: 'https://via.placeholder.com/120x140?text=Crucifixo',
            completed: false
        },
        {
            id: 4,
            name: 'Desenvolvimento Máquina (Pegada Neutra)',
            series: '4x12',
            load: '25kg',
            interval: '50s',
            instructions: 'Suba os halteres acima da cabeça com controle.',
            image: 'https://via.placeholder.com/120x140?text=Desenvolvimento',
            completed: false
        },
        {
            id: 5,
            name: 'Tríceps Francês na Polia com Corda',
            series: '4x12',
            load: '25kg',
            interval: '50s',
            instructions: 'Cotovelos fixos. Estenda completamente os braços no final.',
            image: 'https://via.placeholder.com/120x140?text=Triceps',
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
            image: 'https://via.placeholder.com/120x140?text=Puxada',
            completed: false
        },
        {
            id: 7,
            name: 'Rosca Direta',
            series: '3x8-10',
            load: '15kg',
            interval: '60s',
            instructions: 'Cotovelos fixos na lateral. Movimento só do antebraço.',
            image: 'https://via.placeholder.com/120x140?text=Rosca',
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
            image: 'https://via.placeholder.com/120x140?text=Agachamento',
            completed: false
        },
        {
            id: 9,
            name: 'Leg Press',
            series: '4x8-10',
            load: '120kg',
            interval: '60s',
            instructions: 'Pés ligeiramente afastados. Não tranque os joelhos na extensão total.',
            image: 'https://via.placeholder.com/120x140?text=Leg+Press',
            completed: false
        }
    ]
};

function init() {
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
