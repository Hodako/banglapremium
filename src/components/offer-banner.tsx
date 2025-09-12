'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Gift } from 'lucide-react';

export function OfferBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('offerBannerDismissed');
    if (isDismissed !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('offerBannerDismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-accent text-accent-foreground">
      <div className="container mx-auto flex h-10 items-center justify-center px-4 text-center text-sm font-medium">
        <Gift className="mr-2 h-4 w-4" />
        <span>Special Offer! Get 20% off on all professional subscriptions. Use code: PRO20</span>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-accent/50"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
}
