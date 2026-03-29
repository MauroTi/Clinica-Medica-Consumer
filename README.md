# 🏥 Clinica Consumer - API Cliente MVC + SOLID

Aplicação Node.js que consome a API do **Clinica_Medica_Node** utilizando arquitetura **MVC + SOLID** com padrões profissionais de produção.

## 🎯 Objetivo

Criar um cliente robusto e escalável que consome a API do Clinica_Medica_Node, demonstrando boas práticas de:
- ✅ **MVC** (Model-View-Controller)
- ✅ **SOLID** (5 princípios de design)
- ✅ **Dependency Injection** (Inversão de Controle)
- ✅ **Repository Pattern** (Abstração de dados)
- ✅ **Use Cases Pattern** (Isolamento de lógica)
- ✅ **Retry Logic** (Resiliência)
- ✅ **Error Handling** (Tratamento de erros)

---

## 🏗️ Arquitetura

```
clinica_consumer/
├── index.js                    # Aplicação principal
├── config.js                   # Configurações centralizadas
├── package.json               # Dependências
├── .env                       # Variáveis de ambiente (local)
├── .env.example              # Template de variáveis
├── .gitignore
└── src/
    ├── core/                  # Camada de núcleo
    │   ├── ServiceContainer.js    # Inversão de Controle (DI)
    │   └── HttpClient.js          # Cliente HTTP com retry
    │
    ├── services/              # Camada de serviços
    │   └── ClinicaApiService.js   # Abstração da API
    │
    ├── repositories/          # Camada de dados
    │   └── index.js              # Repository Pattern
    │
    ├── useCases/              # Lógica de negócio
    │   └── index.js              # Use Cases (Interactors)
    │
    ├── controllers/           # Camada de apresentação
    │   └── index.js              # HTTP Handlers
    │
    ├── routes/                # Definição de rotas
    │   └── index.js              # Express routes
    │
    └── setup/                 # Configuração inicial
        └── setupDependencies.js  # Bootstrap DI
```

---

## 🔄 Fluxo de Requisição

```
HTTP Request
    ↓
Route (Express Router)
    ↓
Controller (HTTP Handler)
    ↓
Use Case (Business Logic)
    ↓
Repository (Data Abstraction)
    ↓
ClinicaApiService (API Wrapper)
    ↓
HttpClient (Axios + Retry)
    ↓
Clinica_Medica_Node API
    ↓
HTTP Response
```

---

## 🚀 Guia de Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Clinica_Medica_Node rodando em `http://localhost:3000`

### Passos

1. **Clonar o projeto** (se necessário)
```bash
cd c:\xampp\htdocs\Node\clinica_consumer
```

2. **Instalar dependências**
```bash
npm install
```

3. **Configurar variáveis de ambiente**
```bash
# O arquivo .env já está configurado com valores padrão
# Para produção, ajuste conforme necessário
```

4. **Iniciar a aplicação**

**Modo desenvolvimento** (com nodemon - reload automático):
```bash
npm run dev
```

**Modo produção**:
```bash
npm start
```

5. **Verificar saúde da aplicação**
```bash
curl http://localhost:3001/health
```

---

## 📡 Endpoints Disponíveis

### Health Check
```http
GET http://localhost:3001/health
```

### Pacientes
```http
GET    /api/pacientes           # Listar todos
GET    /api/pacientes/:id       # Obter por ID
POST   /api/pacientes           # Criar novo
PUT    /api/pacientes/:id       # Atualizar
DELETE /api/pacientes/:id       # Deletar
```

### Médicos
```http
GET    /api/medicos             # Listar todos
GET    /api/medicos/:id         # Obter por ID
POST   /api/medicos             # Criar novo
PUT    /api/medicos/:id         # Atualizar
DELETE /api/medicos/:id         # Deletar
```

### Consultas
```http
GET    /api/consultas           # Listar todas
GET    /api/consultas/:id       # Obter por ID
POST   /api/consultas           # Criar nova
PUT    /api/consultas/:id       # Atualizar
DELETE /api/consultas/:id       # Deletar
```

---

## 🧪 Exemplos de Uso

### 1. Listar Pacientes
```bash
curl -X GET http://localhost:3001/api/pacientes
```

**Resposta (sucesso)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "11999999999",
      "cpf": "12345678900"
    }
  ]
}
```

### 2. Obter Paciente por ID
```bash
curl -X GET http://localhost:3001/api/pacientes/1
```

### 3. Criar Novo Paciente
```bash
curl -X POST http://localhost:3001/api/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "telefone": "11988888888",
    "cpf": "98765432100"
  }'
