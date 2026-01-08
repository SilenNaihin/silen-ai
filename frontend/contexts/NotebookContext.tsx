'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { NotebookCell, NotebookData } from '@/lib/notebook-parser';

interface NotebookContextType {
  cells: Record<string, NotebookCell>;
  loading: boolean;
  error: string | null;
  loadNotebook: (path: string, forceReload?: boolean) => void;
  currentNotebookPath: string | null;
  githubUrl: string | null;
  setGithubUrl: (url: string | null) => void;
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
  const [githubUrl, setGithubUrl] = useState<string | null>(null);

  const loadNotebook = async (path: string, forceReload: boolean = false) => {
    // If already loaded and not forcing reload, just set as current
    if (notebooks[path] && !forceReload) {
      setCurrentNotebookPath(path);
      return;
    }

    // Load the notebook
    try {
      setLoading(true);
      setError(null);
      setCurrentNotebookPath(path);

      // Add cache buster for development
      const cacheBuster = process.env.NODE_ENV === 'development' ? `&_t=${Date.now()}` : '';
      const response = await fetch(`/api/notebooks?path=${encodeURIComponent(path)}${cacheBuster}`);
      
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
        githubUrl,
        setGithubUrl,
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
      githubUrl: null,
      setGithubUrl: () => {},
    };
  }
  return context;
}

interface UseNotebookProps {
  path: string;
  /** GitHub URL to link to for all code cells */
  githubUrl?: string;
}

/**
 * Component to declare which notebook an article uses
 * Place at the top of your article component
 */
export function UseNotebook({ path, githubUrl }: UseNotebookProps) {
  const { loadNotebook, setGithubUrl } = useNotebookContext();

  useEffect(() => {
    // Load on mount and when path changes
    // In development, force reload to pick up notebook changes
    const forceReload = process.env.NODE_ENV === 'development';
    loadNotebook(path, forceReload);
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (githubUrl) {
      setGithubUrl(githubUrl);
    }
    return () => setGithubUrl(null);
  }, [githubUrl, setGithubUrl]);

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
