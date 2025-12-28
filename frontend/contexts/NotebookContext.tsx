'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { NotebookCell, NotebookData } from '@/lib/notebook-parser';

interface NotebookContextType {
  cells: Record<string, NotebookCell>;
  loading: boolean;
  error: string | null;
  loadNotebook: (path: string) => void;
  currentNotebookPath: string | null;
}

const NotebookContext = createContext<NotebookContextType | null>(null);

interface GlobalNotebookProviderProps {
  children: ReactNode;
}

/**
 * Global notebook provider that loads notebooks on-demand
 * Place in root layout - articles declare which notebook they need
 */
export function GlobalNotebookProvider({ children }: GlobalNotebookProviderProps) {
  const [notebooks, setNotebooks] = useState<Record<string, NotebookData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentNotebookPath, setCurrentNotebookPath] = useState<string | null>(null);

  const loadNotebook = async (path: string) => {
    // If already loaded, just set as current
    if (notebooks[path]) {
      setCurrentNotebookPath(path);
      return;
    }

    // Load the notebook
    try {
      setLoading(true);
      setError(null);
      setCurrentNotebookPath(path);

      const response = await fetch(`/api/notebooks?path=${encodeURIComponent(path)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch notebook');
      }

      const data: NotebookData = await response.json();
      
      setNotebooks(prev => ({
        ...prev,
        [path]: data,
      }));
    } catch (err: any) {
      console.error('Error fetching notebook:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get current notebook cells
  const cells = currentNotebookPath && notebooks[currentNotebookPath]
    ? notebooks[currentNotebookPath].cells
    : {};

  return (
    <NotebookContext.Provider 
      value={{ 
        cells, 
        loading, 
        error, 
        loadNotebook,
        currentNotebookPath,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
}

/**
 * Hook to access notebook context
 */
export function useNotebookContext() {
  const context = useContext(NotebookContext);
  if (!context) {
    // Return empty state if no provider
    return { 
      cells: {}, 
      loading: false, 
      error: null, 
      loadNotebook: () => {},
      currentNotebookPath: null,
    };
  }
  return context;
}

/**
 * Component to declare which notebook an article uses
 * Place at the top of your article component
 */
export function UseNotebook({ path }: { path: string }) {
  const { loadNotebook, currentNotebookPath } = useNotebookContext();

  useEffect(() => {
    if (currentNotebookPath !== path) {
      loadNotebook(path);
    }
  }, [path, loadNotebook, currentNotebookPath]);

  return null;
}

// Legacy component for backwards compatibility
export function NotebookProvider({ notebookPath, children }: { notebookPath: string; children: ReactNode }) {
  return (
    <>
      <UseNotebook path={notebookPath} />
      {children}
    </>
  );
}
