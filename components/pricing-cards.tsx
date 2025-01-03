'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card';
import { toast } from 'sonner';

const tiers = [
    {
        name: 'Free',
        id: 'free',
        priceMonthly: '$0',
        description: 'Essential features for getting started',
        features: ['5 chats per day', 'Basic AI responses', '2MB file upload limit'],
    },
    {
        name: 'Pro',
        id: 'pro',
        priceMonthly: '$10',
        description: 'Everything in Free, plus advanced features',
        features: [
            'Unlimited chats',
            'Priority AI responses',
            '50MB file upload limit',
            'Custom AI models',
        ],
    }
];

export function PricingCards({ userId }: { userId?: string }) {
    const [loading, setLoading] = useState<string | null>(null);

    const onSubmit = async (tierId: string) => {
        if (!userId) {
            return toast.error('Please sign in first');
        }

        try {
            setLoading(tierId);
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tierId,
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            window.location.href = data.url;
        } catch (error) {
            toast.error('Something went wrong, please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 [&>*]:mx-auto">
            {tiers.map((tier) => (
                <Card key={tier.id} className="flex w-full max-w-sm flex-col">
                    <CardHeader>
                        <CardTitle>{tier.name}</CardTitle>
                        <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <p className="text-3xl font-bold">{tier.priceMonthly}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2">
                                    <CheckIcon className="h-4 w-4" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => onSubmit(tier.id)}
                            disabled={loading === tier.id}
                        >
                            {loading === tier.id ? 'Loading...' : 'Get Started'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
} 
