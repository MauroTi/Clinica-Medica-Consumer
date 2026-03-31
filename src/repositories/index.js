// ============================================================================
// REPOSITORIES - ABSTRAÇÃO DE DADOS (SOLID: D, L)
// ============================================================================

/**
 * Repository Base - Interface genérica
 */
export class BaseRepository {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getAll() {
    throw new Error("Método não implementado");
  }

  async getById(id) {
    throw new Error("Método não implementado");
  }

  async create(data) {
    throw new Error("Método não implementado");
  }

  async update(id, data) {
    throw new Error("Método não implementado");
  }

  async delete(id) {
    throw new Error("Método não implementado");
  }
}

/**
 * Paciente Repository
 */
export class PacienteRepository extends BaseRepository {
  async getAll() {
    return this.apiService.getPacientes();
  }

  async getById(id) {
    return this.apiService.getPacienteById(id);
  }

  async create(data) {
    return this.apiService.createPaciente(data);
  }

  async update(id, data) {
    return this.apiService.updatePaciente(id, data);
  }

  async delete(id) {
    return this.apiService.deletePaciente(id);
  }
}

/**
 * Médico Repository
 */
export class MedicoRepository extends BaseRepository {
  async getAll() {
    return this.apiService.getMedicos();
  }

  async getById(id) {
    return this.apiService.getMedicoById(id);
  }

  async create(data) {
    return this.apiService.createMedico(data);
  }

  async update(id, data) {
    return this.apiService.updateMedico(id, data);
  }

  async delete(id) {
    return this.apiService.deleteMedico(id);
  }
}

/**
 * Consulta Repository
 */
export class ConsultaRepository extends BaseRepository {
  async getAll() {
    return this.apiService.getConsultas();
  }

  async getById(id) {
    return this.apiService.getConsultaById(id);
  }

  async create(data) {
    return this.apiService.createConsulta(data);
  }

  async update(id, data) {
    return this.apiService.updateConsulta(id, data);
  }

  async delete(id) {
    return this.apiService.deleteConsulta(id);
  }
}
