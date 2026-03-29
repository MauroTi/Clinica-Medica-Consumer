#!/usr/bin/env pwsh

# ============================================================================
# INICIAR CLINICA CONSUMER - SIMPLES E DIRETO
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          INICIANDO CLINICA CONSUMER                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório
Write-Host "[1/4] Navegando para o diretório..." -ForegroundColor Yellow
Set-Location c:\xampp\htdocs\Node\clinica_consumer

# Verificar se node_modules existe
Write-Host "[2/4] Verificando dependências..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "      Instalando dependências (primeira vez)..." -ForegroundColor Gray
    npm install
    Write-Host ""
}

Write-Host "[3/4] Verificando configuração..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "      Copiando .env.example para .env..." -ForegroundColor Gray
    Copy-Item ".env.example" ".env"
}

Write-Host "[4/4] Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Servidor iniciará em: http://localhost:3001" -ForegroundColor Green
Write-Host "🏥 Consumindo API: http://localhost:3000" -ForegroundColor Green
Write-Host "⏳ Aguarde a mensagem 'Servidor iniciado com sucesso!'" -ForegroundColor Yellow
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

npm run dev

Read-Host "Pressione ENTER para sair"
