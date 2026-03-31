// ============================================================================
// SETUP DE DEPENDÊNCIAS - INVERSÃO DE CONTROLE (SOLID: D)
// ============================================================================

import ServiceContainer from '../core/ServiceContainer.js';
import HttpClient from '../core/HttpClient.js';
import ClinicaApiService from '../services/ClinicaApiService.js';
import {
  PacienteRepository,
  MedicoRepository,
  ConsultaRepository
} from '../repositories/index.js';
import {
  GetPacientesUseCase,
  GetPacienteByIdUseCase,
  CreatePacienteUseCase,
  UpdatePacienteUseCase,
  DeletePacienteUseCase,
  GetMedicosUseCase,
  GetMedicoByIdUseCase,
  CreateMedicoUseCase,
  UpdateMedicoUseCase,
  DeleteMedicoUseCase,
  GetConsultasUseCase,
  GetConsultaByIdUseCase,
  CreateConsultaUseCase,
  UpdateConsultaUseCase,
  DeleteConsultaUseCase
} from '../useCases/index.js';
import {
  PacienteController,
  MedicoController,
  ConsultaController
} from '../controllers/index.js';

export function setupDependencies() {
  ServiceContainer.register('HttpClient', () => new HttpClient(), true);

  ServiceContainer.register(
    'ClinicaApiService',
    () => {
      const httpClient = ServiceContainer.resolve('HttpClient');
      return new ClinicaApiService(httpClient);
    },
    true
  );

  ServiceContainer.register(
    'PacienteRepository',
    () => {
      const apiService = ServiceContainer.resolve('ClinicaApiService');
      return new PacienteRepository(apiService);
    },
    true
  );

  ServiceContainer.register(
    'MedicoRepository',
    () => {
      const apiService = ServiceContainer.resolve('ClinicaApiService');
      return new MedicoRepository(apiService);
    },
    true
  );

  ServiceContainer.register(
    'ConsultaRepository',
    () => {
      const apiService = ServiceContainer.resolve('ClinicaApiService');
      return new ConsultaRepository(apiService);
    },
    true
  );

  // Pacientes
  ServiceContainer.register('GetPacientesUseCase', () => {
    const repo = ServiceContainer.resolve('PacienteRepository');
    return new GetPacientesUseCase(repo);
  });

  ServiceContainer.register('GetPacienteByIdUseCase', () => {
    const repo = ServiceContainer.resolve('PacienteRepository');
    return new GetPacienteByIdUseCase(repo);
  });

  ServiceContainer.register('CreatePacienteUseCase', () => {
    const repo = ServiceContainer.resolve('PacienteRepository');
    return new CreatePacienteUseCase(repo);
  });

  ServiceContainer.register('UpdatePacienteUseCase', () => {
    const repo = ServiceContainer.resolve('PacienteRepository');
    return new UpdatePacienteUseCase(repo);
  });

  ServiceContainer.register('DeletePacienteUseCase', () => {
    const repo = ServiceContainer.resolve('PacienteRepository');
    return new DeletePacienteUseCase(repo);
  });

  // Médicos
  ServiceContainer.register('GetMedicosUseCase', () => {
    const repo = ServiceContainer.resolve('MedicoRepository');
    return new GetMedicosUseCase(repo);
  });

  ServiceContainer.register('GetMedicoByIdUseCase', () => {
    const repo = ServiceContainer.resolve('MedicoRepository');
    return new GetMedicoByIdUseCase(repo);
  });

  ServiceContainer.register('CreateMedicoUseCase', () => {
    const repo = ServiceContainer.resolve('MedicoRepository');
    return new CreateMedicoUseCase(repo);
  });

  ServiceContainer.register('UpdateMedicoUseCase', () => {
    const repo = ServiceContainer.resolve('MedicoRepository');
    return new UpdateMedicoUseCase(repo);
  });

  ServiceContainer.register('DeleteMedicoUseCase', () => {
    const repo = ServiceContainer.resolve('MedicoRepository');
    return new DeleteMedicoUseCase(repo);
  });

  // Consultas
  ServiceContainer.register('GetConsultasUseCase', () => {
    const consultaRepo = ServiceContainer.resolve('ConsultaRepository');
    return new GetConsultasUseCase(consultaRepo);
  });

  ServiceContainer.register('GetConsultaByIdUseCase', () => {
    const repo = ServiceContainer.resolve('ConsultaRepository');
    return new GetConsultaByIdUseCase(repo);
  });

  ServiceContainer.register('CreateConsultaUseCase', () => {
    const repo = ServiceContainer.resolve('ConsultaRepository');
    return new CreateConsultaUseCase(repo);
  });

  ServiceContainer.register('UpdateConsultaUseCase', () => {
    const repo = ServiceContainer.resolve('ConsultaRepository');
    return new UpdateConsultaUseCase(repo);
  });

  ServiceContainer.register('DeleteConsultaUseCase', () => {
    const repo = ServiceContainer.resolve('ConsultaRepository');
    return new DeleteConsultaUseCase(repo);
  });

  // Controllers
  ServiceContainer.register('PacienteController', () => {
    return new PacienteController(
      ServiceContainer.resolve('GetPacientesUseCase'),
      ServiceContainer.resolve('GetPacienteByIdUseCase'),
      ServiceContainer.resolve('CreatePacienteUseCase'),
      ServiceContainer.resolve('UpdatePacienteUseCase'),
      ServiceContainer.resolve('DeletePacienteUseCase')
    );
  });

  ServiceContainer.register('MedicoController', () => {
    return new MedicoController(
      ServiceContainer.resolve('GetMedicosUseCase'),
      ServiceContainer.resolve('GetMedicoByIdUseCase'),
      ServiceContainer.resolve('CreateMedicoUseCase'),
      ServiceContainer.resolve('UpdateMedicoUseCase'),
      ServiceContainer.resolve('DeleteMedicoUseCase')
    );
  });

  ServiceContainer.register('ConsultaController', () => {
    return new ConsultaController(
      ServiceContainer.resolve('GetConsultasUseCase'),
      ServiceContainer.resolve('GetConsultaByIdUseCase'),
      ServiceContainer.resolve('CreateConsultaUseCase'),
      ServiceContainer.resolve('UpdateConsultaUseCase'),
      ServiceContainer.resolve('DeleteConsultaUseCase')
    );
  });
}

export default setupDependencies;