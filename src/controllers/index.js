// ============================================================================
// CONTROLLERS - CAMADA DE APRESENTAÇÃO (SOLID: S)
// ============================================================================

/**
 * Paciente Controller
 */
export class PacienteController {
  constructor(
    getPacientesUseCase,
    getPacienteByIdUseCase,
    createPacienteUseCase,
    updatePacienteUseCase,
    deletePacienteUseCase,
  ) {
    this.getPacientesUseCase = getPacientesUseCase;
    this.getPacienteByIdUseCase = getPacienteByIdUseCase;
    this.createPacienteUseCase = createPacienteUseCase;
    this.updatePacienteUseCase = updatePacienteUseCase;
    this.deletePacienteUseCase = deletePacienteUseCase;
  }

  async index(req, res) {
    try {
      const pacientes = await this.getPacientesUseCase.execute();
      res.json(pacientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const paciente = await this.getPacienteByIdUseCase.execute(req.params.id);
      res.json(paciente);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const paciente = await this.createPacienteUseCase.execute(req.body);
      res.status(201).json(paciente);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const paciente = await this.updatePacienteUseCase.execute(
        req.params.id,
        req.body,
      );
      res.json(paciente);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      await this.deletePacienteUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

/**
 * Médico Controller
 */
export class MedicoController {
  constructor(
    getMedicosUseCase,
    getMedicoByIdUseCase,
    createMedicoUseCase,
    updateMedicoUseCase,
    deleteMedicoUseCase,
  ) {
    this.getMedicosUseCase = getMedicosUseCase;
    this.getMedicoByIdUseCase = getMedicoByIdUseCase;
    this.createMedicoUseCase = createMedicoUseCase;
    this.updateMedicoUseCase = updateMedicoUseCase;
    this.deleteMedicoUseCase = deleteMedicoUseCase;
  }

  async index(req, res) {
    try {
      const medicos = await this.getMedicosUseCase.execute();
      res.json(medicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const medico = await this.getMedicoByIdUseCase.execute(req.params.id);
      res.json(medico);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const medico = await this.createMedicoUseCase.execute(req.body);
      res.status(201).json(medico);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const medico = await this.updateMedicoUseCase.execute(
        req.params.id,
        req.body,
      );
      res.json(medico);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      await this.deleteMedicoUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

/**
 * Consulta Controller
 */
export class ConsultaController {
  constructor(
    getConsultasUseCase,
    getConsultaByIdUseCase,
    createConsultaUseCase,
    updateConsultaUseCase,
    deleteConsultaUseCase,
  ) {
    this.getConsultasUseCase = getConsultasUseCase;
    this.getConsultaByIdUseCase = getConsultaByIdUseCase;
    this.createConsultaUseCase = createConsultaUseCase;
    this.updateConsultaUseCase = updateConsultaUseCase;
    this.deleteConsultaUseCase = deleteConsultaUseCase;
  }

  async index(req, res) {
    try {
      const consultas = await this.getConsultasUseCase.execute();

      // As consultas já vêm enriquecidas do UseCase com especialidade e status
      // Se temos cache, reforçar o mapeamento de especialidade
      if (global.medicosCache && global.medicosCache.length > 0) {
        const medicoMap = {};
        global.medicosCache.forEach((m) => {
          medicoMap[m.id] = m;
        });

        return res.json(
          consultas.map((c) => ({
            ...c,
            especialidade:
              medicoMap[c.medico_id]?.especialidade ||
              c.especialidade ||
              "Não definida",
            status: c.status || "pendente",
          })),
        );
      }

      res.json(consultas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const consulta = await this.getConsultaByIdUseCase.execute(req.params.id);
      res.json(consulta);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const consulta = await this.createConsultaUseCase.execute(req.body);
      res.status(201).json(consulta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const consulta = await this.updateConsultaUseCase.execute(
        req.params.id,
        req.body,
      );
      res.json(consulta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      await this.deleteConsultaUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
