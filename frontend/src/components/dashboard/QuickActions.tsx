import { Plus, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function QuickActions({ onAction }: { onAction: (action: string) => void }) {
    return (
        <div className="flex flex-wrap gap-3">
            <Button
                variant="outline"
                size="sm"
                leftIcon={<FileText size={14} />}
                onClick={() => onAction('report')}
            >
                Relatório
            </Button>
            <Button
                variant="outline"
                size="sm"
                leftIcon={<Upload size={14} />}
                onClick={() => onAction('import')}
            >
                Importar
            </Button>
            <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() => onAction('new')}
            >
                Novo Registro
            </Button>
        </div>
    )
}
