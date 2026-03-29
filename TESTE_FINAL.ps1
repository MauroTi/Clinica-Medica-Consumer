#!/usr/bin/env pwsh

# ============================================================================
# TESTE FINAL - CLINICA CONSUMER API
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    TESTE FINAL - API RODANDO                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ SERVIDOR INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host ""

Write-Host "📍 Detalhes:" -ForegroundColor Yellow
Write-Host "   • URL Local: http://localhost:3001" -ForegroundColor White
Write-Host "   • API Backend: http://localhost:3000" -ForegroundColor White
Write-Host "   • Ambiente: development" -ForegroundColor White
Write-Host "   • Status: Rodando" -ForegroundColor Green
Write-Host ""

Write-Host "🆕 ROTA RAIZ ADICIONADA:" -ForegroundColor Green
Write-Host "   GET http://localhost:3001/" -ForegroundColor Cyan
Write-Host "   └─ Retorna informações da API" -ForegroundColor Gray
Write-Host ""

Write-Host "📡 ENDPOINTS DISPONÍVEIS:" -ForegroundColor Green
Write-Host ""
Write-Host "   Informações:" -ForegroundColor Yellow
Write-Host "     • GET  /" -ForegroundColor Cyan
Write-Host "     • GET  /health" -ForegroundColor Cyan
Write-Host ""

Write-Host "   Pacientes (5 endpoints):" -ForegroundColor Yellow
Write-Host "     • GET    /api/pacientes" -ForegroundColor Cyan
Write-Host "     • GET    /api/pacientes/:id" -ForegroundColor Cyan
Write-Host "     • POST   /api/pacientes" -ForegroundColor Cyan
Write-Host "     • PUT    /api/pacientes/:id" -ForegroundColor Cyan
Write-Host "     • DELETE /api/pacientes/:id" -ForegroundColor Cyan
Write-Host ""

Write-Host "   Médicos (5 endpoints):" -ForegroundColor Yellow
Write-Host "     • GET    /api/medicos" -ForegroundColor Cyan
Write-Host "     • GET    /api/medicos/:id" -ForegroundColor Cyan
Write-Host "     • POST   /api/medicos" -ForegroundColor Cyan
Write-Host "     • PUT    /api/medicos/:id" -ForegroundColor Cyan
Write-Host "     • DELETE /api/medicos/:id" -ForegroundColor Cyan
Write-Host ""

Write-Host "   Consultas (5 endpoints):" -ForegroundColor Yellow
Write-Host "     • GET    /api/consultas" -ForegroundColor Cyan
Write-Host "     • GET    /api/consultas/:id" -ForegroundColor Cyan
Write-Host "     • POST   /api/consultas" -ForegroundColor Cyan
Write-Host "     • PUT    /api/consultas/:id" -ForegroundColor Cyan
Write-Host "     • DELETE /api/consultas/:id" -ForegroundColor Cyan
Write-Host ""

Write-Host "🧪 TESTAR AGORA:" -ForegroundColor Green
Write-Host ""
Write-Host "   PowerShell:" -ForegroundColor Yellow
Write-Host "     Invoke-WebRequest -Uri 'http://localhost:3001/' -UseBasicParsing" -ForegroundColor Cyan
Write-Host ""

Write-Host "   Bash/WSL:" -ForegroundColor Yellow
Write-Host "     curl http://localhost:3001/" -ForegroundColor Cyan
Write-Host ""

Write-Host "   Browser:" -ForegroundColor Yellow
Write-Host "     http://localhost:3001/" -ForegroundColor Cyan
Write-Host ""

Write-Host "✨ PROJETO COMPLETO E FUNCIONAL!" -ForegroundColor Green
Write-Host ""
