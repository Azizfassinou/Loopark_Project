"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Bike,
  Zap,
  User,
  Mail,
  XCircle,
  ShieldCheck,
  CreditCard,
  Lock,
} from "lucide-react";

interface BookingDetailsProps {
  booking: any;
  statusText: string;
  statusColorClass: string;
  start: Date;
  end: Date;
  now: Date;
  totalCost: string;
  durationHours: number;

  accessCode: string;
}

export default function BookingDetails({
  booking,
  statusText,
  statusColorClass,
  start,
  end,
  now,
  totalCost,
  durationHours,

  accessCode,
}: BookingDetailsProps) {
  const mapsUrl =
    booking.spot.latitude && booking.spot.longitude
      ? `https://maps.google.com/?q=${booking.spot.latitude},${booking.spot.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        booking.spot.address
      )}`;

  const formatDate = (date: Date) => new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Bouton retour */}
      <div className="flex items-center justify-between">
        <Link
          href="/app/profile"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au profil
        </Link>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColorClass}`}>
          {statusText}
        </div>
      </div>

      {/* Titre principal */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Détails de la réservation</h1>
        <p className="text-xs text-[var(--muted)] mt-1">ID Réservation: #{booking.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Infos principales de la réservation (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)] p-6 space-y-6">
            {/* Spot header */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                {booking.spot.type === "BIKE"
                  ? <Bike className="h-5 w-5 text-brand-green" />
                  : booking.spot.type === "BOTH"
                    ? <div className="flex"><Bike className="h-4 w-4 text-brand-green" /><Zap className="h-4 w-4 text-brand-green" /></div>
                    : <Zap className="h-5 w-5 text-brand-green" />}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-[var(--foreground)] leading-snug">
                  {booking.spot.title}
                </h3>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-brand-green transition-colors flex items-center gap-1 mt-1"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate underline underline-offset-2">{booking.spot.address}</span>
                </a>
              </div>
            </div>

            {/* Heures de réservation */}
            <div className="border-t border-[var(--border)] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Date d'arrivée</span>
                <div className="flex items-center gap-2 text-sm text-[var(--foreground)] font-medium">
                  <Calendar className="h-4 w-4 text-[var(--muted)]" />
                  <span className="capitalize">{formatDate(start)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Date de départ</span>
                <div className="flex items-center gap-2 text-sm text-[var(--foreground)] font-medium">
                  <Clock className="h-4 w-4 text-[var(--muted)]" />
                  <span className="capitalize">{formatDate(end)}</span>
                </div>
              </div>
            </div>

            {/* Récapitulatif financier */}
            <div className="border-t border-[var(--border)] pt-6 space-y-3">
              <h4 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Détail du prix</h4>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Tarif horaire</span>
                <span className="font-medium text-[var(--foreground)]">{booking.spot.price.toFixed(2)} €/h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Durée totale</span>
                <span className="font-medium text-[var(--foreground)]">{durationHours} heure{durationHours > 1 ? 's' : ''}</span>
              </div>
              <div className="border-t border-dashed border-[var(--border)] pt-3 flex justify-between text-base font-semibold">
                <span className="text-[var(--foreground)]">Total payé</span>
                <span className="text-brand-green">{booking.spot.price === 0 ? 'Gratuit' : `${totalCost} €`}</span>
              </div>
            </div>
          </div>

          {/* Informations Hôte & Voyageur */}
          <div className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)] p-6 space-y-4">
            <h4 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Contact & Rôles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-medium text-[var(--muted)] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Hôte de l'espace
                </div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{booking.spot.host.name ?? 'Propriétaire'}</p>
                <p className="text-xs text-[var(--muted)] flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {booking.spot.host.email}
                </p>
              </div>
              <div className="p-4 rounded-md bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-medium text-[var(--muted)] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Réservé par
                </div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{booking.user.name ?? 'Utilisateur'}</p>
                <p className="text-xs text-[var(--muted)] flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {booking.user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Digipass Ticket Column */}
        <div className="space-y-6">
          {booking.spot.price > 0 && booking.paymentStatus !== 'PAID' ? (
            <div className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)] overflow-hidden flex flex-col items-center text-center p-6 space-y-4 relative">
              <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Accès verrouillé</h3>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  Veuillez procéder au paiement de votre réservation pour obtenir votre code d'accès et votre ticket.
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-brand-green/30 rounded-lg bg-brand-green/5 overflow-hidden flex flex-col items-center text-center p-6 space-y-6 relative">
              {/* Deco strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-green" />
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-brand-green uppercase tracking-widest">Digipass Loopark</span>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Ticket d'accès sécurisé</h3>
              </div>

              {/* QR Code Simulé */}
              <div className="bg-white p-3 rounded-lg border border-[var(--border)] inline-block">
                <svg className="w-32 h-32 text-black" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="0" y="0" width="30" height="30" rx="2" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  <rect x="70" y="0" width="30" height="30" rx="2" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />
                  <rect x="0" y="70" width="30" height="30" rx="2" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />
                  <rect x="35" y="5" width="10" height="5" />
                  <rect x="55" y="5" width="5" height="10" />
                  <rect x="35" y="15" width="5" height="5" />
                  <rect x="45" y="20" width="10" height="10" />
                  <rect x="5" y="35" width="5" height="10" />
                  <rect x="15" y="45" width="10" height="5" />
                  <rect x="75" y="35" width="15" height="5" />
                  <rect x="85" y="45" width="10" height="10" />
                  <rect x="70" y="55" width="5" height="5" />
                  <rect x="35" y="75" width="10" height="10" />
                  <rect x="55" y="80" width="5" height="15" />
                  <rect x="45" y="85" width="10" height="5" />
                  <rect x="40" y="40" width="20" height="20" rx="1" />
                  <rect x="45" y="45" width="10" height="10" fill="white" />
                  <rect x="48" y="48" width="4" height="4" />
                </svg>
              </div>

              {/* Digipass Code */}
              <div className="space-y-1.5 w-full">
                <span className="text-[10px] font-medium text-[var(--muted)] uppercase">Code clavier numérique</span>
                <div className="bg-[var(--surface)] border border-[var(--border)] py-2 px-4 rounded-md font-mono text-sm font-bold tracking-wider text-[var(--foreground)]">
                  {accessCode}
                </div>
              </div>

              {/* Instructions */}
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Scannez ce QR Code ou tapez le code d'accès ci-dessus sur le boîtier à l'entrée du parking si besoin.
              </p>
            </div>
          )}

          {/* Consignes particulières de l'hôte */}
          <div className="border border-[var(--border)] rounded-lg bg-[var(--surface-raised)] p-5 space-y-2">
            <div className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-green" /> Consignes d'accès
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              {booking.spot.description ? booking.spot.description : "Aucune consigne particulière spécifiée par l'hôte. Suivez l'emplacement indiqué à votre arrivée."}
            </p>
          </div>

          {/* Action buttons handled in page component */}
        </div>
      </div>
    </div>
  );
}
