import prisma from "@/lib/prisma"
import { Prisma, SpotStatus } from "@prisma/client"
import Link from "next/link"
import SpotModerationCard from "./SpotModerationCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

const STATUS_TABS = [
    { key: 'PENDING', label: 'En attente' },
    { key: 'APPROVED', label: 'Approuvés' },
    { key: 'REJECTED', label: 'Rejetés' },
]

const PAGE_SIZE = 25

export default async function AdminSpotsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string }>
}) {
    const params = await searchParams
    const currentStatus = params.status ?? 'PENDING'
    const currentPage = Math.max(1, parseInt(params.page ?? '1'))
    const skip = (currentPage - 1) * PAGE_SIZE

    const [spots, total, rawCounts] = await Promise.all([
        prisma.spot.findMany({
            where: { status: currentStatus as SpotStatus },
            include: {
                host: { select: { name: true, email: true } },
                _count: { select: { bookings: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            skip,
        }) as unknown as Promise<Array<Prisma.SpotGetPayload<{
            include: {
                host: { select: { name: true; email: true } }
                _count: { select: { bookings: true } }
            }
        }>>>,
        prisma.spot.count({ where: { status: currentStatus as SpotStatus } }),
        prisma.spot.groupBy({ by: ['status'], _count: { _all: true } }),
    ])

    const counts = rawCounts as unknown as Array<{ status: SpotStatus; _count: { _all: number } }>
    const countMap: Record<string, number> = Object.fromEntries(
        counts.map((c) => [c.status, c._count._all])
    )

    const totalPages = Math.ceil(total / PAGE_SIZE)

    const buildHref = (page: number) =>
        `/admin/spots?status=${currentStatus}&page=${page}`

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">Modération des espaces</h1>
                <p className="text-sm text-[var(--muted)] mt-1">Vérifiez et validez les espaces soumis par les hôtes</p>
            </div>

            {/* Status tabs */}
            <div className="flex items-center gap-1 border-b border-[var(--border)]">
                {STATUS_TABS.map((tab) => {
                    const count = countMap[tab.key] ?? 0
                    const isActive = currentStatus === tab.key
                    return (
                        <Link
                            key={tab.key}
                            href={`/admin/spots?status=${tab.key}&page=1`}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${isActive
                                ? 'border-[var(--foreground)] text-[var(--foreground)] font-medium'
                                : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab.key === 'PENDING' && count > 0
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                                    : 'bg-[var(--surface)] text-[var(--muted)]'
                                    }`}>
                                    {count.toLocaleString('fr-FR')}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Spots list */}
            {spots.length === 0 ? (
                <div className="border border-[var(--border)] rounded-lg p-16 text-center">
                    <p className="text-sm font-medium text-[var(--foreground)]">Aucun spot dans cette catégorie</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                        {currentStatus === 'PENDING' ? 'Tous les espaces ont été traités.' : 'Rien à afficher ici.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Result count */}
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                        <span>
                            {total.toLocaleString('fr-FR')} spots · page {currentPage} sur {totalPages}
                        </span>
                        <span>
                            {skip + 1}–{Math.min(skip + PAGE_SIZE, total)} affichés
                        </span>
                    </div>

                    <div className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)] divide-y divide-[var(--border)]">
                        {spots.map((spot) => (
                            <SpotModerationCard key={spot.id} spot={spot as any} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-2">
                            <Link
                                href={buildHref(currentPage - 1)}
                                className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border border-[var(--border)] transition-colors ${currentPage <= 1
                                    ? 'pointer-events-none opacity-40'
                                    : 'hover:bg-[var(--surface)] text-[var(--foreground)]'
                                    }`}
                                aria-disabled={currentPage <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Précédent</span>
                            </Link>

                            {/* Page numbers — hidden on mobile, show counter instead */}
                            <div className="flex items-center gap-1">
                                {/* Mobile: simple counter */}
                                <span className="sm:hidden text-sm text-[var(--muted)]">
                                    {currentPage} / {totalPages}
                                </span>
                                {/* Desktop: page numbers */}
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                                        let page: number
                                        if (totalPages <= 7) {
                                            page = i + 1
                                        } else if (currentPage <= 4) {
                                            page = i + 1
                                        } else if (currentPage >= totalPages - 3) {
                                            page = totalPages - 6 + i
                                        } else {
                                            page = currentPage - 3 + i
                                        }
                                        return (
                                            <Link
                                                key={page}
                                                href={buildHref(page)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${page === currentPage
                                                    ? 'bg-[var(--foreground)] text-[var(--background)] font-medium'
                                                    : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
                                                    }`}
                                            >
                                                {page}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>

                            <Link
                                href={buildHref(currentPage + 1)}
                                className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border border-[var(--border)] transition-colors ${currentPage >= totalPages
                                    ? 'pointer-events-none opacity-40'
                                    : 'hover:bg-[var(--surface)] text-[var(--foreground)]'
                                    }`}
                                aria-disabled={currentPage >= totalPages}
                            >
                                <span className="hidden sm:inline">Suivant</span>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
