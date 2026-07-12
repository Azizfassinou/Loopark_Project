import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import BookingDetails from "@/components/BookingDetails";
import stripe from "@/lib/stripe";

export default async function BookingPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { id } = await params;
  const search = await searchParams;

  // Server actions are defined after the component declaration (see below).



  // Server‑side session validation
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch booking with related data
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      spot: {
        include: {
          host: {
            select: { name: true, email: true },
          },
        },
      },
      user: { select: { name: true, email: true } },
    },
  });

  if (!booking) {
    notFound();
  }

  // Authorisation
  const isOwner = booking.userId === session.user.id;
  const isHost = booking.spot.hostId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isHost && !isAdmin) {
    redirect("/app/profile");
  }

  const now = new Date();
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  // Status handling
  let statusText = "Confirmée";
  let statusColorClass = "bg-brand-green/10 text-brand-green border-brand-green/20";
  if (booking.status === "CANCELLED") {
    statusText = "Annulée";
    statusColorClass = "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900";
  } else if (start <= now && end >= now) {
    statusText = "En cours";
    statusColorClass = "bg-brand-green/10 text-brand-green border-brand-green/20";
  } else if (end < now) {
    statusText = "Terminée";
    statusColorClass = "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]";
  } else {
    statusText = "À venir";
    statusColorClass = "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900";
  }

  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const totalCost = (durationHours * booking.spot.price).toFixed(2);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  const accessCode = `LKP-${booking.id.substring(booking.id.length - 8).toUpperCase()}`;


// Server actions – defined in the same server component file
async function handleCancel() {
  "use server";
  const session = await auth();
  if (!session?.user?.id) return;

  const bookingToCancel = await prisma.booking.findUnique({
    where: { id },
    include: { spot: { select: { hostId: true } } },
  });
  if (!bookingToCancel) return;

  const isOwnerAction = bookingToCancel.userId === session.user.id;
  const isHostAction = bookingToCancel.spot.hostId === session.user.id;
  const isAdminAction = (session.user as any).role === "ADMIN";
  if (!isOwnerAction && !isHostAction && !isAdminAction) return;

  try {
    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    revalidatePath(`/app/booking/${id}`);
  } catch (error) {
    console.error("Failed to cancel booking:", error);
  }
}

async function handlePayment() {
  "use server";
  const session = await auth();
  if (!session?.user?.id || !booking) return;

  const durationHoursRounded = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  const amountCents = Math.round(booking.spot.price * durationHoursRounded * 100);
  let checkoutUrl: string;
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: `Réservation spot ${booking.spot.title}` },
          unit_amount: amountCents,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/booking/${booking.id}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/booking/${booking.id}?payment=cancel`,
      metadata: { bookingId: booking.id },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        stripeSessionId: stripeSession.id,
        paymentStatus: "PAID",
      }
    });
    checkoutUrl = stripeSession.url!;
  } catch (error) {
    console.error("Failed to create Stripe session:", error);
    return;
  }
  redirect(checkoutUrl);
}



  return (
    <>
      {String(search?.payment) === 'success' && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          Paiement réussi ! Accès débloqué.
        </div>
      )}
      <BookingDetails
        booking={booking}
        statusText={statusText}
        statusColorClass={statusColorClass}
        start={start}
        end={end}
        now={now}
        totalCost={totalCost}
        durationHours={durationHours}
        accessCode={accessCode}
      />

      {/* Cancel and Payment actions */}
      <div className="mt-4 flex flex-col gap-2">
        <form action={handleCancel}>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
            Annuler la réservation
          </button>
        </form>

        {booking.spot.price > 0 && (
          <form action={handlePayment}>
            <button type="submit" className="px-4 py-2 bg-brand-green text-white rounded hover:bg-green-700 transition">
              Payer maintenant
            </button>
          </form>
        )}
      </div>
    </>
  );
}
