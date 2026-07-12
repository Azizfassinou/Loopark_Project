import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { History, MapPin, Calendar, Bike, Zap, XCircle } from 'lucide-react'
import EditProfileForm from "./EditProfileForm"

interface Spot {
    id: string;
    title: string;
    address: string;
    type: 'BIKE' | 'SCOOTER' | 'BOTH';
    price: number;
}

interface Booking {
    id: string;
    userId: string;
    spotId: string;
    startDate: Date;
    endDate: Date;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    createdAt: Date;
    spot: Spot;
}

const STATUS_CONFIG = {
    active: { label: 'En cours', className: 'bg-brand-green/10 text-brand-green' },
    upcoming: { label: 'À venir', className: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' },
    past: { label: 'Terminée', className: 'bg-[var(--surface)] text-[var(--muted)]' },
    cancelled: { label: 'Annulée', className: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' },
};

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Fetch full user data (session doesn't carry firstName/lastName)
    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { firstName: true, lastName: true, email: true },
    });

    const bookings = await prisma.booking.findMany({
        where: { userId: session.user.id },
        include: { spot: true },
        orderBy: { createdAt: 'desc' },
    }) as unknown as Booking[];

    const now = new Date();

    const formatDate = (date: Date) => new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));

    const getBookingStatus = (booking: Booking) => {
        if (booking.status === 'CANCELLED') return 'cancelled';
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        if (start <= now && end >= now) return 'active';
        if (end < now) return 'past';
        return 'upcoming';
    };

    async function handleCancel(formData: FormData) {
        'use server';
        const bookingId = formData.get('bookingId') as string;
        const session = await auth();
        if (!session?.user?.id) return;
        try {
            await prisma.booking.update({
                where: { id: bookingId, userId: session.user.id },
                data: { status: 'CANCELLED' }
            });
            revalidatePath('/app/profile');
        } catch (error) {
            console.error("Failed to cancel booking:", error);
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">Mon profil</h1>
                <p className="text-sm text-[var(--muted)] mt-1">Gérez vos informations personnelles et vos réservations</p>
            </div>

            {/* Account info — editable */}
            <section className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)] overflow-hidden">
                <EditProfileForm
                    firstName={dbUser?.firstName ?? null}
                    lastName={dbUser?.lastName ?? null}
                    currentEmail={dbUser?.email ?? session.user.email}
                />
            </section>

            {/* Bookings */}
            <section className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)]">
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-[var(--muted)]" />
                        <h2 className="text-base font-semibold">Mes réservations</h2>
                    </div>
                    <span className="text-xs text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                        {bookings.length}
                    </span>
                </div>

                {bookings.length === 0 ? (
                    <div className="p-12 flex flex-col items-center text-center gap-3">
                        <History className="h-8 w-8 text-[var(--muted-foreground)]" />
                        <p className="text-sm text-[var(--muted)]">Aucune réservation pour le moment.</p>
                        <Link href="/app/search" className="text-sm font-medium text-brand-green hover:underline underline-offset-2">
                            Explorer les spots →
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--border)]">
                        {bookings.map((booking) => {
                            const status = getBookingStatus(booking);
                            const statusConfig = STATUS_CONFIG[status];
                            const start = new Date(booking.startDate);
                            const end = new Date(booking.endDate);
                            const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                            const totalCost = (durationHours * booking.spot.price).toFixed(2);

                            return (
                                <div key={booking.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[var(--surface)]/50 transition-colors">
                                    <Link href={`/app/booking/${booking.id}`} className="flex flex-1 items-center gap-4 min-w-0 group">
                                        <div className="w-9 h-9 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                                            {booking.spot.type === 'BIKE'
                                                ? <Bike className="h-4 w-4 text-[var(--muted)]" />
                                                : booking.spot.type === 'BOTH'
                                                ? <div className="flex"><Bike className="h-3.5 w-3.5 text-[var(--muted)]" /><Zap className="h-3.5 w-3.5 text-[var(--muted)]" /></div>
                                                : <Zap className="h-4 w-4 text-[var(--muted)]" />
                                            }
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-sm font-medium text-[var(--foreground)] group-hover:text-brand-green transition-colors">{booking.spot.title}</h4>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig.className}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                                                <MapPin className="h-3 w-3" />
                                                <span className="truncate">{booking.spot.address}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(booking.startDate)} — {formatDate(booking.endDate)}</span>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                                        <span className="text-sm font-medium text-[var(--foreground)]">
                                            {booking.spot.price === 0 ? 'Gratuit' : `${totalCost} €`}
                                        </span>
                                        {status === 'upcoming' && (
                                            <form action={handleCancel}>
                                                <input type="hidden" name="bookingId" value={booking.id} />
                                                <button className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-red-500 transition-colors cursor-pointer">
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    Annuler
                                                 </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}
