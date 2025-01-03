'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { format } from 'date-fns';

interface BillingFormProps {
    subscription: {
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
        stripePriceId: string | null;
        stripeCurrentPeriodEnd: Date | null;
    } | null;
}

export function BillingForm({ subscription }: BillingFormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/stripe/create-portal', {
                method: 'POST',
            });
            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    return (
        <div className="border rounded-lg p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold mb-1">Subscription Status</h2>
                <p className="text-sm text-muted-foreground">
                    {subscription?.stripePriceId ? 'Pro Plan' : 'Free Plan'}
                </p>
            </div>

            {subscription?.stripeCurrentPeriodEnd && (
                <div>
                    <h2 className="text-xl font-semibold mb-1">Next Payment</h2>
                    <p className="text-sm text-muted-foreground">
                        {format(subscription.stripeCurrentPeriodEnd, 'MMMM do, yyyy')}
                    </p>
                </div>
            )}

            <Button
                onClick={handleSubmit}
                disabled={loading || !subscription?.stripeSubscriptionId}
            >
                {loading ? 'Loading...' : 'Manage Subscription'}
            </Button>
        </div>
    );
} 
