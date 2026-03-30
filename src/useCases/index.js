// ============================================================================
// USE CASES - LÓGICA DE NEGÓCIO (SOLID: S, O, D)
// ============================================================================

/**
 * Use Case Base
 */
export class BaseUseCase {
  async execute() {
    throw new Error('Método não implementado');
  }
}

// ========== PACIENTES ==========

export class GetPacientesUseCase extends BaseUseCase {
  constructor(pacienteRepository) {
    super();
    this.pacienteRepository = pacienteRepository;
  }

  async execute() {
    return this.pacienteRepository.getAll();
  }
}

export class GetPacienteByIdUseCase extends BaseUseCase {
  constructor(pacienteRepository) {
    super();
    this.pacienteRepository = pacienteRepository;
  }

  async execute(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.pacienteRepository.getById(id);
  }
}

export class CreatePacienteUseCase extends BaseUseCase {
  constructor(pacienteRepository) {
    super();
    this.pacienteRepository = pacienteRepository;
  }

  async execute(data) {
    if (!data.nome || !data.email) {
      throw new Error('Nome e email são obrigatórios');
    }
    return this.pacienteRepository.create(data);
  }
}

export class UpdatePacienteUseCase extends BaseUseCase {
  constructor(pacienteRepository) {
    super();
    this.pacienteRepository = pacienteRepository;
  }

  async execute(id, data) {
    if (!id) throw new Error('ID é obrigatório');
    return this.pacienteRepository.update(id, data);
  }
}

export class DeletePacienteUseCase extends BaseUseCase {
  constructor(pacienteRepository) {
    super();
    this.pacienteRepository = pacienteRepository;
  }

  async execute(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.pacienteRepository.delete(id);
  }
}

// ========== MÉDICOS ==========

export class GetMedicosUseCase extends BaseUseCase {
  constructor(medicoRepository) {
    super();
    this.medicoRepository = medicoRepository;
  }

  async execute() {
    return this.medicoRepository.getAll();
  }
}

export class GetMedicoByIdUseCase extends BaseUseCase {
  constructor(medicoRepository) {
    super();
    this.medicoRepository = medicoRepository;
  }

  async execute(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.medicoRepository.getById(id);
  }
}

export class CreateMedicoUseCase extends BaseUseCase {
  constructor(medicoRepository) {
    super();
    this.medicoRepository = medicoRepository;
  }

  async execute(data) {
    if (!data.nome || !data.especialidade) {
      throw new Error('Nome e especialidade são obrigatórios');
    }
    return this.medicoRepository.create(data);
  }
}

export class UpdateMedicoUseCase extends BaseUseCase {
  constructor(medicoRepository) {
    super();
    this.medicoRepository = medicoRepository;
  }

  async execute(id, data) {
    if (!id) throw new Error('ID é obrigatório');
    return this.medicoRepository.update(id, data);
  }
}

export class DeleteMedicoUseCase extends BaseUseCase {
  constructor(medicoRepository) {
    super();
    this.medicoRepository = medicoRepository;
  }

  async execute(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.medicoRepository.delete(id);
  }
}

// ========== CONSULTAS ==========

export class GetConsultasUseCase extends BaseUseCase {
  constructor(consultaRepository, allMedicos = null) {
    super();
    this.consultaRepository = consultaRepository;
    this.allMedicos = allMedicos || [];
  }

  async execute() {
    const consultas = await this.consultaRepository.getAll();

    // Mapear medicos por ID
    const medicoMap = {};
    this.allMedicos.forEach(m => {
      medicoMap[m.id] = m;
    });

    // Enriquecer cada consulta
    return consultas.map(c => ({
      ...c,
      especialidade: medicoMap[c.medico_id]?.especialidade || c.especialidade || 'Não definida',
      status: c.status || 'pendente'
    }));
  }

  // Método para injetar os médicos depois
  setMedicos(medicos) {
    this.allMedicos = medicos;
  }
}

export class GetConsultaByIdUseCase extends BaseUseCase {
  constructor(consultaRepository) {
    super();
    this.consultaRepository = consultaRepository;
  }

  async execute(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.consultaRepository.getById(id);
  }
}

export class CreateConsultaUseCase extends BaseUseCase {
  constructor(consultaRepository) {
    super();
    this.consultaRepository = consultaRepository;
  }

  async execute(data) {
    if (!data.paciente_id || !data.medico_id || !data.data_consulta) {
      throw new Error('paciente_id, medico_id e data_consulta são obrigatórios');
    }
    return this.consultaRepository.create(data);
  }
}

export class UpdateConsultaUseCase extends BaseUseCase {
  constructor(consultaRepository) {
    super();
    this.consultaRepository = consultaRepository;
  }

  async execute(id, data) {
    if (!id) throw new Error('ID é obrigatório');
    if (!data.paciente_id || !data.medico_id || !data.data_consulta) {
      throw new Error('paciente_id, medico_id e data_consulta são obrigatórios');
    }
    return this.consultaRepository.update(id, data);
  }
}

export class DeleteConsultaUseCase extends BaseUseCase {
  constructor(consultaRepository) {
    super();
    this.consultaRepository = consultaRepository;
  }

  async execute(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.consultaRepository.delete(id);
  }
}