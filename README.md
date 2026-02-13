# Clientes contact.IA

> Sistema web centralizado para gestão de clientes, consulta de dados e relatórios — substituindo o controle por planilhas.

---

## 📋 Visão Geral

O **Clientes contact.IA** é uma plataforma que centraliza:

- **Cadastro e gestão de clientes** (substitui planilhas)
- **Consulta estruturada** de dados operacionais (tabela existente no Supabase)
- **Relatórios e dashboards** com filtros por clínica, unidade, ação e período
- **Integração com n8n** para automações e fluxos externos

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    MONOREPO                         │
│                                                     │
│  ┌─────────────┐    ┌─────────────┐                │
│  │  /frontend   │    │  /backend    │                │
│  │  React + TS  │───▶│  Python API  │                │
│  └─────────────┘    └──────┬──────┘                │
│                            │                        │
│                   ┌────────┴────────┐               │
│                   │                 │               │
│              ┌────▼────┐     ┌─────▼─────┐         │
│              │ Supabase │     │    n8n     │         │
│              │ (Postgres│     │ (Webhooks) │         │
│              │ + Auth)  │     └───────────┘         │
│              └─────────┘                            │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
|--------|------------|-----------|
| **Frontend** | React + TypeScript | Interface web responsiva |
| **Backend** | Python (API REST) | Lógica de negócio, endpoints |
| **Banco de Dados** | Supabase (PostgreSQL) | Persistência, Auth, RLS |
| **Automação** | n8n (Webhooks) | Fluxos externos e integrações |

---

## 👥 Perfis de Acesso

| Perfil | Permissões |
|--------|------------|
| **Admin** | Gestão de usuários, clientes, relatórios, configurações |
| **Funcionário** | Consulta de registros, visualização de dashboards e relatórios |

**Usuários iniciais:**
- Admin: João
- Funcionários: André, Ester, Gabriel, Daniel

---

## 📂 Estrutura do Monorepo

```
clientes-contact-ia/
├── frontend/               # Aplicação React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Telas da aplicação
│   │   ├── services/       # Camada de API client
│   │   ├── hooks/          # Custom hooks
│   │   ├── contexts/       # Contextos (auth, filtros)
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilitários
│   ├── public/
│   └── package.json
│
├── backend/                # API Python
│   ├── app/
│   │   ├── api/            # Rotas/endpoints
│   │   ├── services/       # Lógica de negócio
│   │   ├── models/         # Modelos de dados
│   │   ├── middleware/     # Auth, RBAC, audit
│   │   └── integrations/  # n8n, Supabase
│   ├── tests/
│   └── requirements.txt
│
├── docs/                   # Documentação detalhada
│   ├── backend.md
│   ├── frontend.md
│   ├── database.md
│   ├── automacao-n8n.md
│   ├── seguranca-auditoria.md
│   └── relatorios-dashboards.md
│
├── .env.example            # Variáveis de ambiente (template)
└── README.md               # Este arquivo
```

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** >= 18.x
- **Python** >= 3.11
- **Conta Supabase** configurada
- **n8n** (instância acessível)

### 1. Clonar e configurar

```bash
git clone <url-do-repositorio>
cd clientes-contact-ia

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do Supabase e n8n
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main          # Inicia em http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                 # Inicia em http://localhost:5173
```

---

## 📚 Documentação

| Documento | Conteúdo |
|-----------|----------|
| [Backend](docs/backend.md) | API, endpoints, serviços, autenticação |
| [Frontend](docs/frontend.md) | Telas, componentes, estado, rotas |
| [Banco de Dados](docs/database.md) | Schema, tabelas, RLS, migrações |
| [Automação n8n](docs/automacao-n8n.md) | Webhooks, fluxos, integração |
| [Segurança e Auditoria](docs/seguranca-auditoria.md) | RBAC, logs, proteções |
| [Relatórios e Dashboards](docs/relatorios-dashboards.md) | Métricas, exports, gráficos |

---

## 📋 Funcionalidades Principais

### ✅ Módulo de Autenticação
- Login com JWT via Supabase Auth
- Sessões seguras com expiração configurável
- Controle de acesso por perfil (RBAC)

### ✅ Gestão de Usuários (Admin)
- Criar/editar/desativar funcionários
- Controle de status (ativo/inativo)
- Histórico de último login

### ✅ Gestão de Clientes (Admin)
- Cadastro completo substituindo planilha
- Busca, filtros e paginação
- Chave lógica: clínica + unidade (evita duplicidade)

### ✅ Consulta de Registros (Base Existente)
- Listagem filtrável da tabela existente no Supabase
- Filtros: clínica, unidade, ação, período (semana/mês/ano)
- Paginação e ordenação

### ✅ Relatórios e Dashboards
- KPIs consolidados por período
- Gráficos por clínica/unidade/ação
- Exportação CSV e PDF

### ✅ Integração n8n
- Webhooks para eventos (cliente cadastrado, relatório gerado)
- Logs de integração com status

### ✅ Auditoria
- Registro de todas as ações críticas
- Rastreabilidade completa (usuário, ação, data, entidade)

---

## ⚙️ Variáveis de Ambiente

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# n8n
N8N_WEBHOOK_BASE_URL=https://n8n.example.com/webhook
N8N_WEBHOOK_SECRET=seu-segredo-aqui

# App
APP_ENV=development
JWT_SECRET=seu-jwt-secret
```

---

## 📄 Licença

Projeto interno — uso restrito.
