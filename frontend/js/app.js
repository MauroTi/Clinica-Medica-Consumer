// =====================
// PAGINAÇÃO DO GRÁFICO DE MÉDICOS
// =====================
let consultasSorted = []; // array completo de médicos ordenados por quantidade de consultas
let currentPage = 0;      // página atual (0 = top 1-10)
const pageSize = 10;      // quantos médicos por página

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
   HELPERS DE COMPATIBILIDADE (BACKEND/CONSUMER)
   ============================================ */
function getConsultaData(consulta) {
    return consulta?.data_consulta || consulta?.data || null;
}

function getConsultaHora(consulta) {
    if (consulta?.hora) return consulta.hora;

    const data = getConsultaData(consulta);
    if (!data) return '-';

    try {
        const dt = new Date(data);
        if (isNaN(dt.getTime())) return '-';

        return dt.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '-';
    }
}

function getConsultaDescricao(consulta) {
    return consulta?.descricao || consulta?.motivo || '-';
}

function getConsultaStatus(consulta) {
    return String(consulta?.status || 'agendada').toLowerCase().trim();
}

function getConsultaStatusLabel(status) {
    const mapa = {
        agendada: 'Agendada',
        pendente: 'Pendente',
        confirmada: 'Confirmada',
        realizada: 'Realizada',
        concluida: 'Concluída',
        cancelada: 'Cancelada',
        faltou: 'Faltou'
    };

    const chave = String(status || 'agendada').toLowerCase().trim();
    return mapa[chave] || (chave.charAt(0).toUpperCase() + chave.slice(1));
}

function getApiErrorMessage(err, fallback = 'Erro na operação') {
    if (!err) return fallback;

    if (typeof err === 'string') return err;

    if (err.message) return err.message;
    if (err.error) return err.error;

    return fallback;
}

function formatarDataParaInput(data) {
    if (!data) return '';

    try {
        const dt = new Date(data);
        if (isNaN(dt.getTime())) return '';

        const ano = dt.getFullYear();
        const mes = String(dt.getMonth() + 1).padStart(2, '0');
        const dia = String(dt.getDate()).padStart(2, '0');
        const hora = String(dt.getHours()).padStart(2, '0');
        const minuto = String(dt.getMinutes()).padStart(2, '0');

        // Como está usando prompt(), manter espaço funciona melhor aqui
        return `${ano}-${mes}-${dia} ${hora}:${minuto}`;
    } catch {
        return '';
    }
}

function getNomePacienteConsulta(c) {
    if (c?.paciente_nome) return c.paciente_nome;
    const paciente = state.pacientes.find(p => Number(p.id) === Number(c?.paciente_id));
    return paciente?.nome || 'Desconhecido';
}

function getNomeMedicoConsulta(c) {
    if (!c) return 'Desconhecido';

    const medicoId = Number(c.medico_id);

    if (Array.isArray(state.medicos) && medicoId) {
        const medico = state.medicos.find(m => Number(m.id) === medicoId);
        if (medico && medico.nome) {
            return medico.nome;
        }
    }

    return c.medico_nome || 'Desconhecido';
}

