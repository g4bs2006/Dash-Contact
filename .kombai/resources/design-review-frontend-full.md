# Design Review — Clientes contact.IA (Frontend Completo)

**Data da Revisão**: 2026-02-18  
**Rotas Analisadas**: `/login`, `/dashboard`, `/records`, `/clients`, `/users`, `/reports`, `/audit`  
**Focos**: Design Visual, UX/Usabilidade, Micro-interações/Motion, Consistência  
**Referências**: Linear, Vercel Dashboard

---

## Resumo

A aplicação possui uma base sólida com bom uso de CSS Variables semânticas, tema Dark/Light funcional e design system coerente (paleta Grafite + Roxo). No entanto, a revisão identificou **36 problemas** distribuídos entre inconsistências de código, componentes não reutilizados, interações quebradas e oportunidades de UX significativas. Os problemas mais críticos envolvem componentes UI que não funcionam, duplicação de código em larga escala e falhas no modo Light.

---

## Issues

| # | Issue | Criticidade | Categoria | Localização |
|---|-------|-------------|-----------|-------------|
| 1 | **Sidebar no Light mode permanece com fundo escuro semi-transparente** — o `color-mix` usa `--surface-primary` que é `#ffffff` no Light mas com 85% opacity + blur, o resultado fica aceitável porém o bloco de info do usuário (`--surface-raised`) fica visualmente descolado | 🟡 Medium | Design Visual | `src/components/layout/Sidebar.tsx:61-63` |
| 2 | **Toaster hardcoded para `theme="dark"`** — não responde ao tema atual; no modo Light, toasts aparecem com visual escuro | 🟠 High | Consistência | `src/components/layout/MainLayout.tsx:26` |
| 3 | **Header duplica título da página** — cada page já renderiza `<Header title="..." />` porém não há breadcrumbs ou contexto diferenciado, criando duplicação visual | 🟡 Medium | UX | `src/components/layout/Header.tsx:25` + todas as pages |
| 4 | **Nenhum componente `Button` extraído** — botões com classes longas (`btn-press flex items-center gap-2 rounded-lg bg-roxo-600 px-4 py-2 text-sm font-medium text-white shadow-glow-roxo...`) são copy-pasted em 10+ locais | 🟠 High | Consistência | `LoginPage:181-184`, `ClientListPage:33-36`, `UserListPage:22-25`, `ClientFormPage:173-176`, `UserFormPage:196-199`, `ReportsPage:138-150` |
| 5 | **Nenhum componente `Input` extraído** — campo de input com estilo repetido (`rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30`) duplicado em 15+ locais | 🟠 High | Consistência | `ClientFormPage:99-104`, `UserFormPage:92-94`, `GlobalFilters:68`, `RecordListPage:67-69`, `AuditPage:90-91` |
| 6 | **`NAV_ITEMS` definido em 3 lugares diferentes** — Sidebar.tsx (L32-39), CommandPalette.tsx (L12-19), e constants.ts (L25-32) com estruturas ligeiramente diferentes | 🟡 Medium | Consistência | `Sidebar.tsx:32`, `CommandPalette.tsx:12`, `utils/constants.ts:25` |
| 7 | **Campo `sttus` é um typo** — propagado em `record.types.ts`, `data.ts` (mocks), e todas as pages que o referenciam; deveria ser `status` | 🟠 High | Consistência | `src/types/record.types.ts:7`, `src/mocks/data.ts:108-120` |
| 8 | **Tipo `Record` conflita com o global `Record<K,V>` do TypeScript** — pode causar erros sutis de tipagem quando usado sem import explícito | 🟡 Medium | Consistência | `src/types/record.types.ts:1` |
| 9 | **`RecordListPage` não utiliza `GlobalFilters`** — constrói seu próprio filtro local com useState, ignorando o store Zustand persistido | 🟠 High | Consistência | `src/pages/records/RecordListPage.tsx:10-14` vs `src/components/filters/GlobalFilters.tsx` |
| 10 | **`DashboardPage` constrói tabela inline** ao invés de usar o componente `DataTable` reutilizável | 🟡 Medium | Consistência | `src/pages/DashboardPage.tsx:191-210` |
| 11 | **`StatusBadge` tem entradas duplicadas** — tanto `'ativo'` quanto `'Ativo'` mapeados para os mesmos estilos, indicando falta de normalização | ⚪ Low | Consistência | `src/components/ui/StatusBadge.tsx:15-18` |
| 12 | **Linhas da tabela em `RecordListPage` têm `cursor-pointer`** mas sem `onRowClick` — não navegam para detalhe | 🟠 High | UX | `src/pages/records/RecordListPage.tsx:126` |
| 13 | **Botão ⋮ (MoreVertical) em `ClientListPage` e `UserListPage`** não abre dropdown/menu — puramente visual | 🟠 High | UX | `src/pages/clients/ClientListPage.tsx:103-109`, `src/pages/users/UserListPage.tsx:51-57` |
| 14 | **Botão "Filtros Avançados" na `AuditPage`** não faz nada ao clicar | 🟡 Medium | UX | `src/pages/audit/AuditPage.tsx:99-105` |
| 15 | **Sem link "Esqueci minha senha"** no Login — UX padrão ausente | 🟡 Medium | UX | `src/pages/LoginPage.tsx:123-195` |
| 16 | **Sem diálogo de confirmação no logout** — clique acidental desloga imediatamente | 🟡 Medium | UX | `src/components/layout/Sidebar.tsx:133-139` |
| 17 | **`GlobalFilters` falta campo "Até" (data fim)** — só tem "A partir de" mas o state `dataFim` existe no store | 🟡 Medium | UX | `src/components/filters/GlobalFilters.tsx:113-127` |
| 18 | **Header Search dispara `KeyboardEvent` via `document.dispatchEvent`** — hack que não garante funcionamento correto do Command Palette | 🟡 Medium | UX | `src/components/layout/Header.tsx:36` |
| 19 | **Notificação (Bell) no Header** não tem tooltip, dropdown, ou contagem visível — apenas um dot roxo estático | ⚪ Low | UX | `src/components/layout/Header.tsx:69-75` |
| 20 | **`PageTransition` component existe mas nunca é usado** — nenhuma page wrapa com ele | 🟡 Medium | Motion | `src/components/ui/PageTransition.tsx` (not imported anywhere) |
| 21 | **Animações `StaggeredList` re-executam a cada navegação** — sem memoização ou flag de "já animado", causando fade-in repetitivo | ⚪ Low | Motion | `src/components/ui/Animations.tsx:35-44` |
| 22 | **`AnimatedNumber` sempre anima a partir de 0** — deveria animar do valor anterior para o novo valor | ⚪ Low | Motion | `src/components/ui/AnimatedNumber.tsx:52` |
| 23 | **Sidebar items colapsados sem tooltip visual** — apenas `title` attr do HTML, sem tooltip estilizado | ⚪ Low | Motion | `src/components/layout/Sidebar.tsx:101` |
| 24 | **Sem skeleton loading nas tabelas** — apenas spinner centralizado sem indicação de estrutura | 🟡 Medium | Motion | `src/components/tables/DataTable.tsx:52-58` |
| 25 | **Login page usa classes Tailwind hardcoded** (`bg-grafite-800`, `text-grafite-100`) ao invés de CSS vars semânticas consistentes com resto da app | 🟡 Medium | Design Visual | `src/pages/LoginPage.tsx:141-162` |
| 26 | **KPI cards no Reports são idênticos ao Dashboard** — mesmos dados, mesmos ícones, sem valor adicional | ⚪ Low | UX | `src/pages/reports/ReportsPage.tsx:72-81` vs `src/pages/DashboardPage.tsx:83-92` |
| 27 | **`tbody` usa `divideColor` como style prop** — esta prop não é nativa do HTML; deveria usar CSS ou Tailwind `divide-y divide-[color]` | 🟡 Medium | Design Visual | `src/components/tables/DataTable.tsx:94` |
| 28 | **`UserFormPage` calcula password strength dentro do render** — `setPasswordStrength` é chamado durante render, podendo causar loop infinito | 🔴 Critical | Consistência | `src/pages/users/UserFormPage.tsx:38-46` |
| 29 | **Formulário de usuário não tem modo de edição** — só cria, apesar da rota `/users/:id/edit` poder existir futuramente | ⚪ Low | UX | `src/pages/users/UserFormPage.tsx` |
| 30 | **Mistura de `style={{}}` inline e classes Tailwind** para mesmas propriedades — inconsistente (ex: `color` via style vs `text-grafite-*` via class) | 🟡 Medium | Design Visual | Múltiplos arquivos |
| 31 | **`ErrorBoundary` usa hardcoded Tailwind colors** (`text-grafite-200`, `text-grafite-400`) ao invés de CSS vars semânticas | ⚪ Low | Consistência | `src/components/feedback/ErrorBoundary.tsx:33-36` |
| 32 | **`ICON_MAP` na Sidebar usa lookup por string** ao invés de importar ícones diretamente — indirection desnecessária | ⚪ Low | Consistência | `src/components/layout/Sidebar.tsx:16-24` |
| 33 | **Sem `aria-label` nos selects dos filtros** — acessibilidade básica ausente | 🟡 Medium | Design Visual | `src/components/filters/GlobalFilters.tsx:62-75`, `RecordListPage.tsx:72-93` |
| 34 | **Chart tooltip e cores hardcoded** — gráficos usam hex direto (`#8b5cf6`) ao invés de CSS vars do tema | ⚪ Low | Design Visual | `src/pages/DashboardPage.tsx:37-40`, `src/pages/reports/ReportsPage.tsx:35-39` |
| 35 | **`AuthContext` não usa `authService`** — o service existe com endpoints reais mas o context usa mock direto | ⚪ Low | Consistência | `src/contexts/AuthContext.tsx:28-37` vs `src/services/auth.service.ts` |
| 36 | **`vite.svg` missing no public** — favicon/asset não encontrado, gerando 404 nos logs | ⚪ Low | Design Visual | `index.html` referencing `/vite.svg` |

