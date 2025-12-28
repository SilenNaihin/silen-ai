'use client';

import { useState, useEffect } from 'react';
import { NotebookData, NotebookCell } from '@/lib/notebook-parser';

/**
 * Hook to fetch and cache notebook cells
 * 
 * @param notebookPath - Path to the notebook relative to project root (e.g., "projects/rnn/networks.ipynb")
 * @returns Object containing cells mapped by targetId, loading state, and error
 */
export function useNotebookCells(notebookPath: string) {
  const [cells, setCells] = useState<Record<string, NotebookCell>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotebook() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/notebooks?path=${encodeURIComponent(notebookPath)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch notebook');
        }

        const data: NotebookData = await response.json();
        setCells(data.cells);
      } catch (err: any) {
        console.error('Error fetching notebook:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotebook();
  }, [notebookPath]);

  return { cells, loading, error };
}

/**
 * Hook to fetch a single cell by targetId
 * 
 * @param notebookPath - Path to the notebook
 * @param targetId - The target ID to look up
 * @returns The cell data, loading state, and error
 */
export function useNotebookCell(notebookPath: string, targetId: string) {
  const { cells, loading, error } = useNotebookCells(notebookPath);
  
  return {
    cell: cells[targetId],
    loading,
    error,
  };
}

