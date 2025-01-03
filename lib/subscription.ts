import { getUserSubscription } from '@/lib/db/queries';

export async function checkSubscription(userId?: string) {
    if (!userId) {
        return false;
    }

    const subscription = await getUserSubscription(userId);

    if (!subscription) {
        return false;
    }

    const isValid =
        subscription.stripePriceId !== null &&
        subscription.stripeCurrentPeriodEnd &&
        subscription.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now();

    return !!isValid;
} 
