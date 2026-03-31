// ============================================================================
// API SERVICE - ABSTRAÇÃO DA API CLINICA MÉDICA (SOLID: S, D)
// ============================================================================

import { config } from "../../config.js";

/**
 * Interface de um serviço de API
 * Responsável por comunicação com API da Clínica Médica
 */
export class IApiService {
  async getPacientes() {
    throw new Error("Método não implementado");
  }

  async getPacienteById(id) {
    throw new Error("Método não implementado");
  }

  async createPaciente(data) {
    throw new Error("Método não implementado");
  }

  async updatePaciente(id, data) {
    throw new Error("Método não implementado");
  }

  async deletePaciente(id) {
    throw new Error("Método não implementado");
  }

  async getMedicos() {
    throw new Error("Método não implementado");
  }

  async getMedicoById(id) {
    throw new Error("Método não implementado");
  }

  async getConsultas() {
    throw new Error("Método não implementado");
  }

  async getConsultaById(id) {
    throw new Error("Método não implementado");
  }
}

/**
 * Implementação do serviço de API
 */
export class ClinicaApiService extends IApiService {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
    this.baseUrl = config.clinicaApi.baseUrl;
  }

  // ========== PACIENTES ==========

  async getPacientes() {
    console.log("📋 [ClinicaApiService] Solicitando PACIENTES...");
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.pacientes}`;
    try {
      const dados = await this.httpClient.get(url);
      console.log(
        `✅ [ClinicaApiService] Pacientes retornados: ${Array.isArray(dados) ? dados.length : "?"} registros`,
      );
      return dados;
    } catch (error) {
      console.error(
        "❌ [ClinicaApiService] Erro ao buscar pacientes:",
        error.message,
      );
      throw error;
    }
  }

  async getPacienteById(id) {
    console.log(`📋 [ClinicaApiService] Solicitando PACIENTE ID: ${id}`);
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.pacientes}/${id}`;
    return this.httpClient.get(url);
  }

  async createPaciente(data) {
    console.log("📋 [ClinicaApiService] Criando PACIENTE:", data);
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.pacientes}`;
    return this.httpClient.post(url, data);
  }

  async updatePaciente(id, data) {
    console.log(`📋 [ClinicaApiService] Atualizando PACIENTE ID: ${id}`, data);
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.pacientes}/${id}`;
    return this.httpClient.put(url, data);
  }

  async deletePaciente(id) {
    console.log(`📋 [ClinicaApiService] Deletando PACIENTE ID: ${id}`);
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.pacientes}/${id}`;
    return this.httpClient.delete(url);
  }

  // ========== MÉDICOS ==========

  async getMedicos() {
    console.log("👨‍⚕️ [ClinicaApiService] Solicitando MÉDICOS...");
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.medicos}`;
    try {
      const dados = await this.httpClient.get(url);
      console.log(
        `✅ [ClinicaApiService] Médicos retornados: ${Array.isArray(dados) ? dados.length : "?"} registros`,
      );
      return dados;
    } catch (error) {
      console.error(
        "❌ [ClinicaApiService] Erro ao buscar médicos:",
        error.message,
      );
      throw error;
    }
  }

  async getMedicoById(id) {
    console.log(`👨‍⚕️ [ClinicaApiService] Solicitando MÉDICO ID: ${id}`);
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.medicos}/${id}`;
    return this.httpClient.get(url);
  }

  async createMedico(data) {
    console.log("👨‍⚕️ [ClinicaApiService] Criando MÉDICO:", data);
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.medicos}`;
    return this.httpClient.post(url, data);
  }

  async updateMedico(id, data) {
    console.log(`👨‍⚕️ [ClinicaApiService] Atualizando MÉDICO ID: ${id}`, data);
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.medicos}/${id}`;
    return this.httpClient.put(url, data);
  }

  async deleteMedico(id) {
    console.log(`👨‍⚕️ [ClinicaApiService] Deletando MÉDICO ID: ${id}`);
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.medicos}/${id}`;
    return this.httpClient.delete(url);
  }

  // ========== CONSULTAS ==========

  async getConsultas() {
    console.log("📅 [ClinicaApiService] Solicitando CONSULTAS...");
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.consultas}`;
    try {
      const dados = await this.httpClient.get(url);
      console.log(
        `✅ [ClinicaApiService] Consultas retornadas: ${Array.isArray(dados) ? dados.length : "?"} registros`,
      );
      return dados;
    } catch (error) {
      console.error(
        "❌ [ClinicaApiService] Erro ao buscar consultas:",
        error.message,
      );
      throw error;
    }
  }

  async getConsultaById(id) {
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.consultas}/${id}`;
    return this.httpClient.get(url);
  }

  async createConsulta(data) {
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.consultas}`;
    return this.httpClient.post(url, data);
  }

  async updateConsulta(id, data) {
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.consultas}/${id}`;
    return this.httpClient.put(url, data);
  }

  async deleteConsulta(id) {
    const url = `${this.baseUrl}${config.clinicaApi.endpoints.consultas}/${id}`;
    return this.httpClient.delete(url);
  }
}

export default ClinicaApiService;
