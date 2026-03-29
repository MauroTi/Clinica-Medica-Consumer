#!/bin/bash

# ============================================================================
# EXEMPLOS DE REQUISIÇÕES - Clinica Consumer API
# ============================================================================

# Base URL
BASE_URL="http://localhost:3001"
API_BASE="$BASE_URL/api"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          EXEMPLOS DE REQUISIÇÕES - CLINICA CONSUMER            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# HEALTH CHECK
# ============================================================================
echo "🏥 1. HEALTH CHECK"
echo "════════════════════════════════════════════════════════════════"
echo "GET $BASE_URL/health"
echo ""
curl -X GET "$BASE_URL/health" | jq .
echo ""
echo ""

# ============================================================================
# PACIENTES - LISTAR TODOS
# ============================================================================
echo "👥 2. LISTAR TODOS OS PACIENTES"
echo "════════════════════════════════════════════════════════════════"
echo "GET $API_BASE/pacientes"
echo ""
curl -X GET "$API_BASE/pacientes" | jq .
echo ""
echo ""

# ============================================================================
# PACIENTES - BUSCAR POR ID
# ============================================================================
echo "👤 3. BUSCAR PACIENTE POR ID"
echo "════════════════════════════════════════════════════════════════"
echo "GET $API_BASE/pacientes/1"
echo ""
curl -X GET "$API_BASE/pacientes/1" | jq .
echo ""
echo ""

# ============================================================================
# PACIENTES - CRIAR NOVO
# ============================================================================
echo "➕ 4. CRIAR NOVO PACIENTE"
echo "════════════════════════════════════════════════════════════════"
echo "POST $API_BASE/pacientes"
echo ""
curl -X POST "$API_BASE/pacientes" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "cpf": "12345678900"
  }' | jq .
echo ""
echo ""

# ============================================================================
# PACIENTES - ATUALIZAR
# ============================================================================
echo "✏️  5. ATUALIZAR PACIENTE"
echo "════════════════════════════════════════════════════════════════"
echo "PUT $API_BASE/pacientes/1"
echo ""
curl -X PUT "$API_BASE/pacientes/1" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Updated",
    "email": "joao.updated@email.com"
  }' | jq .
echo ""
echo ""

# ============================================================================
# PACIENTES - DELETAR
# ============================================================================
echo "🗑️  6. DELETAR PACIENTE"
echo "════════════════════════════════════════════════════════════════"
echo "DELETE $API_BASE/pacientes/1"
echo ""
curl -X DELETE "$API_BASE/pacientes/1"
echo ""
echo ""

# ============================================================================
# MÉDICOS - LISTAR TODOS
# ============================================================================
echo "👨‍⚕️  7. LISTAR TODOS OS MÉDICOS"
echo "════════════════════════════════════════════════════════════════"
echo "GET $API_BASE/medicos"
echo ""
curl -X GET "$API_BASE/medicos" | jq .
echo ""
echo ""

# ============================================================================
# MÉDICOS - CRIAR NOVO
# ============================================================================
echo "➕ 8. CRIAR NOVO MÉDICO"
echo "════════════════════════════════════════════════════════════════"
echo "POST $API_BASE/medicos"
echo ""
curl -X POST "$API_BASE/medicos" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dr. Silva",
    "especialidade": "Cardiologia",
    "telefone": "11999999999",
    "crm": "123456"
  }' | jq .
echo ""
echo ""

# ============================================================================
# CONSULTAS - LISTAR TODAS
# ============================================================================
echo "📋 9. LISTAR TODAS AS CONSULTAS"
echo "════════════════════════════════════════════════════════════════"
echo "GET $API_BASE/consultas"
echo ""
curl -X GET "$API_BASE/consultas" | jq .
echo ""
echo ""

# ============================================================================
# CONSULTAS - CRIAR NOVA
# ============================================================================
echo "➕ 10. CRIAR NOVA CONSULTA"
echo "════════════════════════════════════════════════════════════════"
echo "POST $API_BASE/consultas"
echo ""
curl -X POST "$API_BASE/consultas" \
  -H "Content-Type: application/json" \
  -d '{
    "data": "2024-01-15",
    "hora": "10:00",
    "idMedico": 1,
    "idPaciente": 1,
    "motivo": "Checkup anual"
  }' | jq .
echo ""
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ Exemplos de requisições concluídos!"
echo ""
