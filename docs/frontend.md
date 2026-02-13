# Frontend — React + TypeScript

> Documentação completa da interface web do Clientes contact.IA.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Execução](#instalação-e-execução)
- [Telas Implemantadas](#telas-implementadas)
- [Componentes Reutilizáveis](#componentes-reutilizáveis)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Rotas e Navegação](#rotas-e-navegação)
- [Camada de API](#camada-de-api)
- [Convenções](#convenções)

---

## Visão Geral

Aplicação SPA (Single Page Application) desenvolvida com **Vite + React 18 + TypeScript**, utilizando Tailwind CSS para estilização e Semantic CSS Variables para suporte completo a temas **Light e Dark**.

### Stack Tecnológico

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| **Core** | Vite + React | 18.x |
| **Linguagem** | TypeScript | 5.x |
| **Estilização** | Tailwind CSS v4 | 4.x |
| **Estado Global** | Zustand | 5.x |
| **Roteamento** | React Router DOM | 6.x |
| **Formulários** | React Hook Form + Zod | 7.x |
| **Tabelas** | TanStack Table | 8.x |
| **Gráficos** | Recharts | 2.x |
| **Ícones** | Lucide React | 0.460+ |
| **Feedback** | Sonner (Toasts) | 1.x |

---

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── ui/                     # Primitivos (Button, Input, Card, Animations, StatusBadge)
│   │   ├── layout/                 # Layout (Sidebar, Header, MainLayout, PageTitle)
│   │   ├── filters/                # Filtros (GlobalFilters)
│   │   ├── tables/                 # Tabelas (DataTable, Pagination)
│   │   ├── charts/                 # Gráficos (KPICard, Recharts wrappers)
│   │   └── feedback/               # Feedback (LoadingSpinner, EmptyState, ErrorBoundary)
│   │
│   ├── pages/                      # Telas da aplicação
│   │   ├── LoginPage.tsx           # Login
│   │   ├── DashboardPage.tsx       # Dashboard Principal
│   │   ├── clients/                # Módulo de Clientes (List, Detail, Form)
│   │   ├── users/                  # Módulo de Usuários (List, Form)
│   │   ├── records/                # Módulo de Registros (List, Detail)
│   │   ├── reports/                # Relatórios e Gráficos
│   │   └── audit/                  # Logs de Auditoria
│   │
│   ├── services/                   # Serviços de API (Axios instance + endpoints)
│   ├── hooks/                      # Custom Hooks (useAuth, useFilters, usePagination, useExport)
│   ├── contexts/                   # Context Providers (AuthContext)
│   ├── types/                      # Definições de Tipos TypeScript
│   ├── utils/                      # Formatadores e validadores
│   ├── mocks/                      # Dados mockados para desenvolvimento
│   └── styles/                     # CSS Global e Variáveis de Tema
│
└── public/                         # Assets estáticos
```

---

## Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Comandos

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

---

## Telas Implementadas

| Tela | Rota | Descrição | Status |
|------|------|-----------|--------|
| **Login** | `/login` | Autenticação com split-screen e animações. | ✅ |
| **Dashboard** | `/dashboard` | KPIs animados, gráficos de tendência e atalhos rápidos. | ✅ |
| **Lista de Clientes** | `/clients` | Tabela com busca, paginação e ações (Admin). | ✅ |
| **Detalhe Cliente** | `/clients/:id` | Card de informações + Tabela de registros vinculados. | ✅ |
| **Formulário Cliente** | `/clients/new`, `/clients/:id/edit` | Criação e Edição com validação Zod. | ✅ |
| **Lista de Registros** | `/records` | Tabela avançada com filtros globais. | ✅ |
| **Detalhe Registro** | `/records/:id` | Visualização detalhada de interações em grid. | ✅ |
| **Relatórios** | `/reports` | Gráficos (Linha/Pizza), KPIs e exportação CSV/PDF. | ✅ |
| **Auditoria** | `/audit` | Logs de ações do sistema com busca e filtros (Admin). | ✅ |
| **Usuários** | `/users` | Gestão de usuários do sistema. | ✅ |

---

## Componentes Reutilizáveis

### `DataTable` (`src/components/tables/DataTable.tsx`)
Tabela genérica poderosa baseada em **TanStack Table**.
- **Features**: Ordenação (clique no header), Paginação, Skeleton Loading, Empty State integrado.
- **Uso**: Recebe `data`, `columns` e props de paginação.

### `GlobalFilters` (`src/components/filters/GlobalFilters.tsx`)
Barra de filtros persistente gerenciada via **Zustand**.
- **Campos**: 
  - Clínica (Dropdown)
  - Unidade (Dropdown em cascata - depende da clínica)
  - Ação (Dropdown)
  - Período (Data Início/Fim)
- **Features**: Persistência no LocalStorage, botão de limpar filtros, contador de filtros ativos.

### `StatusBadge` (`src/components/ui/StatusBadge.tsx`)
Badge visual para status de registros, clientes e usuários.
- **Temas**: Cores semânticas que se adaptam automaticamente ao modo Dark/Light.
- **Variantes**: Sucesso, Erro, Aviso, Info, Neutro.

### `KPICard` (`src/components/charts/KPICard.tsx`)
Card de métrica com ícone, valor animado e indicador de tendência.
- **Animação**: Usa `AnimatedNumber` para contagem suave sem re-render excessivo.

---

## Gerenciamento de Estado

### Zustand Store (`useFilters`)
Gerencia o estado global dos filtros para manter a consistência entre navegações.

```typescript
// Exemplo de uso
const { clinica, setFilter, clearFilters } = useFilters();
```

### AuthContext
Gerencia a sessão do usuário, persistência de token e verificação de role (Admin vs Funcionário).

---

## Rotas e Navegação

A navegação é controlada pelo `react-router-dom` com Guards de proteção:

- **`ProtectedRoute`**: Redireciona para `/login` se não autenticado.
- **`AdminRoute`**: Redireciona para `/dashboard` se usuário não for admin.

### Estrutura de Rotas (`App.tsx`)

```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  <Route element={<ProtectedRoute />}>
    <Route element={<MainLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/records" element={<RecordListPage />} />
      {/* ... outras rotas autenticadas */}
      
      <Route element={<AdminRoute />}>
         <Route path="/clients" element={<ClientListPage />} />
         {/* ... outras rotas admin */}
      </Route>
    </Route>
  </Route>
</Routes>
```

---

## Camada de API

Utiliza **Axios** com interceptors para:
1. Injetar Token JWT automaticamente (`Authorization: Bearer ...`).
2. Tratar erros 401 (Logout automático).

Os serviços são modularizados em `src/services/`:
- `auth.service.ts`
- `client.service.ts`
- `user.service.ts`
- `record.service.ts`
- `report.service.ts`

---

## Convenções

1. **Semantic CSS Variables**: Todas as cores devem usar variáveis (`var(--surface-primary)`, `var(--text-muted)`) para garantir suporte a temas.
2. **Componentes Funcionais**: Sempre usar React Functional Components.
3. **Tipagem Estrita**: Evitar `any`, usar interfaces definidas em `src/types/`.
4. **Mobile First**: Layouts responsivos utilizando classes utilitárias do Tailwind (`grid-cols-1 md:grid-cols-2`).

