# PROMPT: Implementar Frontend — Clientes contact.IA

## Contexto

Você é um frontend developer especialista em React + TypeScript. Seu objetivo é **implementar as telas funcionais** de um sistema de gestão de clientes para clínicas, chamado **Clientes contact.IA**.

O scaffolding do projeto **já existe** em `frontend/`. Sua tarefa é transformar placeholders e mock data em telas funcionais com chamadas reais à API.

---

## Stack Obrigatória

- **React 18** + **TypeScript** (strict mode)
- **Vite** como bundler
- **Tailwind CSS v4** (já configurado com tema custom)
- **React Router v6** (rotas já configuradas)
- **Zustand** para estado global (filtros)
- **React Hook Form + Zod** para formulários
- **TanStack Table** para tabelas com sorting/paginação
- **Recharts** para gráficos
- **Axios** para HTTP (instância já configurada em `services/api.ts`)
- **Lucide React** para ícones
- **Sonner** para toasts
- **date-fns** para datas (locale pt-BR)

---

## Design System (Já Configurado)

Tema escuro, "Dashboard Profissional":

| Token | Cor |
|-------|-----|
| Background | `grafite-950` (#0a0a0f) |
| Surface | `grafite-900` (#12121a) |
| Surface Raised | `grafite-800` (#1a1a26) |
| Borders | `grafite-700` (#252533) |
| Text Primary | `grafite-100` (#dcdce8) |
| Text Secondary | `grafite-400` (#6b6b85) |
| Accent | `roxo-500` (#8b5cf6) |
| Accent Hover | `roxo-400` (#a78bfa) |
| Success | `success-400` (#4ade80) |
| Warning | `warning-400` (#fbbf24) |
| Danger | `danger-400` (#f87171) |
| Info | `info-400` (#60a5fa) |
| Font | Inter (sans), JetBrains Mono (mono) |
| Radius | 4-12px (sharp, dashboard feel) |

**Regras visuais:**
- Cards: `border border-grafite-700 bg-grafite-900 rounded-xl`
- Hover em rows: `hover:bg-grafite-800/50`
- Botão primário: `bg-roxo-600 hover:bg-roxo-500 text-white rounded-lg`
- Badges de status: `bg-[cor]-500/10 text-[cor]-400 rounded-md px-2 py-0.5 text-xs`
- Focus ring: `focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30`
- Inputs: `border border-grafite-700 bg-grafite-800 rounded-lg text-sm`

---

## Estrutura Existente

```
frontend/src/
├── App.tsx              ← Router completo (não altere a estrutura de rotas)
├── main.tsx             ← Entry point
├── styles/globals.css   ← Tailwind v4 theme (não altere)
│
├── types/               ← Tipagens TS (USE ESTAS, não crie novas)
│   ├── common.types.ts    → PaginatedResponse<T>, ApiError
│   ├── auth.types.ts      → User, LoginRequest, LoginResponse
│   ├── user.types.ts      → UserProfile, UserCreate, UserUpdate
│   ├── client.types.ts    → Client, ClientCreate, ClientUpdate
│   ├── record.types.ts    → Record, RecordFilters, FilterOptions
│   └── report.types.ts    → ReportConsolidated, KPIData, ExportParams
│
├── services/            ← API calls (USE ESTES, não crie novos)
│   ├── api.ts              → Axios instance com interceptors
│   ├── auth.service.ts     → login(), me(), logout()
│   ├── user.service.ts     → list(), getById(), create(), update(), toggleStatus()
│   ├── client.service.ts   → list(), getById(), create(), update(), delete()
│   ├── record.service.ts   → list(), getById(), getFilterOptions()
│   └── report.service.ts   → getConsolidated(), getKPIs(), export()
│
├── hooks/               ← Custom hooks (USE ESTES)
│   ├── useAuth.ts          → { user, isAdmin, isLoading, login, logout }
│   ├── useFilters.ts       → Zustand store com persist (clinica, unidade, acao, datas)
│   ├── usePagination.ts    → { page, perPage, goToPage, nextPage, prevPage }
│   └── useExport.ts        → { isExporting, exportReport }
│
├── contexts/
│   └── AuthContext.tsx     → Usando mock data (TROCAR por auth.service real quando backend estiver pronto)
│
├── utils/
│   ├── formatters.ts       → formatDate, formatDateTime, formatPhone, formatNumber, truncate
│   └── constants.ts        → APP_NAME, ROLES, STATUS, PAGINATION, NAV_ITEMS
│
├── mocks/
│   └── data.ts             → Mock data (REMOVER quando API estiver pronta)
│
├── components/
│   ├── layout/             → Sidebar, Header, MainLayout, PageTitle (PRONTOS)
│   ├── feedback/           → LoadingSpinner, EmptyState, ErrorBoundary (PRONTOS)
│   ├── guards/             → ProtectedRoute, AdminRoute (PRONTOS)
│   └── charts/             → KPICard (PRONTO)
│
└── pages/                  ← ⚠️ ESTAS SÃO AS TELAS A IMPLEMENTAR
    ├── LoginPage.tsx          → Funcional (com mock, trocar depois)
    ├── DashboardPage.tsx      → Visual OK, falta gráficos reais
    ├── clients/               → List (visual OK), Detail e Form (placeholder)
    ├── users/                 → List (visual OK), Form (placeholder)
    ├── records/               → List (visual OK), Detail (placeholder)
    ├── reports/               → Placeholder total
    └── audit/                 → Placeholder total
```

---

## Tarefas de Implementação

### TAREFA 1: Componente `DataTable` Genérico

Criar `components/tables/DataTable.tsx` usando TanStack Table:

```typescript
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading?: boolean
  pagination?: { page: number; perPage: number; total: number }
  onPageChange?: (page: number) => void
  onRowClick?: (row: T) => void
  emptyMessage?: string
}
```

Funcionalidades:
- Sorting por coluna (clicável no header)
- Paginação com "Página X de Y" + botões prev/next
- Loading state (skeleton rows)
- Empty state usando `EmptyState` component
- Rows clicáveis → `onRowClick`
- Scroll horizontal responsivo

---

### TAREFA 2: Componente `GlobalFilters`

Criar `components/filters/GlobalFilters.tsx`:

```
┌────────────────────────────────────────────────────────────┐
│  Clínica: [Dropdown ▼]   Unidade: [Dropdown ▼]            │
│  Ação: [Dropdown ▼]      Período: [📅 Início] — [📅 Fim]  │
│                                        [Limpar Filtros]    │
└────────────────────────────────────────────────────────────┘
```

- Usa `useFilters` hook (Zustand) para estado persistente
- Dropdowns carregam opções de `recordService.getFilterOptions()`
- Unidade filtra de acordo com Clínica selecionada
- Botão "Limpar Filtros" reseta todos
- Aparece no Dashboard, Registros e Relatórios

---

### TAREFA 3: Gráficos Reais (Dashboard)

Substituir barras CSS no `DashboardPage.tsx` por gráficos Recharts:

1. **BarChart** — Registros por período (últimos 30 dias)
2. **PieChart** — Distribuição por clínica
3. **LineChart** — Tendência semanal (opcional)

Usar cores do design system:
- `#8b5cf6` (roxo-500) como cor principal
- `#a78bfa` (roxo-400) como secundária
- `#252533` (grafite-700) para grid lines
- Tooltip com `bg-grafite-800 border-grafite-700`

---

### TAREFA 4: Formulários

#### `ClientFormPage.tsx` (criar/editar cliente)
Campos: clínica*, unidade*, responsável, telefone, email, observações
- React Hook Form + Zod schema
- Modo create (POST) e edit (PUT, pré-preenche campos)
- Toast de sucesso com Sonner
- Redirect para `/clients` após salvar

#### `UserFormPage.tsx` (criar usuário)
Campos: nome*, email*, senha*, role (dropdown admin/funcionario)
- Validação: email válido, senha min 6 chars

---

### TAREFA 5: Telas de Detalhe

#### `ClientDetailPage.tsx`
- Dados completos do cliente em card
- Seção de registros vinculados (registros onde `clinica` = nome do cliente)
- Botões: Editar, Inativar/Ativar, Voltar

#### `RecordDetailPage.tsx`
- Todos os campos do registro em layout de card
- Status badge colorido
- Botão Voltar

---

### TAREFA 6: Relatórios (`ReportsPage.tsx`)

- GlobalFilters no topo
- Seleção de tipo: Consolidado / Detalhado
- Área de visualização com gráficos
- Botões de export: CSV, PDF (usa `useExport` hook)
- Tabela de dados abaixo dos gráficos

---

### TAREFA 7: Auditoria (`AuditPage.tsx`)

- DataTable com colunas: Data, Usuário, Ação, Entidade, IP
- Filtros: por usuário, por ação, por período
- Sem ações de edição (somente leitura)

---

## API (Endpoints que o Backend vai expor)

Base URL: `VITE_API_URL` (default: `http://localhost:8000/v1`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | `{ email, password }` → `{ access_token, user }` |
| GET | `/auth/me` | Retorna usuário logado |
| POST | `/auth/logout` | Invalida token |
| GET | `/clients?page=&per_page=` | Lista paginada |
| GET | `/clients/:id` | Detalhe |
| POST | `/clients` | Criar |
| PUT | `/clients/:id` | Atualizar |
| DELETE | `/clients/:id` | Deletar |
| GET | `/users` | Lista |
| POST | `/users` | Criar |
| PUT | `/users/:id` | Atualizar |
| PATCH | `/users/:id/status` | Ativar/Inativar |
| GET | `/records?clinica=&acao=&page=` | Lista com filtros |
| GET | `/records/:id` | Detalhe |
| GET | `/records/filter-options` | `{ clinicas[], unidades[], acoes[] }` |
| GET | `/reports/kpis` | KPI data |
| GET | `/reports/consolidated` | Relatório consolidado |
| GET | `/reports/export?formato=csv` | Download arquivo |
| GET | `/audit` | Logs de auditoria |

Todos retornam JSON. Listas paginadas retornam `PaginatedResponse<T>`.

---

## Convenções a Seguir

- **PascalCase** para componentes
- **camelCase** para hooks/services/utils
- Exportação **nomeada** (não default)
- Uma função por arquivo
- Tipos em `*.types.ts` separados
- Usar `@/` path alias para imports
- Toast via `toast.success()` / `toast.error()` do Sonner
- Loading states obrigatórios em todas as chamadas async
- Error handling com try/catch + toast.error()
- `prefers-reduced-motion` respeitado em animações

---

## Regras Críticas

1. **NÃO altere** `globals.css`, `App.tsx`, `main.tsx`, ou estrutura de rotas
2. **USE** os types, services e hooks existentes — não duplique
3. **Mantenha** o tema escuro Grafite+Roxo em todas as telas
4. **TypeScript strict** — zero `any`, zero type errors
5. **Acessibilidade** — labels nos inputs, ARIA em botões, foco visível
6. **Responsivo** — funcione em telas de 1024px+, scroll horizontal em mobile para tabelas
