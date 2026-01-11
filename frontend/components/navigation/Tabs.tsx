'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  tabs: TabConfig[];
}

interface TabConfig {
  id: string;
  label: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider');
  }
  return context;
}

interface TabsProviderProps {
  children: ReactNode;
  tabs: TabConfig[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  /** Query parameter name for URL sync. Set to false to disable URL sync. Default: 'tab' */
  queryParam?: string | false;
}

/**
 * Provider for tab state management.
 * Wrap your article content with this to enable tabbed navigation.
 *
 * By default, syncs active tab to URL query params (e.g., ?tab=training).
 * This ensures refreshing the page maintains the current tab.
 */
export function TabsProvider(props: TabsProviderProps) {
  return (
    <Suspense fallback={<TabsProviderFallback {...props} />}>
      <TabsProviderInner {...props} />
    </Suspense>
  );
}

/**
 * Fallback component that renders without URL sync during SSR/loading
 */
function TabsProviderFallback({
  children,
  tabs,
  defaultTab,
}: TabsProviderProps) {
  const [activeTab, setActiveTabState] = useState(defaultTab || tabs[0]?.id || '');

  const setActiveTab = useCallback(
    (id: string) => {
      setActiveTabState(id);
    },
    []
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, tabs }}>
      {children}
    </TabsContext.Provider>
  );
}

/**
 * Inner provider that uses searchParams (requires Suspense boundary)
 */
function TabsProviderInner({
  children,
  tabs,
  defaultTab,
  onTabChange,
  queryParam = 'tab',
}: TabsProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get initial tab from URL or default
  const getInitialTab = useCallback(() => {
    if (queryParam) {
      const urlTab = searchParams.get(queryParam);
      if (urlTab && tabs.some(t => t.id === urlTab)) {
        return urlTab;
      }
    }
    return defaultTab || tabs[0]?.id || '';
  }, [searchParams, queryParam, defaultTab, tabs]);

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  // Sync with URL on mount and when URL changes
  useEffect(() => {
    if (queryParam) {
      const urlTab = searchParams.get(queryParam);
      if (urlTab && tabs.some(t => t.id === urlTab) && urlTab !== activeTab) {
        setActiveTabState(urlTab);
      }
    }
  }, [searchParams, queryParam, tabs, activeTab]);

  const setActiveTab = useCallback(
    (id: string) => {
      setActiveTabState(id);
      onTabChange?.(id);

      // Update URL query param
      if (queryParam) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(queryParam, id);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [onTabChange, queryParam, searchParams, router, pathname]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, tabs }}>
      {children}
    </TabsContext.Provider>
  );
}

interface TabButtonsProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'pills';
}

/**
 * Tab buttons for switching between tabs.
 * Can be placed anywhere within a TabsProvider.
 */
export function TabButtons({ className = '', variant = 'default' }: TabButtonsProps) {
  const { activeTab, setActiveTab, tabs } = useTabsContext();

  const baseStyles = 'relative px-4 py-2 text-sm font-medium transition-colors';

  const variantStyles = {
    default: {
      container: 'flex gap-1 bg-neutral-100 rounded-lg p-1',
      tab: 'rounded-md',
      active: 'bg-white text-black shadow-sm',
      inactive: 'text-neutral-600 hover:text-black',
    },
    minimal: {
      container: 'flex gap-6',
      tab: '',
      active: 'text-black',
      inactive: 'text-neutral-400 hover:text-neutral-600',
    },
    pills: {
      container: 'flex gap-2',
      tab: 'rounded-full border',
      active: 'bg-black text-white border-black',
      inactive: 'bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-400',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.container} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`${baseStyles} ${styles.tab} ${
              isActive ? styles.active : styles.inactive
            }`}
          >
            {tab.label}
            {variant === 'minimal' && isActive && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

interface TabContentProps {
  tabId: string;
  children: ReactNode;
  className?: string;
}

/**
 * Content panel for a specific tab.
 * Only renders when its tab is active.
 */
export function TabContent({ tabId, children, className = '' }: TabContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== tabId) {
    return null;
  }

  return (
    <div
      id={`tabpanel-${tabId}`}
      role="tabpanel"
      aria-labelledby={tabId}
      className={className}
    >
      {children}
    </div>
  );
}

/**
 * Hook to check if a specific tab is active
 */
export function useIsTabActive(tabId: string): boolean {
  const { activeTab } = useTabsContext();
  return activeTab === tabId;
}

/**
 * Alias for useTabsContext for convenience
 */
export function useTabs() {
  return useTabsContext();
}

interface TabSwitchButtonProps {
  targetTab: string;
  label?: string;
  className?: string;
  scrollToTop?: boolean;
}

/**
 * Button to switch to another tab and optionally scroll to top.
 * Use at the end of an article to guide users to the next section.
 */
export function TabSwitchButton({
  targetTab,
  label,
  className = '',
  scrollToTop = true,
}: TabSwitchButtonProps) {
  const { tabs, setActiveTab } = useTabsContext();
  const targetTabConfig = tabs.find(t => t.id === targetTab);

  if (!targetTabConfig) {
    return null;
  }

  const handleClick = () => {
    setActiveTab(targetTab);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group flex items-center justify-center gap-3 px-6 py-4 bg-black text-white hover:bg-neutral-800 rounded-lg transition-colors ${className}`}
    >
      <span className="font-medium">{label || `Continue to ${targetTabConfig.label}`}</span>
      <svg
        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
