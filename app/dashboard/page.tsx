import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { getUserSubscription } from '@/lib/db/queries';
import { BillingForm } from '@/components/billing-form';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const subscription = await getUserSubscription(session.user.id);

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            <BillingForm subscription={subscription} />
        </div>
    );
} 
