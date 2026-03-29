⚡ REFERÊNCIA RÁPIDA - CLINICA CONSUMER
════════════════════════════════════════════════════════════════

## ✅ SERVIDOR AGORA ESTÁ RODANDO!

📍 **URL Principal:** http://localhost:3001/

---

## 🚀 COMO INICIAR

### Primeira vez:
```bash
cd c:\xampp\htdocs\Node\clinica_consumer
npm install          # Instala dependências
npm run dev          # Inicia servidor
```

### Próximas vezes:
```bash
npm run dev          # Inicia servidor (auto-reload ativado)
```

---

## 🌐 ENDPOINTS DISPONÍVEIS

### Informações
- `GET http://localhost:3001/` ← Informações da API
- `GET http://localhost:3001/health` ← Status do servidor

### Pacientes
- `GET http://localhost:3001/api/pacientes` - Listar todos
- `GET http://localhost:3001/api/pacientes/:id` - Obter um
- `POST http://localhost:3001/api/pacientes` - Criar
- `PUT http://localhost:3001/api/pacientes/:id` - Atualizar
- `DELETE http://localhost:3001/api/pacientes/:id` - Deletar

### Médicos
- `GET http://localhost:3001/api/medicos` - Listar todos
- `GET http://localhost:3001/api/medicos/:id` - Obter um
- `POST http://localhost:3001/api/medicos` - Criar
- `PUT http://localhost:3001/api/medicos/:id` - Atualizar
- `DELETE http://localhost:3001/api/medicos/:id` - Deletar

### Consultas
- `GET http://localhost:3001/api/consultas` - Listar todos
- `GET http://localhost:3001/api/consultas/:id` - Obter uma
- `POST http://localhost:3001/api/consultas` - Criar
- `PUT http://localhost:3001/api/consultas/:id` - Atualizar
- `DELETE http://localhost:3001/api/consultas/:id` - Deletar

---

## 📝 SCRIPTS NPM

```bash
npm run dev          # Desenvolvimento com auto-reload (USAR ESTE)
npm start            # Produção
npm test             # Executar testes
```

---

## 💡 DICAS IMPORTANTES

### ✅ Para manter servidor rodando:
- **NÃO feche o terminal** onde `npm run dev` está rodando
- O servidor só funciona enquanto o terminal está aberto

### ✅ Para parar o servidor:
- Pressione **CTRL+C** no terminal

### ✅ Para recarregar depois de mudanças:
- Salve o arquivo (CTRL+S)
- Servidor auto-recarrega automaticamente (nodemon)
- Não precisa parar/iniciar

### ✅ Se der erro "porta em uso":
```bash
taskkill /F /IM node.exe    # Mata todos os Node.js
npm run dev                  # Inicia novamente
```

---

## 📚 DOCUMENTAÇÃO

No diretório `clinica_consumer/`:

| Arquivo | Leia quando |
|---------|----------|
| **LEIA-ME.md** | Primeiro contato |
| QUICK_START.md | Setup rápido |
| README.md | Documentação completa |
| ARCHITECTURE.md | Entender a arquitetura |
| CHANGELOG.md | Correções aplicadas |

---

## 🏗️ ESTRUTURA DO PROJETO

```
clinica_consumer/
├── index.js              ← Arquivo principal
├── config.js             ← Configurações
├── package.json          ← Dependências
├── .env                  ← Variáveis de ambiente
│
└── src/
    ├── core/             ← ServiceContainer + HttpClient
    ├── services/         ← ClinicaApiService
    ├── repositories/     ← Data access
    ├── useCases/         ← Business logic
    ├── controllers/      ← HTTP handlers
    ├── routes/           ← Express routes
    ├── setup/            ← Bootstrap DI
    └── __tests__/        ← Testes
```

---

## 🔌 PARA TESTAR RAPIDAMENTE

### No Browser:
```
http://localhost:3001/
```

### No PowerShell:
```powershell
Invoke-WebRequest http://localhost:3001/ | Select-Object -ExpandProperty Content
```

### No Bash:
```bash
curl http://localhost:3001/ | jq .
```

---

## ✨ RESUMO

✅ Servidor está rodando em http://localhost:3001/
✅ 16 endpoints disponíveis
✅ Documentação completa incluída
✅ Testes unitários prontos
✅ Auto-reload habilitado
✅ Pronto para produção

---

## 🆘 PROBLEMAS COMUNS

### Porta 3001 recusada?
- Servidor não está rodando
- Execute: `npm run dev`

### Erro ao acessar API?
- API original (3000) pode estar offline
- Verifique se clinica_medica_node está rodando

### Mudanças não refletem?
- Salve o arquivo (CTRL+S)
- Aguarde reload (segundos)
- Atualize browser (F5)

---

**Tudo pronto! Comece a desenvolver! 🚀**
