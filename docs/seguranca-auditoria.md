# Segurança e Auditoria

> RBAC, proteções, logs de auditoria e boas práticas de segurança.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Autorização (RBAC)](#autorização-rbac)
- [Proteções de Segurança](#proteções-de-segurança)
- [Sistema de Auditoria](#sistema-de-auditoria)
- [Guia de Implementação](#guia-de-implementação)
- [Checklist de Segurança](#checklist-de-segurança)

---

## Visão Geral

O sistema implementa segurança em **4 camadas**:

```
1. AUTENTICAÇÃO     → Quem é você? (JWT via Supabase Auth)
2. AUTORIZAÇÃO      → O que você pode fazer? (RBAC: Admin/Funcionário)
3. PROTEÇÃO         → Defesa contra ataques (injection, brute force, CSRF)
4. AUDITORIA        → O que foi feito? (logs rastreáveis)
```

---

## Autenticação

### Fluxo de Login

```
Usuário → Email + Senha
  → Frontend → POST /v1/auth/login
    → Backend → Supabase Auth (signInWithPassword)
      → Supabase retorna JWT + Refresh Token
        → Backend verifica users_profile.status == 'ativo'
          → Retorna token ao Frontend
            → Frontend salva token (localStorage)
              → Todas as requests incluem: Authorization: Bearer <token>
```

### Token JWT

| Campo | Conteúdo |
|-------|----------|
| `sub` | UUID do usuário (Supabase Auth) |
| `email` | Email do usuário |
| `role` | `admin` ou `funcionario` |
| `exp` | Expiração (padrão: 24h) |
| `iat` | Momento de emissão |

### Regras de Sessão

| Regra | Implementação |
|-------|---------------|
| Expiração | Token expira em 24h (configurável) |
| Refresh | Usar refresh token do Supabase (se disponível) |
| Logout | Remover token do localStorage + invalidar no Supabase |
| Usuário Inativo | Verificar `users_profile.status` em cada request |

---

## Autorização (RBAC)

### Matriz de Permissões

| Recurso / Ação | Admin | Funcionário |
|-----------------|:-----:|:-----------:|
| **Dashboard** — Visualizar | ✅ | ✅ |
| **Registros** — Listar/filtrar | ✅ | ✅ |
| **Registros** — Ver detalhe | ✅ | ✅ |
| **Relatórios** — Visualizar | ✅ | ✅ |
| **Relatórios** — Exportar CSV/PDF | ✅ | ✅ |
| **Clientes** — Listar | ✅ | ❌ |
| **Clientes** — Criar/Editar/Excluir | ✅ | ❌ |
| **Usuários** — Listar | ✅ | ❌ |
| **Usuários** — Criar/Editar/Desativar | ✅ | ❌ |
| **Auditoria** — Visualizar logs | ✅ | ❌ |
| **Configurações** — Gerenciar | ✅ | ❌ |

### Implementação no Backend

```python
# Decorator de permissão
from functools import wraps
from fastapi import HTTPException

def require_role(*roles):
    """Decorator que exige um dos roles especificados."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: dict, **kwargs):
            if current_user.get("role") not in roles:
                raise HTTPException(
                    status_code=403,
                    detail="Você não tem permissão para esta ação"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Uso nos endpoints
@router.post("/clients")
@require_role("admin")
async def create_client(data: ClientCreate, current_user = Depends(get_current_user)):
    ...
```

### Implementação no Frontend

```typescript
// Componente de proteção de rota
function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
}

// Componente condicional
function ActionButton({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return <>{children}</>;
}
```

### Regras de Segurança Operacional

- **Último Admin**: Não permitir desativar ou rebaixar o último usuário admin
- **Auto-desativação**: Admin não pode desativar a si mesmo
- **Desativação imediata**: Usuário desativado perde acesso no próximo request (validação do token verifica `status`)

---

## Proteções de Segurança

### Contra SQL Injection

| Camada | Proteção |
|--------|----------|
| **Supabase Client** | Queries parametrizadas por padrão |
| **Backend** | Nunca usar f-strings ou concatenação em queries |
| **Validação** | Pydantic valida e sanitiza inputs |

```python
# ✅ CORRETO — Query parametrizada via Supabase
result = db.table("clients").select("*").eq("clinica", clinica).execute()

# ❌ ERRADO — Concatenação de SQL
query = f"SELECT * FROM clients WHERE clinica = '{clinica}'"
```

### Contra Brute Force

```python
# Rate limiting por IP
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/auth/login")
@limiter.limit("5/minute")  # Máximo 5 tentativas por minuto
async def login(request: Request, data: LoginRequest):
    ...
```

### Contra CSRF

| Medida | Implementação |
|--------|---------------|
| Token-based auth | JWT no header (não em cookie) elimina CSRF clássico |
| SameSite cookies | Se usar cookies, definir `SameSite=Strict` |
| CORS restrito | Permitir apenas origens conhecidas |

### Contra Exposição de Dados

| Área | Medida |
|------|--------|
| **Logs** | Nunca logar senhas, tokens ou dados sensíveis |
| **Respostas** | Nunca retornar `password_hash` ou `service_role_key` |
| **Erros** | Mensagens genéricas ao usuário, detalhes técnicos só no server log |
| **.env** | Nunca commitar no repositório (usar `.gitignore`) |

---

## Sistema de Auditoria

### O Que é Auditado

| Categoria | Ações |
|-----------|-------|
| **Autenticação** | Login, logout |
| **Clientes** | Criar, editar, excluir |
| **Usuários** | Criar, editar, ativar/desativar |
| **Relatórios** | Visualizar, exportar |
| **Integrações** | Disparos para n8n |

### Estrutura do Log

```json
{
  "id": 1234,
  "user_id": "uuid-do-usuario",
  "action": "CLIENT_CREATED",
  "entity_type": "client",
  "entity_id": "uuid-do-cliente",
  "details": {
    "clinica": "Clínica São Lucas",
    "unidade": "Unidade Centro",
    "responsavel": "Dr. Silva"
  },
  "ip_address": "192.168.1.100",
  "created_at": "2026-02-13T10:30:00Z"
}
```

### Guia de Implementação

#### AuditService (`services/audit_service.py`)

```python
from app.integrations.supabase_client import get_supabase

class AuditService:
    def __init__(self):
        self.db = get_supabase()
        self.table = "audit_logs"

    async def log(
        self,
        user_id: str,
        action: str,
        entity_type: str = None,
        entity_id: str = None,
        details: dict = None,
        ip_address: str = None
    ):
        """Registra ação na tabela de auditoria."""
        self.db.table(self.table).insert({
            "user_id": user_id,
            "action": action,
            "entity_type": entity_type,
            "entity_id": str(entity_id) if entity_id else None,
            "details": details or {},
            "ip_address": ip_address
        }).execute()

    async def list_logs(
        self,
        action: str = None,
        user_id: str = None,
        page: int = 1,
        per_page: int = 50
    ) -> dict:
        """Lista logs com filtros e paginação."""
        query = self.db.table(self.table).select("*", count="exact")

        if action:
            query = query.eq("action", action)
        if user_id:
            query = query.eq("user_id", user_id)

        query = query.order("created_at", desc=True)
        query = query.range((page - 1) * per_page, page * per_page - 1)

        result = query.execute()
        return {
            "data": result.data,
            "total": result.count,
            "page": page,
            "per_page": per_page
        }

audit_service = AuditService()

# Helper
async def log_action(user_id: str, action: str, **kwargs):
    await audit_service.log(user_id=user_id, action=action, **kwargs)
```

#### Middleware de Auditoria (opcional)

```python
from starlette.middleware.base import BaseHTTPMiddleware

class AuditMiddleware(BaseHTTPMiddleware):
    """Audita automaticamente ações de escrita (POST, PUT, DELETE)."""

    AUDITABLE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}

    async def dispatch(self, request, call_next):
        response = await call_next(request)

        if (
            request.method in self.AUDITABLE_METHODS
            and response.status_code < 400
        ):
            # Registrar ação baseado na rota
            await self._auto_audit(request, response)

        return response
```

### Tela de Auditoria (Admin)

| Coluna | Exibição |
|--------|----------|
| Data/Hora | Formatado DD/MM/YYYY HH:mm |
| Usuário | Nome do usuário |
| Ação | Badge colorido (verde=create, amarelo=update, vermelho=delete) |
| Entidade | Tipo + link para detalhe |
| IP | Endereço IP |

Filtros: por ação, por usuário, por período.

---

## Checklist de Segurança

### Pré-Deploy

- [ ] Todas as variáveis sensíveis estão em `.env` (não no código)
- [ ] `.env` está no `.gitignore`
- [ ] CORS configurado apenas para origens permitidas
- [ ] Rate limiting configurado em endpoints de autenticação
- [ ] RLS habilitado em todas as tabelas do Supabase
- [ ] `service_role_key` usado apenas no backend (nunca no frontend)
- [ ] Queries parametrizadas (sem concatenação SQL)
- [ ] Mensagens de erro não expõem detalhes internos
- [ ] Logs não contêm senhas ou tokens

### Pós-Deploy

- [ ] HTTPS habilitado
- [ ] Tenant isolado no Supabase (sem acesso público desnecessário)
- [ ] Admin inicial configurado e funcional
- [ ] Auditoria registrando ações corretamente
- [ ] Rate limit testado contra brute force
