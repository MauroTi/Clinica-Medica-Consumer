# 📊 Dashboard Clínica Médica

Interface profissional e moderna para gerenciamento de dados da Clínica Médica, construída com **HTML5**, **CSS3**, **JavaScript vanilla** e **Chart.js**.

## 🎯 Características

✅ **Dashboard Completo**
- Estatísticas em tempo real
- Gráficos interativos (Pizza, Barras)
- Atualização automática (a cada 5 minutos)

✅ **Múltiplas Seções**
- 📊 Dashboard com gráficos
- 👥 Tabela de Pacientes
- 👨‍⚕️ Tabela de Médicos
- 📅 Tabela de Consultas

✅ **Gráficos Disponíveis**
- Pacientes por Gênero (Pizza)
- Médicos por Especialidade (Pizza)
- Consultas por Status (Barras Horizontais)
- Consultas por Médico - Top 10 (Barras)

✅ **Recursos Modernos**
- Design responsivo (Desktop, Tablet, Mobile)
- Navbar e Sidebar fixas
- Busca em tempo real nas tabelas
- Animações suaves
- Tema dark-friendly
- Ícones Font Awesome
- Bootstrap 5 para estrutura

## 🚀 Como Usar

### 1. Iniciar o Servidor

```bash
cd c:\xampp\htdocs\Node\clinica_consumer
npm run dev
```

### 2. Abrir no Navegador

```
http://localhost:3001/
```

### 3. Dashboard carrega automaticamente com:
- ✅ Total de Pacientes
- ✅ Total de Médicos
- ✅ Total de Consultas
- ✅ Consultas de Hoje
- ✅ Todos os gráficos preenchidos

## 📁 Estrutura de Arquivos

```
frontend/
├── index.html          # HTML principal (estrutura do dashboard)
├── css/
│   └── style.css       # CSS customizado com variáveis e animações
├── js/
│   └── app.js          # JavaScript com toda a lógica
└── ...
```

## 🎨 Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Styling moderno com variáveis CSS |
| **JavaScript** | Lógica e consumo de API |
| **Chart.js 4.4** | Gráficos interativos |
| **Bootstrap 5** | Framework CSS responsivo |
| **Font Awesome 6.4** | Ícones |

## 📊 Gráficos e Dados

### Dashboard mostra:

**Cards de Estatísticas:**
- Total Pacientes
- Total Médicos  
- Total Consultas
- Consultas Hoje

**Gráficos (Pizza):**
- Distribuição de Pacientes por Gênero
- Distribuição de Médicos por Especialidade

**Gráficos (Barras):**
- Consultas agrupadas por Status (Confirmada, Pendente, Cancelada, Realizada)
- Top 10 Médicos com mais Consultas

## 🔄 Funcionalidades

### Navegação
- Clique na Navbar ou Sidebar para mudar de seção
- Busca em tempo real em cada tabela

### Atualização de Dados
- Clique em "Atualizar" para recarregar dados manualmente
- Auto-refresh a cada 5 minutos

### Status do Servidor
- Indicador visual de conexão (verde/vermelho)
- Timestamp da última atualização

## 🎯 API Consumida

O dashboard consome dados de:
- `GET /api/pacientes` - Lista de todos os pacientes
- `GET /api/medicos` - Lista de todos os médicos
- `GET /api/consultas` - Lista de todas as consultas

Todos os dados são processados no frontend para gerar os gráficos.

## 🎨 Cores e Temas

**Paleta de Cores:**
- 🔵 Primária: #2563eb (Azul)
- 🟢 Sucesso: #10b981 (Verde)
- 🟡 Aviso: #f59e0b (Amarelo)
- 🔴 Perigo: #ef4444 (Vermelho)
- 🔵 Info: #06b6d4 (Ciano)

## 📱 Responsividade

✅ **Desktop** - Layout completo com sidebar
✅ **Tablet** - Sidebar colapsável
✅ **Mobile** - Navbar responsiva, sidebar adaptada

## 💡 Dicas

1. **Filtrar dados**: Use a busca em cada seção
2. **Atualizar manualmente**: Clique no botão "Atualizar"
3. **Ver API**: Acesse `http://localhost:3001/api`
4. **Ver Health**: Acesse `http://localhost:3001/health`

## 🐛 Troubleshooting

### Dashboard não carrega dados
- Verifique se a API está rodando em `http://localhost:3000`
- Abra o Console (F12) para ver mensagens de erro
- Clique em "Atualizar"

### Gráficos não aparecem
- Verifique se Chart.js está sendo carregado
- Abra o Console (F12) e procure por erros

### Tabelas vazias
- Verifique se há dados na API
- Execute `TESTAR_CONEXAO.ps1` para testar

## 📞 Suporte

Para problemas, verifique:
1. Se a API está rodando (`http://localhost:3000`)
2. Se o servidor está rodando (`http://localhost:3001`)
3. Se o arquivo `frontend/index.html` existe
4. Console do navegador (F12) para erros

## 📄 Licença

Este projeto faz parte do sistema de Clínica Médica.

---

**Desenvolvido com ❤️ - 2026**
