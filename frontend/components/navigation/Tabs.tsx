'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
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
}

/**
 * Provider for tab state management.
 * Wrap your article content with this to enable tabbed navigation.
 */
export function TabsProvider({
  children,
  tabs,
  defaultTab,
  onTabChange,
}: TabsProviderProps) {
  const [activeTab, setActiveTabState] = useState(defaultTab || tabs[0]?.id || '');

  const setActiveTab = useCallback(
    (id: string) => {
      setActiveTabState(id);
      onTabChange?.(id);
    },
    [onTabChange]
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