function getEspecialidadeConsulta(c) {
    if (c?.especialidade) return c.especialidade;
    const medico = state.medicos.find(m => Number(m.id) === Number(c?.medico_id));
    return medico?.especialidade || 'Não definida';
}

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
    const btnAtualizar = document.getElementById('btnAtualizar');
    if (btnAtualizar) {
        btnAtualizar.addEventListener('click', async (e) => {
            console.log('🔄 Atualizando dados...');
            const btn = e.target.closest('.btn') || btnAtualizar;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-sync-alt me-1 fa-spin"></i> Atualizando...';

            try {
                await loadAllData();
                updateAllCharts();
                updateTimestamp();
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Atualizar';
            }
        });
    }

    // Busca de pacientes
    const searchPacientes = document.getElementById('searchPacientes');
    if (searchPacientes) {
        searchPacientes.addEventListener('input', (e) => {
            filterTable('tablePacientes', e.target.value);
        });
    }

    // Busca de médicos
    const searchMedicos = document.getElementById('searchMedicos');
    if (searchMedicos) {
        searchMedicos.addEventListener('input', (e) => {
            filterTable('tableMedicos', e.target.value);
        });
    }

    // Busca de consultas
    const searchConsultas = document.getElementById('searchConsultas');
    if (searchConsultas) {
        searchConsultas.addEventListener('input', (e) => {
            filterTable('tableConsultas', e.target.value);
        });
    }

    // Formulário de paciente
    const formPaciente = document.getElementById('formPaciente');
    if (formPaciente) {
        formPaciente.addEventListener('submit', (e) => {
            e.preventDefault();
            salvarPaciente();
        });
    }

    // Formulário de médico
    const formMedico = document.getElementById('formMedico');
    if (formMedico) {
        formMedico.addEventListener('submit', (e) => {
            e.preventDefault();
            salvarMedico();
        });
    }

    // Botões da paginação do gráfico (se existirem no HTML)
    const btnPrevChart = document.getElementById('btnPrevChart');
    const btnNextChart = document.getElementById('btnNextChart');

    if (btnPrevChart) {
        btnPrevChart.addEventListener('click', prevPage);
    }

    if (btnNextChart) {
        btnNextChart.addEventListener('click', nextPage);
    }
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

        // Resetar paginação/recontagem do gráfico por médico após recarregar dados
        consultasSorted = [];
        currentPage = 0;

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
        showError(getApiErrorMessage(error, 'Erro ao carregar dados da API'));
        return false;
    }
}

