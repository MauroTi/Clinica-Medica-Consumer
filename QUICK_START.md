# 🚀 Guia de Inicialização Rápida - Clinica Consumer

## ✅ Projeto Criado com Sucesso!

Seu novo projeto **Clinica Consumer** foi criado com toda a arquitetura MVC + SOLID implementada.

---

## 📁 Estrutura do Projeto Criada

```
clinica_consumer/
├── 📄 index.js                           ✅ Aplicação principal
├── 📄 config.js                          ✅ Configurações centralizadas
├── 📄 package.json                       ✅ Dependências npm
├── 📄 .env                               ✅ Variáveis de ambiente
├── 📄 .env.example                       ✅ Template de variáveis
├── 📄 .gitignore                         ✅ Git ignore patterns
├── 📄 README.md                          ✅ Documentação completa
├── 📄 Clinica_Consumer_API.postman_collection.json  ✅ Coleção Postman
├── 📄 start.ps1                          ✅ Script de inicialização
├── 📄 verify-structure.ps1               ✅ Verificador de estrutura
│
└── 📁 src/
    ├── 📁 core/
    │   ├── 📄 ServiceContainer.js        ✅ Dependency Injection
    │   └── 📄 HttpClient.js              ✅ Cliente HTTP com retry
    │
    ├── 📁 services/
    │   └── 📄 ClinicaApiService.js       ✅ Abstração da API
    │
    ├── 📁 repositories/
    │   └── 📄 index.js                   ✅ Repository Pattern
    │
    ├── 📁 useCases/
    │   └── 📄 index.js                   ✅ Use Cases (13+ classes)
    │
    ├── 📁 controllers/
    │   └── 📄 index.js                   ✅ Controllers (3 classes)
    │
    ├── 📁 routes/
    │   └── 📄 index.js                   ✅ Route Factories
    │
    ├── 📁 setup/
    │   └── 📄 setupDependencies.js       ✅ Bootstrap DI
    │
    └── 📁 __tests__/
        └── 📄 paciente.test.js           ✅ Testes unitários
```

**Total: 19 arquivos criados com sucesso! ✅**

---

## 🎯 Próximos Passos

### 1️⃣ Verificar Estrutura do Projeto
```powershell
# No diretório do projeto
.\verify-structure.ps1
```

Isso vai confirmar que todos os 19 arquivos foram criados corretamente.

### 2️⃣ Instalar Dependências
```powershell
npm install
```

Instala:
- ✅ express 4.18.2
- ✅ axios 1.6.5 (com retry logic)
- ✅ cors 2.8.5
- ✅ dotenv 16.3.1
- ✅ nodemon (dev - reload automático)
- ✅ jest (dev - testes)

### 3️⃣ Iniciar o Projeto

**Opção A - Modo Desenvolvimento** (com reload automático):
```powershell
npm run dev
```

**Opção B - Modo Produção**:
```powershell
npm start
```

**Opção C - Script Interativo**:
```powershell
.\start.ps1
```

Vai aparecer um menu com opções para iniciar, testar, ou ver informações.

---

## ✨ Verificação Rápida

Após iniciar, teste em outro terminal:

```powershell
# Health Check
curl http://localhost:3001/health

# Listar Pacientes
curl http://localhost:3001/api/pacientes

# Listar Médicos
curl http://localhost:3001/api/medicos

# Listar Consultas
curl http://localhost:3001/api/consultas
```

---

## 🏛️ Arquitetura Implementada

### Camadas

```
┌──────────────────────────────────────┐
│  Express Routes & Controllers        │  HTTP Layer
│  (HTTP Request/Response)             │
└──────────────────────────────────────┘
           ↓↑
┌──────────────────────────────────────┐
│  Use Cases (Business Logic)          │  Business Logic
│  (GetPacientes, CreatePaciente, ...) │
└──────────────────────────────────────┘
           ↓↑
┌──────────────────────────────────────┐
│  Repositories (Data Abstraction)     │  Data Access
│  (PacienteRepo, MedicoRepo, ...)     │
└──────────────────────────────────────┘
           ↓↑
┌──────────────────────────────────────┐
│  ClinicaApiService (API Wrapper)     │  Service
│  (API Calls with abstraction)        │
└──────────────────────────────────────┘
           ↓↑
┌──────────────────────────────────────┐
│  HttpClient (Retry + Backoff)        │  Network
│  (Axios with resilience)             │
└──────────────────────────────────────┘
           ↓↑
┌──────────────────────────────────────┐
│  Clinica_Medica_Node API             │  Backend
│  (http://localhost:3000)             │
└──────────────────────────────────────┘
```

