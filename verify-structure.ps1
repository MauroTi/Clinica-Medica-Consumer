#!/usr/bin/env pwsh

# ============================================================================
# VERIFICADOR DE ESTRUTURA DO PROJETO
# Valida que todos os arquivos necessários existem
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          VERIFICAÇÃO DE ESTRUTURA - CLINICA CONSUMER          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$files = @(
    # Root files
    "package.json",
    "index.js",
    "config.js",
    ".env",
    ".env.example",
    ".gitignore",
    "README.md",
    
    # Core
    "src/core/ServiceContainer.js",
    "src/core/HttpClient.js",
    
    # Services
    "src/services/ClinicaApiService.js",
    
    # Repositories
    "src/repositories/index.js",
    
    # UseCases
    "src/useCases/index.js",
    
    # Controllers
    "src/controllers/index.js",
    
    # Routes
    "src/routes/index.js",
    
    # Setup
    "src/setup/setupDependencies.js",
    
    # Tests
    "src/__tests__/paciente.test.js",
    
    # Collections
    "Clinica_Consumer_API.postman_collection.json"
)

$foundCount = 0
$missingCount = 0

Write-Host "Verificando arquivos do projeto..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
        $foundCount++
    }
    else {
        Write-Host "❌ $file (FALTANDO)" -ForegroundColor Red
        $missingCount++
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Resumo:" -ForegroundColor Yellow
Write-Host "  ✅ Encontrados: $foundCount" -ForegroundColor Green
Write-Host "  ❌ Faltando: $missingCount" -ForegroundColor $(if ($missingCount -gt 0) { "Red" } else { "Green" })
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($missingCount -eq 0) {
    Write-Host "🎉 Todos os arquivos necessários foram encontrados!" -ForegroundColor Green
    Write-Host "   Você está pronto para iniciar o projeto." -ForegroundColor Green
    Write-Host ""
    Write-Host "Para iniciar, execute:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host "⚠️  Alguns arquivos estão faltando!" -ForegroundColor Red
    Write-Host "   Verifique se todos os arquivos foram criados corretamente." -ForegroundColor Yellow
    Write-Host ""
}
