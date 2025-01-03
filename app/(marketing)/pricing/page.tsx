import { auth } from '@/app/(auth)/auth';
import { PricingCards } from '@/components/pricing-cards';

export default async function PricingPage() {
    const session = await auth();

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-base font-semibold leading-7 text-primary">
                        Pricing
                    </h1>
                    <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                        Choose the right plan for&nbsp;you
                    </p>
                </div>
                <PricingCards userId={session?.user?.id} />
            </div>
        </div>
    );
} 
