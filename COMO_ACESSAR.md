# 🚀 COMO ACESSAR O SITE - GUIA SIMPLES

## ⚡ Forma Mais Rápida (2 passos)

### Windows

**Duplo clique em um desses arquivos:**
- `INICIAR.bat` - Para CMD
- `INICIAR.ps1` - Para PowerShell

Ou execute no terminal:
```powershell
cd c:\xampp\htdocs\Node\clinica_consumer
npm run dev
```

### WSL/Linux/Mac

```bash
cd ~/path/to/clinica_consumer
npm run dev
```

---

## ⏳ Aguarde a Mensagem

Quando ver isto no terminal, o servidor está pronto:

```
╔════════════════════════════════════════════════════════════════╗
║          CLINICA MÉDICA - CONSUMER API                         ║
╚════════════════════════════════════════════════════════════════╝

✨ Servidor iniciado com sucesso!
📍 URL: http://localhost:3001
🏥 API Consumindo: http://localhost:3000
```

---

## 🌐 Acessar o Site

### Opção 1 - Navegador (Mais Fácil)

Abra seu navegador e acesse:

```
http://localhost:3001/
```

### Opção 2 - Terminal

```bash
curl http://localhost:3001/
```

### Opção 3 - PowerShell

```powershell
Invoke-WebRequest -Uri 'http://localhost:3001/'
```

---

## ✅ Resposta Esperada

Se tudo funcionar, você verá algo assim:

```json
{
  "name": "Clinica Consumer - API Cliente",
  "version": "1.0.0",
  "description": "Cliente MVC + SOLID que consome Clinica_Medica_Node API",
  "consumingApi": "http://localhost:3000",
  "port": 3001,
  "environment": "development",
  "availableEndpoints": {
    "health": "GET /health",
    "pacientes": {
      "list": "GET /api/pacientes",
      "get": "GET /api/pacientes/:id",
      "create": "POST /api/pacientes",
      "update": "PUT /api/pacientes/:id",
      "delete": "DELETE /api/pacientes/:id"
    },
    ...
  }
}
```

---

## 🔧 Troubleshooting

### "Não consigo acessar"

1. **Verificar se o servidor está rodando**
   - Procure a mensagem "Servidor iniciado com sucesso!"
   - Se não vir, aguarde mais tempo ou reinicie

2. **Verificar a porta**
   - Abra terminal e execute:
   ```bash
   netstat -ano | findstr :3001
   ```
   - Se não houver saída, o servidor não está rodando

3. **Porta em uso**
   - Se houver algo na porta 3001:
   ```bash
   taskkill /F /PID [PID]
   ```
   - Depois reinicie

4. **Dependências não instaladas**
   ```bash
   npm install
   npm run dev
   ```

---

## 📝 Checklist

- [ ] Terminal aberto no diretório `clinica_consumer`
- [ ] Executou `npm run dev` (ou clicou INICIAR.bat/ps1)
- [ ] Viu mensagem "Servidor iniciado com sucesso!"
- [ ] Abriu `http://localhost:3001/` no navegador
- [ ] Recebeu resposta JSON

---

## 🎉 Pronto!

Se chegou aqui, seu projeto está **100% funcional**!

```
http://localhost:3001/
```

Acesse agora! ✨
