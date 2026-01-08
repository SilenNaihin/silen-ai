import { render, screen, fireEvent } from '@testing-library/react';
import {
  TabsProvider,
  TabButtons,
  TabContent,
  useTabsContext,
  useIsTabActive,
} from '@/components/navigation/Tabs';

describe('Tabs', () => {
  const tabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
  ];

  describe('TabsProvider', () => {
    it('renders children', () => {
      render(
        <TabsProvider tabs={tabs}>
          <div data-testid="child">Child content</div>
        </TabsProvider>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('uses first tab as default when no defaultTab specified', () => {
      render(
        <TabsProvider tabs={tabs}>
          <TabContent tabId="tab1">
            <div data-testid="content1">Content 1</div>
          </TabContent>
          <TabContent tabId="tab2">
            <div data-testid="content2">Content 2</div>
          </TabContent>
        </TabsProvider>
      );
      expect(screen.getByTestId('content1')).toBeInTheDocument();
      expect(screen.queryByTestId('content2')).not.toBeInTheDocument();
    });

    it('uses defaultTab when specified', () => {
      render(
        <TabsProvider tabs={tabs} defaultTab="tab2">
          <TabContent tabId="tab1">
            <div data-testid="content1">Content 1</div>
          </TabContent>
          <TabContent tabId="tab2">
            <div data-testid="content2">Content 2</div>
          </TabContent>
        </TabsProvider>
      );
      expect(screen.queryByTestId('content1')).not.toBeInTheDocument();
      expect(screen.getByTestId('content2')).toBeInTheDocument();
    });

    it('calls onTabChange when tab changes', () => {
      const onTabChange = jest.fn();
      render(
        <TabsProvider tabs={tabs} onTabChange={onTabChange}>
          <TabButtons />
        </TabsProvider>
      );

      fireEvent.click(screen.getByText('Tab 2'));
      expect(onTabChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('TabButtons', () => {
    it('renders all tab buttons', () => {
      render(
        <TabsProvider tabs={tabs}>
          <TabButtons />
        </TabsProvider>
      );
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('switches tabs on click', () => {
      render(
        <TabsProvider tabs={tabs}>
          <TabButtons />
          <TabContent tabId="tab1">
            <div data-testid="content1">Content 1</div>
          </TabContent>
          <TabContent tabId="tab2">
            <div data-testid="content2">Content 2</div>
          </TabContent>
        </TabsProvider>
      );

      expect(screen.getByTestId('content1')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Tab 2'));
      expect(screen.queryByTestId('content1')).not.toBeInTheDocument();
      expect(screen.getByTestId('content2')).toBeInTheDocument();
    });

    it('marks active tab with aria-selected', () => {
      render(
        <TabsProvider tabs={tabs} defaultTab="tab2">
          <TabButtons />
        </TabsProvider>
      );
      expect(screen.getByText('Tab 2').closest('button')).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByText('Tab 1').closest('button')).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    it('supports different variants', () => {
      const { rerender } = render(
        <TabsProvider tabs={tabs}>
          <TabButtons variant="default" />
        </TabsProvider>
      );
      expect(screen.getByRole('tablist')).toBeInTheDocument();

      rerender(
        <TabsProvider tabs={tabs}>
          <TabButtons variant="pills" />
        </TabsProvider>
      );
      expect(screen.getByRole('tablist')).toBeInTheDocument();

      rerender(
        <TabsProvider tabs={tabs}>
          <TabButtons variant="minimal" />
        </TabsProvider>
      );
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  describe('TabContent', () => {
    it('only renders when tab is active', () => {
      render(
        <TabsProvider tabs={tabs} defaultTab="tab1">
          <TabContent tabId="tab1">
            <div data-testid="content1">Content 1</div>
          </TabContent>
          <TabContent tabId="tab2">
            <div data-testid="content2">Content 2</div>
          </TabContent>
        </TabsProvider>
      );
      expect(screen.getByTestId('content1')).toBeInTheDocument();
      expect(screen.queryByTestId('content2')).not.toBeInTheDocument();
    });

    it('has correct aria attributes', () => {
      render(
        <TabsProvider tabs={tabs} defaultTab="tab1">
          <TabContent tabId="tab1">Content 1</TabContent>
        </TabsProvider>
      );
      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('id', 'tabpanel-tab1');
      expect(panel).toHaveAttribute('aria-labelledby', 'tab1');
    });
  });

  describe('useTabsContext', () => {
    it('throws when used outside TabsProvider', () => {
      const TestComponent = () => {
        useTabsContext();
        return null;
      };

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        'useTabsContext must be used within a TabsProvider'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('useIsTabActive', () => {
    it('returns true for active tab', () => {
      let isActive: boolean = false;

      const TestComponent = () => {
        isActive = useIsTabActive('tab1');
        return null;
      };

      render(
        <TabsProvider tabs={tabs} defaultTab="tab1">
          <TestComponent />
        </TabsProvider>
      );

      expect(isActive).toBe(true);
    });

    it('returns false for inactive tab', () => {
      let isActive: boolean = true;

      const TestComponent = () => {
        isActive = useIsTabActive('tab2');
        return null;
      };

      render(
        <TabsProvider tabs={tabs} defaultTab="tab1">
          <TestComponent />
        </TabsProvider>
      );

      expect(isActive).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('handles empty tabs array', () => {
      render(
        <TabsProvider tabs={[]}>
          <TabButtons />
        </TabsProvider>
      );
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('handles single tab', () => {
      render(
        <TabsProvider tabs={[{ id: 'only', label: 'Only Tab' }]}>
          <TabButtons />
          <TabContent tabId="only">Only content</TabContent>
        </TabsProvider>
      );
      expect(screen.getByText('Only Tab')).toBeInTheDocument();
      expect(screen.getByText('Only content')).toBeInTheDocument();
    });

    it('handles invalid defaultTab gracefully', () => {
      render(
        <TabsProvider tabs={tabs} defaultTab="nonexistent">
          <TabButtons />
          <TabContent tabId="tab1">
            <div data-testid="content1">Content 1</div>
          </TabContent>
        </TabsProvider>
      );
      // Should not crash, content won't show since no matching tab
      expect(screen.queryByTestId('content1')).not.toBeInTheDocument();
    });

    it('handles rapid tab switching', () => {
      render(
        <TabsProvider tabs={tabs}>
          <TabButtons />
          <TabContent tabId="tab1">Content 1</TabContent>
          <TabContent tabId="tab2">Content 2</TabContent>
          <TabContent tabId="tab3">Content 3</TabContent>
        </TabsProvider>
      );

      fireEvent.click(screen.getByText('Tab 2'));
      fireEvent.click(screen.getByText('Tab 3'));
      fireEvent.click(screen.getByText('Tab 1'));
      fireEvent.click(screen.getByText('Tab 3'));

      expect(screen.getByText('Content 3')).toBeInTheDocument();
    });
  });
});