async function fetchData(url) {
    console.log(`🔗 Buscando: ${url}`);
    const response = await fetch(url);

    console.log(`📊 Response status: ${response.status} - ${response.statusText}`);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Dados recebidos de ${url}:`, data);
    return Array.isArray(data) ? data : data.data || [];
}

/* ============================================
   ATUALIZAR DASHBOARD
   ============================================ */
function updateDashboard() {
    const totalPacientes = document.getElementById('totalPacientes');
    const totalMedicos = document.getElementById('totalMedicos');
    const totalConsultas = document.getElementById('totalConsultas');
    const consultasHojeEl = document.getElementById('consultasHoje');

    if (totalPacientes) {
        totalPacientes.textContent = formatNumber(state.pacientes.length);
    }

    if (totalMedicos) {
        totalMedicos.textContent = formatNumber(state.medicos.length);
    }

    if (totalConsultas) {
        totalConsultas.textContent = formatNumber(state.consultas.length);
    }

    // Consultas hoje
    const hoje = new Date().toISOString().split('T')[0];
    const consultasHoje = state.consultas.filter(c => {
        const data = getConsultaData(c);
        return data && String(data).includes(hoje);
    }).length;

    if (consultasHojeEl) {
        consultasHojeEl.textContent = formatNumber(consultasHoje);
    }

    // Atualizar timestamp
    updateTimestamp();
}

function updateTimestamp() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (!lastUpdate) return;

    const now = new Date();
    const formatted = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    lastUpdate.textContent = formatted;
}

/* ============================================
   RENDERIZAR TABELAS
   ============================================ */
function renderPacientesTable() {
    const tbody = document.getElementById('tablePacientes');
    if (!tbody) return;

    if (state.pacientes.length === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="5" class="py-4">Nenhum paciente encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = state.pacientes.map((p) => `
        <tr>
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
    if (!tbody) return;

    if (state.medicos.length === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="6" class="py-4">Nenhum médico encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = state.medicos.map((m) => `
        <tr>
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
    if (!tbody) return;

    if (state.consultas.length === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="8" class="py-4">Nenhuma consulta encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = state.consultas.map((c) => {
        const statusBadge = getStatusBadge(getConsultaStatus(c));

        return `
        <tr>
            <td>${getNomePacienteConsulta(c)}</td>
            <td>${getNomeMedicoConsulta(c)}</td>
            <td>${formatarData(getConsultaData(c))}</td>
            <td><code>${getConsultaHora(c)}</code></td>
            <td><span class="badge bg-info-light text-info">${getEspecialidadeConsulta(c)}</span></td>
            <td>${statusBadge}</td>
            <td><small>${getConsultaDescricao(c)}</small></td>
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
    createChartConsultasMedicos(currentPage);
}

function createChartEspecialidadePacientes() {
    const canvas = document.getElementById('chartEspecialidadePacientes');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    console.log('📊 Criando gráfico de Pacientes por Especialidade...');
    console.log('   Consultas disponíveis:', state.consultas.length);
    console.log('   Dados das consultas:', state.consultas);

    // Contar pacientes por especialidade das consultas
    const especialidades = {};
    state.consultas.forEach(c => {
        const esp = getEspecialidadeConsulta(c);
        if (esp) {
            especialidades[esp] = (especialidades[esp] || 0) + 1;
        }
    });

    console.log('   Especialidades encontradas:', especialidades);

    if (state.charts.especialidadePacientes) {
        state.charts.especialidadePacientes.destroy();
    }

    const cores = ['#2563eb', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
    const labels = Object.keys(especialidades);
    const valores = Object.values(especialidades);

    state.charts.especialidadePacientes = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
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
    const canvas = document.getElementById('chartEspecialidadeMedicos');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

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
    const canvas = document.getElementById('chartStatusConsultas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    console.log('📊 Criando gráfico de Status das Consultas...');
    console.log('   Consultas disponíveis:', state.consultas.length);
    console.log('   Dados das consultas:', state.consultas);

    const statusMap = {};

    state.consultas.forEach(c => {
        const chave = getConsultaStatus(c);
        statusMap[chave] = (statusMap[chave] || 0) + 1;
    });

    // Ordem preferencial
    const ordemPreferencial = [
        'agendada',
        'pendente',
        'confirmada',
        'realizada',
        'concluida',
        'cancelada',
        'faltou'
    ];

    const chavesExistentes = Object.keys(statusMap);

    const chavesOrdenadas = [
        ...ordemPreferencial.filter(k => chavesExistentes.includes(k)),
        ...chavesExistentes.filter(k => !ordemPreferencial.includes(k)).sort()
    ];

    const labels = chavesOrdenadas.map(getConsultaStatusLabel);
    const valores = chavesOrdenadas.map(k => statusMap[k]);

    const corPorStatus = {
        agendada: '#6366f1',
        pendente: '#f59e0b',
        confirmada: '#10b981',
        realizada: '#2563eb',
        concluida: '#0ea5e9',
        cancelada: '#ef4444',
        faltou: '#6b7280'
    };

    const backgroundColor = chavesOrdenadas.map(k => corPorStatus[k] || '#94a3b8');

    console.log('   Status contados:', statusMap);

    if (state.charts.statusConsultas) {
        state.charts.statusConsultas.destroy();
    }

    state.charts.statusConsultas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Quantidade de Consultas',
                data: valores,
                backgroundColor,
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
                        stepSize: 1,
                        precision: 0
                    }
                }
            }
        }
    });
}

