#!/usr/bin/env pwsh

# ============================================================================
# EXEMPLOS DE REQUISIÇÕES - Clinica Consumer API (PowerShell)
# ============================================================================

$BaseUrl = "http://localhost:3001"
$ApiBase = "$BaseUrl/api"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          EXEMPLOS DE REQUISIÇÕES - CLINICA CONSUMER            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# HEALTH CHECK
# ============================================================================
Write-Host "🏥 1. HEALTH CHECK" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "GET $BaseUrl/health" -ForegroundColor Yellow
Write-Host ""
$response = Invoke-WebRequest -Uri "$BaseUrl/health" -Method Get -ContentType "application/json" | ConvertFrom-Json
$response | ConvertTo-Json | Write-Host -ForegroundColor Green
Write-Host ""
Write-Host ""

# ============================================================================
# PACIENTES - LISTAR TODOS
# ============================================================================
Write-Host "👥 2. LISTAR TODOS OS PACIENTES" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "GET $ApiBase/pacientes" -ForegroundColor Yellow
Write-Host ""
try {
    $response = Invoke-WebRequest -Uri "$ApiBase/pacientes" -Method Get -ContentType "application/json" | ConvertFrom-Json
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Erro ao buscar pacientes" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# ============================================================================
# PACIENTES - BUSCAR POR ID
# ============================================================================
Write-Host "👤 3. BUSCAR PACIENTE POR ID" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "GET $ApiBase/pacientes/1" -ForegroundColor Yellow
Write-Host ""
try {
    $response = Invoke-WebRequest -Uri "$ApiBase/pacientes/1" -Method Get -ContentType "application/json" | ConvertFrom-Json
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Paciente não encontrado (esperado se não existir)" -ForegroundColor Yellow
}
Write-Host ""
Write-Host ""

# ============================================================================
# PACIENTES - CRIAR NOVO
# ============================================================================
Write-Host "➕ 4. CRIAR NOVO PACIENTE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "POST $ApiBase/pacientes" -ForegroundColor Yellow
Write-Host ""
$body = @{
    nome     = "João Silva"
    email    = "joao@email.com"
    telefone = "11999999999"
    cpf      = "12345678900"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$ApiBase/pacientes" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body | ConvertFrom-Json
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Erro ao criar paciente" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# ============================================================================
# PACIENTES - ATUALIZAR
# ============================================================================
Write-Host "✏️  5. ATUALIZAR PACIENTE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "PUT $ApiBase/pacientes/1" -ForegroundColor Yellow
Write-Host ""
$body = @{
    nome  = "João Silva Updated"
    email = "joao.updated@email.com"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$ApiBase/pacientes/1" `
        -Method Put `
        -ContentType "application/json" `
        -Body $body | ConvertFrom-Json
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Erro ao atualizar paciente" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# ============================================================================
# PACIENTES - DELETAR
# ============================================================================
Write-Host "🗑️  6. DELETAR PACIENTE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "DELETE $ApiBase/pacientes/1" -ForegroundColor Yellow
Write-Host ""
try {
    Invoke-WebRequest -Uri "$ApiBase/pacientes/1" `
        -Method Delete `
        -ContentType "application/json"
    Write-Host "✅ Paciente deletado com sucesso" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Erro ao deletar paciente (pode não existir)" -ForegroundColor Yellow
}
Write-Host ""
Write-Host ""

# ============================================================================
# MÉDICOS - LISTAR TODOS
# ============================================================================
Write-Host "👨‍⚕️  7. LISTAR TODOS OS MÉDICOS" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "GET $ApiBase/medicos" -ForegroundColor Yellow
Write-Host ""
try {
    $response = Invoke-WebRequest -Uri "$ApiBase/medicos" -Method Get -ContentType "application/json" | ConvertFrom-Json
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Erro ao buscar médicos" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# ============================================================================
# MÉDICOS - CRIAR NOVO
# ============================================================================
Write-Host "➕ 8. CRIAR NOVO MÉDICO" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "POST $ApiBase/medicos" -ForegroundColor Yellow
Write-Host ""
$body = @{
    nome          = "Dr. Silva"
    especialidade = "Cardiologia"
    telefone      = "11999999999"
    crm           = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$ApiBase/medicos" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body | ConvertFrom-Json
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Erro ao criar médico" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# ============================================================================
# CONSULTAS - LISTAR TODAS
# ============================================================================
Write-Host "📋 9. LISTAR TODAS AS CONSULTAS" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "GET $ApiBase/consultas" -ForegroundColor Yellow
Write-Host ""
try {
    $response = Invoke-WebRequest -Uri "$ApiBase/consultas" -Method Get -ContentType "application/json" | ConvertFrom-Json
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Erro ao buscar consultas" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# ============================================================================
# CONSULTAS - CRIAR NOVA
# ============================================================================
Write-Host "➕ 10. CRIAR NOVA CONSULTA" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "POST $ApiBase/consultas" -ForegroundColor Yellow
Write-Host ""
$body = @{
    data       = "2024-01-15"
    hora       = "10:00"
    idMedico   = 1
    idPaciente = 1
    motivo     = "Checkup anual"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$ApiBase/consultas" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body | ConvertFrom-Json
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Erro ao criar consulta" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# ============================================================================
# RESUMO
# ============================================================================
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "✅ Exemplos de requisições concluídos!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Dicas:" -ForegroundColor Yellow
Write-Host "   • Verifique se a API original (localhost:3000) está rodando" -ForegroundColor White
Write-Host "   • Use Postman para testes mais completos" -ForegroundColor White
Write-Host "   • Verifique os logs para detalhes de erro" -ForegroundColor White
Write-Host ""
