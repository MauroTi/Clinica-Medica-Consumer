# 🎯 GUIA DE USO - DASHBOARD CLÍNICA MÉDICA

## ✨ Seu Dashboard está pronto!

Acesse: **http://localhost:3001**

---

## 📊 O que você vai ver:

### 🏠 Dashboard (Seção Principal)

**Cards de Resumo:**
- 👥 **Total de Pacientes** - Quantidade de todos os pacientes
- 👨‍⚕️ **Total de Médicos** - Quantidade de todos os médicos
- 📅 **Total de Consultas** - Quantidade de todas as consultas
- ⏰ **Consultas Hoje** - Quantidade de consultas agendadas para hoje

### 📈 Gráficos

**1. Pacientes por Gênero (Pizza)**
- Mostra a distribuição de pacientes entre Masculino, Feminino e Outro
- Cores: Azul, Rosa e Roxo

**2. Médicos por Especialidade (Pizza)**
- Mostra quantos médicos há em cada especialidade
- Cores variadas para cada especialidade

**3. Consultas por Status (Barras Horizontais)**
- Confirmada (Verde)
- Pendente (Amarelo)
- Cancelada (Vermelho)
- Realizada (Azul)

**4. Top 10 Médicos com mais Consultas (Barras)**
- Mostra quais médicos têm mais consultas marcadas
- Ordenado de forma decrescente

---

## 🧭 Navegação

### Navbar (Topo)
Clique em:
- 📊 **Dashboard** - Volta para a página principal com gráficos
- 👥 **Pacientes** - Tabela com todos os pacientes
- 👨‍⚕️ **Médicos** - Tabela com todos os médicos
- 📅 **Consultas** - Tabela com todas as consultas
- 🔄 **Atualizar** - Recarrega todos os dados

### Sidebar (Esquerda)
Menu rápido com as mesmas opções da Navbar

### Status (Sidebar inferior)
- 🟢 **Conectado** - Servidor está rodando corretamente
- 🔴 **Desconectado** - Sem conexão com a API
- ⏱️ **Última atualização** - Horário da última sincronização

---

## 🔍 Buscando Dados

### Em cada seção (Pacientes, Médicos, Consultas):

1. Existe um campo de **busca** no topo da tabela
2. **Digite o que procura** (nome, CPF, CRM, etc)
3. A tabela filtra **em tempo real** enquanto você digita
4. Ótimo para encontrar dados rapidamente!

**Exemplos:**
- Buscar por nome: "João"
- Buscar por CPF: "123.456"
- Buscar por especialidade: "Cardiologia"

---

## ♻️ Atualizar Dados

### Opção 1: Manual
Clique no botão **"🔄 Atualizar"** na Navbar

### Opção 2: Automático
O dashboard **atualiza automaticamente a cada 5 minutos**

### Opção 3: F5
Aperte **F5** no navegador para recarregar a página

---

## 📱 Seções Disponíveis

### 1. 📊 DASHBOARD
**Conteúdo:**
- 4 cards com estatísticas
- 4 gráficos em tempo real
- Indicador de conexão
- Auto-refresh

**Para acessar:** Clique em "Dashboard" no menu

---

### 2. 👥 PACIENTES
**Conteúdo:**
- Tabela com todas os pacientes
- Colunas: ID, Nome, CPF, Telefone, Email, Data Nascimento, Endereço
- Botões: Editar (lápis), Deletar (lixo)
- Busca em tempo real

**Para acessar:** Clique em "Pacientes" no menu

---

### 3. 👨‍⚕️ MÉDICOS
**Conteúdo:**
- Tabela com todos os médicos
- Colunas: ID, Nome, CRM, Especialidade, Telefone, Email
- Badge de especialidade em destaque
- Botões: Editar, Deletar
- Busca em tempo real

**Para acessar:** Clique em "Médicos" no menu

---