function createChartConsultasMedicos(page = 0) {
    const canvas = document.getElementById('chartConsultasMedicos');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // =====================
    // CALCULA CONTAGEM POR MÉDICO (APENAS NA PRIMEIRA EXECUÇÃO)
    // =====================
    if (!consultasSorted.length) {
        const consultasPorMedico = {};

        state.consultas.forEach(c => {
            const nomeMedico = getNomeMedicoConsulta(c);
            if (nomeMedico && nomeMedico !== 'Desconhecido') {
                consultasPorMedico[nomeMedico] = (consultasPorMedico[nomeMedico] || 0) + 1;
            }
        });

        // Ordena decrescente por quantidade de consultas, desempate por nome
        consultasSorted = Object.entries(consultasPorMedico)
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'));
    }

    const totalPages = Math.max(1, Math.ceil(consultasSorted.length / pageSize));

    // Garante página válida
    if (page < 0) page = 0;
    if (page > totalPages - 1) page = totalPages - 1;
    currentPage = page;

    // =====================
    // SELECIONA A PÁGINA ATUAL
    // =====================
    const paged = consultasSorted.slice(page * pageSize, (page + 1) * pageSize);

    const labels = paged.map(([nome]) => {
        const partes = String(nome).trim().split(/\s+/);
        return partes.slice(0, 3).join(' '); // pega até 3 palavras do nome
    });

    const valores = paged.map(([, count]) => Number(count));

    // =====================
    // DESTRÓI GRÁFICO EXISTENTE (SE HOUVER)
    // =====================
    if (state.charts.consultasMedicos) {
        state.charts.consultasMedicos.destroy();
    }

    // =====================
    // CRIA O GRÁFICO
    // =====================
    state.charts.consultasMedicos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Consultas',
                data: valores,
                backgroundColor: '#f59e0b',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} consultas`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    }
                },
                y: {
                    ticks: {
                        autoSkip: false
                    }
                }
            }
        }
    });

    // =====================
    // ATUALIZA INFORMAÇÃO DE PÁGINA NO HTML
    // =====================
    const pageInfo = document.getElementById('chartPageInfo');
    if (pageInfo) {
        pageInfo.textContent = `Página ${page + 1} de ${totalPages}`;
    }

    // =====================
    // ATUALIZA BOTÕES DE PAGINAÇÃO (SE EXISTIREM)
    // =====================
    const btnPrev = document.getElementById('btnPrevChart');
    const btnNext = document.getElementById('btnNextChart');

    if (btnPrev) btnPrev.disabled = page <= 0;
    if (btnNext) btnNext.disabled = page >= totalPages - 1 || consultasSorted.length === 0;
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

function nextPage() {
    const totalPages = Math.max(1, Math.ceil(consultasSorted.length / pageSize));
    if (currentPage + 1 < totalPages) {
        currentPage++;
        createChartConsultasMedicos(currentPage);
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        createChartConsultasMedicos(currentPage);
    }
}

/* ============================================
   FUNÇÕES UTILITÁRIAS
   ============================================ */
function formatNumber(num) {
    return Number(num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatarData(data) {
    if (!data) return '-';
    try {
        const dt = new Date(data);
        if (isNaN(dt.getTime())) return String(data);
        return dt.toLocaleDateString('pt-BR');
    } catch {
        return String(data);
    }
}

function getNomAbreviado(nome) {
    if (!nome) return '?';

    return nome.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
}

function getStatusBadge(status) {
    const chave = String(status || 'agendada').toLowerCase().trim();

    const statusMap = {
        agendada: { class: 'bg-primary-light text-primary', icon: 'fa-calendar-plus' },
        confirmada: { class: 'bg-success-light text-success', icon: 'fa-check-circle' },
        pendente: { class: 'bg-warning-light text-warning', icon: 'fa-clock' },
        cancelada: { class: 'bg-danger-light text-danger', icon: 'fa-times-circle' },
        realizada: { class: 'bg-info-light text-info', icon: 'fa-check' },
        concluida: { class: 'bg-info-light text-info', icon: 'fa-check-double' },
        faltou: { class: 'bg-secondary text-white', icon: 'fa-user-slash' }
    };

    const s = statusMap[chave] || { class: 'bg-secondary text-white', icon: 'fa-question' };
    return `<span class="badge ${s.class}"><i class="fas ${s.icon} me-1"></i>${getConsultaStatusLabel(chave)}</span>`;
}

function filterTable(tableId, searchTerm) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    const termo = String(searchTerm || '').toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(termo) ? '' : 'none';
    });
}

/* ============================================
   STATUS DO SERVIDOR
   ============================================ */
function updateServerStatus(connected) {
    const status = document.getElementById('statusServer');
    if (!status || !status.parentElement) return;

    const icon = status.parentElement.querySelector('.fa-circle');

    if (connected) {
        status.textContent = 'Conectado';
        if (icon) icon.className = 'fas fa-circle text-success';
    } else {
        status.textContent = 'Desconectado';
        if (icon) icon.className = 'fas fa-circle text-danger';
    }
}

/* ============================================
   AUTO REFRESH
   ============================================ */
function startAutoRefresh() {
    console.log('🔄 Auto-refresh iniciado (5 minutos)');

    setInterval(async () => {
        console.log('🔄 Auto-refresh executado');
        const ok = await loadAllData();
        if (ok) {
            updateAllCharts();
        }
    }, REFRESH_INTERVAL);
}

/* ============================================
   NOTIFICAÇÕES COM TOAST
   ============================================ */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        alert(message);
        return;
    }

    const toastHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    const toastEl = document.createElement('div');
    toastEl.innerHTML = toastHtml;
    toastContainer.appendChild(toastEl);

    setTimeout(() => {
        toastEl.remove();
    }, 4000);
}

function showError(message) {
    console.error('❌ Erro:', message);
    showToast(`❌ Erro: ${message}`, 'danger');
}

function showSuccess(message) {
    console.log('✅ Sucesso:', message);
    showToast(`✅ ${message}`, 'success');
}

/* ============================================
   ESTADO DE EDIÇÃO
   ============================================ */
let estadoEdicao = {
    paciente: null,
    medico: null
};

/* ============================================
   AÇÕES PACIENTES (EDIT/DELETE COM MODAL)
   ============================================ */
function editarPaciente(id) {
    const paciente = state.pacientes.find(p => Number(p.id) === Number(id));
    if (!paciente) {
        showError('Paciente não encontrado.');
        return;
    }

    estadoEdicao.paciente = paciente.id;

    document.getElementById('pacienteName').value = paciente.nome || '';
    document.getElementById('pacienteIdade').value = paciente.idade || '';
    document.getElementById('pacienteCpf').value = paciente.cpf || '';
    document.getElementById('pacienteTelefone').value = paciente.telefone || '';
    document.getElementById('pacienteEmail').value = paciente.email || '';

    document.getElementById('modalPacienteTitle').textContent = 'Editar Paciente';
    const modal = new bootstrap.Modal(document.getElementById('modalPaciente'));
    modal.show();
}

function deletarPaciente(id) {
    if (!confirm('Tem certeza que deseja deletar este paciente?')) return;

    fetch(`${API_URL}/pacientes/${id}`, {
        method: 'DELETE'
    })
    .then(async (res) => {
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(getApiErrorMessage(err, 'Erro ao deletar paciente'));
        }
    })
    .then(async () => {
        showSuccess('Paciente deletado com sucesso.');
        const ok = await loadAllData();
        if (ok) updateAllCharts();
    })
    .catch(err => showError(err.message));
}

function adicionarPaciente() {
    estadoEdicao.paciente = null;

    document.getElementById('formPaciente').reset();
    document.getElementById('modalPacienteTitle').textContent = 'Adicionar Paciente';

    const modal = new bootstrap.Modal(document.getElementById('modalPaciente'));
    modal.show();
}

function salvarPaciente() {
    const nome = document.getElementById('pacienteName').value.trim();
    const idade = Number(document.getElementById('pacienteIdade').value);
    const cpf = document.getElementById('pacienteCpf').value.trim();
    const telefone = document.getElementById('pacienteTelefone').value.trim();
    const email = document.getElementById('pacienteEmail').value.trim();

    if (!nome || !email || isNaN(idade)) {
        showError('Nome, email e idade válidos são obrigatórios.');
        return;
    }

    const payload = { nome, idade, cpf, telefone, email };
    const method = estadoEdicao.paciente ? 'PUT' : 'POST';
    const url = estadoEdicao.paciente
        ? `${API_URL}/pacientes/${estadoEdicao.paciente}`
        : `${API_URL}/pacientes`;

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(async (res) => {
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(getApiErrorMessage(err, 'Erro ao salvar paciente'));
        }
        return res.json().catch(() => ({}));
    })
    .then(async () => {
        showSuccess(estadoEdicao.paciente ? 'Paciente atualizado com sucesso.' : 'Paciente criado com sucesso.');

        const modalEl = document.getElementById('modalPaciente');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        const ok = await loadAllData();
        if (ok) updateAllCharts();
    })
    .catch(err => showError(err.message));
}

function adicionarConsulta() {
    // Selecionar paciente
    const pacienteOptions = state.pacientes.map(p => `${p.id}: ${p.nome}`).join('\n');
    const pacienteIdInput = prompt(`Selecione o paciente (ID: Nome):\n${pacienteOptions}`);
    if (pacienteIdInput === null) return;
    const paciente_id = Number(pacienteIdInput);

    // Selecionar médico
    const medicoOptions = state.medicos.map(m => `${m.id}: ${m.nome} (${m.especialidade})`).join('\n');
    const medicoIdInput = prompt(`Selecione o médico (ID: Nome (Especialidade)):\n${medicoOptions}`);
    if (medicoIdInput === null) return;
    const medico_id = Number(medicoIdInput);

    // Data da consulta
    const data_consulta = prompt('Data da consulta (YYYY-MM-DD HH:mm):');
    if (data_consulta === null) return;

    // Descrição
    const descricao = prompt('Descrição:');
    if (descricao === null) return;

    // Status
    const status = prompt('Status (agendada, pendente, confirmada, realizada, cancelada, concluida, faltou):', 'agendada');
    if (status === null) return;

    // Observação do status
    const observacao_status = prompt('Observação do status:');
    if (observacao_status === null) return;

    if (!paciente_id || !medico_id || !String(data_consulta).trim()) {
        showError('Paciente, médico e data são obrigatórios.');
        return;
    }

    fetch(`${API_URL}/consultas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            paciente_id,
            medico_id,
            data_consulta: String(data_consulta).trim(),
            descricao: String(descricao).trim(),
            status: String(status).toLowerCase().trim(),
            observacao_status: String(observacao_status).trim()
        })
    })
    .then(async (res) => {
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(getApiErrorMessage(err, 'Erro ao criar consulta'));
        }
        return res.json().catch(() => ({}));
    })
    .then(async () => {
        showSuccess('Consulta criada com sucesso.');
        const ok = await loadAllData();
        if (ok) updateAllCharts();
    })
    .catch(err => showError(err.message));
}

