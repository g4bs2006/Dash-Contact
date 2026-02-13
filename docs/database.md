# Banco de Dados — Supabase (PostgreSQL)

> Schema, tabelas, RLS, migrações e padrões do banco de dados.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Diagrama de Entidades](#diagrama-de-entidades)
- [Tabelas](#tabelas)
- [Índices](#índices)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Guia de Migrações](#guia-de-migrações)
- [Convenções](#convenções)

---

## Visão Geral

O Supabase é usado como:

1. **Banco PostgreSQL** — Persistência de dados (clientes, usuários, auditoria, registros)
2. **Supabase Auth** — Autenticação e gestão de credenciais
3. **API REST automática** — Acessada via SDK `supabase-py` no backend

### Tabelas do Sistema

| Tabela | Propósito | Criada por |
|--------|-----------|------------|
| `registros` | Dados operacionais (antiga "imagem") | **Já existente** |
| `clients` | Cadastro de clientes/clínicas | **Nova** |
| `users_profile` | Perfis do sistema (complementa Auth) | **Nova** |
| `audit_logs` | Logs de auditoria | **Nova** |
| `n8n_integration_logs` | Logs de disparo para n8n | **Nova** |

---

## Diagrama de Entidades

```
┌──────────────────────┐     ┌───────────────────────┐
│   auth.users         │     │    users_profile       │
│   (Supabase Auth)    │     │                       │
│──────────────────────│     │───────────────────────│
│ id (uuid) PK         │◄───│ auth_user_id (uuid) FK │
│ email                │     │ id (uuid) PK           │
│ encrypted_password   │     │ name (text)            │
│ ...                  │     │ role (text)            │
└──────────────────────┘     │ status (text)          │
                             │ last_login_at          │
                             │ created_at             │
                             │ updated_at             │
                             └───────────────────────┘

┌───────────────────────┐     ┌───────────────────────┐
│     clients           │     │    audit_logs          │
│───────────────────────│     │───────────────────────│
│ id (uuid) PK          │     │ id (bigint) PK         │
│ clinica (text)        │     │ user_id (uuid)         │
│ unidade (text)        │     │ action (text)          │
│ responsavel (text)    │     │ entity_type (text)     │
│ telefone (text)       │     │ entity_id (text)       │
│ email (text)          │     │ details (jsonb)        │
│ status (text)         │     │ ip_address (text)      │
│ observacoes (text)    │     │ created_at             │
│ created_at            │     └───────────────────────┘
│ updated_at            │
└───────────────────────┘

┌──────────────────────────────────────┐
│          registros (já existente)     │
│──────────────────────────────────────│
│ id (bigint) PK                       │
│ created_at (timestamptz)             │
│ clinica (text)                       │
│ unidade (text)                       │
│ acao (text)                          │
│ sttus (text)                         │
│ nome_paciente (text)                 │
│ telefone_paciente (text)             │
│ detalhes (text)                      │
└──────────────────────────────────────┘

┌───────────────────────────────┐
│   n8n_integration_logs        │
│───────────────────────────────│
│ id (bigint) PK                │
│ event_type (text)             │
│ payload (jsonb)               │
│ webhook_url (text)            │
│ status (text)                 │
│ response_code (int)           │
│ error_message (text)          │
│ execution_id (text)           │
│ created_at (timestamptz)      │
└───────────────────────────────┘
```

---

## Tabelas

### `registros` (JÁ EXISTENTE — não modificar estrutura)

> Tabela existente que alimenta consultas e relatórios. Somente leitura pelo sistema.

| Coluna | Tipo | Nulável | Descrição |
|--------|------|---------|-----------|
| `id` | `bigint` | Não | PK auto-incremento |
| `created_at` | `timestamptz` | Não | Data de criação |
| `clinica` | `text` | Sim | Nome da clínica |
| `unidade` | `text` | Sim | Unidade da clínica |
| `acao` | `text` | Sim | Tipo de ação realizada |
| `sttus` | `text` | Sim | Status do registro |
| `nome_paciente` | `text` | Sim | Nome do paciente |
| `telefone_paciente` | `text` | Sim | Telefone do paciente |
| `detalhes` | `text` | Sim | Detalhes/observações |

> **⚠️ Nota:** O campo `sttus` tem essa grafia (sem o "a") na tabela original. Manter por compatibilidade.

---

### `clients` (NOVA)

> Substitui a planilha "Clientes contact.IA".

```sql
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinica TEXT NOT NULL,
    unidade TEXT NOT NULL DEFAULT '',
    responsavel TEXT,
    telefone TEXT,
    email TEXT,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Chave lógica: evita duplicidade clínica+unidade
    UNIQUE (clinica, unidade)
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

---

### `users_profile` (NOVA)

> Complementa o Supabase Auth com dados de perfil do sistema.

```sql
CREATE TABLE users_profile (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'funcionario' CHECK (role IN ('admin', 'funcionario')),
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (auth_user_id)
);

CREATE TRIGGER trigger_users_profile_updated_at
    BEFORE UPDATE ON users_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

---

### `audit_logs` (NOVA)

> Registro de todas as ações críticas no sistema.

```sql
CREATE TABLE audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Valores padrão de `action`:**

| Action | Descrição |
|--------|-----------|
| `USER_LOGIN` | Login realizado |
| `USER_LOGOUT` | Logout realizado |
| `USER_CREATED` | Usuário criado |
| `USER_UPDATED` | Usuário atualizado |
| `USER_DEACTIVATED` | Usuário desativado |
| `CLIENT_CREATED` | Cliente cadastrado |
| `CLIENT_UPDATED` | Cliente editado |
| `CLIENT_DELETED` | Cliente excluído |
| `REPORT_VIEWED` | Relatório visualizado |
| `REPORT_EXPORTED` | Relatório exportado |
| `N8N_WEBHOOK_SENT` | Webhook enviado ao n8n |

---

### `n8n_integration_logs` (NOVA)

> Rastreio de disparos para o n8n.

```sql
CREATE TABLE n8n_integration_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    webhook_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'success', 'failed', 'retrying')
    ),
    response_code INT,
    error_message TEXT,
    execution_id TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Índices

```sql
-- registros: filtros e ordenação (performance em consultas frequentes)
CREATE INDEX IF NOT EXISTS idx_registros_clinica ON registros (clinica);
CREATE INDEX IF NOT EXISTS idx_registros_unidade ON registros (unidade);
CREATE INDEX IF NOT EXISTS idx_registros_acao ON registros (acao);
CREATE INDEX IF NOT EXISTS idx_registros_created_at ON registros (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registros_nome_paciente ON registros (nome_paciente);

-- Índice composto para queries de relatório
CREATE INDEX IF NOT EXISTS idx_registros_filtros
    ON registros (clinica, unidade, acao, created_at DESC);

-- clients
CREATE INDEX IF NOT EXISTS idx_clients_clinica ON clients (clinica);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients (status);

-- audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);

-- n8n_integration_logs
CREATE INDEX IF NOT EXISTS idx_n8n_logs_status ON n8n_integration_logs (status);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_event ON n8n_integration_logs (event_type);
```

---

## Row Level Security (RLS)

### Políticas Recomendadas

```sql
-- Habilitar RLS nas tabelas novas
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- clients: Admin pode tudo, Funcionário pode visualizar ativos
CREATE POLICY "Admin full access on clients"
    ON clients FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users_profile
            WHERE auth_user_id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Funcionario read active clients"
    ON clients FOR SELECT
    USING (
        status = 'ativo'
        AND EXISTS (
            SELECT 1 FROM users_profile
            WHERE auth_user_id = auth.uid()
            AND status = 'ativo'
        )
    );

-- users_profile: Admin pode gerenciar, todos leem próprio perfil
CREATE POLICY "Users read own profile"
    ON users_profile FOR SELECT
    USING (auth_user_id = auth.uid());

CREATE POLICY "Admin manage all profiles"
    ON users_profile FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users_profile
            WHERE auth_user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- audit_logs: somente Admin pode ler, sistema insere via service_role
CREATE POLICY "Admin read audit"
    ON audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users_profile
            WHERE auth_user_id = auth.uid()
            AND role = 'admin'
        )
    );
```

> **⚠️ Importante:** O backend usa `service_role_key` para escrita (bypassa RLS). RLS protege acessos diretos via API REST do Supabase.

---

## Guia de Migrações

### Estrutura de Migrações

```
backend/
└── migrations/
    ├── 001_create_clients.sql
    ├── 002_create_users_profile.sql
    ├── 003_create_audit_logs.sql
    ├── 004_create_n8n_integration_logs.sql
    ├── 005_create_indexes.sql
    └── 006_setup_rls.sql
```

### Aplicar Migrações

As migrações podem ser aplicadas via:

1. **Supabase Dashboard** → SQL Editor (manual)
2. **Supabase CLI** (recomendado para CI/CD):

```bash
supabase db push
```

### Dados Iniciais (Seed)

```sql
-- Criar admin inicial (após criar user no Supabase Auth)
INSERT INTO users_profile (auth_user_id, name, role, status)
VALUES (
    '<UUID do João no Supabase Auth>',
    'João',
    'admin',
    'ativo'
);

-- Criar funcionários iniciais
INSERT INTO users_profile (auth_user_id, name, role, status)
VALUES
    ('<UUID André>', 'André', 'funcionario', 'ativo'),
    ('<UUID Ester>', 'Ester', 'funcionario', 'ativo'),
    ('<UUID Gabriel>', 'Gabriel', 'funcionario', 'ativo'),
    ('<UUID Daniel>', 'Daniel', 'funcionario', 'ativo');
```

---

## Convenções

| Área | Padrão |
|------|--------|
| **Nomes de tabela** | snake_case, plural (ex.: `clients`, `audit_logs`) |
| **Nomes de coluna** | snake_case (ex.: `created_at`, `nome_paciente`) |
| **PKs** | UUID para entidades de negócio, BIGINT para logs/registros |
| **Timestamps** | `TIMESTAMPTZ` com default `NOW()` |
| **Status** | CHECK constraint com valores permitidos |
| **Soft delete** | Usar campo `status` = 'inativo' (não deletar registro) |
| **JSON** | `JSONB` para dados flexíveis (details em audit, payload em n8n) |
