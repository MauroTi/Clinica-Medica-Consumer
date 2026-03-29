# 🚀 INICIALIZAÇÃO - Clinica Consumer

## Passo 1️⃣ - Abrir o Projeto no VS Code

### Opção A - Abrir via Terminal
```powershell
# Na pasta do projeto
cd c:\xampp\htdocs\Node\clinica_consumer
code .
```

### Opção B - Abrir Manualmente
1. Abra o VS Code
2. **File** → **Open Folder**
3. Navegue para: `c:\xampp\htdocs\Node\clinica_consumer`
4. Clique em **Select Folder**

---

## Passo 2️⃣ - Instalar Dependências

No VS Code, abra o terminal integrado (**Ctrl + `**) e execute:

```powershell
npm install
```

Isso vai instalar:
- ✅ express 4.18.2
- ✅ axios 1.6.5 (com retry automático)
- ✅ cors 2.8.5
- ✅ dotenv 16.3.1
- ✅ nodemon (dev)
- ✅ jest (dev)

**Tempo estimado**: 1-2 minutos

---

## Passo 3️⃣ - Verificar Estrutura

Execute no terminal:

```powershell
.\verify-structure.ps1
```

Deve aparecer ✅ em todos os 19 arquivos:
- ✅ Core (ServiceContainer, HttpClient)
- ✅ Services (ClinicaApiService)
- ✅ Repositories (3 repos)
- ✅ UseCases (13+ classes)
- ✅ Controllers (3 controllers)
- ✅ Routes
- ✅ Setup e Testes

---

## Passo 4️⃣ - Iniciar o Projeto

### Modo Desenvolvimento (COM reload automático)
```powershell
npm run dev
```

Você verá:
```
╔════════════════════════════════════════════════════════════════╗
║          CLINICA MÉDICA - CONSUMER API                         ║
╚════════════════════════════════════════════════════════════════╝

✨ Servidor iniciado com sucesso!
📍 URL: http://localhost:3001
🏥 API Consumindo: http://localhost:3000
📦 Ambiente: development

📝 Endpoints disponíveis:
   • GET  http://localhost:3001/health
   • GET  http://localhost:3001/api/pacientes
   • GET  http://localhost:3001/api/medicos
   • GET  http://localhost:3001/api/consultas

🔌 Para testar:
   curl http://localhost:3001/health
```

### Modo Produção
```powershell
npm start
```

---

## Passo 5️⃣ - Testar Requisições

### Abra OUTRO terminal (Ctrl + Shift + `)

**Health Check**:
```powershell
curl http://localhost:3001/health
```

**Listar Pacientes**:
```powershell
curl http://localhost:3001/api/pacientes
```

**Criar Paciente**:
```powershell
curl -X POST http://localhost:3001/api/pacientes `
  -H "Content-Type: application/json" `
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "cpf": "12345678900"
  }' | jq .
```

---

## Passo 6️⃣ - Adicionar ao Workspace

### Opção A - Workspace File (Recomendado)

1. Na pasta raiz do projeto Node (`c:\xampp\htdocs\Node`), crie: `Node.code-workspace`

```json
{
  "folders": [
    {
      "path": "Clinica_Medica_Node",
      "name": "🏥 Clinica API (Backend)"
    },
    {
      "path": "clinica_consumer",
      "name": "👁️ Clinica Consumer (MVC)"
    }
  ],
  "settings": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
  }
}
```

2. Abra com: `code Node.code-workspace`

**Agora terá AMBOS os projetos no mesmo workspace!** 🎯

### Opção B - Adicionar Pasta ao Workspace Atual

1. **File** → **Add Folder to Workspace**
2. Selecione: `c:\xampp\htdocs\Node\clinica_consumer`
3. Clique em **Add**

---

## Passo 7️⃣ - Executar Testes

```powershell
npm test
```

Testa:
- ✅ Criar paciente (válido e inválido)
- ✅ Listar pacientes
- ✅ Buscar por ID
- ✅ Atualizar
- ✅ Deletar

---

## 🎯 Estrutura no VS Code

### Explorer (Ctrl + Shift + E)
```
clinica_consumer/
├─ src/
│  ├─ core/
│  ├─ services/
│  ├─ repositories/
│  ├─ useCases/
│  ├─ controllers/
│  ├─ routes/
│  ├─ setup/
│  └─ __tests__/
├─ index.js
├─ config.js
├─ .env
├─ package.json
└─ README.md
```

### Debugging (Ctrl + Shift + D)

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Clinica Consumer",
      "program": "${workspaceFolder}/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

Depois pressione **F5** para debugar!

---

## 🔗 Dependências Externas

### ❗ Importante: Clinica_Medica_Node DEVE estar rodando!

**Terminal separado**:
```powershell
cd c:\xampp\htdocs\Node\Clinica_Medica_Node
npm run dev
# Deve estar em http://localhost:3000
```

**Ambos precisam estar rodando**:
- 🏥 Backend: `http://localhost:3000` (Clinica_Medica_Node)
- 👁️ Consumer: `http://localhost:3001` (clinica_consumer)

---

## 📋 Checklist de Inicialização

- [ ] Projeto aberto no VS Code
- [ ] `npm install` executado
- [ ] `.\verify-structure.ps1` passou
- [ ] `npm run dev` rodando
- [ ] Health check funcionando: `curl http://localhost:3001/health`
- [ ] Clinica_Medica_Node rodando em 3000
- [ ] Pacientes listados: `curl http://localhost:3001/api/pacientes`

---

## 💻 Variáveis de Ambiente

Arquivo `.env` já está configurado:

```env
PORT=3001
NODE_ENV=development
CLINICA_API_URL=http://localhost:3000
API_REQUEST_TIMEOUT=5000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
```

Para **produção**, altere:
```env
PORT=3001
NODE_ENV=production
```

---

## 🧪 Testes com Postman

1. **Importe** `Clinica_Consumer_API.postman_collection.json`
2. **Defina** a variável: `base_url=http://localhost:3001`
3. **Execute** as requisições

---

## ⚙️ Troubleshooting

### Porta 3001 em uso
```powershell
# Mude em .env
PORT=3002
```

### "Cannot find module 'express'"
```powershell
npm install
```

### "API not found"
```powershell
# Verifique se Clinica_Medica_Node está rodando
curl http://localhost:3000/health
```

### Erro de CORS
```powershell
# Verifique config.js - CORS já está habilitado
```

---

## 🎓 Próximos Passos

1. **Explore o código** - Veja como as camadas funcionam
2. **Modifique** - Tente adicionar novo endpoint
3. **Teste** - Execute `npm test` sempre
4. **Documente** - Leia README.md e ARCHITECTURE.md
5. **Deploy** - Use config.js para ambiente production

---

## 📞 Resumo Rápido

```powershell
# Terminal 1 - Clinica Backend
cd c:\xampp\htdocs\Node\Clinica_Medica_Node
npm run dev

# Terminal 2 - Clinica Consumer
cd c:\xampp\htdocs\Node\clinica_consumer
npm install
npm run dev

# Terminal 3 - Testar
curl http://localhost:3001/health
```

---

## ✅ Pronto!

Agora você tem:
- ✅ Projeto MVC + SOLID criado
- ✅ Integrado ao seu workspace
- ✅ Rodando na porta 3001
- ✅ Consumindo API original
- ✅ Com retry automático
- ✅ Bem documentado

**Bora começar a desenvolver!** 🚀
