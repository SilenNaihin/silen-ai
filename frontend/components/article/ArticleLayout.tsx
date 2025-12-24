'use client';

import { ReactNode, useRef } from 'react';
import { useScrollProgress } from '@/components/animation/useScrollProgress';

interface ArticleLayoutProps {
  children: ReactNode;
  leftContent?: (progress: number) => ReactNode;
  className?: string;
}

/**
 * Main article layout with fixed-width content in center
 * Optional left sidebar for scroll-synced animations
 */
export function ArticleLayout({
  children,
  leftContent,
  className = '',
}: ArticleLayoutProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useScrollProgress(articleRef);

  return (
    <div ref={articleRef} className={`min-h-screen ${className}`}>
      <div className="relative max-w-[1600px] mx-auto px-8">
        {/* Animation - centered vertically on viewport */}
        {leftContent && (
          <>
            {/* Desktop: Left margin, full opacity */}
            <div className="fixed left-[calc((100vw-1600px)/2+2rem)] top-1/2 -translate-y-1/2 w-[28rem] h-[28rem] hidden xl:flex items-center justify-center pr-8">
              {leftContent(scrollProgress)}
            </div>

            {/* Mobile/Tablet: Behind text, reduced opacity */}
            <div className="fixed inset-0 flex items-center justify-center opacity-30 xl:hidden pointer-events-none">
              {leftContent(scrollProgress)}
            </div>
          </>
        )}

        {/* Main content - centered with equal margins */}
        <div className="xl:mx-[30rem] max-w-2xl mx-auto py-24 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
