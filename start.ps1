#!/usr/bin/env pwsh

# ============================================================================
# SCRIPT DE INICIALIZAÇÃO - Clinica Consumer
# Windows PowerShell
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          CLINICA MÉDICA - CONSUMER API                         ║" -ForegroundColor Cyan
Write-Host "║          Sistema de Inicialização                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green
}
else {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Por favor, instale Node.js 18+ de https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Verificar se npm está instalado
Write-Host "🔍 Verificando npm..." -ForegroundColor Yellow
$npmVersion = npm --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ npm $npmVersion encontrado" -ForegroundColor Green
}
else {
    Write-Host "❌ npm não encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar node_modules
Write-Host ""
Write-Host "🔍 Verificando dependências..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules já existe" -ForegroundColor Green
}
else {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependências instaladas com sucesso" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
        exit 1
    }
}

# Verificar .env
Write-Host ""
Write-Host "🔍 Verificando variáveis de ambiente..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
}
else {
    Write-Host "📝 Criando .env a partir de .env.example" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Arquivo .env criado" -ForegroundColor Green
}

# Menu de opções
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Escolha uma opção:" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1 - 🚀 Iniciar em modo DESENVOLVIMENTO (com reload automático)" -ForegroundColor Green
Write-Host "2 - 🏭 Iniciar em modo PRODUÇÃO" -ForegroundColor Yellow
Write-Host "3 - 🧪 Executar TESTES" -ForegroundColor Cyan
Write-Host "4 - 📋 Mostrar informações da aplicação" -ForegroundColor Magenta
Write-Host "5 - 🚪 Sair" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Digite a opção (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Iniciando em modo DESENVOLVIMENTO..." -ForegroundColor Green
        Write-Host "    💡 Dica: Use CTRL+C para parar" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }
    "2" {
        Write-Host ""
        Write-Host "🏭 Iniciando em modo PRODUÇÃO..." -ForegroundColor Yellow
        Write-Host "    💡 Dica: Use CTRL+C para parar" -ForegroundColor Yellow
        Write-Host ""
        npm start
    }
    "3" {
        Write-Host ""
        Write-Host "🧪 Executando TESTES..." -ForegroundColor Cyan
        Write-Host ""
        npm test
    }
    "4" {
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "📋 INFORMAÇÕES DA APLICAÇÃO" -ForegroundColor Cyan
        Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📦 Nome do Projeto:" -ForegroundColor Yellow
        Write-Host "   Clinica Consumer - API Cliente" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎯 Versão:" -ForegroundColor Yellow
        Write-Host "   1.0.0" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 URLs:" -ForegroundColor Yellow
        Write-Host "   • Aplicação: http://localhost:3001" -ForegroundColor Green
        Write-Host "   • Health Check: http://localhost:3001/health" -ForegroundColor Green
        Write-Host "   • API Original: http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        Write-Host "📡 Endpoints:" -ForegroundColor Yellow
        Write-Host "   • GET    /api/pacientes" -ForegroundColor Green
        Write-Host "   • GET    /api/pacientes/:id" -ForegroundColor Green
        Write-Host "   • POST   /api/pacientes" -ForegroundColor Green
        Write-Host "   • PUT    /api/pacientes/:id" -ForegroundColor Green
        Write-Host "   • DELETE /api/pacientes/:id" -ForegroundColor Green
        Write-Host ""
        Write-Host "   • GET    /api/medicos" -ForegroundColor Green
        Write-Host "   • GET    /api/medicos/:id" -ForegroundColor Green
        Write-Host "   • POST   /api/medicos" -ForegroundColor Green
        Write-Host ""
        Write-Host "   • GET    /api/consultas" -ForegroundColor Green
        Write-Host "   • GET    /api/consultas/:id" -ForegroundColor Green
        Write-Host "   • POST   /api/consultas" -ForegroundColor Green
        Write-Host ""
        Write-Host "🏛️  Padrões de Arquitetura:" -ForegroundColor Yellow
        Write-Host "   • MVC (Model-View-Controller)" -ForegroundColor Green
        Write-Host "   • SOLID Principles" -ForegroundColor Green
        Write-Host "   • Dependency Injection" -ForegroundColor Green
        Write-Host "   • Repository Pattern" -ForegroundColor Green
        Write-Host "   • Use Case Pattern" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Estrutura de Camadas:" -ForegroundColor Yellow
        Write-Host "   Core" -ForegroundColor Green
        Write-Host "   ├─ ServiceContainer (DI)" -ForegroundColor Green
        Write-Host "   └─ HttpClient (Retry Logic)" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Services" -ForegroundColor Green
        Write-Host "   └─ ClinicaApiService" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Repositories" -ForegroundColor Green
        Write-Host "   ├─ PacienteRepository" -ForegroundColor Green
        Write-Host "   ├─ MedicoRepository" -ForegroundColor Green
        Write-Host "   └─ ConsultaRepository" -ForegroundColor Green
        Write-Host ""
        Write-Host "   UseCases (Business Logic)" -ForegroundColor Green
        Write-Host "   ├─ GetPacientesUseCase" -ForegroundColor Green
        Write-Host "   ├─ CreatePacienteUseCase" -ForegroundColor Green
        Write-Host "   └─ ... (mais 10 use cases)" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Controllers (HTTP Handlers)" -ForegroundColor Green
        Write-Host "   ├─ PacienteController" -ForegroundColor Green
        Write-Host "   ├─ MedicoController" -ForegroundColor Green
        Write-Host "   └─ ConsultaController" -ForegroundColor Green
        Write-Host ""
        Write-Host "🛡️  Recursos de Resiliência:" -ForegroundColor Yellow
        Write-Host "   • Retry Automático (3 tentativas)" -ForegroundColor Green
        Write-Host "   • Backoff Exponencial" -ForegroundColor Green
        Write-Host "   • Tratamento robusto de erros" -ForegroundColor Green
        Write-Host ""
        Write-Host "📚 Documentação:" -ForegroundColor Yellow
        Write-Host "   • README.md - Guia completo" -ForegroundColor Green
        Write-Host "   • Clinica_Consumer_API.postman_collection.json" -ForegroundColor Green
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
    }
    "5" {
        Write-Host ""
        Write-Host "👋 Até logo!" -ForegroundColor Green
        Write-Host ""
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "❌ Opção inválida. Por favor, escolha 1-5" -ForegroundColor Red
        Write-Host ""
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Operação concluída!" -ForegroundColor Green
Write-Host ""
