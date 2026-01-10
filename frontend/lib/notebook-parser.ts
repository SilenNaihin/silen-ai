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
  outputImage?: string; // Base64 encoded image from cell output
  executionCount?: number;
  inline?: boolean; // If true, render inline in article instead of side panel
  expanded?: boolean; // If true, start expanded instead of collapsed
  visualization?: boolean; // If true, show only output (no code), for graphs/plots
}

export interface NotebookData {
  cells: Record<string, NotebookCell>;
  notebookPath: string;
}

/**
 * Parse a Jupyter notebook JSON and extract cells with article directives
 *
 * Directive formats:
 * - # | targetId                  - Standard cell, shown in side panel
 * - # | targetId inline           - Shown inline in article body (collapsed)
 * - # | targetId inline expanded  - Shown inline, expanded by default
 * - # | targetId visualization    - Output only (graph/plot), no code shown
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

    // Look for directive: # | targetId [inline] [expanded] [visualization] (with optional trailing >)
    // Flags can appear in any order after targetId
    const directiveMatch = source.match(/^#\s*\|\s*([\w-]+)((?:\s+(?:inline|expanded|visualization))*)\s*>?\s*$/m);

    if (!directiveMatch) return;

    const [, targetId, flagsStr] = directiveMatch;
    const flags = flagsStr ? flagsStr.toLowerCase() : '';
    const isInline = flags.includes('inline');
    const isExpanded = flags.includes('expanded');
    const isVisualization = flags.includes('visualization');

    // Extract code without the directive line
    const codeLines = source.split('\n');
    const codeWithoutDirective = codeLines
      .filter((line: string) => !line.match(/^#\s*\|/))
      .join('\n')
      .trim();

    // Extract output (text and/or image)
    let output: string | undefined;
    let outputImage: string | undefined;
    if (cell.outputs && Array.isArray(cell.outputs) && cell.outputs.length > 0) {
      const extracted = extractOutput(cell.outputs);
      output = extracted.text;
      outputImage = extracted.image;
    }

    // Determine language
    const language = notebookJson.metadata?.language_info?.name || 'python';

    cells[targetId] = {
      targetId,
      code: codeWithoutDirective,
      language,
      output,
      outputImage,
      executionCount: cell.execution_count,
      inline: isInline,
      expanded: isExpanded,
      visualization: isVisualization,
    };
  });

  return { cells, notebookPath };
}

/**
 * Filter out matplotlib figure text representations
 * These look like: <Figure size 600x500 with 2 Axes>
 */
function filterMatplotlibArtifacts(text: string | undefined): string | undefined {
  if (!text) return text;

  // Filter out matplotlib figure representations
  // Matches patterns like: <Figure size 600x500 with 2 Axes>, <Figure size 640x480 with 1 Axes>, etc.
  const filtered = text
    .split('\n')
    .filter(line => !line.match(/^<Figure size \d+x\d+ with \d+ Axes?>$/))
    .join('\n')
    .trim();

  return filtered || undefined;
}

/**
 * Extract output from Jupyter notebook output format
 * Returns both text and image outputs if available
 */
function extractOutput(outputs: any[]): { text?: string; image?: string } {
  let text: string | undefined;
  let image: string | undefined;

  for (const output of outputs) {
    if (!output) continue;

    // Handle different output types
    if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
      // Check for image output (PNG or JPEG)
      if (output.data) {
        if (output.data['image/png']) {
          const imgData = output.data['image/png'];
          image = `data:image/png;base64,${Array.isArray(imgData) ? imgData.join('') : imgData}`;
        } else if (output.data['image/jpeg']) {
          const imgData = output.data['image/jpeg'];
          image = `data:image/jpeg;base64,${Array.isArray(imgData) ? imgData.join('') : imgData}`;
        }

        // Check for text/plain output
        if (output.data['text/plain'] && !text) {
          const textData = output.data['text/plain'];
          text = Array.isArray(textData) ? textData.join('').trim() : textData.trim();
        }
      }
    } else if (output.output_type === 'stream') {
      // Handle print statements
      const textData = output.text;
      const streamText = Array.isArray(textData) ? textData.join('').trim() : textData.trim();
      text = text ? text + '\n' + streamText : streamText;
    } else if (output.output_type === 'error') {
      // Handle errors
      const traceback = output.traceback;
      text = Array.isArray(traceback) ? traceback.join('\n') : traceback;
    }
  }

  // Filter out matplotlib artifacts from text output
  text = filterMatplotlibArtifacts(text);

  return { text, image };
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

