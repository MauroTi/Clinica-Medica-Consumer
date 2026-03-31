// ============================================================================
// CLIENTE HTTP COM RETRY E TRATAMENTO DE ERROS
// ============================================================================

import axios from "axios";
import { config } from "../../config.js";

class HttpClient {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: config.requestTimeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Faz requisição com retry automático
   * @param {string} method - Método HTTP
   * @param {string} url - URL
   * @param {*} data - Dados (opcional)
   * @returns {Promise<*>} Resposta da API
   */
  async request(method, url, data = null) {
    let lastError = null;

    for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
      try {
        console.log(`🔗 [${method}] ${url} (tentativa ${attempt})`);

        const config = {
          method,
          url,
        };

        // Não enviar data em GET/DELETE
        if (data && !["GET", "DELETE"].includes(method)) {
          config.data = data;
        }

        const response = await this.axiosInstance(config);

        console.log(`✅ Sucesso [${response.status}]: ${url}`);
        console.log(`   Dados retornados:`, response.data);

        return response.data;
      } catch (error) {
        lastError = error;

        console.warn(`⚠️  Tentativa ${attempt}/${config.retryAttempts} falhou`);
        console.warn(`   Erro: ${error.message}`);

        if (error.response) {
          console.warn(`   Status: ${error.response.status}`);
          console.warn(`   Data type: ${typeof error.response.data}`);
          console.warn(`   Data value: ${JSON.stringify(error.response.data)}`);
        }

        // Se é último attempt, lança erro
        if (attempt === config.retryAttempts) {
          throw this._handleError(error);
        }

        // Aguarda antes de tentar novamente
        await this._delay(config.retryDelay * attempt);
      }
    }

    throw lastError;
  }

  /**
   * GET request
   */
  async get(url) {
    return this.request("GET", url);
  }

  /**
   * POST request
   */
  async post(url, data) {
    return this.request("POST", url, data);
  }

  /**
   * PUT request
   */
  async put(url, data) {
    return this.request("PUT", url, data);
  }

  /**
   * DELETE request
   */
  async delete(url) {
    return this.request("DELETE", url);
  }

  /**
   * Trata erros da API
   */
  _handleError(error) {
    console.error("❌ ERRO HTTP:", error.message);

    if (error.response) {
      // Erro da API
      console.error("   Status:", error.response.status);
      console.error("   Dados:", error.response.data);
      throw new Error(
        `API Error ${error.response.status}: ${error.response.data?.message || "Erro desconhecido"}`,
      );
    } else if (error.request) {
      // Sem resposta
      console.error("   Sem resposta do servidor:", error.message);
      throw new Error(`Sem resposta do servidor: ${error.message}`);
    }
    // Erro na requisição
    console.error("   Erro na requisição:", error.message);
    throw new Error(`Erro na requisição: ${error.message}`);
  }

  /**
   * Aguarda x milissegundos
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default HttpClient;
