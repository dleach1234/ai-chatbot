import { auth } from '@/app/(auth)/auth';
import { AgentFormComponent } from '@/app/(chat)/agent/agent-form';
import { notFound } from 'next/navigation';

export default async function AgentNewPage() {
  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  return (
    <>
      <AgentFormComponent user={session?.user!} />
    </>
  );
}
