'use client';

import { ReactNode } from 'react';

interface ArticleSectionProps {
  children: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}

/**
 * Article section with optional right-side content (e.g., code panels)
 * Right content is positioned in the right margin
 */
export function ArticleSection({ children, rightContent, className = '' }: ArticleSectionProps) {
  return (
    <div className={`relative mb-16 ${className}`}>
      {/* Main text content */}
      <div className="prose prose-lg max-w-none">
        {children}
      </div>

      {/* Right panel - absolutely positioned in right margin */}
      {rightContent && (
        <div className="hidden xl:block absolute left-full ml-8 top-0 w-[26rem]">
          {rightContent}
        </div>
      )}
    </div>
  );
}

