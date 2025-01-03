'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PlusIcon, SparklesIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { PricingDialog } from './pricing-dialog';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
      <Sidebar className="group-data-[side=left]:border-r-0">
        <SidebarHeader>
          <SidebarMenu>
            <div className="flex flex-row justify-between items-center">
              <Link
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
                className="flex flex-row gap-3 items-center"
              >
                <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                  Bambi
                </span>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    className="p-2 h-fit"
                    onClick={() => {
                      setOpenMobile(false);
                      router.push('/');
                      router.refresh();
                    }}
                  >
                    <PlusIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="end">New Chat</TooltipContent>
              </Tooltip>
            </div>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarHistory user={user} />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2">
            <button
              className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-md text-left"
              onClick={() => {
                setOpenMobile(false);
                setShowPricing(true);
              }}
            >
              <SparklesIcon size={16} />
              Upgrade to Pro
            </button>
            {user && <SidebarUserNav user={user} />}
          </div>
        </SidebarFooter>
      </Sidebar>

      <PricingDialog
        open={showPricing}
        onOpenChange={setShowPricing}
        userId={user?.id}
      />
    </>
  );
}
