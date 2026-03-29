// ============================================================================
// CONFIGURAÇÕES DO PROJETO
// ============================================================================

export const config = {
  // Servidor
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',

  // API Clinica Médica
  clinicaApi: {
    baseUrl: process.env.CLINICA_API_URL || 'http://localhost:3000',
    endpoints: {
      pacientes: '/api/pacientes',
      medicos: '/api/medicos',
      consultas: '/api/consultas'
    }
  },

  // Timeouts
  requestTimeout: 5000,
  retryAttempts: 3,
  retryDelay: 1000
};

export default config;
