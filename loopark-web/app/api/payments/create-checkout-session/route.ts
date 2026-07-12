import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import stripe from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId } = await request.json();
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { spot: true },
    });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Duration in hours, rounded up to next hour
    const durationHours = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60));
    const amountCents = Math.round(booking.spot.price * durationHours * 100);

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Réservation spot ${booking.spot.title}` },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/booking/${booking.id}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/booking/${booking.id}?payment=cancel`,
      metadata: { bookingId },
    });

    // Store session id for webhook lookup
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
