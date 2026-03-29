// ============================================================================
// EXEMPLO DE TESTE UNITÁRIO - Paciente Use Cases
// Use: npm test
// ============================================================================

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock do Repository
class MockPacienteRepository {
  pacientes = [];
  nextId = 1;

  async getAll() {
    return this.pacientes;
  }

  async getById(id) {
    const paciente = this.pacientes.find(p => p.id === id);
    if (!paciente) throw new Error(`Paciente ${id} não encontrado`);
    return paciente;
  }

  async create(data) {
    if (!data.nome || !data.email) {
      throw new Error('Nome e email são obrigatórios');
    }
    const paciente = {
      id: this.nextId++,
      ...data
    };
    this.pacientes.push(paciente);
    return paciente;
  }

  async update(id, data) {
    const index = this.pacientes.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Paciente ${id} não encontrado`);
    this.pacientes[index] = { ...this.pacientes[index], ...data };
    return this.pacientes[index];
  }

  async delete(id) {
    const index = this.pacientes.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Paciente ${id} não encontrado`);
    this.pacientes.splice(index, 1);
  }
}

// Importar Use Cases
// import { GetPacientesUseCase, CreatePacienteUseCase } from '../src/useCases/index.js';

describe('Paciente Use Cases', () => {
  let repository;

  beforeEach(() => {
    repository = new MockPacienteRepository();
  });

  afterEach(() => {
    repository = null;
  });

  describe('GetPacientesUseCase', () => {
    it('deve retornar lista vazia quando não há pacientes', async () => {
      const result = await repository.getAll();
      expect(result).toEqual([]);
    });

    it('deve retornar lista de pacientes', async () => {
      await repository.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        cpf: '12345678900'
      });

      const result = await repository.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].nome).toBe('João Silva');
    });
  });

  describe('CreatePacienteUseCase', () => {
    it('deve criar um novo paciente com dados válidos', async () => {
      const paciente = await repository.create({
        nome: 'Maria Santos',
        email: 'maria@email.com',
        telefone: '11988888888',
        cpf: '98765432100'
      });

      expect(paciente.id).toBe(1);
      expect(paciente.nome).toBe('Maria Santos');
      expect(paciente.email).toBe('maria@email.com');
    });

    it('deve lançar erro quando nome não é fornecido', async () => {
      try {
        await repository.create({
          email: 'test@email.com'
        });
        expect.fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error.message).toContain('obrigatórios');
      }
    });

    it('deve lançar erro quando email não é fornecido', async () => {
      try {
        await repository.create({
          nome: 'Teste'
        });
        expect.fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error.message).toContain('obrigatórios');
      }
    });
  });

  describe('UpdatePacienteUseCase', () => {
    it('deve atualizar um paciente existente', async () => {
      await repository.create({
        nome: 'João Silva',
        email: 'joao@email.com'
      });

      const updated = await repository.update(1, {
        nome: 'João Silva Updated'
      });

      expect(updated.nome).toBe('João Silva Updated');
      expect(updated.email).toBe('joao@email.com'); // mantém email
    });

    it('deve lançar erro ao tentar atualizar paciente inexistente', async () => {
      try {
        await repository.update(999, { nome: 'Novo Nome' });
        expect.fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error.message).toContain('não encontrado');
      }
    });
  });

  describe('DeletePacienteUseCase', () => {
    it('deve deletar um paciente existente', async () => {
      await repository.create({
        nome: 'João Silva',
        email: 'joao@email.com'
      });

      await repository.delete(1);
      const result = await repository.getAll();
      expect(result).toHaveLength(0);
    });

    it('deve lançar erro ao tentar deletar paciente inexistente', async () => {
      try {
        await repository.delete(999);
        expect.fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error.message).toContain('não encontrado');
      }
    });
  });

  describe('GetPacienteByIdUseCase', () => {
    it('deve retornar paciente por ID', async () => {
      await repository.create({
        nome: 'João Silva',
        email: 'joao@email.com'
      });

      const paciente = await repository.getById(1);
      expect(paciente.nome).toBe('João Silva');
    });

    it('deve lançar erro ao buscar ID inexistente', async () => {
      try {
        await repository.getById(999);
        expect.fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error.message).toContain('não encontrado');
      }
    });
  });
});
