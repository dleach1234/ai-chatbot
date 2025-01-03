import { auth } from '@/app/(auth)/auth';
import { stripe } from '@/lib/stripe';
import { getUserSubscription } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const subscription = await getUserSubscription(session.user.id);
        if (!subscription?.stripeCustomerId) {
            return new NextResponse('No subscription found', { status: 404 });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse('Error', { status: 500 });
    }
} 