### Princípios SOLID Aplicados

- **S** - Single Responsibility: Cada classe uma responsabilidade
- **O** - Open/Closed: Aberto para extensão, fechado para modificação
- **L** - Liskov Substitution: Subclasses substituem classes base
- **I** - Interface Segregation: Interfaces específicas
- **D** - Dependency Inversion: Dependências injetadas (ServiceContainer)

---

## 🧪 Testes

### Executar Testes
```powershell
npm test
```

### Testes com Coverage
```powershell
npm run test:coverage
```

Os testes já incluem testes para Use Cases (criar, atualizar, deletar, buscar).

---

## 📊 Recursos Implementados

### Resiliência
- ✅ Retry Automático (3 tentativas)
- ✅ Backoff Exponencial (1s, 2s, 4s)
- ✅ Tratamento de erros em todas as camadas

### Funcionalidades
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validação de dados
- ✅ Health check endpoint
- ✅ Middleware CORS
- ✅ Tratamento de erros 404, 500

### Configuração
- ✅ Variáveis de ambiente (.env)
- ✅ Porta configurável (padrão 3001)
- ✅ Timeout configurável
- ✅ Retry configurável

---

## 🔌 Dependências Externas

**Clinica_Medica_Node API**
- URL: http://localhost:3000
- Endpoints consumidos:
  - GET /api/pacientes
  - POST /api/pacientes
  - PUT /api/pacientes/:id
  - DELETE /api/pacientes/:id
  - (idem para médicos e consultas)

---

## 📚 Documentação

- 📄 **README.md** - Guia completo
- 📄 **QUICK_START.md** - Este arquivo
- 📄 **Clinica_Consumer_API.postman_collection.json** - Testes no Postman

---

## 🐛 Troubleshooting

### Porta 3001 já em uso
```powershell
# Mude a porta em .env
PORT=3002
```

### API não encontrada (localhost:3000)
```powershell
# Verifique se Clinica_Medica_Node está rodando
# Mude a URL em config.js ou .env:
CLINICA_API_URL=http://localhost:3000
```

### Erro de dependências
```powershell
# Remova node_modules e reinstale
rmdir node_modules -r
npm install
```

### Retry não funciona
```powershell
# Verifique os parâmetros em config.js:
retryAttempts: 3
retryDelay: 1000  # milissegundos
```

---

## 🎓 Aprendizado

Este projeto demonstra:

1. **Arquitetura em Camadas** - Separação clara de responsabilidades
2. **Dependency Injection** - Inversão de controle com ServiceContainer
3. **Repository Pattern** - Abstração de acesso a dados
4. **Use Case Pattern** - Isolamento de lógica de negócio
5. **SOLID Principles** - Código bem projetado e manutenível
6. **Retry Logic** - Resiliência contra falhas de rede
7. **Error Handling** - Tratamento robusto de erros
8. **Testing** - Testes unitários e mocks

---

## ✅ Checklist de Inicialização

- [ ] Verificar estrutura: `.\verify-structure.ps1`
- [ ] Instalar dependências: `npm install`
- [ ] Revisar .env (padrão ok)
- [ ] Iniciar projeto: `npm run dev`
- [ ] Testar health: `curl http://localhost:3001/health`
- [ ] Testar endpoints
- [ ] Importar Postman collection para testes
- [ ] Executar testes: `npm test`

---

## 🎉 Pronto!

Seu projeto **Clinica Consumer** está pronto para usar! 🚀

```
npm run dev
```

E visite: **http://localhost:3001/health**

---

## 💡 Dicas

- Use o Postman collection para testar endpoints
- Leia README.md para documentação completa
- Modifique config.js para customizar comportamento
- Adicione novos repositories, use cases e controllers mantendo o padrão
- Execute `npm test` para validar mudanças

---

**Desenvolvido com ❤️ usando Node.js + Express + SOLID Principles**
