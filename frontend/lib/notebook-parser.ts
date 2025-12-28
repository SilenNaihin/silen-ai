/**
 * Jupyter Notebook Parser
 * 
 * Parses Jupyter notebooks and extracts cells with article directives
 * Directive format: # | targetId
 */

export interface NotebookCell {
  targetId: string;
  code: string;
  language: string;
  output?: string;
  executionCount?: number;
}

export interface NotebookData {
  cells: Record<string, NotebookCell>;
  notebookPath: string;
}

/**
 * Parse a Jupyter notebook JSON and extract cells with article directives
 */
export function parseNotebook(notebookJson: any, notebookPath: string): NotebookData {
  const cells: Record<string, NotebookCell> = {};

  if (!notebookJson.cells || !Array.isArray(notebookJson.cells)) {
    return { cells, notebookPath };
  }

  notebookJson.cells.forEach((cell: any, index: number) => {
    if (cell.cell_type !== 'code') return;

    // Get the cell source (can be string or array of strings)
    const source = Array.isArray(cell.source) 
      ? cell.source.join('') 
      : cell.source;

    // Look for directive: # | targetId (with optional trailing >)
    const directiveMatch = source.match(/^#\s*\|\s*([\w-]+)\s*>?\s*$/m);
    
    if (!directiveMatch) return;

    const [, targetId] = directiveMatch;

    // Extract code without the directive line
    const codeLines = source.split('\n');
    const codeWithoutDirective = codeLines
      .filter((line: string) => !line.match(/^#\s*\|/))
      .join('\n')
      .trim();

    // Extract output
    let output: string | undefined;
    if (cell.outputs && Array.isArray(cell.outputs) && cell.outputs.length > 0) {
      output = extractOutput(cell.outputs);
    }

    // Determine language
    const language = notebookJson.metadata?.language_info?.name || 'python';

    cells[targetId] = {
      targetId,
      code: codeWithoutDirective,
      language,
      output,
      executionCount: cell.execution_count,
    };
  });

  return { cells, notebookPath };
}

/**
 * Extract output from Jupyter notebook output format
 */
function extractOutput(outputs: any[]): string | undefined {
  const output = outputs[0];
  
  if (!output) return undefined;

  // Handle different output types
  if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
    // Check for text/plain output
    if (output.data && output.data['text/plain']) {
      const text = output.data['text/plain'];
      return Array.isArray(text) ? text.join('').trim() : text.trim();
    }
  } else if (output.output_type === 'stream') {
    // Handle print statements
    const text = output.text;
    return Array.isArray(text) ? text.join('').trim() : text.trim();
  } else if (output.output_type === 'error') {
    // Handle errors
    const traceback = output.traceback;
    return Array.isArray(traceback) ? traceback.join('\n') : traceback;
  }

  return undefined;
}

/**
 * Parse multiple notebooks and combine their cells
 */
export function parseNotebooks(notebooks: Array<{ json: any; path: string }>): NotebookData {
  const allCells: Record<string, NotebookCell> = {};
  
  notebooks.forEach(({ json, path }) => {
    const parsed = parseNotebook(json, path);
    Object.assign(allCells, parsed.cells);
  });

  return {
    cells: allCells,
    notebookPath: 'multiple',
  };
}

