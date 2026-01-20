'use client';

import { ReactNode, useRef } from 'react';
import { useScrollProgress } from '@/components/animation/useScrollProgress';

interface ArticleLayoutProps {
  children: ReactNode;
  leftContent?: (progress: number) => ReactNode;
  className?: string;
  /** Hide the mobile animation disclaimer. Default: false */
  hideMobileDisclaimer?: boolean;
}

/**
 * Main article layout with fixed-width content in center
 * Optional left sidebar for scroll-synced animations
 */
export function ArticleLayout({
  children,
  leftContent,
  className = '',
  hideMobileDisclaimer = false,
}: ArticleLayoutProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useScrollProgress(articleRef);

  return (
    <div ref={articleRef} className={`min-h-screen ${className}`}>
      <div className="relative max-w-[1600px] mx-auto px-2 min-[412px]:px-4 md:px-8">
        {/* Animation - centered vertically on viewport */}
        {leftContent && (
          <>
            {/* Desktop: Centered in left column (space between viewport edge and content) */}
            <div className="fixed left-0 top-1/2 -translate-y-1/2 w-[calc((100vw-768px)/2)] h-[28rem] hidden xl:flex items-center justify-center">
              {leftContent(scrollProgress)}
            </div>

            {/* Mobile/Tablet: Behind text, reduced opacity */}
            <div className="fixed inset-0 flex items-center justify-center opacity-30 xl:hidden pointer-events-none">
              {leftContent(scrollProgress)}
            </div>
          </>
        )}

        {/* Main content - always centered, animation is fixed overlay */}
        <div className="py-16 relative z-10 max-w-3xl mx-auto px-1 min-[412px]:px-2 sm:px-4">
          {/* Mobile disclaimer about animations */}
          {leftContent && !hideMobileDisclaimer && (
            <div className="xl:hidden mb-6 text-xs text-neutral-400 text-center">
              Scroll-synced animations are best viewed on desktop
            </div>
          )}
          {children}

          {/* Footer link */}
          <div className="mt-16 pt-8 border-t border-neutral-800 text-center">
            <a
              href="https://silennai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors text-sm"
            >
              silennai.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
