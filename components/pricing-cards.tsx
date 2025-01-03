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
        name: 'Starter',
        id: 'starter',
        priceMonthly: '$19',
        description: 'Perfect for regular users',
        features: [
            '25 chats per day',
            'Standard AI responses',
            '10MB file upload limit',
            'Basic chat history'
        ],
    },
    {
        name: 'Pro',
        id: 'pro',
        priceMonthly: '$29',
        description: 'Everything in Free, plus advanced features',
        features: [
            'Unlimited chats',
            'Priority AI responses',
            '50MB file upload limit',
            'Custom AI models',
        ],
    }
];

interface PricingCardsProps {
    userId?: string;
    stripePriceId?: string | null;
}

export function PricingCards({ userId, stripePriceId }: PricingCardsProps) {
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
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 justify-center items-center">
            {tiers.map((tier) => {
                const isCurrentPlan =
                    (tier.id === 'free' && !stripePriceId) ||
                    (tier.id === 'starter' && stripePriceId === 'price_starter') ||
                    (tier.id === 'pro' && stripePriceId === 'price_pro');

                return (
                    <Card
                        key={tier.id}
                        className={`flex w-full max-w-sm flex-col relative mt-6 ${isCurrentPlan ? 'border-primary shadow-md' : ''
                            }`}
                    >
                        {isCurrentPlan && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full whitespace-nowrap">
                                Current Plan
                            </div>
                        )}
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
                                disabled={loading === tier.id || isCurrentPlan}
                            >
                                {loading === tier.id
                                    ? 'Loading...'
                                    : isCurrentPlan
                                        ? 'Current Plan'
                                        : 'Upgrade'
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
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
