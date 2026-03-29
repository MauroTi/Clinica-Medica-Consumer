// ============================================================================
// DEPENDÊNCIA INJEÇÃO - SERVICE LOCATOR
// ============================================================================

class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * Registra um serviço no container
   * @param {string} name - Nome do serviço
   * @param {Function} factory - Função que cria o serviço
   * @param {boolean} singleton - Se deve ser singleton
   */
  register(name, factory, singleton = false) {
    if (typeof factory !== 'function') {
      throw new Error(`Factory para ${name} não é uma função`);
    }
    this.services.set(name, { factory, singleton });
  }

  /**
   * Resolve um serviço
   * @param {string} name - Nome do serviço
   * @returns {*} Instância do serviço
   */
  resolve(name) {
    const service = this.services.get(name);

    if (!service) {
      throw new Error(`Serviço ${name} não foi registrado`);
    }

    // Se é singleton
    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory());
      }
      return this.singletons.get(name);
    }

    // Caso contrário, cria nova instância
    return service.factory();
  }

  /**
   * Limpa todos os singletons
   */
  clear() {
    this.singletons.clear();
  }
}

export default new ServiceContainer();
