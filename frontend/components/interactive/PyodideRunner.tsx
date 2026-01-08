'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from 'react';
import { FiPlay, FiRefreshCw, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Pyodide types (loaded from CDN)
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  globals: {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
  };
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideContextValue {
  pyodide: PyodideInterface | null;
  loading: boolean;
  error: string | null;
  ready: boolean;
  loadPyodide: () => Promise<void>;
}

const PyodideContext = createContext<PyodideContextValue>({
  pyodide: null,
  loading: false,
  error: null,
  ready: false,
  loadPyodide: async () => {},
});

export function usePyodide() {
  return useContext(PyodideContext);
}

interface PyodideProviderProps {
  children: ReactNode;
  /** Auto-load Pyodide on mount. Set to false to defer loading. */
  autoLoad?: boolean;
  /** Packages to pre-load (e.g., ['numpy', 'matplotlib']) */
  packages?: string[];
}

/**
 * Provider that loads Pyodide and makes it available to child components.
 * Only loads when first interactive cell is rendered.
 */
export function PyodideProvider({
  children,
  autoLoad = false,
  packages = [],
}: PyodideProviderProps) {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const loadPyodide = useCallback(async () => {
    if (loadingRef.current || pyodide) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Load Pyodide script if not already loaded
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide script'));
          document.head.appendChild(script);
        });
      }

      // Initialize Pyodide
      const py = await window.loadPyodide!({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });

      // Load requested packages
      if (packages.length > 0) {
        await py.loadPackage(packages);
      }

      setPyodide(py);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Pyodide');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [packages, pyodide]);

  useEffect(() => {
    if (autoLoad) {
      loadPyodide();
    }
  }, [autoLoad, loadPyodide]);

  return (
    <PyodideContext.Provider
      value={{
        pyodide,
        loading,
        error,
        ready: !!pyodide,
        loadPyodide,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
}

interface InteractiveCodeProps {
  /** Initial code to display */
  code: string;
  /** Label for the run button */
  runLabel?: string;
  /** Packages needed for this cell */
  packages?: string[];
  /** Callback when code runs successfully */
  onResult?: (result: string) => void;
  className?: string;
}

/**
 * Interactive code cell that can run Python in the browser.
 * Uses Pyodide for in-browser Python execution.
 */
export function InteractiveCode({
  code: initialCode,
  runLabel = 'Run',
  packages = [],
  onResult,
  className = '',
}: InteractiveCodeProps) {
  const { pyodide, loading: pyodideLoading, ready, loadPyodide } = usePyodide();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load packages when needed
  useEffect(() => {
    const loadPackages = async () => {
      if (pyodide && packages.length > 0 && !initialized) {
        try {
          await pyodide.loadPackage(packages);
          setInitialized(true);
        } catch (err) {
          setError(`Failed to load packages: ${packages.join(', ')}`);
        }
      } else if (pyodide && packages.length === 0) {
        setInitialized(true);
      }
    };
    loadPackages();
  }, [pyodide, packages, initialized]);

  const runCode = async () => {
    if (running) return;

    // If pyodide isn't loaded yet, trigger load
    if (!pyodide) {
      setOutput('Loading Python environment...');
      await loadPyodide();
      return; // Will need to click run again after load completes
    }

    setRunning(true);
    setError(null);
    setOutput(null);

    try {
      // Capture stdout
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);

      // Run user code
      const result = await pyodide.runPythonAsync(code);

      // Get stdout
      const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()');
      const outputStr = stdout ? String(stdout) : '';

      // Format result
      let finalOutput = outputStr;
      if (result !== undefined && result !== null) {
        const resultStr = String(result);
        if (resultStr !== 'None' && resultStr !== outputStr.trim()) {
          finalOutput = outputStr + (outputStr ? '\n' : '') + resultStr;
        }
      }

      setOutput(finalOutput || 'Code executed successfully (no output)');
      onResult?.(finalOutput);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(errMsg);
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput(null);
    setError(null);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [code]);

  return (
    <div className={`border border-neutral-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-medium">Try it yourself</span>
          {pyodideLoading && (
            <span className="text-xs text-neutral-400">
              (Loading Python...)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetCode}
            className="p-1.5 text-neutral-500 hover:text-neutral-700 transition-colors"
            title="Reset code"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={runCode}
            disabled={running || pyodideLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-black hover:bg-neutral-800 disabled:bg-neutral-300 rounded transition-colors"
          >
            {running || pyodideLoading ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiPlay className="w-4 h-4" />
            )}
            {pyodideLoading ? 'Loading...' : !ready ? 'Load & Run' : runLabel}
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-4 font-mono text-sm leading-relaxed bg-white resize-none focus:outline-none"
          spellCheck={false}
          rows={code.split('\n').length}
        />
      </div>

      {/* Output */}
      {(output || error) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-neutral-200"
        >
          <div className={`px-4 py-3 ${error ? 'bg-red-50' : 'bg-neutral-50'}`}>
            <div className={`text-xs mb-1 ${error ? 'text-red-500' : 'text-neutral-500'}`}>
              {error ? 'Error:' : 'Output:'}
            </div>
            <pre className={`font-mono text-sm whitespace-pre-wrap ${error ? 'text-red-600' : 'text-neutral-900'}`}>
              {error || output}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