---

## Legenda de Criticidade

- 🔴 **Critical**: Quebra funcionalidade ou padrões de código (pode causar bugs em produção)
- 🟠 **High**: Impacta significativamente a experiência do usuário ou qualidade do design
- 🟡 **Medium**: Problema perceptível que deve ser corrigido
- ⚪ **Low**: Melhoria nice-to-have

---

## Resumo por Criticidade

| Criticidade | Quantidade |
|-------------|-----------|
| 🔴 Critical | 1 |
| 🟠 High | 7 |
| 🟡 Medium | 16 |
| ⚪ Low | 12 |

---

## Próximos Passos Recomendados

### Prioridade 1 — Correções Urgentes
1. **Fix #28**: Mover cálculo de password strength para `useEffect` (bug real de infinite render loop)
2. **Fix #7**: Renomear `sttus` → `status` em types, mocks e todos os consumidores
3. **Fix #4 e #5**: Extrair componentes `Button` e `Input` reutilizáveis

### Prioridade 2 — UX Funcional
4. **Fix #12**: Adicionar navegação `onRowClick` na tabela de Registros
5. **Fix #13**: Implementar dropdown menu nos botões ⋮
6. **Fix #9**: Unificar filtros usando `GlobalFilters` + Zustand store
7. **Fix #2**: Toaster responsivo ao tema

### Prioridade 3 — Consistência do Design System
8. **Fix #6**: Centralizar `NAV_ITEMS` em `constants.ts`
9. **Fix #10**: Usar `DataTable` no Dashboard
10. **Fix #25 e #30**: Padronizar uso de CSS vars vs classes Tailwind

### Prioridade 4 — Polish
11. **Fix #20**: Usar `PageTransition` wrapper em todas as pages
12. **Fix #24**: Adicionar skeleton loading nas tabelas
13. **Fix #17**: Adicionar campo "Data Fim" nos filtros
