import { NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';

// Curated demo documents - handpicked for the best demo experience
const DEMO_DOCUMENTS = [
  'Quarterly_Business_Report_Q4_2024.pdf',
  'ApexCorp-contract-2025-11-15-9.pdf',
  'BlueSky Holdings-contract-2025-11-15-3.pdf',
  'Brightstone LLC-contract-2025-11-15-6.pdf',
  'NovaTech-contract-2025-11-15-15.pdf',
  'Pioneer Labs-contract-2025-11-15-14.pdf',
  'SummitWorks-contract-2025-11-15-1.pdf',
  'ApexCorp-legal-2025-11-15-3.pdf',
  'BlueSky Holdings-legal-2025-11-15-1.pdf',
  'Brightstone LLC-legal-2025-11-15-11.pdf',
  'Everline Inc-legal-2025-11-15-9.pdf',
  'NovaTech-legal-2025-11-15-2.pdf',
];

// Cache for faster subsequent loads
let cachedDocuments: any[] | null = null;

export async function GET() {
  console.log('[DEMO API] Demo documents endpoint called');

  try {
    // Return cached documents if available
    if (cachedDocuments) {
      console.log('[DEMO API] Returning cached documents:', cachedDocuments.length);
      return NextResponse.json({
        success: true,
        documents: cachedDocuments,
        isDemo: true
      });
    }

    const uploadsDir = join(process.cwd(), 'uploads');
    console.log('[DEMO API] Checking uploads directory:', uploadsDir);

    if (!existsSync(uploadsDir)) {
      console.log('[DEMO API] Uploads directory does not exist');
      return NextResponse.json({
        success: true,
        documents: [],
        isDemo: true
      });
    }

    // Get all files in uploads directory
    const allFiles = readdirSync(uploadsDir);
    console.log('[DEMO API] Found files in uploads:', allFiles.length);

    // Find matching demo documents (they have timestamp prefixes)
    const demoDocuments = DEMO_DOCUMENTS.map(docName => {
      // Find file that ends with the docName (has timestamp prefix)
      const matchingFile = allFiles.find(file => file.endsWith(docName));

      if (!matchingFile) {
        console.warn(`[DEMO API] Demo document not found: ${docName}`);
        return null;
      }

      const filePath = join(uploadsDir, matchingFile);
      const stats = statSync(filePath);

      return {
        name: docName,
        size: stats.size,
        pages: 0, // Will be populated if needed
        uploadedAt: new Date('2025-11-15').toISOString(),
        storedAs: matchingFile
      };
    }).filter(doc => doc !== null);

    console.log('[DEMO API] Loaded demo documents:', demoDocuments.length);

    // Cache for future requests
    cachedDocuments = demoDocuments;

    return NextResponse.json({
      success: true,
      documents: demoDocuments,
      isDemo: true
    });

  } catch (error) {
    console.error('[DEMO API] Error fetching demo documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo documents' },
      { status: 500 }
    );
  }
}
