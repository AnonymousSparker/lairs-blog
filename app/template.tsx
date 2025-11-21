'use client';

import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    // This div wraps every page and triggers the animation on navigation
    <div className="page-transition">
      {children}
    </div>
  );
}