### 4. 📅 CONSULTAS
**Conteúdo:**
- Tabela com todas as consultas
- Colunas: ID, Paciente, Médico, Data, Hora, Status, Motivo
- Status com cores diferentes
- Botões: Editar, Deletar
- Busca em tempo real

**Para acessar:** Clique em "Consultas" no menu

---

## 🎨 Entendendo as Cores

| Cor | Significado |
|-----|-------------|
| 🔵 Azul | Dados principais, primária |
| 🟢 Verde | Sucesso, confirmado |
| 🟡 Amarelo | Atenção, pendente |
| 🔴 Vermelho | Erro, cancelado |
| 🔷 Ciano | Informação |

---

## 📊 Como Funcionam os Gráficos

### Gráficos de Pizza 🥧
- **Formato:** Círculo dividido em "fatias"
- **Uso:** Mostrar proporções (partes de um todo)
- **Exemplo:** 60% masculino, 40% feminino

### Gráficos de Barras 📊
- **Formato:** Barras horizontais ou verticais
- **Uso:** Comparar quantidades
- **Exemplo:** 10 consultas com o Dr. João, 8 com a Dra. Maria

---

## 🔗 API Consumida

O dashboard pega dados de:

```
GET /api/pacientes     → Lista todos os pacientes
GET /api/medicos       → Lista todos os médicos
GET /api/consultas     → Lista todas as consultas
```

**Local:** `http://localhost:3000` (API original)
**Consumidor:** `http://localhost:3001` (Este dashboard)

---

## 🚨 Troubleshooting

### ❌ Dados não carregam

**Solução:**
1. Verifique se a API está rodando em `http://localhost:3000`
2. Clique em "Atualizar" para tentar novamente
3. Abra o Console (F12) e procure por erros vermelho
4. Se vir erro "conexão recusada", inicie a API

### ❌ Gráficos não aparecem

**Solução:**
1. Aguarde a página carregar completamente
2. Clique em "Atualizar"
3. Se ainda não aparecer, abra Console (F12)

### ❌ Tabela vazia

**Solução:**
1. Verifique se há dados na API
2. Clique em "Atualizar"
3. Verifique console para erros

### ❌ Página branca

**Solução:**
1. Feche e abra novamente `http://localhost:3001`
2. Limpe o cache (Ctrl+Shift+Del)
3. Verifique se o servidor está rodando

---

## 💡 Dicas Profissionais

✅ **Use a busca** para encontrar dados rapidamente
✅ **Clique em "Atualizar"** antes de tomar decisões importantes
✅ **Veja o indicador de status** para confirmar conectividade
✅ **Abra Console (F12)** para ver mensagens do sistema
✅ **Use no celular** - o dashboard é responsivo!

---

## 📞 Precisa de Ajuda?

1. **Verifique se a API está rodando:** `http://localhost:3000`
2. **Verifique se o dashboard está rodando:** `http://localhost:3001`
3. **Abra o Console (F12)** - tecla F12 no navegador
4. **Procure por erros** em vermelho no Console

---

## 🎯 Atalhos Úteis

| Atalho | Função |
|--------|--------|
| F5 | Recarregar página |
| F12 | Abrir Console do navegador |
| Ctrl+Shift+Del | Limpar cache |
| Ctrl+Shift+C | Inspetor de elementos |

---

## ✨ Recursos Especiais

✅ **Responsivo** - Funciona em Desktop, Tablet e Mobile
✅ **Tempo Real** - Dados atualizados automaticamente
✅ **Gráficos Interativos** - Passe o mouse para ver detalhes
✅ **Busca Rápida** - Filtre em tempo real
✅ **Design Moderno** - Interface profissional e limpa

---

**Aproveite seu Dashboard! 🚀**

Qualquer dúvida, consulte a documentação em:
- `DASHBOARD.md` - Documentação completa
- `README.md` - Overview do projeto

---

*Última atualização: 29 de março de 2026*
