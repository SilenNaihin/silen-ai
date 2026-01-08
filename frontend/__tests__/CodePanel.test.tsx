import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodePanel } from '@/components/article/CodePanel';

// Mock clipboard API
const mockClipboard = {
  writeText: jest.fn(() => Promise.resolve()),
};
Object.assign(navigator, { clipboard: mockClipboard });

describe('CodePanel', () => {
  beforeEach(() => {
    mockClipboard.writeText.mockClear();
  });

  describe('Basic rendering', () => {
    it('renders code content', () => {
      render(<CodePanel code="print('hello')" />);
      expect(screen.getByText(/print/)).toBeInTheDocument();
    });

    it('renders output when provided', () => {
      render(<CodePanel code="print('hello')" output="hello" />);
      expect(screen.getByText('Output:')).toBeInTheDocument();
      expect(screen.getByText('hello')).toBeInTheDocument();
    });

    it('does not render output section when no output', () => {
      render(<CodePanel code="x = 1" />);
      expect(screen.queryByText('Output:')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <CodePanel code="test" className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Syntax highlighting', () => {
    it('highlights Python keywords', () => {
      render(<CodePanel code="def foo(): return True" language="python" />);
      // Keywords should be highlighted (we can check they're in the DOM)
      expect(screen.getByText('def')).toBeInTheDocument();
      expect(screen.getByText('return')).toBeInTheDocument();
      expect(screen.getByText('True')).toBeInTheDocument();
    });

    it('handles non-Python code gracefully', () => {
      render(<CodePanel code="console.log('hi')" language="javascript" />);
      expect(screen.getByText(/console.log/)).toBeInTheDocument();
    });
  });

  describe('Copy functionality', () => {
    it('copies code to clipboard when copy button clicked', async () => {
      render(<CodePanel code="test code" />);
      const copyButton = screen.getByTitle('Copy code');

      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('test code');
      });
    });

    it('handles clipboard error gracefully', async () => {
      mockClipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<CodePanel code="test" />);
      const copyButton = screen.getByTitle('Copy code');

      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('GitHub link', () => {
    it('renders GitHub button when URL provided', () => {
      render(<CodePanel code="test" githubUrl="https://github.com/test" />);
      expect(screen.getByTitle('View on GitHub')).toBeInTheDocument();
    });

    it('does not render GitHub button when no URL', () => {
      render(<CodePanel code="test" />);
      expect(screen.queryByTitle('View on GitHub')).not.toBeInTheDocument();
    });

    it('opens GitHub URL in new tab', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      render(<CodePanel code="test" githubUrl="https://github.com/test" />);

      fireEvent.click(screen.getByTitle('View on GitHub'));

      expect(windowSpy).toHaveBeenCalledWith('https://github.com/test', '_blank');
      windowSpy.mockRestore();
    });
  });

  describe('Collapsible functionality', () => {
    it('renders collapsed state when collapsible and defaultCollapsed', () => {
      render(
        <CodePanel
          code="test code"
          collapsible={true}
          defaultCollapsed={true}
        />
      );
      expect(screen.getByText('View Code')).toBeInTheDocument();
      expect(screen.queryByText('test code')).not.toBeInTheDocument();
    });

    it('renders expanded by default even when collapsible', () => {
      render(<CodePanel code="test code" collapsible={true} />);
      expect(screen.getByText(/test code/)).toBeInTheDocument();
    });

    it('expands when collapsed button clicked', () => {
      render(
        <CodePanel
          code="test code"
          collapsible={true}
          defaultCollapsed={true}
        />
      );

      expect(screen.queryByText(/test code/)).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('View Code'));

      expect(screen.getByText(/test code/)).toBeInTheDocument();
    });

    it('collapses when collapse button clicked', () => {
      render(<CodePanel code="test code" collapsible={true} />);

      expect(screen.getByText(/test code/)).toBeInTheDocument();

      fireEvent.click(screen.getByTitle('Collapse'));

      expect(screen.queryByText(/test code/)).not.toBeInTheDocument();
      expect(screen.getByText('View Code')).toBeInTheDocument();
    });

    it('uses custom collapsedLabel', () => {
      render(
        <CodePanel
          code="test"
          collapsible={true}
          defaultCollapsed={true}
          collapsedLabel="Show Python"
        />
      );
      expect(screen.getByText('Show Python')).toBeInTheDocument();
    });

    it('does not show collapse button when not collapsible', () => {
      render(<CodePanel code="test" />);
      expect(screen.queryByTitle('Collapse')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles empty code string', () => {
      render(<CodePanel code="" />);
      // Should not crash
      expect(screen.getByTitle('Copy code')).toBeInTheDocument();
    });

    it('handles very long code', () => {
      const longCode = 'x = 1\n'.repeat(1000);
      const { container } = render(<CodePanel code={longCode} />);
      // With syntax highlighting, the text is split, so check the pre element
      expect(container.querySelector('pre')).toBeInTheDocument();
    });

    it('handles code with special characters', () => {
      render(<CodePanel code="<script>alert('xss')</script>" />);
      expect(screen.getByText(/<script>/)).toBeInTheDocument();
    });

    it('handles multiline output', () => {
      render(<CodePanel code="test" output="line1\nline2\nline3" />);
      expect(screen.getByText(/line1/)).toBeInTheDocument();
    });

    it('handles code with unicode', () => {
      render(<CodePanel code="print('Hello 世界 🌍')" />);
      expect(screen.getByText(/Hello 世界 🌍/)).toBeInTheDocument();
    });
  });
});
