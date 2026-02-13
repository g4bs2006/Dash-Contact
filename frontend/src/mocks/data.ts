import type { User } from '@/types/auth.types'
import type { Client } from '@/types/client.types'
import type { Record } from '@/types/record.types'
import type { UserProfile } from '@/types/user.types'

// ── Admin user ──
export const MOCK_ADMIN: User = {
    id: '1',
    name: 'Gabriel Admin',
    email: 'admin@contactia.com',
    role: 'admin',
    status: 'ativo',
    last_login_at: '2026-02-13T10:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-02-13T10:00:00Z',
}

export const MOCK_USERS: UserProfile[] = [
    { ...MOCK_ADMIN },
    {
        id: '2',
        name: 'Ana Souza',
        email: 'ana@contactia.com',
        role: 'funcionario',
        status: 'ativo',
        last_login_at: '2026-02-12T14:30:00Z',
        created_at: '2026-01-15T00:00:00Z',
        updated_at: '2026-02-12T14:30:00Z',
    },
    {
        id: '3',
        name: 'Pedro Lima',
        email: 'pedro@contactia.com',
        role: 'funcionario',
        status: 'inativo',
        last_login_at: null,
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-02-01T00:00:00Z',
    },
]

// ── Clients ──
export const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        clinica: 'Clínica Saúde Plena',
        unidade: 'Matriz - Centro',
        responsavel: 'Dr. Carlos Mendes',
        telefone: '11999887766',
        email: 'contato@saudeplena.com',
        status: 'ativo',
        observacoes: 'Cliente desde 2024',
        created_at: '2025-06-15T00:00:00Z',
        updated_at: '2026-01-10T00:00:00Z',
    },
    {
        id: '2',
        clinica: 'Clínica Saúde Plena',
        unidade: 'Filial - Zona Sul',
        responsavel: 'Dra. Maria Silva',
        telefone: '11988776655',
        email: 'zonasul@saudeplena.com',
        status: 'ativo',
        observacoes: null,
        created_at: '2025-08-20T00:00:00Z',
        updated_at: '2025-12-05T00:00:00Z',
    },
    {
        id: '3',
        clinica: 'OdontoVita',
        unidade: 'Sede',
        responsavel: 'Dr. João Almeida',
        telefone: '21977665544',
        email: 'joao@odontovita.com',
        status: 'ativo',
        observacoes: 'Especialidade: Ortodontia',
        created_at: '2025-10-01T00:00:00Z',
        updated_at: '2026-02-01T00:00:00Z',
    },
    {
        id: '4',
        clinica: 'Bem Estar Clínicas',
        unidade: 'Unidade Norte',
        responsavel: 'Dra. Lucia Costa',
        telefone: '31966554433',
        email: 'norte@bemestar.com',
        status: 'inativo',
        observacoes: 'Contrato pausado',
        created_at: '2025-03-10T00:00:00Z',
        updated_at: '2026-01-20T00:00:00Z',
    },
    {
        id: '5',
        clinica: 'Clínica Renovar',
        unidade: 'Centro Médico',
        responsavel: 'Dr. Fernando Brito',
        telefone: '41955443322',
        email: 'fernando@renovar.med',
        status: 'ativo',
        observacoes: null,
        created_at: '2026-01-05T00:00:00Z',
        updated_at: '2026-02-10T00:00:00Z',
    },
]

