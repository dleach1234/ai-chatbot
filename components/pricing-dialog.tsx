'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from './ui/dialog';
import { PricingCards } from './pricing-cards';

interface PricingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId?: string;
}

export function PricingDialog({ open, onOpenChange, userId }: PricingDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-center">Pricing</DialogTitle>
                    <DialogDescription className="text-center text-2xl font-bold">
                        Choose the right plan for you
                    </DialogDescription>
                </DialogHeader>
                <PricingCards userId={userId} />
            </DialogContent>
        </Dialog>
    );
} 
