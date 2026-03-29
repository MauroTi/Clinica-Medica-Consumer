 vclco@echo off
REM ============================================================================
REM INICIAR CLINICA CONSUMER - SIMPLES E DIRETO
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          INICIANDO CLINICA CONSUMER...                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Navegar para o diretório
cd /d c:\xampp\htdocs\Node\clinica_consumer

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [1/3] Instalando dependências...
    call npm install
    echo.
)

REM Iniciar servidor
echo [2/3] Iniciando servidor em http://localhost:3001...
echo [3/3] Aguarde a mensagem "Servidor iniciado com sucesso!"
echo.
echo ════════════════════════════════════════════════════════════════
echo.

call npm run dev

pause
