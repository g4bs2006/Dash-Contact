# Backend — API Python

> Documentação completa da API REST do Clientes contact.IA.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Guia de Implementação](#guia-de-implementação)
- [Endpoints (Referência)](#endpoints-referência)
- [Serviços](#serviços)
- [Middleware](#middleware)
- [Configuração](#configuração)

---

## Visão Geral

API REST stateless em Python que serve como camada intermediária entre o frontend React e o Supabase. Responsável por:

- Validação e processamento de dados
- Controle de autorização (RBAC)
- Geração de relatórios e exports
- Disparo de webhooks para n8n
- Registro de auditoria

### Stack Recomendada

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **Framework** | FastAPI | Async, tipagem, docs automáticas (OpenAPI) |
| **ORM/Client** | supabase-py | SDK oficial do Supabase para Python |
| **Validação** | Pydantic v2 | Validação de schemas integrada ao FastAPI |
| **Auth** | PyJWT + Supabase Auth | Verificação de tokens JWT |
| **Exports** | pandas + reportlab | CSV e PDF respectivamente |
| **HTTP Client** | httpx | Requisições assíncronas para n8n |

---

## Estrutura do Projeto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Entrypoint, inicialização FastAPI
│   ├── config.py               # Variáveis de ambiente e settings
│   │
│   ├── api/                    # Camada de rotas
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py       # Router principal /v1
│   │   │   ├── auth.py         # POST /v1/auth/login, /logout, /me
│   │   │   ├── users.py        # CRUD /v1/users (Admin)
│   │   │   ├── clients.py      # CRUD /v1/clients (Admin)
│   │   │   ├── records.py      # GET /v1/records (consulta base "imagem")
│   │   │   ├── reports.py      # GET /v1/reports, /export
│   │   │   └── audit.py        # GET /v1/audit (Admin)
│   │   └── deps.py             # Dependências injetáveis (current_user, db)
│   │
│   ├── services/               # Lógica de negócio
│   │   ├── __init__.py
│   │   ├── auth_service.py     # Autenticação e sessão
│   │   ├── user_service.py     # CRUD de usuários
│   │   ├── client_service.py   # CRUD de clientes
│   │   ├── record_service.py   # Consultas à base "imagem"
│   │   ├── report_service.py   # Agregações e exports
│   │   ├── audit_service.py    # Registro de auditoria
│   │   └── n8n_service.py      # Integração com n8n
│   │
│   ├── models/                 # Schemas Pydantic
│   │   ├── __init__.py
│   │   ├── auth.py             # LoginRequest, TokenResponse
│   │   ├── user.py             # UserCreate, UserUpdate, UserResponse
│   │   ├── client.py           # ClientCreate, ClientUpdate, ClientResponse
│   │   ├── record.py           # RecordFilter, RecordResponse
│   │   ├── report.py           # ReportParams, ReportData
│   │   └── audit.py            # AuditLogEntry
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth_middleware.py  # Validação JWT em cada request
│   │   ├── rbac.py             # Decorators de permissão
│   │   └── rate_limit.py       # Rate limiting
│   │
│   └── integrations/
│       ├── __init__.py
│       ├── supabase_client.py  # Inicialização e helpers Supabase
│       └── n8n_client.py       # Disparo de webhooks n8n
│
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_users.py
│   ├── test_clients.py
│   ├── test_records.py
│   └── test_reports.py
│
├── requirements.txt
├── Dockerfile
└── .env.example
```

---

## Guia de Implementação

### Passo 1: Setup Inicial

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependências
pip install fastapi uvicorn supabase pydantic python-dotenv pyjwt httpx pandas
pip freeze > requirements.txt
```

### Passo 2: Configuração (`config.py`)

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    # n8n
    n8n_webhook_base_url: str
    n8n_webhook_secret: str = ""

    # App
    app_env: str = "development"
    jwt_secret: str
    jwt_expiration_hours: int = 24

    class Config:
        env_file = ".env"

settings = Settings()
```

### Passo 3: Entrypoint (`main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.config import settings

app = FastAPI(
    title="Clientes contact.IA API",
    version="1.0.0",
    docs_url="/docs" if settings.app_env == "development" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/v1")
```

### Passo 4: Dependências Injetáveis (`deps.py`)

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from app.config import settings

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """Valida JWT e retorna dados do usuário."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Garante que o usuário é Admin."""
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acesso restrito a administradores")
    return user
```

### Passo 5: Exemplo de Serviço (`client_service.py`)

```python
from app.integrations.supabase_client import get_supabase
from app.models.client import ClientCreate, ClientUpdate
from app.services.audit_service import log_action
from app.services.n8n_service import trigger_webhook

class ClientService:
    def __init__(self):
        self.db = get_supabase()
        self.table = "clients"

    async def create(self, data: ClientCreate, user_id: str) -> dict:
        """Cria cliente, registra auditoria, dispara webhook."""
        # Verificar duplicidade (clínica + unidade)
        existing = (
            self.db.table(self.table)
            .select("id")
            .eq("clinica", data.clinica)
            .eq("unidade", data.unidade)
            .execute()
        )
        if existing.data:
            raise ValueError("Cliente já cadastrado para esta clínica/unidade")

        # Inserir
        result = self.db.table(self.table).insert(data.model_dump()).execute()
        client = result.data[0]

        # Auditoria
        await log_action(
            user_id=user_id,
            action="CLIENT_CREATED",
            entity_type="client",
            entity_id=client["id"],
            details=data.model_dump()
        )

        # Webhook n8n
        await trigger_webhook("cliente_cadastrado", client)

        return client

    async def list(self, page: int = 1, per_page: int = 20, search: str = None) -> dict:
        """Lista clientes com paginação e busca."""
        query = self.db.table(self.table).select("*", count="exact")

        if search:
            query = query.or_(
                f"clinica.ilike.%{search}%,"
                f"unidade.ilike.%{search}%,"
                f"responsavel.ilike.%{search}%"
            )

        query = query.order("created_at", desc=True)
        query = query.range((page - 1) * per_page, page * per_page - 1)

        result = query.execute()
        return {
            "data": result.data,
            "total": result.count,
            "page": page,
            "per_page": per_page
        }
```

---

## Endpoints (Referência)

### Autenticação

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `POST` | `/v1/auth/login` | Login com email/senha | Público |
| `POST` | `/v1/auth/logout` | Encerrar sessão | Autenticado |
| `GET` | `/v1/auth/me` | Dados do usuário logado | Autenticado |

#### `POST /v1/auth/login`

**Request:**
```json
{
  "email": "joao@empresa.com",
  "password": "senha-segura"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "João",
    "email": "joao@empresa.com",
    "role": "admin"
  }
}
```

**Response (401):**
```json
{
  "detail": "Credenciais inválidas"
}
```

---

### Usuários (Admin)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `GET` | `/v1/users` | Listar usuários | Admin |
| `POST` | `/v1/users` | Criar usuário | Admin |
| `PUT` | `/v1/users/{id}` | Atualizar usuário | Admin |
| `PATCH` | `/v1/users/{id}/status` | Ativar/desativar | Admin |

#### `POST /v1/users`

**Request:**
```json
{
  "name": "André",
  "email": "andre@empresa.com",
  "role": "funcionario"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "André",
  "email": "andre@empresa.com",
  "role": "funcionario",
  "status": "ativo",
  "created_at": "2026-02-13T10:00:00Z"
}
```

---

### Clientes (Admin)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `GET` | `/v1/clients` | Listar clientes | Admin |
| `POST` | `/v1/clients` | Criar cliente | Admin |
| `GET` | `/v1/clients/{id}` | Detalhe do cliente | Admin |
| `PUT` | `/v1/clients/{id}` | Atualizar cliente | Admin |
| `DELETE` | `/v1/clients/{id}` | Excluir cliente | Admin |

#### `POST /v1/clients`

**Request:**
```json
{
  "clinica": "Clínica São Lucas",
  "unidade": "Unidade Centro",
  "responsavel": "Dr. Silva",
  "telefone": "(11) 99999-0000",
  "email": "contato@saolucas.com",
  "status": "ativo",
  "observacoes": "Cliente premium"
}
```

---

### Registros (Base "imagem")

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `GET` | `/v1/records` | Listar registros com filtros | Autenticado |
| `GET` | `/v1/records/{id}` | Detalhe do registro | Autenticado |

#### `GET /v1/records`

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `clinica` | string | Não | Filtro por clínica |
| `unidade` | string | Não | Filtro por unidade |
| `acao` | string | Não | Filtro por ação |
| `periodo` | string | Não | `semana`, `mes`, `ano` |
| `data_inicio` | date | Não | Início do período |
| `data_fim` | date | Não | Fim do período |
| `busca` | string | Não | Busca por nome_paciente |
| `page` | int | Não | Página (padrão: 1) |
| `per_page` | int | Não | Itens por página (padrão: 20, max: 100) |
| `order_by` | string | Não | Campo de ordenação (padrão: `created_at`) |
| `order_dir` | string | Não | `asc` ou `desc` (padrão: `desc`) |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "created_at": "2026-02-10T14:30:00Z",
      "clinica": "Clínica São Lucas",
      "unidade": "Unidade Centro",
      "acao": "Confirmação",
      "sttus": "concluido",
      "nome_paciente": "Maria Silva",
      "telefone_paciente": "(11) 98888-0000",
      "detalhes": "Confirmação de consulta realizada"
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 20
}
```

---

### Relatórios

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `GET` | `/v1/reports/consolidated` | Relatório consolidado | Autenticado |
| `GET` | `/v1/reports/detailed` | Relatório detalhado (lista) | Autenticado |
| `GET` | `/v1/reports/export` | Exportar CSV/PDF | Autenticado |

#### `GET /v1/reports/consolidated`

**Query Parameters:** mesmos filtros de `/v1/records` + `group_by` (clínica/unidade/ação)

**Response (200):**
```json
{
  "periodo": {
    "inicio": "2026-02-01",
    "fim": "2026-02-13"
  },
  "total_registros": 450,
  "por_clinica": [
    {
      "clinica": "Clínica São Lucas",
      "total": 200,
      "por_unidade": [
        {
          "unidade": "Unidade Centro",
          "total": 120,
          "por_acao": {
            "Confirmação": 80,
            "Cancelamento": 20,
            "Reagendamento": 20
          }
        }
      ]
    }
  ],
  "serie_temporal": [
    { "data": "2026-02-01", "total": 35 },
    { "data": "2026-02-02", "total": 42 }
  ]
}
```

#### `GET /v1/reports/export`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `formato` | string | `csv` ou `pdf` |
| `tipo` | string | `consolidado` ou `detalhado` |
| + filtros | - | Mesmos filtros de records |

**Response:** Arquivo para download (`Content-Disposition: attachment`)

---

### Auditoria (Admin)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `GET` | `/v1/audit` | Listar logs de auditoria | Admin |

---

## Serviços

| Serviço | Responsabilidade |
|---------|------------------|
| `AuthService` | Login, validação JWT, sessão |
| `UserService` | CRUD de usuários, integração Supabase Auth |
| `ClientService` | CRUD de clientes, validação de duplicatas |
| `RecordService` | Consultas à base "imagem" com filtros |
| `ReportService` | Queries agregadas, geração CSV/PDF |
| `AuditService` | Persistência de logs de auditoria |
| `N8nService` | Disparo de webhooks com retry |

---

## Middleware

### Fluxo de uma Requisição

```
Request → Rate Limit → Auth (JWT) → RBAC → Handler → Audit → Response
```

| Middleware | Função |
|-----------|--------|
| **Rate Limit** | Max 100 req/min por IP (configurável) |
| **Auth** | Valida JWT, extrai `user_id` e `role` |
| **RBAC** | Verifica se o perfil tem acesso ao recurso |
| **Audit** | Registra ação no log após execução |

---

## Configuração

### Variáveis de Ambiente

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# n8n
N8N_WEBHOOK_BASE_URL=https://n8n.example.com/webhook
N8N_WEBHOOK_SECRET=seu-segredo

# App
APP_ENV=development
JWT_SECRET=sua-chave-secreta
JWT_EXPIRATION_HOURS=24

# Rate Limit
RATE_LIMIT_PER_MINUTE=100
```

### Executando

```bash
# Desenvolvimento
uvicorn app.main:app --reload --port 8000

# Produção
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Testes

```bash
pytest tests/ -v --cov=app
```

---

## Padrões e Convenções

- **Versionamento**: Prefixo `/v1/` em todos os endpoints
- **Respostas**: JSON com estrutura `{ data, total, page, per_page }` para listagens
- **Erros**: Formato padrão `{ detail: "mensagem" }` com HTTP status adequado
- **Datas**: ISO 8601 (UTC) em todas as respostas
- **IDs**: UUID para entidades criadas pelo sistema
