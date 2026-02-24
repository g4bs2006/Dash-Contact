import { formatDateTime } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface Activity {
    id: number
    action: string
    description: string
    timestamp: string
    user?: string
    status?: string
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
    if (!activities?.length) {
        return <div className="text-center py-6 text-sm text-muted-foreground">Nenhuma atividade recente.</div>
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border-subtle" />

                <ul className="space-y-6 relative">
                    {activities.map((activity) => (
                        <li key={activity.id} className="group flex gap-4">
                            {/* Dot */}
                            <div className="relative mt-1.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-surface-primary ring-1 ring-border-default group-hover:ring-coral-500/50 transition-all">
                                <div className="h-1.5 w-1.5 rounded-full bg-text-muted group-hover:bg-coral-500 transition-colors" />
                            </div>

                            <div className="flex-auto py-0.5 text-sm leading-5">
                                <div className="flex items-center justify-between gap-x-4">
                                    <div className="font-medium text-text-primary">
                                        {activity.action}
                                        {activity.status && (
                                            <span className="ml-2 inline-flex">
                                                <StatusBadge status={activity.status} size="sm" />
                                            </span>
                                        )}
                                    </div>
                                    <time dateTime={activity.timestamp} className="flex-none text-xs text-text-faint">
                                        {formatDateTime(activity.timestamp)}
                                    </time>
                                </div>
                                <p className="text-text-secondary mt-1">{activity.description}</p>
                                {activity.user && (
                                    <p className="text-xs text-text-muted mt-1">por {activity.user}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
