import { motion, AnimatePresence } from 'framer-motion'
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

// Helper to group activities by time blocks
function groupActivitiesByTime(activities: Activity[]) {
    const now = new Date()

    return activities.reduce((acc, activity) => {
        const activityTime = new Date(activity.timestamp)
        const diffMs = now.getTime() - activityTime.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        let timeGroup: string
        if (diffMins < 1) {
            timeGroup = 'Agora'
        } else if (diffMins < 60) {
            timeGroup = 'Últimos 60 minutos'
        } else if (diffHours < 24) {
            timeGroup = 'Hoje'
        } else if (diffDays === 1) {
            timeGroup = 'Ontem'
        } else if (diffDays < 7) {
            timeGroup = 'Esta semana'
        } else {
            timeGroup = 'Mais antigo'
        }

        if (!acc[timeGroup]) {
            acc[timeGroup] = []
        }

        // Garante ao typescript que o array foi inicializado.
        const group = acc[timeGroup]
        if (group) {
            group.push(activity)
        }

        return acc
    }, {} as Record<string, Activity[]>)
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
    if (!activities?.length) {
        return (
            <div className="text-center py-6 text-sm text-grafite-500">
                Nenhuma atividade recente.
            </div>
        )
    }

    const groupedByTime = groupActivitiesByTime(activities)

    return (
        <div className="space-y-8">
            <AnimatePresence>
                {Object.entries(groupedByTime).map(([timeGroup, items], groupIdx) => (
                    <motion.div
                        key={timeGroup}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: groupIdx * 0.1 }}
                    >
                        {/* Time label */}
                        <div className="mb-4 flex items-center gap-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-grafite-500">
                                {timeGroup}
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-border-default to-transparent" />
                            <span className="text-xs text-grafite-600">{items.length}</span>
                        </div>

                        {/* Timeline with flowing animation */}
                        <div className="space-y-4 relative pl-8">
                            {/* Animated vertical line */}
                            <motion.div
                                className="absolute left-3 top-0 w-1 bg-gradient-to-b from-coral-500 to-transparent"
                                style={{
                                    height: `${items.length * 80}px`
                                }}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.6, delay: 0.1 + groupIdx * 0.1 }}
                            />

                            {items.map((activity, idx) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    className="group/item relative pb-4"
                                >
                                    {/* Animated dot */}
                                    <div className="absolute -left-7 top-1 h-4 w-4 rounded-full bg-coral-500/20 border border-coral-500 group-hover/item:bg-coral-500 group-hover/item:shadow-neon transition-all" />

                                    {/* Activity card */}
                                    <div className="rounded-lg p-3 bg-grafite-900 border border-transparent group-hover/item:border-coral-500/30 transition-all cursor-default relative overflow-hidden">

                                        {/* Glow Hover Layer */}
                                        <div className="absolute inset-0 bg-coral-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity" />

                                        <div className="flex items-start justify-between gap-2 relative z-10">
                                            <p className="text-sm font-medium flex-1 text-grafite-50">
                                                {activity.action}
                                                {activity.status && (
                                                    <span className="ml-2 inline-flex">
                                                        <StatusBadge status={activity.status as any} size="sm" />
                                                    </span>
                                                )}
                                            </p>
                                            {activity.timestamp && (
                                                <time
                                                    dateTime={activity.timestamp}
                                                    className="flex-none text-xs text-grafite-500 whitespace-nowrap"
                                                >
                                                    {formatDateTime(activity.timestamp)}
                                                </time>
                                            )}
                                        </div>
                                        <p className="text-xs text-grafite-400 mt-1 relative z-10">{activity.description}</p>
                                        {activity.user && (
                                            <p className="text-xs text-grafite-600 mt-1 relative z-10">por {activity.user}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
