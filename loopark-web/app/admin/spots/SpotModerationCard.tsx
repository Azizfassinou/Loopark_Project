'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, ChevronDown, Loader2, MapPin, User } from 'lucide-react';

interface SpotHost {
    name: string | null;
    email: string | null;
}

interface Spot {
    id: string;
    title: string;
    address: string;
    type: string;
    price: number;
    capacity: number;
    status: string;
    rejectionReason: string | null;
    createdAt: string;
    host: SpotHost;
    _count: { bookings: number };
}

const TYPE_LABELS: Record<string, string> = {
    BIKE: 'Vélo',
    SCOOTER: 'Trottinette',
    BOTH: 'Vélo & Trotts',
};

export default function SpotModerationCard({ spot }: { spot: Spot }) {
    const router = useRouter();
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState<'approve' | 'reject' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleApprove = async () => {
        setIsLoading('approve');
        setError(null);
        try {
            const res = await fetch(`/api/spots/${spot.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'APPROVED' }),
            });
            if (!res.ok) throw new Error('Erreur lors de l\'approbation');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(null);
        }
    };

    const handleReject = async () => {
        if (!reason.trim()) {
            setError('Veuillez indiquer un motif de rejet.');
            return;
        }
        setIsLoading('reject');
        setError(null);
        try {
            const res = await fetch(`/api/spots/${spot.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'REJECTED', rejectionReason: reason }),
            });
            if (!res.ok) throw new Error('Erreur lors du rejet');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-3">
            {/* Info block — stack on mobile, side-by-side on desktop */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-medium text-[var(--foreground)] truncate">{spot.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{spot.address}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span>{spot.host.name ?? spot.host.email}</span>
                        {spot.host.name && spot.host.email && (
                            <span className="text-[var(--muted-foreground)] hidden sm:inline">({spot.host.email})</span>
                        )}
                    </div>
                </div>

                {/* Badges — wrapping row */}
                <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:flex-shrink-0">
                    <span className="text-xs text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full whitespace-nowrap">
                        {TYPE_LABELS[spot.type] ?? spot.type}
                    </span>
                    <span className="text-xs text-[var(--muted)] whitespace-nowrap">{spot.capacity} place{spot.capacity > 1 ? 's' : ''}</span>
                    <span className="text-xs font-medium text-[var(--foreground)] whitespace-nowrap">
                        {spot.price === 0 ? 'Gratuit' : `${spot.price} €/h`}
                    </span>
                    <span className="text-[10px] text-[var(--muted-foreground)] whitespace-nowrap">
                        {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(spot.createdAt))}
                    </span>
                </div>
            </div>

            {spot.rejectionReason && (
                <p className="text-xs text-[var(--muted)] italic border-l-2 border-red-300 pl-3">
                    Motif précédent : {spot.rejectionReason}
                </p>
            )}

            {error && (
                <p className="text-xs text-red-600">{error}</p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
                {spot.status !== 'APPROVED' && (
                    <button
                        onClick={handleApprove}
                        disabled={!!isLoading}
                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-green text-white px-3 py-2 rounded-md hover:bg-brand-green-dark transition-colors disabled:opacity-50 touch-action-manipulation"
                    >
                        {isLoading === 'approve' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                        Approuver
                    </button>
                )}

                {spot.status !== 'REJECTED' && (
                    <button
                        onClick={() => setShowRejectForm(!showRejectForm)}
                        disabled={!!isLoading}
                        className="inline-flex items-center gap-1.5 text-xs font-medium border border-red-200 text-red-600 px-3 py-2 rounded-md hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                    >
                        <XCircle className="h-3.5 w-3.5" />
                        Rejeter
                        <ChevronDown className={`h-3 w-3 transition-transform ${showRejectForm ? 'rotate-180' : ''}`} />
                    </button>
                )}

                {spot.status === 'REJECTED' && (
                    <button
                        onClick={handleApprove}
                        disabled={!!isLoading}
                        className="inline-flex items-center gap-1.5 text-xs font-medium border border-[var(--border)] text-[var(--foreground)] px-3 py-2 rounded-md hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                    >
                        {isLoading === 'approve' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                        Approuver quand même
                    </button>
                )}
            </div>

            {showRejectForm && (
                <div className="space-y-2 border-t border-[var(--border)] pt-3">
                    <label className="text-xs font-medium text-[var(--foreground)]">
                        Motif du rejet (visible par l'hôte)
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={2}
                        placeholder="ex: Adresse introuvable, description insuffisante..."
                        className="flex w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors resize-none"
                    />
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleReject}
                            disabled={!!isLoading}
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading === 'reject' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Confirmer le rejet
                        </button>
                        <button
                            onClick={() => { setShowRejectForm(false); setReason(''); setError(null); }}
                            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-3 py-2 transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
