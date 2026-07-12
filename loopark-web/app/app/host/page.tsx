import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import SubmitSpotForm from "./SubmitSpotForm"
import { MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const STATUS_CONFIG = {
    PENDING: {
        label: 'En attente de validation',
        icon: Clock,
        className: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900',
    },
    APPROVED: {
        label: 'Approuvé — visible dans la recherche',
        icon: CheckCircle,
        className: 'text-brand-green bg-brand-green/5 border-brand-green/20',
    },
    REJECTED: {
        label: 'Rejeté',
        icon: XCircle,
        className: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
    },
};

const TYPE_LABELS: Record<string, string> = {
    BIKE: 'Vélo',
    SCOOTER: 'Trottinette',
    BOTH: 'Vélo & Trottinette',
};

export default async function HostPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const mySpots = await prisma.spot.findMany({
        where: { hostId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">Proposer un espace</h1>
                <p className="text-sm text-[var(--muted)] mt-1">
                    Soumettez votre espace de stationnement. Notre équipe le vérifiera avant publication.
                </p>
            </div>

            {/* Submission form */}
            <section className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)]">
                <div className="p-6 border-b border-[var(--border)]">
                    <h2 className="text-base font-semibold">Nouvel espace</h2>
                    <p className="text-xs text-[var(--muted)] mt-0.5">Tous les champs marqués d'un * sont obligatoires</p>
                </div>
                <div className="p-6">
                    <SubmitSpotForm />
                </div>
            </section>

            {/* My spots list */}
            <section className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)]">
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                    <h2 className="text-base font-semibold">Mes espaces soumis</h2>
                    <span className="text-xs text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                        {mySpots.length}
                    </span>
                </div>

                {mySpots.length === 0 ? (
                    <div className="p-12 flex flex-col items-center text-center gap-3">
                        <MapPin className="h-8 w-8 text-[var(--muted-foreground)]" />
                        <p className="text-sm text-[var(--muted)]">Vous n'avez pas encore soumis d'espace.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--border)]">
                        {mySpots.map((spot) => {
                            const config = STATUS_CONFIG[spot.status as keyof typeof STATUS_CONFIG]
                            const Icon = config.icon
                            return (
                                <div key={spot.id} className="p-6 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-medium text-[var(--foreground)] truncate">{spot.title}</h3>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-[var(--muted)]">
                                                <MapPin className="h-3 w-3" />
                                                <span>{spot.address}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
                                            <span className="text-[var(--muted)]">{TYPE_LABELS[spot.type]}</span>
                                            <span className="text-[var(--border)]">·</span>
                                            <span className="text-[var(--muted)]">{spot.capacity} place{spot.capacity > 1 ? 's' : ''}</span>
                                            <span className="text-[var(--border)]">·</span>
                                            <span className="text-[var(--muted)]">{spot.price === 0 ? 'Gratuit' : `${spot.price} €/h`}</span>
                                        </div>
                                    </div>

                                    <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${config.className}`}>
                                        <Icon className="h-3.5 w-3.5" />
                                        {config.label}
                                    </div>

                                    {spot.status === 'REJECTED' && spot.rejectionReason && (
                                        <div className="flex items-start gap-2 text-xs text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] rounded-md p-3">
                                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-red-500" />
                                            <div>
                                                <span className="font-medium text-red-600">Motif du rejet : </span>
                                                {spot.rejectionReason}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}