function editarMedico(id) {
    const medico = state.medicos.find(m => Number(m.id) === Number(id));
    if (!medico) {
        showError('Médico não encontrado.');
        return;
    }

    estadoEdicao.medico = medico.id;

    document.getElementById('medicoName').value = medico.nome || '';
    document.getElementById('medicoCrm').value = medico.crm || '';
    document.getElementById('medicoEspecialidade').value = medico.especialidade || '';
    document.getElementById('medicoTelefone').value = medico.telefone || '';
    document.getElementById('medicoEmail').value = medico.email || '';

    document.getElementById('modalMedicoTitle').textContent = 'Editar Médico';
    const modal = new bootstrap.Modal(document.getElementById('modalMedico'));
    modal.show();
}

function deletarMedico(id) {
    if (!confirm('Tem certeza que deseja deletar este médico?')) return;

    fetch(`${API_URL}/medicos/${id}`, {
        method: 'DELETE'
    })
    .then(async (res) => {
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(getApiErrorMessage(err, 'Erro ao deletar médico'));
        }
    })
    .then(async () => {
        showSuccess('Médico deletado com sucesso.');
        const ok = await loadAllData();
        if (ok) updateAllCharts();
    })
    .catch(err => showError(err.message));
}

function adicionarMedico() {
    estadoEdicao.medico = null;

    document.getElementById('formMedico').reset();
    document.getElementById('modalMedicoTitle').textContent = 'Adicionar Médico';

    const modal = new bootstrap.Modal(document.getElementById('modalMedico'));
    modal.show();
}

