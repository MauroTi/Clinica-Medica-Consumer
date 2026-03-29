#!/usr/bin/env pwsh

# ============================================================================
# TESTAR CONEXÃO - CLINICA CONSUMER
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          TESTE DE CONEXÃO - CLINICA CONSUMER                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Testando conexão com servidor..." -ForegroundColor Yellow
Write-Host ""

# Teste 1: Localhost 3001
Write-Host "[1/3] Verificando http://localhost:3001/" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ FALHOU" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Teste 2: Health
Write-Host "[2/3] Verificando http://localhost:3001/health" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ FALHOU" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Teste 3: API Pacientes
Write-Host "[3/3] Verificando http://localhost:3001/api/pacientes" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/pacientes" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ FALHOU" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Resumo
Write-Host "📊 RESUMO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Se os testes acima tiveram ✅ SUCESSO:" -ForegroundColor Green
Write-Host "  • Seu servidor está rodando corretamente" -ForegroundColor Gray
Write-Host "  • Acesse http://localhost:3001/ no navegador" -ForegroundColor Gray
Write-Host ""

Write-Host "Se tiveram ❌ FALHOU:" -ForegroundColor Red
Write-Host "  • Execute INICIAR.ps1 ou INICIAR.bat" -ForegroundColor Gray
Write-Host "  • Aguarde a mensagem 'Servidor iniciado com sucesso!'" -ForegroundColor Gray
Write-Host "  • Depois execute este teste novamente" -ForegroundColor Gray
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Read-Host "Pressione ENTER para sair"
