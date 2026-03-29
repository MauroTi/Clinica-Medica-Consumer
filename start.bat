@echo off
REM ============================================================================
REM INICIALIZAR CLINICA CONSUMER - Windows CMD
REM ============================================================================

color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          INICIALIZADOR - CLINICA CONSUMER                      ║
echo ║          Clínica Médica - API MVC + SOLID                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM ============================================================================
REM VERIFICAR NODE.JS
REM ============================================================================

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js !NODE_VERSION! encontrado
) else (
    echo ✗ Erro: Node.js não encontrado
    echo   Instale em https://nodejs.org
    pause
    exit /b 1
)
echo.

REM ============================================================================
REM VERIFICAR NPM
REM ============================================================================

echo [2/5] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✓ npm !NPM_VERSION! encontrado
) else (
    echo ✗ Erro: npm não encontrado
    pause
    exit /b 1
)
echo.

REM ============================================================================
REM INSTALAR DEPENDÊNCIAS
REM ============================================================================

echo [3/5] Verificando dependências...
if exist "node_modules" (
    echo ✓ node_modules já existe
) else (
    echo ! Instalando dependências (primeira vez)...
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Erro ao instalar dependências
        pause
        exit /b 1
    )
    echo ✓ Dependências instaladas
)
echo.

REM ============================================================================
REM VERIFICAR VARIÁVEIS DE AMBIENTE
REM ============================================================================

echo [4/5] Verificando configuração...
if exist ".env" (
    echo ✓ Arquivo .env encontrado
) else (
    echo ! Criando .env a partir de .env.example...
    copy .env.example .env >nul
    echo ✓ Arquivo .env criado
)
echo.

REM ============================================================================
REM INICIAR APLICAÇÃO
REM ============================================================================

echo [5/5] Iniciando aplicação...
echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM Abrir em modo desenvolvimento
npm run dev

pause
