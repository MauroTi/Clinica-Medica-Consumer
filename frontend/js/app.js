/* ============================================
   CONFIGURAÇÃO E ESTADO GLOBAL
   ============================================ */
const API_URL = 'http://localhost:3001/api';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutos

let state = {
    pacientes: [],
    medicos: [],
    consultas: [],
    charts: {
        especialidadePacientes: null,
        especialidadeMedicos: null,
        statusConsultas: null,
        consultasMedicos: null
    }
};

/* ============================================
   INICIALIZAÇÃO
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Dashboard...');
    
    setupEventListeners();
    await loadAllData();
    initializeCharts();
    startAutoRefresh();
    
    console.log('✅ Dashboard iniciado com sucesso!');
});

/* ============================================
   SETUP DE EVENTOS
   ============================================ */
function setupEventListeners() {
    // Navegação por seções
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
        });
    });

    // Botão atualizar
    document.getElementById('btnAtualizar').addEventListener('click', async (e) => {
        console.log('🔄 Atualizando dados...');
        const btn = e.target.closest('.btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-sync-alt me-1 fa-spin"></i> Atualizando...';
        
        await loadAllData();
        updateAllCharts();
        updateTimestamp();
        
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Atualizar';
    });

    // Busca de pacientes
    document.getElementById('searchPacientes').addEventListener('input', (e) => {
        filterTable('tablePacientes', e.target.value);
    });

    // Busca de médicos
    document.getElementById('searchMedicos').addEventListener('input', (e) => {
        filterTable('tableMedicos', e.target.value);
    });

    // Busca de consultas
    document.getElementById('searchConsultas').addEventListener('input', (e) => {
        filterTable('tableConsultas', e.target.value);
    });
}

/* ============================================
   CARREGAMENTO DE DADOS
   ============================================ */
async function loadAllData() {
    try {
        console.log('📡 Carregando dados da API...');
        console.log('🔗 Endpoint base:', API_URL);
        
        // Carregar dados em paralelo
        const [pacientes, medicos, consultas] = await Promise.all([
            fetchData(`${API_URL}/pacientes`),
            fetchData(`${API_URL}/medicos`),
            fetchData(`${API_URL}/consultas`)
        ]);

        state.pacientes = pacientes || [];
        state.medicos = medicos || [];
        state.consultas = consultas || [];

        console.log('✅ Dados carregados:', {
            pacientes: state.pacientes.length,
            medicos: state.medicos.length,
            consultas: state.consultas.length
        });
        
        console.log('📦 Pacientes:', state.pacientes);
        console.log('📦 Médicos:', state.medicos);
        console.log('📦 Consultas:', state.consultas);

        // Atualizar interface
        updateDashboard();
        renderPacientesTable();
        renderMedicosTable();
        renderConsultasTable();
        updateServerStatus(true);

        return true;
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        updateServerStatus(false);
        showError('Erro ao carregar dados da API');
        return false;
    }
}

