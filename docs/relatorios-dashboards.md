# Relatórios e Dashboards

> Sistema de métricas, gráficos, relatórios e exportação de dados.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Dashboard Principal](#dashboard-principal)
- [Relatórios Disponíveis](#relatórios-disponíveis)
- [Filtros e Períodos](#filtros-e-períodos)
- [Exportação](#exportação)
- [Guia de Implementação](#guia-de-implementação)
- [Queries de Agregação](#queries-de-agregação)
- [Performance](#performance)

---

## Visão Geral

O módulo de relatórios é o **foco principal** do sistema. Permite que Admin e Funcionários visualizem dados consolidados e detalhados sobre as operações registradas na base de `registros` (Supabase).

### Hierarquia de Dados

```
Clínica → Unidade → Ação → Registros individuais
```

### Filtros Globais (presentes em todas as visualizações)

- **Clínica** (dropdown)
- **Unidade** (dropdown, depende da clínica selecionada)
- **Ação** (dropdown)
- **Período** (semana / mês / ano / personalizado)

---

## Dashboard Principal

### Layout do Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  🏠 Dashboard                                    [Filtros ▼] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐│
│  │ Total    │  │ Ações    │  │ Clínicas │  │ Variação     ││
│  │ Registros│  │ Período  │  │ Ativas   │  │ vs Anterior  ││
│  │  1.245   │  │   342    │  │    8     │  │  ▲ +12%      ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘│
│                                                              │
│  ┌─────────────────────────────┐  ┌────────────────────────┐│
│  │  📊 Série Temporal          │  │  🥧 Distribuição por   ││
│  │  (Linha: registros/dia)     │  │     Ação               ││
│  │                             │  │                        ││
│  │   ╱\    /╲                  │  │   ████ Confirmação 45% ││
│  │  ╱  ╲  ╱  ╲                │  │   ████ Cancelamento 25% │
│  │ ╱    ╲╱    ╲               │  │   ████ Reagendamento 30%│
│  └─────────────────────────────┘  └────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────┐  ┌────────────────────────┐│
│  │  📊 Top Clínicas por Volume │  │  📊 Distribuição por   ││
│  │  (Barras horizontais)       │  │     Unidade            ││
│  │                             │  │  (Barras verticais)    ││
│  │  São Lucas  ████████ 200   │  │                        ││
│  │  Santa Casa ██████ 150     │  │   ██  ██               ││
│  │  Vida Saud  ████ 100       │  │   ██  ██  ██           ││
│  └─────────────────────────────┘  └────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  📋 Últimos Registros     [Exportar CSV] [Exportar PDF] ││
│  │───────────────────────────────────────────────────────────│
│  │  Data      │ Clínica      │ Unid. │ Ação      │ Status  ││
│  │  13/02/26  │ São Lucas    │ Centro│ Confirm.  │ ok      ││
│  │  13/02/26  │ Santa Casa   │ Norte │ Cancel.   │ ok      ││
│  │  ...       │ ...          │ ...   │ ...       │ ...     ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

### KPIs (Cards superiores)

| KPI | Descrição | Cálculo |
|-----|-----------|---------|
| **Total de Registros** | Quantidade no período filtrado | `COUNT(*)` |
| **Ações no Período** | Total de ações distintas executadas | `COUNT(DISTINCT acao)` com base no total |
| **Clínicas Ativas** | Clínicas com pelo menos 1 registro no período | `COUNT(DISTINCT clinica)` |
| **Variação** | Diferença percentual vs período anterior | `((atual - anterior) / anterior) * 100` |

### Gráficos

| Gráfico | Tipo | Dados |
|---------|------|-------|
| **Série Temporal** | Linha | Registros por dia/semana/mês |
| **Distribuição por Ação** | Pizza/Donut | Percentual por tipo de ação |
| **Top Clínicas** | Barra horizontal | Volume de registros por clínica |
| **Distribuição por Unidade** | Barra vertical | Volume por unidade |

### Drill-down (interatividade)

- **Clicar em barra do gráfico** → Filtra dashboard para aquele item
- **Clicar em KPI card** → Navega para relatório detalhado
- **Clicar em linha da tabela** → Abre detalhe do registro

---

## Relatórios Disponíveis

### Relatório 1: Consolidado por Período

**Propósito:** Visão gerencial agrupada.

```
Agrupamento: Clínica → Unidade → Ação

Conteúdo:
- Total de registros por grupo
- Subtotais e totais gerais
- Comparação vs período anterior (quando aplicável)
```

**Exemplo de saída (tabela):**

| Clínica | Unidade | Ação | Total | % do Total |
|---------|---------|------|------:|----------:|
| São Lucas | Centro | Confirmação | 80 | 17.8% |
| São Lucas | Centro | Cancelamento | 20 | 4.4% |
| São Lucas | **Subtotal Centro** | | **100** | **22.2%** |
| São Lucas | Norte | Confirmação | 60 | 13.3% |
| **São Lucas** | **Subtotal** | | **160** | **35.6%** |
| Santa Casa | Central | Confirmação | 90 | 20.0% |
| ... | ... | ... | | |
| **TOTAL GERAL** | | | **450** | **100%** |

---

### Relatório 2: Detalhado (Lista)

**Propósito:** Visualização registro a registro com todos os campos.

| Coluna | Exibição |
|--------|----------|
| Data | DD/MM/YYYY HH:mm |
| Clínica | Nome completo |
| Unidade | Nome da unidade |
| Ação | Tipo de ação |
| Status | Badge colorido |
| Paciente | Nome do paciente |
| Telefone | Telefone formatado |
| Detalhes | Texto (truncado, expansível) |

Filtros: todos os filtros globais + busca por nome_paciente.

---

### Relatório 3: Por Paciente

**Propósito:** Histórico de um paciente específico.

- Busca por `nome_paciente`
- Lista todas as interações
- Agrupado por data
- Mostra clínica, unidade e ação em cada registro

---

## Filtros e Períodos

### Regras de Período

| Filtro | Formato | Exemplo |
|--------|---------|---------|
| **Semana** | ISO Week (YYYY-Www) | 2026-W07 |
| **Mês** | YYYY-MM | 2026-02 |
| **Ano** | YYYY | 2026 |
| **Personalizado** | Data início — Data fim | 01/02/2026 — 13/02/2026 |

### Comportamento dos Filtros

| Cenário | Comportamento |
|---------|-------------|
| Nenhum filtro selecionado | Exibe últimos 30 dias |
| Clínica selecionada | Unidades mostram apenas as da clínica |
| Período "semana" selecionado | Calcula início/fim da semana ISO |
| "Limpar filtros" clicado | Volta para últimos 30 dias |
| Mudança de página/tela | Filtros persistem (Zustand/Context) |

### Carregamento de Opções (Dropdowns)

```python
# Endpoint para opções de filtro
@router.get("/records/filter-options")
async def get_filter_options():
    """Retorna valores únicos para popular dropdowns."""
    db = get_supabase()
    clinicas = db.rpc("get_distinct_clinicas").execute()
    unidades = db.rpc("get_distinct_unidades").execute()
    acoes = db.rpc("get_distinct_acoes").execute()

    return {
        "clinicas": clinicas.data,
        "unidades": unidades.data,
        "acoes": acoes.data
    }
```

```sql
-- Funções RPC no Supabase para valores distintos
CREATE OR REPLACE FUNCTION get_distinct_clinicas()
RETURNS TABLE(value TEXT) AS $$
    SELECT DISTINCT clinica AS value
    FROM registros
    WHERE clinica IS NOT NULL
    ORDER BY clinica;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_distinct_unidades()
RETURNS TABLE(value TEXT, clinica TEXT) AS $$
    SELECT DISTINCT unidade AS value, clinica
    FROM registros
    WHERE unidade IS NOT NULL
    ORDER BY clinica, unidade;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_distinct_acoes()
RETURNS TABLE(value TEXT) AS $$
    SELECT DISTINCT acao AS value
    FROM registros
    WHERE acao IS NOT NULL
    ORDER BY acao;
$$ LANGUAGE sql STABLE;
```

---

## Exportação

### Formatos Suportados

| Formato | Uso | Implementação |
|---------|-----|---------------|
| **CSV** | Análise em Excel/Google Sheets | Backend (pandas) |
| **PDF** | Compartilhamento formal | Backend (reportlab ou weasyprint) |

### Fluxo de Exportação

```
1. Usuário aplica filtros no dashboard/relatório
2. Clica em "Exportar CSV" ou "Exportar PDF"
3. Frontend envia request → GET /v1/reports/export?formato=csv&...filtros
4. Backend:
   a. Executa query com mesmos filtros
   b. Limita resultado (max 10.000 linhas para CSV, 5.000 para PDF)
   c. Gera arquivo
   d. Registra auditoria "REPORT_EXPORTED"
   e. Retorna arquivo (Content-Disposition: attachment)
5. Navegador faz download automático
```

### Limites de Exportação

| Regra | Valor | Motivo |
|-------|-------|--------|
| Max linhas CSV | 10.000 | Performance e memória |
| Max linhas PDF | 5.000 | Tamanho do arquivo |
| Filtro obrigatório | Pelo menos 1 filtro | Evitar export da base inteira |
| Rate limit | 5 exports/minuto | Evitar sobrecarga |

### Implementação do Export CSV

```python
import io
import pandas as pd
from fastapi.responses import StreamingResponse

@router.get("/reports/export")
async def export_report(
    formato: str,  # "csv" ou "pdf"
    clinica: str = None,
    unidade: str = None,
    acao: str = None,
    data_inicio: str = None,
    data_fim: str = None,
    current_user = Depends(get_current_user)
):
    # Buscar dados com filtros
    records = await record_service.list_all(
        clinica=clinica, unidade=unidade, acao=acao,
        data_inicio=data_inicio, data_fim=data_fim,
        limit=10000
    )

    if formato == "csv":
        df = pd.DataFrame(records)
        buffer = io.StringIO()
        df.to_csv(buffer, index=False, encoding="utf-8-sig")  # BOM para Excel
        buffer.seek(0)

        # Auditoria
        await log_action(
            user_id=current_user["sub"],
            action="REPORT_EXPORTED",
            details={"formato": "csv", "linhas": len(records)}
        )

        return StreamingResponse(
            iter([buffer.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=relatorio_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
            }
        )
```

---

## Guia de Implementação

### Componentes Frontend Necessários

| Componente | Lib | Propósito |
|------------|-----|-----------|
| `KPICard` | Custom | Exibir métrica com variação |
| `LineChart` | Recharts | Série temporal |
| `PieChart` | Recharts | Distribuição por ação |
| `BarChart` | Recharts | Top clínicas, distribuição por unidade |
| `DataTable` | TanStack Table | Tabela de registros |
| `DateRangePicker` | Custom / react-day-picker | Seleção de período |
| `ExportButton` | Custom | Trigger de download |

### Exemplo: KPICard

```tsx
interface KPICardProps {
  titulo: string;
  valor: number;
  variacao?: number;  // percentual vs período anterior
  icone: React.ReactNode;
}

function KPICard({ titulo, valor, variacao, icone }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        {icone}
        <span className="kpi-titulo">{titulo}</span>
      </div>
      <div className="kpi-valor">{valor.toLocaleString('pt-BR')}</div>
      {variacao !== undefined && (
        <div className={`kpi-variacao ${variacao >= 0 ? 'positiva' : 'negativa'}`}>
          {variacao >= 0 ? '▲' : '▼'} {Math.abs(variacao).toFixed(1)}%
          <span> vs período anterior</span>
        </div>
      )}
    </div>
  );
}
```

### Exemplo: Gráfico de Série Temporal

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function SerieTemporal({ dados }: { dados: { data: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dados}>
        <XAxis
          dataKey="data"
          tickFormatter={(d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(d) => new Date(d).toLocaleDateString('pt-BR')}
          formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Registros']}
        />
        <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## Queries de Agregação

### Consolidado por Clínica/Unidade/Ação

```sql
SELECT
    clinica,
    unidade,
    acao,
    COUNT(*) as total,
    ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 1) as percentual
FROM registros
WHERE created_at BETWEEN :data_inicio AND :data_fim
    AND (:clinica IS NULL OR clinica = :clinica)
    AND (:unidade IS NULL OR unidade = :unidade)
    AND (:acao IS NULL OR acao = :acao)
GROUP BY clinica, unidade, acao
ORDER BY clinica, unidade, acao;
```

### Série Temporal (por dia)

```sql
SELECT
    DATE(created_at) as data,
    COUNT(*) as total
FROM registros
WHERE created_at BETWEEN :data_inicio AND :data_fim
    AND (:clinica IS NULL OR clinica = :clinica)
GROUP BY DATE(created_at)
ORDER BY data;
```

### KPIs do Dashboard

```sql
-- Total de registros no período
SELECT COUNT(*) as total FROM registros
WHERE created_at BETWEEN :data_inicio AND :data_fim;

-- Total de clínicas ativas
SELECT COUNT(DISTINCT clinica) as clinicas_ativas FROM registros
WHERE created_at BETWEEN :data_inicio AND :data_fim;

-- Comparação com período anterior
WITH periodo_atual AS (
    SELECT COUNT(*) as total FROM registros
    WHERE created_at BETWEEN :data_inicio AND :data_fim
),
periodo_anterior AS (
    SELECT COUNT(*) as total FROM registros
    WHERE created_at BETWEEN
        :data_inicio - (:data_fim - :data_inicio)
        AND :data_inicio
)
SELECT
    a.total as atual,
    p.total as anterior,
    CASE WHEN p.total > 0
        THEN ROUND(((a.total - p.total)::numeric / p.total) * 100, 1)
        ELSE 0
    END as variacao_percentual
FROM periodo_atual a, periodo_anterior p;
```

---

## Performance

### Otimizações Implementadas

| Técnica | Detalhes |
|---------|----------|
| **Índices compostos** | `(clinica, unidade, acao, created_at)` na tabela `registros` |
| **Paginação** | Todas as listagens com `LIMIT/OFFSET` |
| **Cache de filtros** | Opções de dropdown cacheadas por 5 min |
| **Lazy loading** | Gráficos carregam sob demanda |
| **Queries otimizadas** | `COUNT(*)` com `OVER()` evita query separada |

### Metas de Performance (p95)

| Operação | Meta | Técnica |
|----------|------|---------|
| Listagem filtrada | < 2s | Índices + paginação |
| Dashboard (KPIs + gráficos) | < 3s | Queries paralelas |
| Exportação CSV (5k linhas) | < 5s | Streaming |
| Carregamento de dropdowns | < 1s | Cache |
