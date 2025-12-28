import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseNotebook } from '@/lib/notebook-parser';

/**
 * API route to fetch parsed notebook cells
 * GET /api/notebooks?path=projects/rnn/networks.ipynb
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const notebookPath = searchParams.get('path');

  if (!notebookPath) {
    return NextResponse.json(
      { error: 'Missing notebook path parameter' },
      { status: 400 }
    );
  }

  try {
    // Read notebook file from project root
    const projectRoot = join(process.cwd(), '..');
    const fullPath = join(projectRoot, notebookPath);

    const notebookContent = readFileSync(fullPath, 'utf-8');
    const notebookJson = JSON.parse(notebookContent);

    // Parse notebook
    const parsed = parseNotebook(notebookJson, notebookPath);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error reading notebook:', error);
    let details = 'Unknown error';

    if (error instanceof Error) {
      details = error.message;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    ) {
      details = (error as { message: string }).message;
    }

    return NextResponse.json(
      { error: 'Failed to read notebook', details },
      { status: 500 }
    );
  }
}
