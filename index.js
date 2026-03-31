// ============================================================================
// APLICAÇÃO PRINCIPAL - CLINICA CONSUMER
// Consome API do Clinica_Medica_Node (http://localhost:3000)
// Executa em http://localhost:3001 com arquitetura MVC + SOLID
// ============================================================================

import express from "express";
import cors from "cors";
import config from "./config.js";
import setupDependencies from "./src/setup/setupDependencies.js";
import ServiceContainer from "./src/core/ServiceContainer.js";
import {
  createPacienteRoutes,
  createMedicoRoutes,
  createConsultaRoutes,
} from "./src/routes/index.js";

// ============================================================================
// 1. INICIALIZAR EXPRESS
// ============================================================================
const app = express();

// ============================================================================
// 2. MIDDLEWARE GLOBAL
// ============================================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static("frontend"));

// ============================================================================
// 3. SETUP DE DEPENDÊNCIAS (Inversão de Controle)
// ============================================================================
setupDependencies();

// Inicializar cache de médicos imediatamente
(async () => {
  try {
    const getMedicosUseCase = ServiceContainer.resolve("GetMedicosUseCase");
    const medicos = await getMedicosUseCase.execute();
    global.medicosCache = medicos;
    console.log(
      `💾 Cache de médicos inicializado: ${medicos.length} registros`,
    );
  } catch (error) {
    console.error("⚠️  Erro ao inicializar cache de médicos:", error.message);
    global.medicosCache = [];
  }
})();

// ============================================================================
// 4. REGISTRAR ROTAS
// ============================================================================
const pacienteController = ServiceContainer.resolve("PacienteController");
const medicoController = ServiceContainer.resolve("MedicoController");
const consultaController = ServiceContainer.resolve("ConsultaController");

app.use("/api/pacientes", createPacienteRoutes(pacienteController));
app.use("/api/medicos", createMedicoRoutes(medicoController));
app.use("/api/consultas", createConsultaRoutes(consultaController));

// ============================================================================
// 5. ROTA RAIZ (Home - Redirecion para Frontend)
// ============================================================================
app.get("/api", (req, res) => {
  res.status(200).json({
    name: "Clinica Consumer - API Cliente",
    version: "1.0.0",
    description: "Cliente MVC + SOLID que consome Clinica_Medica_Node API",
    consumingApi: config.clinicaApi.baseUrl,
    port: config.port,
    environment: process.env.NODE_ENV || "development",
    documentation: "http://localhost:" + config.port + "/health",
    availableEndpoints: {
      health: "GET /health",
      pacientes: {
        list: "GET /api/pacientes",
        get: "GET /api/pacientes/:id",
        create: "POST /api/pacientes",
        update: "PUT /api/pacientes/:id",
        delete: "DELETE /api/pacientes/:id",
      },
      medicos: {
        list: "GET /api/medicos",
        get: "GET /api/medicos/:id",
        create: "POST /api/medicos",
        update: "PUT /api/medicos/:id",
        delete: "DELETE /api/medicos/:id",
      },
      consultas: {
        list: "GET /api/consultas",
        get: "GET /api/consultas/:id",
        create: "POST /api/consultas",
        update: "PUT /api/consultas/:id",
        delete: "DELETE /api/consultas/:id",
      },
    },
  });
});

// ============================================================================
// 6. ROTA DE HEALTH CHECK
// ============================================================================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    apiVersion: "1.0.0",
    consumingApi: config.clinicaApi.baseUrl,
  });
});

// ============================================================================
// 7. MIDDLEWARE - NÃO ENCONTRADO (404)
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    message: `${req.method} ${req.originalUrl} não existe`,
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET /api/pacientes",
      "GET /api/pacientes/:id",
      "POST /api/pacientes",
      "PUT /api/pacientes/:id",
      "DELETE /api/pacientes/:id",
      "GET /api/medicos",
      "GET /api/medicos/:id",
      "POST /api/medicos",
      "PUT /api/medicos/:id",
      "DELETE /api/medicos/:id",
      "GET /api/consultas",
      "GET /api/consultas/:id",
      "POST /api/consultas",
      "PUT /api/consultas/:id",
      "DELETE /api/consultas/:id",
    ],
  });
});

// ============================================================================
// 8. MIDDLEWARE - TRATAMENTO DE ERROS GLOBAL
// ============================================================================
app.use((err, req, res, next) => {
  console.error("[ERROR]", {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    statusCode: err.statusCode || 500,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor";

  res.status(statusCode).json({
    error: true,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ============================================================================
// 9. INICIAR SERVIDOR
// ============================================================================
const PORT = config.port;

app.listen(PORT, () => {
  console.log(
    "╔════════════════════════════════════════════════════════════════╗",
  );
  console.log(
    "║          CLINICA MÉDICA - CONSUMER API                         ║",
  );
  console.log(
    "╚════════════════════════════════════════════════════════════════╝",
  );
  console.log("");
  console.log(`✨ Servidor iniciado com sucesso!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 API Consumindo: ${config.clinicaApi.baseUrl}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log("");
  console.log("📝 Endpoints disponíveis:");
  console.log(`   • GET  http://localhost:${PORT}/`);
  console.log(`   • GET  http://localhost:${PORT}/health`);
  console.log(`   • GET  http://localhost:${PORT}/api/pacientes`);
  console.log(`   • GET  http://localhost:${PORT}/api/medicos`);
  console.log(`   • GET  http://localhost:${PORT}/api/consultas`);
  console.log("");
  console.log("🔌 Para testar:");
  console.log(`   curl http://localhost:${PORT}/`);
  console.log("");
});

export default app;
