# Automação — Integração com n8n

> Webhooks, fluxos de automação e integração entre o sistema e o n8n.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura de Integração](#arquitetura-de-integração)
- [Eventos e Webhooks](#eventos-e-webhooks)
- [Guia de Implementação](#guia-de-implementação)
- [Fluxos n8n Recomendados](#fluxos-n8n-recomendados)
- [Monitoramento e Logs](#monitoramento-e-logs)
- [Segurança](#segurança)
- [Troubleshooting](#troubleshooting)

---

## Visão Geral

O sistema dispara eventos para o n8n via **webhooks HTTP** em momentos-chave. O n8n pode então executar automações como:

- Notificações (email, Telegram, WhatsApp)
- Sincronização com outros sistemas
- Geração de relatórios automáticos
- Alertas para a equipe

### Princípio

```
Sistema → Evento → Backend → HTTP POST → n8n Webhook → Automação
```

O fluxo é **unidirecional por padrão** (sistema → n8n). Opcionalmente, o n8n pode retornar dados via response ou chamar endpoints do sistema.

---

## Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────┐
│                       BACKEND                           │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │  Service      │───▶│ N8nService   │───▶│ HTTP POST │─┼──▶ n8n Webhook
│  │  (ex: Client) │    │              │    │ (httpx)   │ │
│  └──────────────┘    │ • retry      │    └───────────┘ │
│                      │ • log        │                   │
│                      │ • timeout    │                   │
│                      └──────┬───────┘                   │
│                             │                           │
│                      ┌──────▼───────┐                   │
│                      │ n8n_integra  │                   │
│                      │ tion_logs    │                   │
│                      │ (Supabase)   │                   │
│                      └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

---

## Eventos e Webhooks

### Eventos Disponíveis

| Evento | Trigger | Payload | Prioridade |
|--------|---------|---------|------------|
| `cliente_cadastrado` | Novo cliente criado | Dados do cliente | Alta |
| `cliente_atualizado` | Cliente editado | Dados antes + depois | Média |
| `cliente_excluido` | Cliente removido | ID + dados | Média |
| `usuario_criado` | Novo funcionário | Nome, email, role | Alta |
| `usuario_desativado` | Usuário desativado | ID + motivo | Alta |
| `relatorio_exportado` | Export CSV/PDF gerado | Tipo, filtros, usuário | Baixa |

### Estrutura do Payload

Todos os webhooks seguem esta estrutura:

```json
{
  "event": "cliente_cadastrado",
  "timestamp": "2026-02-13T10:30:00Z",
  "source": "clientes-contact-ia",
  "data": {
    "id": "uuid-do-cliente",
    "clinica": "Clínica São Lucas",
    "unidade": "Unidade Centro",
    "responsavel": "Dr. Silva"
  },
  "metadata": {
    "triggered_by": "uuid-do-usuario",
    "triggered_by_name": "João",
    "environment": "production"
  }
}
```

### Headers

| Header | Valor | Propósito |
|--------|-------|-----------|
| `Content-Type` | `application/json` | Formato do payload |
| `X-Webhook-Secret` | `{N8N_WEBHOOK_SECRET}` | Autenticação |
| `X-Event-Type` | Nome do evento | Identificação rápida |
| `X-Timestamp` | ISO 8601 | Momento do disparo |

---

## Guia de Implementação

### N8nService (`integrations/n8n_client.py`)

```python
import httpx
from datetime import datetime
from app.config import settings
from app.integrations.supabase_client import get_supabase

class N8nService:
    """Serviço de integração com n8n via webhooks."""

    MAX_RETRIES = 3
    TIMEOUT_SECONDS = 10

    def __init__(self):
        self.base_url = settings.n8n_webhook_base_url
        self.secret = settings.n8n_webhook_secret
        self.db = get_supabase()

    async def trigger_webhook(
        self,
        event: str,
        data: dict,
        triggered_by: str = None,
        triggered_by_name: str = None
    ) -> dict:
        """Dispara webhook para o n8n com retry e logging."""
        url = f"{self.base_url}/{event}"
        payload = {
            "event": event,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source": "clientes-contact-ia",
            "data": data,
            "metadata": {
                "triggered_by": triggered_by,
                "triggered_by_name": triggered_by_name,
                "environment": settings.app_env
            }
        }

        headers = {
            "Content-Type": "application/json",
            "X-Webhook-Secret": self.secret,
            "X-Event-Type": event,
            "X-Timestamp": payload["timestamp"]
        }

        # Registrar tentativa
        log_entry = self._create_log(event, payload, url)

        for attempt in range(1, self.MAX_RETRIES + 1):
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        url,
                        json=payload,
                        headers=headers,
                        timeout=self.TIMEOUT_SECONDS
                    )

                if response.status_code in (200, 201, 202):
                    self._update_log(log_entry, "success", response.status_code)
                    return {
                        "status": "success",
                        "response_code": response.status_code,
                        "execution_id": response.json().get("executionId")
                    }
                else:
                    self._update_log(
                        log_entry, "failed",
                        response.status_code,
                        f"HTTP {response.status_code}: {response.text[:200]}"
                    )

            except httpx.TimeoutException:
                self._update_log(log_entry, "retrying", error=f"Timeout (tentativa {attempt})")
            except httpx.RequestError as e:
                self._update_log(log_entry, "retrying", error=str(e))

        # Todas as tentativas falharam
        self._update_log(log_entry, "failed", error="Max retries exceeded")
        return {"status": "failed", "error": "Max retries exceeded"}

    def _create_log(self, event: str, payload: dict, url: str) -> str:
        """Cria registro na tabela n8n_integration_logs."""
        result = self.db.table("n8n_integration_logs").insert({
            "event_type": event,
            "payload": payload,
            "webhook_url": url,
            "status": "pending"
        }).execute()
        return result.data[0]["id"]

    def _update_log(self, log_id: str, status: str, response_code: int = None, error: str = None):
        """Atualiza status do log."""
        update = {"status": status}
        if response_code:
            update["response_code"] = response_code
        if error:
            update["error_message"] = error
        self.db.table("n8n_integration_logs").update(update).eq("id", log_id).execute()


# Instância singleton
n8n_service = N8nService()

# Helper para uso direto
async def trigger_webhook(event: str, data: dict, **kwargs):
    return await n8n_service.trigger_webhook(event, data, **kwargs)
```

### Configuração dos Webhooks no n8n

Para cada evento, criar um workflow no n8n com:

1. **Nó Webhook** como trigger
   - Método: `POST`
   - Path: nome do evento (ex.: `/cliente_cadastrado`)
   - Authentication: Header Auth (`X-Webhook-Secret`)

2. **Validação** (nó Code)
   - Verificar `X-Webhook-Secret`
   - Validar estrutura do payload

3. **Ação** (nós específicos para cada automação)

---

## Fluxos n8n Recomendados

### Fluxo 1: Notificação de Novo Cliente

```
[Webhook: cliente_cadastrado]
    → [IF: dados válidos]
        → [Telegram: enviar mensagem para grupo da equipe]
        → [Email: enviar boas-vindas ao responsável]
    → [Error Trigger]
        → [Telegram: alertar admin sobre erro]
```

### Fluxo 2: Alerta de Usuário Desativado

```
[Webhook: usuario_desativado]
    → [Telegram: alertar admin]
    → [Google Sheets: registrar em planilha de controle]
```

### Fluxo 3: Relatório Semanal Automático

```
[Schedule Trigger: toda segunda 8h]
    → [HTTP Request: GET /v1/reports/consolidated?periodo=semana]
    → [Code: formatar dados]
    → [Email: enviar para lista de distribuição]
```

---

## Monitoramento e Logs

### Tabela `n8n_integration_logs`

Todos os disparos são registrados com:

| Campo | Propósito |
|-------|-----------|
| `event_type` | Qual evento disparou |
| `status` | `pending` → `success` / `failed` / `retrying` |
| `response_code` | HTTP status retornado pelo n8n |
| `error_message` | Detalhe do erro (se houver) |
| `execution_id` | ID da execução no n8n (se retornado) |
| `retry_count` | Número de tentativas |

### Consulta de Falhas

```sql
-- Últimas 10 falhas
SELECT event_type, error_message, created_at
FROM n8n_integration_logs
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;
```

### Dashboard de Integração (recomendado)

No painel Admin, mostrar:
- Total de webhooks enviados (24h / 7d / 30d)
- Taxa de sucesso / falha
- Últimas falhas com opção de re-disparo

---

## Segurança

| Medida | Implementação |
|--------|---------------|
| **Autenticação** | Header `X-Webhook-Secret` compartilhado |
| **HTTPS** | Obrigatório em produção |
| **Timeout** | 10s por requisição |
| **Rate Limit** | Máximo 1 webhook/s por evento (evita spam em loops) |
| **Dados sensíveis** | Não incluir senhas, tokens ou dados financeiros no payload |
| **Retry** | Máximo 3 tentativas, com backoff |

---

## Troubleshooting

| Problema | Causa Provável | Solução |
|----------|---------------|---------|
| Webhook retorna 404 | Workflow n8n inativo ou path errado | Ativar workflow, verificar path |
| Timeout frequente | n8n sobrecarregado ou rede lenta | Aumentar timeout, verificar recursos |
| `X-Webhook-Secret` inválido | Variáveis desincronizadas | Comparar `.env` com config do n8n |
| Payload vazio no n8n | Headers incorretos | Verificar `Content-Type: application/json` |
| Webhook enviado mas nada acontece | Workflow sem nós após o trigger | Verificar workflow no n8n |