function salvarMedico() {
    const nome = document.getElementById('medicoName').value.trim();
    const crm = document.getElementById('medicoCrm').value.trim();
    const especialidade = document.getElementById('medicoEspecialidade').value.trim();
    const telefone = document.getElementById('medicoTelefone').value.trim();
    const email = document.getElementById('medicoEmail').value.trim();

    if (!nome || !crm || !especialidade || !email) {
        showError('Todos os campos são obrigatórios.');
        return;
    }

    const payload = { nome, crm, especialidade, telefone, email };
    const method = estadoEdicao.medico ? 'PUT' : 'POST';
    const url = estadoEdicao.medico
        ? `${API_URL}/medicos/${estadoEdicao.medico}`
        : `${API_URL}/medicos`;

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(async (res) => {
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(getApiErrorMessage(err, 'Erro ao salvar médico'));
        }
        return res.json().catch(() => ({}));
    })
    .then(async () => {
        showSuccess(estadoEdicao.medico ? 'Médico atualizado com sucesso.' : 'Médico criado com sucesso.');

        const modalEl = document.getElementById('modalMedico');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        const ok = await loadAllData();
        if (ok) updateAllCharts();
    })
    .catch(err => showError(err.message));
}

function editarConsulta(id) {
    const consulta = state.consultas.find(c => Number(c.id) === Number(id));
    if (!consulta) {
        showError('Consulta não encontrada.');
        return;
    }

    // Selecionar paciente
    const pacienteOptions = state.pacientes.map(p => `${p.id}: ${p.nome}`).join('\n');
    const pacienteIdInput = prompt(
        `Selecione o paciente (ID: Nome):\n${pacienteOptions}\n\nPaciente atual: ${consulta.paciente_id}: ${getNomePacienteConsulta(consulta)}`,
        consulta.paciente_id
    );
    if (pacienteIdInput === null) return;
    const paciente_id = Number(pacienteIdInput);

    // Selecionar médico
    const medicoOptions = state.medicos.map(m => `${m.id}: ${m.nome} (${m.especialidade})`).join('\n');
    const medicoIdInput = prompt(
        `Selecione o médico (ID: Nome (Especialidade)):\n${medicoOptions}\n\nMédico atual: ${consulta.medico_id}: ${getNomeMedicoConsulta(consulta)} (${getEspecialidadeConsulta(consulta)})`,
        consulta.medico_id
    );
    if (medicoIdInput === null) return;
    const medico_id = Number(medicoIdInput);

    // Data da consulta
    const dataAtual = getConsultaData(consulta);
    const data_consulta = prompt(
        'Data da consulta (YYYY-MM-DD HH:mm):',
        formatarDataParaInput(dataAtual) || ''
    );
    if (data_consulta === null) return;

    // Descrição
    const descricao = prompt('Descrição:', getConsultaDescricao(consulta) || '');
    if (descricao === null) return;

    // Status
    const statusOptions = ['agendada', 'pendente', 'confirmada', 'realizada', 'cancelada', 'concluida', 'faltou'];
    const statusInput = prompt(
        `Status (${statusOptions.join(', ')}):`,
        getConsultaStatus(consulta) || 'agendada'
    );
    if (statusInput === null) return;
    const status = String(statusInput).toLowerCase().trim();

    // Observação do status
    const observacao_status = prompt('Observação do status:', consulta.observacao_status || '');
    if (observacao_status === null) return;

    if (!paciente_id || !medico_id || !String(data_consulta).trim()) {
        showError('Paciente, médico e data são obrigatórios.');
        return;
    }

    fetch(`${API_URL}/consultas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            paciente_id,
            medico_id,
            data_consulta: String(data_consulta).trim(),
            descricao: String(descricao).trim(),
            status,
            observacao_status: String(observacao_status).trim()
        })
    })
    .then(async (res) => {
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(getApiErrorMessage(err, 'Erro ao atualizar consulta'));
        }
        return res.json().catch(() => ({}));
    })
    .then(async () => {
        showSuccess('Consulta atualizada com sucesso.');
        const ok = await loadAllData();
        if (ok) updateAllCharts();
    })
    .catch(err => showError(err.message));
}

function deletarConsulta(id) {
    if (!confirm('Tem certeza que deseja deletar esta consulta?')) return;

    fetch(`${API_URL}/consultas/${id}`, {
        method: 'DELETE'
    })
    .then(async (res) => {
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(getApiErrorMessage(err, 'Erro ao deletar consulta'));
        }
    })
    .then(async () => {
        showSuccess('Consulta deletada com sucesso.');
        const ok = await loadAllData();
        if (ok) updateAllCharts();
    })
    .catch(err => showError(err.message));
}