// ── Records (tabela registros do Supabase) ──
export const MOCK_RECORDS: Record[] = [
    { id: 1, created_at: '2026-02-13T09:15:00Z', clinica: 'Clínica Saúde Plena', unidade: 'Matriz - Centro', acao: 'Agendamento', sttus: 'Concluído', nome_paciente: 'Maria Oliveira', telefone_paciente: '11999001122', detalhes: 'Consulta cardiologia' },
    { id: 2, created_at: '2026-02-13T08:45:00Z', clinica: 'Clínica Saúde Plena', unidade: 'Filial - Zona Sul', acao: 'Confirmação', sttus: 'Confirmado', nome_paciente: 'José Santos', telefone_paciente: '11988112233', detalhes: 'Retorno dermatologia' },
    { id: 3, created_at: '2026-02-12T16:30:00Z', clinica: 'OdontoVita', unidade: 'Sede', acao: 'Cancelamento', sttus: 'Cancelado', nome_paciente: 'Ana Paula Reis', telefone_paciente: '21977334455', detalhes: 'Paciente remarcou' },
    { id: 4, created_at: '2026-02-12T14:00:00Z', clinica: 'Clínica Saúde Plena', unidade: 'Matriz - Centro', acao: 'Agendamento', sttus: 'Pendente', nome_paciente: 'Roberto Costa', telefone_paciente: '11966778899', detalhes: 'Exame laboratório' },
    { id: 5, created_at: '2026-02-12T11:20:00Z', clinica: 'Clínica Renovar', unidade: 'Centro Médico', acao: 'Lembrete', sttus: 'Enviado', nome_paciente: 'Fernanda Lima', telefone_paciente: '41955112233', detalhes: 'Lembrete 24h pré-consulta' },
    { id: 6, created_at: '2026-02-11T17:45:00Z', clinica: 'Clínica Saúde Plena', unidade: 'Matriz - Centro', acao: 'Agendamento', sttus: 'Concluído', nome_paciente: 'Lucas Pereira', telefone_paciente: '11944556677', detalhes: 'Ortopedista' },
    { id: 7, created_at: '2026-02-11T10:00:00Z', clinica: 'OdontoVita', unidade: 'Sede', acao: 'Confirmação', sttus: 'Confirmado', nome_paciente: 'Camila Rocha', telefone_paciente: '21933445566', detalhes: 'Limpeza dental' },
    { id: 8, created_at: '2026-02-10T15:30:00Z', clinica: 'Bem Estar Clínicas', unidade: 'Unidade Norte', acao: 'Agendamento', sttus: 'Concluído', nome_paciente: 'André Martins', telefone_paciente: '31922334455', detalhes: 'Clínico geral' },
    { id: 9, created_at: '2026-02-10T09:00:00Z', clinica: 'Clínica Saúde Plena', unidade: 'Filial - Zona Sul', acao: 'Lembrete', sttus: 'Enviado', nome_paciente: 'Patricia Alves', telefone_paciente: '11911223344', detalhes: 'Lembrete vacina' },
    { id: 10, created_at: '2026-02-09T13:00:00Z', clinica: 'Clínica Renovar', unidade: 'Centro Médico', acao: 'Cancelamento', sttus: 'Cancelado', nome_paciente: 'Bruno Ferreira', telefone_paciente: '41900112233', detalhes: 'Paciente viajou' },
    { id: 11, created_at: '2026-02-08T11:15:00Z', clinica: 'Clínica Saúde Plena', unidade: 'Matriz - Centro', acao: 'Confirmação', sttus: 'Confirmado', nome_paciente: 'Juliana Cardoso', telefone_paciente: '11999887711', detalhes: 'Pediatria' },
    { id: 12, created_at: '2026-02-07T08:30:00Z', clinica: 'OdontoVita', unidade: 'Sede', acao: 'Agendamento', sttus: 'Concluído', nome_paciente: 'Ricardo Nascimento', telefone_paciente: '21988776622', detalhes: 'Implante' },
]

// ── Filter Options ──
export const MOCK_FILTER_OPTIONS = {
    clinicas: ['Clínica Saúde Plena', 'OdontoVita', 'Bem Estar Clínicas', 'Clínica Renovar'],
    unidades: [
        { value: 'Matriz - Centro', clinica: 'Clínica Saúde Plena' },
        { value: 'Filial - Zona Sul', clinica: 'Clínica Saúde Plena' },
        { value: 'Sede', clinica: 'OdontoVita' },
        { value: 'Unidade Norte', clinica: 'Bem Estar Clínicas' },
        { value: 'Centro Médico', clinica: 'Clínica Renovar' },
    ],
    acoes: ['Agendamento', 'Confirmação', 'Cancelamento', 'Lembrete'],
}

// ── KPIs ──
export const MOCK_KPIS = {
    total_registros: 1245,
    clinicas_ativas: 4,
    acoes_periodo: 328,
    variacao_percentual: 12.5,
}

// ── Credentials (for mock login) ──
export const MOCK_CREDENTIALS = {
    email: 'admin@contactia.com',
    password: '123456',
}
