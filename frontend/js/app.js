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
    },
    pagination: {
        pacientes: { page: 1, pageSize: 10, filtered: [] },
        medicos: { page: 1, pageSize: 10, filtered: [] },
        consultas: { page: 1, pageSize: 10, filtered: [] }
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
    return String(consulta?.status || 'agendada').toLowerCase();
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

function getNomePacienteConsulta(c) {
    if (c?.paciente_nome) return c.paciente_nome;
    const paciente = state.pacientes.find(p => p.id == c.paciente_id);
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
    if (c?.medico_especialidade) return c.medico_especialidade;
    const medico = state.medicos.find(m => m.id == c.medico_id);
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

    // Formulário de paciente
    document.getElementById('formPaciente').addEventListener('submit', (e) => {
        e.preventDefault();
        salvarPaciente();
    });

    // Formulário de médico
    document.getElementById('formMedico').addEventListener('submit', (e) => {
        e.preventDefault();
        salvarMedico();
    });

    // Formulário de consulta
    const formConsulta = document.getElementById('formConsulta');
    if (formConsulta) {
        formConsulta.addEventListener('submit', (e) => {
            e.preventDefault();
            salvarConsulta();
        });
    }
}

/* ============================================
   CARREGAMENTO DE DADOS
   ============================================ */
async function loadAllData() {
    try {
        console.log('📡 Carregando dados da API...');
        console.log('🔗 Endpoint base:', API_URL);
        
        const [pacientes, medicos, consultas] = await Promise.all([
            fetchData(`${API_URL}/pacientes`),
            fetchData(`${API_URL}/medicos`),
            fetchData(`${API_URL}/consultas`)
        ]);

        state.pacientes = pacientes || [];
        state.medicos = medicos || [];
        state.consultas = consultas || [];
        consultasSorted = [];
        currentPage = 0;

        console.log('✅ Dados carregados:', {
            pacientes: state.pacientes.length,
            medicos: state.medicos.length,
            consultas: state.consultas.length
        });
        
        applyAllFiltersAndRender();
        updateDashboard();
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
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
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
    document.getElementById('totalPacientes').textContent = formatNumber(state.pacientes.length);
    document.getElementById('totalMedicos').textContent = formatNumber(state.medicos.length);
    document.getElementById('totalConsultas').textContent = formatNumber(state.consultas.length);
    document.getElementById('consultasHoje').textContent = formatNumber(
        state.consultas.filter(c => {
            const data = getConsultaData(c);
            if (!data) return false;
            const hoje = new Date().toDateString();
            return new Date(data).toDateString() === hoje;
        }).length
    );

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
    const pag = state.pagination.pacientes;
    const lista = Array.isArray(pag.filtered) ? pag.filtered : state.pacientes;
    const total = lista.length;
    const totalPages = Math.max(1, Math.ceil(total / pag.pageSize));

    if (pag.page > totalPages) pag.page = totalPages;
    if (pag.page < 1) pag.page = 1;

    if (total === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="5" class="py-4">Nenhum paciente encontrado</td></tr>';
        renderPaginationControls('pacientes');
        return;
    }

    const start = (pag.page - 1) * pag.pageSize;
    const pagina = lista.slice(start, start + pag.pageSize);

    tbody.innerHTML = pagina.map((p) => `
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
                <button class="btn btn-sm btn-light" onclick="editarPaciente(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-light" onclick="deletarPaciente(${p.id})"><i class="fas fa-trash text-danger"></i></button>
            </td>
        </tr>
    `).join('');

    renderPaginationControls('pacientes');
}

function renderMedicosTable() {
    const tbody = document.getElementById('tableMedicos');
    const pag = state.pagination.medicos;
    const lista = Array.isArray(pag.filtered) ? pag.filtered : state.medicos;
    const total = lista.length;
    const totalPages = Math.max(1, Math.ceil(total / pag.pageSize));

    if (pag.page > totalPages) pag.page = totalPages;
    if (pag.page < 1) pag.page = 1;

    if (total === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="6" class="py-4">Nenhum médico encontrado</td></tr>';
        renderPaginationControls('medicos');
        return;
    }

    const start = (pag.page - 1) * pag.pageSize;
    const pagina = lista.slice(start, start + pag.pageSize);

    tbody.innerHTML = pagina.map((m) => `
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
                <button class="btn btn-sm btn-light" onclick="editarMedico(${m.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-light" onclick="deletarMedico(${m.id})"><i class="fas fa-trash text-danger"></i></button>
            </td>
        </tr>
    `).join('');

    renderPaginationControls('medicos');
}

function renderConsultasTable() {
    const tbody = document.getElementById('tableConsultas');
    const pag = state.pagination.consultas;
    const lista = Array.isArray(pag.filtered) ? pag.filtered : state.consultas;
    const total = lista.length;
    const totalPages = Math.max(1, Math.ceil(total / pag.pageSize));

    if (pag.page > totalPages) pag.page = totalPages;
    if (pag.page < 1) pag.page = 1;

    if (total === 0) {
        tbody.innerHTML = '<tr class="text-center"><td colspan="8" class="py-4">Nenhuma consulta encontrada</td></tr>';
        renderPaginationControls('consultas');
        return;
    }

    const start = (pag.page - 1) * pag.pageSize;
    const pagina = lista.slice(start, start + pag.pageSize);

    tbody.innerHTML = pagina.map((c) => {
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
                <button class="btn btn-sm btn-light" onclick="editarConsulta(${c.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-light" onclick="deletarConsulta(${c.id})"><i class="fas fa-trash text-danger"></i></button>
            </td>
        </tr>
    `;
    }).join('');

    renderPaginationControls('consultas');
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
    const canvas = document.getElementById('chartEspecialidadePacientes');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const especialidades = {};
    state.consultas.forEach(c => {
        const esp = getEspecialidadeConsulta(c);
        if (esp) especialidades[esp] = (especialidades[esp] || 0) + 1;
    });

    if (state.charts.especialidadePacientes) state.charts.especialidadePacientes.destroy();

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
                    labels: { padding: 15, font: { size: 12, weight: 600 }, usePointStyle: true }
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

    if (state.charts.especialidadeMedicos) state.charts.especialidadeMedicos.destroy();

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
                    labels: { padding: 15, font: { size: 12, weight: 600 }, usePointStyle: true }
                }
            }
        }
    });
}

function createChartStatusConsultas() {
    const canvas = document.getElementById('chartStatusConsultas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const statusMap = {};
    state.consultas.forEach(c => {
        const chave = getConsultaStatus(c);
        statusMap[chave] = (statusMap[chave] || 0) + 1;
    });

    const ordem = ['agendada', 'pendente', 'confirmada', 'realizada', 'concluida', 'cancelada', 'faltou'];
    const labels = [];
    const valores = [];
    const cores = [];

    const colorMap = {
        agendada: '#6366f1',
        pendente: '#f59e0b',
        confirmada: '#10b981',
        realizada: '#2563eb',
        concluida: '#06b6d4',
        cancelada: '#ef4444',
        faltou: '#64748b'
    };

    ordem.forEach(chave => {
        if ((statusMap[chave] || 0) > 0) {
            labels.push(getConsultaStatusLabel(chave));
            valores.push(statusMap[chave]);
            cores.push(colorMap[chave] || '#94a3b8');
        }
    });

    if (labels.length === 0) {
        labels.push('Sem dados');
        valores.push(0);
        cores.push('#cbd5e1');
    }

    if (state.charts.statusConsultas) state.charts.statusConsultas.destroy();

    state.charts.statusConsultas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Quantidade de Consultas',
                data: valores,
                backgroundColor: cores,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } }
            }
        }
    });
}

function createChartConsultasMedicos(page = currentPage) {
    const canvas = document.getElementById('chartConsultasMedicos');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    currentPage = page;

    if (!consultasSorted.length) {
        const consultasPorMedico = {};

        state.consultas.forEach(c => {
            const nomeMedico = getNomeMedicoConsulta(c);
            if (nomeMedico && nomeMedico !== 'Desconhecido') {
                consultasPorMedico[nomeMedico] = (consultasPorMedico[nomeMedico] || 0) + 1;
            }
        });

        consultasSorted = Object.entries(consultasPorMedico)
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    }

    const totalPages = Math.max(1, Math.ceil(consultasSorted.length / pageSize));

    if (currentPage < 0) currentPage = 0;
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    const paged = consultasSorted.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    const labels = paged.map(([nome]) => {
        const partes = String(nome).trim().split(/\s+/);
        return partes.slice(0, 3).join(' ');
    });

    const valores = paged.map(([, count]) => Number(count));

    if (state.charts.consultasMedicos) state.charts.consultasMedicos.destroy();

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
                x: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
                y: { ticks: { autoSkip: false } }
            }
        }
    });

    renderChartPaginationControls();
}

function renderChartPaginationControls() {
    const container = document.getElementById('pagination-chart-medicos');
    if (!container) return;

    const totalItems = consultasSorted.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = totalItems === 0 ? 0 : (currentPage * pageSize) + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalItems);

    container.innerHTML = `
        <div class="pagination-summary">Mostrando ${start}-${end} de ${totalItems}</div>
        <div class="pagination-actions">
            <button class="btn btn-chart-nav btn-sm" ${currentPage <= 0 ? 'disabled' : ''} onclick="prevPage()">⬅ Anterior</button>
            <span class="chart-page-info">Página ${currentPage + 1} de ${totalPages}</span>
            <button class="btn btn-chart-nav btn-sm" ${currentPage >= totalPages - 1 ? 'disabled' : ''} onclick="nextPage()">Próximo ➡</button>
        </div>
    `;
}

/* ============================================
   NAVEGAÇÃO E SEÇÕES
   ============================================ */
function showSection(sectionId) {
    document.querySelectorAll('.section-content').forEach(section => section.classList.add('d-none'));

    const section = document.getElementById(sectionId);
    if (section) section.classList.remove('d-none');

    document.querySelectorAll('[data-section]').forEach(link => link.classList.remove('active'));
    document.querySelectorAll(`[data-section="${sectionId}"]`).forEach(link => link.classList.add('active'));
}

function nextPage() {
    const totalPages = Math.max(1, Math.ceil(consultasSorted.length / pageSize));

    if (currentPage < totalPages - 1) {
        currentPage++;
        createChartConsultasMedicos(currentPage);
    } else {
        renderChartPaginationControls();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        createChartConsultasMedicos(currentPage);
    } else {
        renderChartPaginationControls();
    }
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

function formatarDataInput(data) {
    if (!data) return '';
    const dt = new Date(data);
    if (isNaN(dt.getTime())) return '';

    const ano = dt.getFullYear();
    const mes = String(dt.getMonth() + 1).padStart(2, '0');
    const dia = String(dt.getDate()).padStart(2, '0');
    const hora = String(dt.getHours()).padStart(2, '0');
    const minuto = String(dt.getMinutes()).padStart(2, '0');

    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

function getNomAbreviado(nome) {
    if (!nome) return '?';
    return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function getStatusBadge(status) {
    const chave = String(status || 'agendada').toLowerCase().trim();

    const statusMap = {
        'agendada': { class: 'bg-primary-light text-primary', icon: 'fa-calendar-plus' },
        'confirmada': { class: 'bg-success-light text-success', icon: 'fa-check-circle' },
        'pendente': { class: 'bg-warning-light text-warning', icon: 'fa-clock' },
        'cancelada': { class: 'bg-danger-light text-danger', icon: 'fa-times-circle' },
        'realizada': { class: 'bg-info-light text-info', icon: 'fa-check' },
        'concluida': { class: 'bg-info-light text-info', icon: 'fa-check-double' },
        'faltou': { class: 'bg-secondary text-white', icon: 'fa-user-slash' }
    };

    const s = statusMap[chave] || { class: 'bg-secondary text-white', icon: 'fa-question' };
    return `<span class="badge ${s.class}"><i class="fas ${s.icon} me-1"></i>${getConsultaStatusLabel(chave)}</span>`;
}

function filterTable(tableId, searchTerm) {
    const termo = String(searchTerm || '').toLowerCase().trim();

    if (tableId === 'tablePacientes') {
        state.pagination.pacientes.page = 1;
        state.pagination.pacientes.filtered = state.pacientes.filter(p => {
            const texto = `${p.nome || ''} ${p.cpf || ''} ${p.telefone || ''} ${p.email || ''}`.toLowerCase();
            return texto.includes(termo);
        });
        renderPacientesTable();
        return;
    }

    if (tableId === 'tableMedicos') {
        state.pagination.medicos.page = 1;
        state.pagination.medicos.filtered = state.medicos.filter(m => {
            const texto = `${m.nome || ''} ${m.crm || ''} ${m.especialidade || ''} ${m.telefone || ''} ${m.email || ''}`.toLowerCase();
            return texto.includes(termo);
        });
        renderMedicosTable();
        return;
    }

    if (tableId === 'tableConsultas') {
        state.pagination.consultas.page = 1;
        state.pagination.consultas.filtered = state.consultas.filter(c => {
            const texto = `${getNomePacienteConsulta(c)} ${getNomeMedicoConsulta(c)} ${formatarData(getConsultaData(c))} ${getConsultaHora(c)} ${getEspecialidadeConsulta(c)} ${getConsultaStatusLabel(getConsultaStatus(c))} ${getConsultaDescricao(c)}`.toLowerCase();
            return texto.includes(termo);
        });
        renderConsultasTable();
    }
}

function applyAllFiltersAndRender() {
    filterTable('tablePacientes', document.getElementById('searchPacientes')?.value || '');
    filterTable('tableMedicos', document.getElementById('searchMedicos')?.value || '');
    filterTable('tableConsultas', document.getElementById('searchConsultas')?.value || '');
}

function renderPaginationControls(tipo) {
    const pag = state.pagination[tipo];
    const container = document.getElementById(`pagination-${tipo}`);
    if (!container || !pag) return;

    const totalItems = Array.isArray(pag.filtered) ? pag.filtered.length : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / pag.pageSize));
    const start = totalItems === 0 ? 0 : ((pag.page - 1) * pag.pageSize) + 1;
    const end = Math.min(pag.page * pag.pageSize, totalItems);

    container.innerHTML = `
        <div class="pagination-summary">Mostrando ${start}-${end} de ${totalItems}</div>
        <div class="pagination-actions">
            <button class="btn btn-chart-nav btn-sm" ${pag.page <= 1 ? 'disabled' : ''} onclick="changePage('${tipo}', -1)">⬅ Anterior</button>
            <span class="chart-page-info">Página ${pag.page} de ${totalPages}</span>
            <button class="btn btn-chart-nav btn-sm" ${pag.page >= totalPages ? 'disabled' : ''} onclick="changePage('${tipo}', 1)">Próximo ➡</button>
        </div>
    `;
}

function changePage(tipo, delta) {
    const pag = state.pagination[tipo];
    if (!pag) return;

    const totalItems = Array.isArray(pag.filtered) ? pag.filtered.length : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / pag.pageSize));
    const novaPagina = pag.page + delta;

    if (novaPagina < 1 || novaPagina > totalPages) return;

    pag.page = novaPagina;

    if (tipo === 'pacientes') renderPacientesTable();
    if (tipo === 'medicos') renderMedicosTable();
    if (tipo === 'consultas') renderConsultasTable();
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
   NOTIFICAÇÕES COM TOAST
   ============================================ */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
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
        const alert = toastEl.querySelector('.alert');
        if (alert) alert.remove();
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
    medico: null,
    consulta: null
};

/* ============================================
   AÇÕES PACIENTES
   ============================================ */
function editarPaciente(id) {
    const paciente = state.pacientes.find(p => p.id === Number(id));
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

    fetch(`${API_URL}/pacientes/${id}`, { method: 'DELETE' })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.mensagem || data?.message || 'Erro ao deletar paciente');
        showSuccess(data?.mensagem || 'Paciente deletado com sucesso.');
        await loadAllData();
        updateAllCharts();
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
    const url = estadoEdicao.paciente ? `${API_URL}/pacientes/${estadoEdicao.paciente}` : `${API_URL}/pacientes`;

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.mensagem || data?.message || 'Erro ao salvar paciente');
        showSuccess(estadoEdicao.paciente ? 'Paciente atualizado com sucesso.' : 'Paciente criado com sucesso.');
        bootstrap.Modal.getInstance(document.getElementById('modalPaciente')).hide();
        await loadAllData();
        updateAllCharts();
    })
    .catch(err => showError(err.message));
}

/* ============================================
   AÇÕES MÉDICOS
   ============================================ */
function editarMedico(id) {
    const medico = state.medicos.find(m => m.id === Number(id));
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

    fetch(`${API_URL}/medicos/${id}`, { method: 'DELETE' })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.mensagem || data?.message || 'Erro ao deletar médico');
        showSuccess(data?.mensagem || 'Médico deletado com sucesso.');
        await loadAllData();
        updateAllCharts();
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
    const url = estadoEdicao.medico ? `${API_URL}/medicos/${estadoEdicao.medico}` : `${API_URL}/medicos`;

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.mensagem || data?.message || 'Erro ao salvar médico');
        showSuccess(estadoEdicao.medico ? 'Médico atualizado com sucesso.' : 'Médico criado com sucesso.');
        bootstrap.Modal.getInstance(document.getElementById('modalMedico')).hide();
        await loadAllData();
        updateAllCharts();
    })
    .catch(err => showError(err.message));
}

/* ============================================
   AÇÕES CONSULTAS (SEM PROMPT / COM MODAL)
   ============================================ */
function adicionarConsulta() {
    estadoEdicao.consulta = null;

    popularSelectsConsulta();
    document.getElementById('formConsulta').reset();
    document.getElementById('consultaStatus').value = 'agendada';
    document.getElementById('modalConsultaTitle').textContent = 'Adicionar Consulta';

    const modal = new bootstrap.Modal(document.getElementById('modalConsulta'));
    modal.show();
}

function editarConsulta(id) {
    const consulta = state.consultas.find(c => c.id === Number(id));
    if (!consulta) {
        showError('Consulta não encontrada.');
        return;
    }

    estadoEdicao.consulta = consulta.id;
    popularSelectsConsulta();

    document.getElementById('consultaPaciente').value = String(consulta.paciente_id || '');
    document.getElementById('consultaMedico').value = String(consulta.medico_id || '');
    document.getElementById('consultaData').value = formatarDataInput(getConsultaData(consulta));
    document.getElementById('consultaDescricao').value = getConsultaDescricao(consulta) === '-' ? '' : getConsultaDescricao(consulta);
    document.getElementById('consultaStatus').value = getConsultaStatus(consulta) || 'agendada';
    document.getElementById('consultaObservacaoStatus').value = consulta.observacao_status || '';

    document.getElementById('modalConsultaTitle').textContent = 'Editar Consulta';

    const modal = new bootstrap.Modal(document.getElementById('modalConsulta'));
    modal.show();
}

function popularSelectsConsulta() {
    const selectPaciente = document.getElementById('consultaPaciente');
    const selectMedico = document.getElementById('consultaMedico');

    if (!selectPaciente || !selectMedico) return;

    selectPaciente.innerHTML = '<option value="">Selecione o paciente</option>' + state.pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    selectMedico.innerHTML = '<option value="">Selecione o médico</option>' + state.medicos.map(m => `<option value="${m.id}">${m.nome} - ${m.especialidade || 'Sem especialidade'}</option>`).join('');
}

async function salvarConsulta() {
    const paciente_id = Number(document.getElementById('consultaPaciente').value);
    const medico_id = Number(document.getElementById('consultaMedico').value);
    const data_consulta = document.getElementById('consultaData').value;
    const descricao = document.getElementById('consultaDescricao').value.trim();
    const status = (document.getElementById('consultaStatus').value || 'agendada').trim().toLowerCase();
    const observacao_status = document.getElementById('consultaObservacaoStatus').value.trim();

    if (!paciente_id || !medico_id || !data_consulta) {
        showError('Paciente, médico e data da consulta são obrigatórios.');
        return;
    }

    const payload = { paciente_id, medico_id, data_consulta, descricao, status, observacao_status };
    const method = estadoEdicao.consulta ? 'PUT' : 'POST';
    const url = estadoEdicao.consulta ? `${API_URL}/consultas/${estadoEdicao.consulta}` : `${API_URL}/consultas`;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data?.mensagem || data?.message || 'Erro ao salvar consulta');
        }

        showSuccess(estadoEdicao.consulta ? 'Consulta atualizada com sucesso.' : 'Consulta criada com sucesso.');
        bootstrap.Modal.getInstance(document.getElementById('modalConsulta'))?.hide();
        await loadAllData();
        updateAllCharts();
    } catch (err) {
        showError(err.message);
    }
}

function deletarConsulta(id) {
    if (!confirm('Tem certeza que deseja deletar esta consulta?')) return;

    fetch(`${API_URL}/consultas/${id}`, { method: 'DELETE' })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.mensagem || data?.message || 'Erro ao deletar consulta');
        showSuccess(data?.mensagem || 'Consulta deletada com sucesso.');
        await loadAllData();
        updateAllCharts();
    })
    .catch(err => showError(err.message));
}