async function fetchData(url) {
    try {
        console.log(`🔗 Buscando: ${url}`);
        const response = await fetch(url);
        
        console.log(`📊 Response status: ${response.status} - ${response.statusText}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`✅ Dados recebidos de ${url}:`, data);
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error(`❌ Erro ao buscar ${url}:`, error.message);
        return [];
    }
}

/* ============================================
   ATUALIZAR DASHBOARD
   ============================================ */
function updateDashboard() {
    // Totais
    document.getElementById('totalPacientes').textContent = 
        formatNumber(state.pacientes.length);
    
    document.getElementById('totalMedicos').textContent = 
        formatNumber(state.medicos.length);
    
    document.getElementById('totalConsultas').textContent = 
        formatNumber(state.consultas.length);

    // Consultas hoje
    const hoje = new Date().toISOString().split('T')[0];
    const consultasHoje = state.consultas.filter(c => 
        c.data && c.data.includes(hoje)
    ).length;
    
    document.getElementById('consultasHoje').textContent = 
        formatNumber(consultasHoje);

    // Atualizar timestamp
    updateTimestamp();
}

function updateTimestamp() {
    const now = new Date();
    const formatted = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = formatted;
}

/* ============================================
   RENDERIZAR TABELAS
   ============================================ */
function renderPacientesTable() {
    const tbody = document.getElementById('tablePacientes');
    
    if (state.pacientes.length === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="8" class="py-4">Nenhum paciente encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = state.pacientes.map((p, index) => `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar me-2" style="background: linear-gradient(135deg, #2563eb, #1e40af); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        ${getNomAbreviado(p.nome)}
                    </div>
                    <div>${p.nome || '-'}</div>
                </div>
            </td>
            <td><code>${p.cpf || '-'}</code></td>
            <td>${p.telefone || '-'}</td>
            <td>${p.email || '-'}</td>
            <td>${formatarData(p.data_nascimento)}</td>
            <td><small>${p.endereco || '-'}</small></td>
            <td>
                <button class="btn btn-sm btn-light" onclick="editarPaciente(${p.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-light" onclick="deletarPaciente(${p.id})">
                    <i class="fas fa-trash text-danger"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderMedicosTable() {
    const tbody = document.getElementById('tableMedicos');
    
    if (state.medicos.length === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="7" class="py-4">Nenhum médico encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = state.medicos.map((m, index) => `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar me-2" style="background: linear-gradient(135deg, #10b981, #059669); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        ${getNomAbreviado(m.nome)}
                    </div>
                    <div>${m.nome || '-'}</div>
                </div>
            </td>
            <td><code>${m.crm || '-'}</code></td>
            <td><span class="badge bg-info-light text-info">${m.especialidade || '-'}</span></td>
            <td>${m.telefone || '-'}</td>
            <td>${m.email || '-'}</td>
            <td>
                <button class="btn btn-sm btn-light" onclick="editarMedico(${m.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-light" onclick="deletarMedico(${m.id})">
                    <i class="fas fa-trash text-danger"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderConsultasTable() {
    const tbody = document.getElementById('tableConsultas');
    
    if (state.consultas.length === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="8" class="py-4">Nenhuma consulta encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = state.consultas.map((c, index) => {
        const paciente = state.pacientes.find(p => p.id === c.paciente_id);
        const medico = state.medicos.find(m => m.id === c.medico_id);
        const statusBadge = getStatusBadge(c.status);

        return `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td>${paciente?.nome || 'Desconhecido'}</td>
            <td>${medico?.nome || 'Desconhecido'}</td>
            <td>${formatarData(c.data)}</td>
            <td><code>${c.hora || '-'}</code></td>
            <td>${statusBadge}</td>
            <td><small>${c.motivo || '-'}</small></td>
            <td>
                <button class="btn btn-sm btn-light" onclick="editarConsulta(${c.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-light" onclick="deletarConsulta(${c.id})">
                    <i class="fas fa-trash text-danger"></i>
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/* ============================================
   INICIALIZAR E ATUALIZAR GRÁFICOS
   ============================================ */
function initializeCharts() {
    console.log('📊 Inicializando gráficos...');
    updateAllCharts();
}

function updateAllCharts() {
    createChartEspecialidadePacientes();
    createChartEspecialidadeMedicos();
    createChartStatusConsultas();
    createChartConsultasMedicos();
}

function createChartEspecialidadePacientes() {
    const ctx = document.getElementById('chartEspecialidadePacientes').getContext('2d');
    
    console.log('📊 Criando gráfico de Pacientes por Especialidade...');
    console.log('   Consultas disponíveis:', state.consultas.length);
    console.log('   Dados das consultas:', state.consultas);
    
    // Contar pacientes por especialidade das consultas
    const especialidades = {};
    state.consultas.forEach(c => {
        if (c.especialidade) {
            especialidades[c.especialidade] = (especialidades[c.especialidade] || 0) + 1;
        }
    });

    console.log('   Especialidades encontradas:', especialidades);

    if (state.charts.especialidadePacientes) {
        state.charts.especialidadePacientes.destroy();
    }

    const cores = ['#2563eb', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
    const labels = Object.keys(especialidades);
    const valores = Object.values(especialidades);

    console.log('   Labels:', labels, 'Valores:', valores);

    state.charts.especialidadePacientes = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: cores.slice(0, labels.length),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12, weight: 600 },
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function createChartEspecialidadeMedicos() {
    const ctx = document.getElementById('chartEspecialidadeMedicos').getContext('2d');
    
    const especialidades = {};
    state.medicos.forEach(m => {
        const esp = m.especialidade || 'Não definida';
        especialidades[esp] = (especialidades[esp] || 0) + 1;
    });

    if (state.charts.especialidadeMedicos) {
        state.charts.especialidadeMedicos.destroy();
    }

    const colors = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    state.charts.especialidadeMedicos = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(especialidades),
            datasets: [{
                data: Object.values(especialidades),
                backgroundColor: colors.slice(0, Object.keys(especialidades).length),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12, weight: 600 },
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function createChartStatusConsultas() {
    const ctx = document.getElementById('chartStatusConsultas').getContext('2d');
    
    console.log('📊 Criando gráfico de Status das Consultas...');
    console.log('   Consultas disponíveis:', state.consultas.length);
    console.log('   Dados das consultas:', state.consultas);
    
    const status = {
        'Confirmada': state.consultas.filter(c => c.status === 'confirmada').length,
        'Pendente': state.consultas.filter(c => c.status === 'pendente').length,
        'Cancelada': state.consultas.filter(c => c.status === 'cancelada').length,
        'Realizada': state.consultas.filter(c => c.status === 'realizada').length
    };

    console.log('   Status contados:', status);

    if (state.charts.statusConsultas) {
        state.charts.statusConsultas.destroy();
    }

    state.charts.statusConsultas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(status),
            datasets: [{
                label: 'Quantidade de Consultas',
                data: Object.values(status),
                backgroundColor: [
                    '#10b981', // Verde - Confirmada
                    '#f59e0b', // Amarelo - Pendente
                    '#ef4444', // Vermelho - Cancelada
                    '#2563eb'  // Azul - Realizada
                ],
                borderRadius: 8,
                borderSkipped: false,
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { 
                    display: true,
                    labels: {
                        font: { size: 12, weight: 600 },
                        padding: 15
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function createChartConsultasMedicos() {
    const ctx = document.getElementById('chartConsultasMedicos').getContext('2d');
    
    const consultasPorMedico = {};
    state.consultas.forEach(c => {
        const medico = state.medicos.find(m => m.id === c.medico_id);
        if (medico) {
            consultasPorMedico[medico.nome] = (consultasPorMedico[medico.nome] || 0) + 1;
        }
    });

    // Top 10
    const sorted = Object.entries(consultasPorMedico)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    if (state.charts.consultasMedicos) {
        state.charts.consultasMedicos.destroy();
    }

    state.charts.consultasMedicos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(([nome]) => nome.split(' ')[0]), // Primeiro nome
            datasets: [{
                label: 'Consultas',
                data: sorted.map(([, count]) => count),
                backgroundColor: '#f59e0b',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

/* ============================================
   NAVEGAÇÃO E SEÇÕES
   ============================================ */
function showSection(sectionId) {
    console.log(`📄 Mostrando seção: ${sectionId}`);
    
    // Esconder todas as seções
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('d-none');
    });

    // Mostrar seção selecionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('d-none');
    }

    // Atualizar links da navbar
    document.querySelectorAll('[data-section]').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll(`[data-section="${sectionId}"]`).forEach(link => {
        link.classList.add('active');
    });
}

/* ============================================
   FUNÇÕES UTILITÁRIAS
   ============================================ */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatarData(data) {
    if (!data) return '-';
    try {
        return new Date(data).toLocaleDateString('pt-BR');
    } catch {
        return data;
    }
}

function getNomAbreviado(nome) {
    if (!nome) return '?';
    return nome.split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
}

function getStatusBadge(status) {
    const statusMap = {
        'confirmada': { class: 'bg-success-light text-success', icon: 'fa-check-circle' },
        'pendente': { class: 'bg-warning-light text-warning', icon: 'fa-clock' },
        'cancelada': { class: 'bg-danger-light text-danger', icon: 'fa-times-circle' },
        'realizada': { class: 'bg-info-light text-info', icon: 'fa-check' }
    };

    const s = statusMap[status?.toLowerCase()] || { class: 'bg-gray-light text-muted', icon: 'fa-question' };
    return `<span class="badge ${s.class}"><i class="fas ${s.icon} me-1"></i>${status}</span>`;
}

function filterTable(tableId, searchTerm) {
    const tbody = document.getElementById(tableId);
    const rows = tbody.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

/* ============================================
   STATUS DO SERVIDOR
   ============================================ */
function updateServerStatus(connected) {
    const status = document.getElementById('statusServer');
    if (connected) {
        status.textContent = 'Conectado';
        status.parentElement.querySelector('.fa-circle').className = 'fas fa-circle text-success';
    } else {
        status.textContent = 'Desconectado';
        status.parentElement.querySelector('.fa-circle').className = 'fas fa-circle text-danger';
    }
}

/* ============================================
   AUTO REFRESH
   ============================================ */
function startAutoRefresh() {
    console.log('🔄 Auto-refresh iniciado (5 minutos)');
    setInterval(async () => {
        console.log('🔄 Auto-refresh executado');
        await loadAllData();
        updateAllCharts();
    }, REFRESH_INTERVAL);
}

/* ============================================
   NOTIFICAÇÕES
   ============================================ */
function showError(message) {
    console.error('❌ Erro:', message);
    alert(`Erro: ${message}`);
}

function showSuccess(message) {
    console.log('✅ Sucesso:', message);
    alert(`Sucesso: ${message}`);
}

/* ============================================
   AÇÕES PLACEHOLDER (EDIT/DELETE)
   ============================================ */
function editarPaciente(id) {
    console.log('Editar paciente:', id);
    alert('Funcionalidade em desenvolvimento');
}

function deletarPaciente(id) {
    console.log('Deletar paciente:', id);
    if (confirm('Tem certeza que deseja deletar este paciente?')) {
        alert('Funcionalidade em desenvolvimento');
    }
}

function editarMedico(id) {
    console.log('Editar médico:', id);
    alert('Funcionalidade em desenvolvimento');
}

function deletarMedico(id) {
    console.log('Deletar médico:', id);
    if (confirm('Tem certeza que deseja deletar este médico?')) {
        alert('Funcionalidade em desenvolvimento');
    }
}

function editarConsulta(id) {
    console.log('Editar consulta:', id);
    alert('Funcionalidade em desenvolvimento');
}

function deletarConsulta(id) {
    console.log('Deletar consulta:', id);
    if (confirm('Tem certeza que deseja deletar esta consulta?')) {
        alert('Funcionalidade em desenvolvimento');
    }
}
