import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { Clock, CheckCircle, XCircle, CalendarDays, ArrowRight } from "lucide-react"

type RecentSpot = Prisma.SpotGetPayload<{ include: { host: { select: { name: true; email: true } } } }>

export default async function AdminDashboardPage() {
    const pendingCount = await prisma.spot.count({ where: { status: 'PENDING' } })
    const approvedCount = await prisma.spot.count({ where: { status: 'APPROVED' } })
    const rejectedCount = await prisma.spot.count({ where: { status: 'REJECTED' } })
    const bookingCount = await prisma.booking.count()
    const recentPending = (await prisma.spot.findMany({
        where: { status: 'PENDING' },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
            host: { select: { name: true, email: true } },
        },
    }) as unknown) as RecentSpot[]

    const stats = [
        { label: 'En attente', value: pendingCount, icon: Clock, href: '/admin/spots?status=PENDING', urgent: pendingCount > 0 },
        { label: 'Approuvés', value: approvedCount, icon: CheckCircle, href: '/admin/spots?status=APPROVED', urgent: false },
        { label: 'Rejetés', value: rejectedCount, icon: XCircle, href: '/admin/spots?status=REJECTED', urgent: false },
        { label: 'Réservations totales', value: bookingCount, icon: CalendarDays, href: '#', urgent: false },
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">Tableau de bord</h1>
                <p className="text-sm text-[var(--muted)] mt-1">Vue d'ensemble de la plateforme Loopark</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className={`border rounded-lg p-5 hover:border-[var(--muted-foreground)] transition-colors ${stat.urgent ? 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20' : 'border-[var(--border)] bg-[var(--surface-raised)]'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <Icon className={`h-4 w-4 ${stat.urgent ? 'text-amber-600' : 'text-[var(--muted)]'}`} />
                                <span className={`text-2xl font-semibold ${stat.urgent ? 'text-amber-600' : 'text-[var(--foreground)]'}`}>
                                    {stat.value}
                                </span>
                            </div>
                            <p className="text-xs text-[var(--muted)]">{stat.label}</p>
                        </Link>
                    )
                })}
            </div>

            {/* Recent pending */}
            {recentPending.length > 0 && (
                <section className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)]">
                    <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-600" />
                            <h2 className="text-base font-semibold">Spots en attente de validation</h2>
                        </div>
                        <Link
                            href="/admin/spots?status=PENDING"
                            className="flex items-center gap-1 text-xs text-brand-green hover:underline underline-offset-2"
                        >
                            Voir tous <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                        {recentPending.map((spot) => (
                            <div key={spot.id} className="p-5 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{spot.title}</p>
                                    <p className="text-xs text-[var(--muted)] mt-0.5">{spot.address}</p>
                                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                                        Par {spot.host.name ?? spot.host.email}
                                    </p>
                                </div>
                                <Link
                                    href="/admin/spots?status=PENDING"
                                    className="flex-shrink-0 text-xs font-medium text-brand-green hover:underline underline-offset-2"
                                >
                                    Modérer →
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {pendingCount === 0 && (
                <div className="border border-[var(--border)] rounded-lg p-12 text-center">
                    <CheckCircle className="h-8 w-8 text-brand-green mx-auto mb-3" />
                    <p className="text-sm font-medium text-[var(--foreground)]">Aucun spot en attente</p>
                    <p className="text-xs text-[var(--muted)] mt-1">La file de modération est vide.</p>
                </div>
            )}
        </div>
    )
}
