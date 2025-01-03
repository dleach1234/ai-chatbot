import { auth } from '@/app/(auth)/auth';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL;

const STRIPE_PRODUCTS = {
    pro: process.env.STRIPE_PRO_PRICE_ID,
};

export async function POST(req: Request) {
    try {
        const session = await auth();
        const { tierId } = await req.json();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'You must be logged in.' },
                { status: 401 }
            );
        }

        if (tierId === 'free') {
            return NextResponse.json(
                { error: 'Cannot create checkout session for free tier' },
                { status: 400 }
            );
        }

        const priceId = STRIPE_PRODUCTS[tierId as keyof typeof STRIPE_PRODUCTS];

        if (!priceId) {
            return NextResponse.json(
                { error: 'Invalid tier selected' },
                { status: 400 }
            );
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer_email: session.user.email!,
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${DOMAIN}/dashboard/billing?success=true`,
            cancel_url: `${DOMAIN}/pricing?canceled=true`,
            metadata: {
                userId: session.user.id,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 
