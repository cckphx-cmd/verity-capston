import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const requestedFilename = decodeURIComponent(params.filename);

    // Security: Only allow PDF files
    if (!requestedFilename.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Security: Prevent directory traversal
    if (requestedFilename.includes('..') || requestedFilename.includes('/') || requestedFilename.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), 'uploads');

    // Find the file - it might have a timestamp prefix
    const files = await readdir(uploadsDir);
    const matchingFile = files.find(file => {
      // Match files that end with the requested filename
      // e.g., "1763325252522-Software_License_Agreement.pdf" matches "Software_License_Agreement.pdf"
      return file.endsWith(requestedFilename) && file.endsWith('.pdf');
    });

    if (!matchingFile) {
      console.error(`PDF not found: ${requestedFilename}`);
      console.error(`Available files:`, files.filter(f => f.endsWith('.pdf')));
      return NextResponse.json(
        { error: 'PDF file not found' },
        { status: 404 }
      );
    }

    const filepath = join(uploadsDir, matchingFile);

    // Read the PDF file
    const pdfBuffer = await readFile(filepath);

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${requestedFilename}"`,
      },
    });

  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'Failed to load PDF' },
      { status: 500 }
    );
  }
}
