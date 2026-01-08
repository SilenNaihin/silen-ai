import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import {
  TOCProvider,
  TOCHeading,
  TOCDropdown,
  useTOCContext,
  useCurrentSection,
  useTOCItems,
} from '@/components/navigation/TableOfContents';

describe('TableOfContents', () => {
  describe('TOCProvider', () => {
    it('renders children', () => {
      render(
        <TOCProvider>
          <div data-testid="child">Child content</div>
        </TOCProvider>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('TOCHeading', () => {
    it('renders heading with correct tag', () => {
      render(
        <TOCProvider>
          <TOCHeading id="test" level={2}>
            Test Heading
          </TOCHeading>
        </TOCProvider>
      );
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Test Heading');
      expect(heading).toHaveAttribute('id', 'test');
    });

    it('supports custom tag via as prop', () => {
      render(
        <TOCProvider>
          <TOCHeading id="test" level={2} as="h3">
            Custom Tag
          </TOCHeading>
        </TOCProvider>
      );
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('applies className', () => {
      render(
        <TOCProvider>
          <TOCHeading id="test" level={2} className="custom-class">
            Styled Heading
          </TOCHeading>
        </TOCProvider>
      );
      expect(screen.getByRole('heading')).toHaveClass('custom-class');
    });

    it('registers heading on mount', async () => {
      let items: { id: string; text: string; level: number }[] = [];

      const ItemsReader = () => {
        items = useTOCItems();
        return null;
      };

      render(
        <TOCProvider>
          <TOCHeading id="section1" level={2}>
            Section 1
          </TOCHeading>
          <ItemsReader />
        </TOCProvider>
      );

      await waitFor(() => {
        expect(items).toHaveLength(1);
        expect(items[0]).toEqual({ id: 'section1', text: 'Section 1', level: 2 });
      });
    });

    it('unregisters heading on unmount', async () => {
      let items: { id: string; text: string; level: number }[] = [];

      const ItemsReader = () => {
        items = useTOCItems();
        return null;
      };

      const { rerender } = render(
        <TOCProvider>
          <TOCHeading id="section1" level={2}>
            Section 1
          </TOCHeading>
          <ItemsReader />
        </TOCProvider>
      );

      await waitFor(() => {
        expect(items).toHaveLength(1);
      });

      rerender(
        <TOCProvider>
          <ItemsReader />
        </TOCProvider>
      );

      await waitFor(() => {
        expect(items).toHaveLength(0);
      });
    });
  });

  describe('TOCDropdown', () => {
    it('shows dropdown on hover', async () => {
      render(
        <TOCProvider>
          <TOCHeading id="section1" level={2}>
            Section 1
          </TOCHeading>
          <TOCDropdown />
        </TOCProvider>
      );

      const dropdownButton = screen.getByRole('button');
      fireEvent.mouseEnter(dropdownButton);

      await waitFor(() => {
        // There should be two: the heading and the dropdown item
        expect(screen.getAllByText('Section 1')).toHaveLength(2);
      });
    });

    it('hides dropdown on mouse leave', async () => {
      render(
        <TOCProvider>
          <TOCHeading id="section1" level={2}>
            Section 1
          </TOCHeading>
          <TOCDropdown />
        </TOCProvider>
      );

      const dropdownContainer = screen.getByRole('button').parentElement!;
      fireEvent.mouseEnter(dropdownContainer);

      await waitFor(() => {
        expect(screen.getAllByText('Section 1')).toHaveLength(2); // heading + dropdown
      });

      fireEvent.mouseLeave(dropdownContainer);

      await waitFor(() => {
        expect(screen.getAllByText('Section 1')).toHaveLength(1); // just heading
      });
    });

    it('displays "Contents" when no active section', () => {
      render(
        <TOCProvider>
          <TOCDropdown />
        </TOCProvider>
      );
      expect(screen.getByText('Contents')).toBeInTheDocument();
    });
  });

  describe('useCurrentSection', () => {
    it('returns null when no active section', () => {
      let current: string | null = 'initial';

      const CurrentReader = () => {
        current = useCurrentSection();
        return null;
      };

      render(
        <TOCProvider>
          <CurrentReader />
        </TOCProvider>
      );

      expect(current).toBeNull();
    });
  });

  describe('useTOCContext', () => {
    it('throws when used outside TOCProvider', () => {
      const TestComponent = () => {
        useTOCContext();
        return null;
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        'useTOCContext must be used within a TOCProvider'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    it('handles multiple headings at same level', async () => {
      let items: { id: string; text: string; level: number }[] = [];

      const ItemsReader = () => {
        items = useTOCItems();
        return null;
      };

      render(
        <TOCProvider>
          <TOCHeading id="a" level={2}>A</TOCHeading>
          <TOCHeading id="b" level={2}>B</TOCHeading>
          <TOCHeading id="c" level={2}>C</TOCHeading>
          <ItemsReader />
        </TOCProvider>
      );

      await waitFor(() => {
        expect(items).toHaveLength(3);
      });
    });

    it('handles mixed heading levels', async () => {
      let items: { id: string; text: string; level: number }[] = [];

      const ItemsReader = () => {
        items = useTOCItems();
        return null;
      };

      render(
        <TOCProvider>
          <TOCHeading id="a" level={1}>Main</TOCHeading>
          <TOCHeading id="b" level={2}>Sub 1</TOCHeading>
          <TOCHeading id="c" level={3}>Sub Sub</TOCHeading>
          <TOCHeading id="d" level={2}>Sub 2</TOCHeading>
          <ItemsReader />
        </TOCProvider>
      );

      await waitFor(() => {
        expect(items).toHaveLength(4);
        expect(items.map(i => i.level)).toEqual([1, 2, 3, 2]);
      });
    });

    it('handles headings with duplicate IDs', async () => {
      let items: { id: string; text: string; level: number }[] = [];

      const ItemsReader = () => {
        items = useTOCItems();
        return null;
      };

      render(
        <TOCProvider>
          <TOCHeading id="same" level={2}>First</TOCHeading>
          <TOCHeading id="same" level={2}>Second</TOCHeading>
          <ItemsReader />
        </TOCProvider>
      );

      // Second registration should overwrite first
      await waitFor(() => {
        expect(items).toHaveLength(1);
        expect(items[0].text).toBe('Second');
      });
    });

    it('handles empty heading text', async () => {
      let items: { id: string; text: string; level: number }[] = [];

      const ItemsReader = () => {
        items = useTOCItems();
        return null;
      };

      render(
        <TOCProvider>
          <TOCHeading id="empty" level={2}>{''}</TOCHeading>
          <ItemsReader />
        </TOCProvider>
      );

      await waitFor(() => {
        expect(items).toHaveLength(1);
        expect(items[0].text).toBe('');
      });
    });

    it('handles non-string children in heading', async () => {
      let items: { id: string; text: string; level: number }[] = [];

      const ItemsReader = () => {
        items = useTOCItems();
        return null;
      };

      render(
        <TOCProvider>
          <TOCHeading id="complex" level={2}>
            <span>Complex</span> <strong>Content</strong>
          </TOCHeading>
          <ItemsReader />
        </TOCProvider>
      );

      // Non-string children result in empty text
      await waitFor(() => {
        expect(items).toHaveLength(1);
        expect(items[0].text).toBe('');
      });
    });
  });
});