```

### 4. Atualizar Paciente
```bash
curl -X PUT http://localhost:3001/api/pacientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Updated",
    "email": "joao.updated@email.com"
  }'
```

### 5. Deletar Paciente
```bash
curl -X DELETE http://localhost:3001/api/pacientes/1
```

---

## 🏛️ Princípios SOLID Aplicados

### 1. **S** - Single Responsibility Principle
Cada classe tem uma única responsabilidade:
- `HttpClient` → Apenas requisições HTTP
- `ClinicaApiService` → Apenas chamadas à API
- `PacienteRepository` → Apenas acesso a dados
- `GetPacientesUseCase` → Apenas lógica de "listar pacientes"
- `PacienteController` → Apenas manipulação HTTP

### 2. **O** - Open/Closed Principle
Código aberto para extensão, fechado para modificação:
- `BaseRepository` pode ser estendido para novos repositórios
- `BaseUseCase` pode ser estendido para novos use cases
- `IApiService` pode ter múltiplas implementações

### 3. **L** - Liskov Substitution Principle
Subclasses podem substituir classes base:
- Qualquer `ClinicaApiService` substitui `IApiService`
- Qualquer Repository substitui `BaseRepository`
- Qualquer UseCase substitui `BaseUseCase`

### 4. **I** - Interface Segregation Principle
Interfaces específicas e focadas:
- `IApiService` define contrato para serviços de API
- `BaseRepository` define contrato para repositories
- `BaseUseCase` define contrato para use cases

### 5. **D** - Dependency Inversion Principle
Dependências injetadas, não criadas localmente:
- `ServiceContainer` gerencia todas as dependências
- Construtores recebem dependências, não as criam
- Fácil de testar e mockar

---

## 🔧 Configuração

### config.js
```javascript
export default {
  port: 3001,
  clinicaApi: {
    baseUrl: 'http://localhost:3000',
    endpoints: {
      pacientes: '/api/pacientes',
      medicos: '/api/medicos',
      consultas: '/api/consultas'
    }
  },
  httpClient: {
    timeout: 5000,
    retryAttempts: 3,
    retryDelay: 1000
  }
}
```

### Variáveis de Ambiente (.env)
```env
PORT=3001
NODE_ENV=development
CLINICA_API_URL=http://localhost:3000
API_REQUEST_TIMEOUT=5000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
```

---

## 🛡️ Recursos de Resiliência

### Retry Logic
O `HttpClient` implementa retry automático com backoff exponencial:
- **Tentativas**: 3 por padrão
- **Backoff**: 1s, 2s, 4s (exponencial)
- **Aplicado a**: Todos os erros de rede

### Error Handling
Tratamento robusto de erros em todas as camadas:
- Validação em Use Cases
- Try/catch em Controllers
- Middleware de erro global
- Respostas consistentes

### Health Check
```bash
curl http://localhost:3001/health
```

Resposta:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "apiVersion": "1.0.0",
  "consumingApi": "http://localhost:3000"
}
```

---

## 🧪 Testes

### Executar Testes
```bash
npm test
```

### Testes com Coverage
```bash
npm run test:coverage
```

*Nota: Testes a ser implementados*

---

## 📦 Dependências

```json
{
  "express": "^4.18.2",
  "axios": "^1.6.5",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

---

## 🔗 Links Úteis

- **API Original**: http://localhost:3000
- **Health Check**: http://localhost:3001/health
- **Express**: https://expressjs.com
- **Axios**: https://axios-http.com
- **SOLID Principles**: https://en.wikipedia.org/wiki/SOLID

---

## 📝 Próximos Passos

- [ ] Adicionar testes unitários (Jest)
- [ ] Adicionar testes de integração
- [ ] Implementar autenticação JWT
- [ ] Adicionar logging estruturado
- [ ] Implementar cache com Redis
- [ ] Documentação OpenAPI/Swagger
- [ ] Rate limiting
- [ ] Métricas e monitoramento

---

## 📄 Licença

Projeto de demonstração educacional.

---

## 👨‍💻 Desenvolvimento

Criado com ❤️ usando Node.js e melhores práticas de engenharia de software.

**Padrões de Arquitetura**:
- MVC (Model-View-Controller)
- SOLID Principles
- Dependency Injection
- Repository Pattern
- Use Case Pattern

**Características**:
- ✅ Camadas bem definidas
- ✅ Separação de responsabilidades
- ✅ Fácil de testar
- ✅ Fácil de estender
- ✅ Tratamento robusto de erros
- ✅ Retry com backoff exponencial
