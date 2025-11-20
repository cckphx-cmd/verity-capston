import { NextResponse } from 'next/server';

// Curated demo documents with hardcoded filenames for production deployment
const DEMO_DOCUMENTS = [
  {
    name: 'Quarterly_Business_Report_Q4_2024.pdf',
    size: 245678,
    pages: 24,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763339625221-Quarterly_Business_Report_Q4_2024.pdf'
  },
  {
    name: 'ApexCorp-contract-2025-11-15-9.pdf',
    size: 187234,
    pages: 18,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763325283146-ApexCorp-contract-2025-11-15-9.pdf'
  },
  {
    name: 'BlueSky Holdings-contract-2025-11-15-3.pdf',
    size: 192456,
    pages: 16,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763325283154-BlueSky Holdings-contract-2025-11-15-3.pdf'
  },
  {
    name: 'Brightstone LLC-contract-2025-11-15-6.pdf',
    size: 178923,
    pages: 15,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763325283162-Brightstone LLC-contract-2025-11-15-6.pdf'
  },
  {
    name: 'NovaTech-contract-2025-11-15-15.pdf',
    size: 203456,
    pages: 20,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763325283165-NovaTech-contract-2025-11-15-15.pdf'
  },
  {
    name: 'Pioneer Labs-contract-2025-11-15-14.pdf',
    size: 195234,
    pages: 17,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763325283183-Pioneer Labs-contract-2025-11-15-14.pdf'
  },
  {
    name: 'SummitWorks-contract-2025-11-15-1.pdf',
    size: 184567,
    pages: 16,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763325283188-SummitWorks-contract-2025-11-15-1.pdf'
  },
  {
    name: 'ApexCorp-legal-2025-11-15-3.pdf',
    size: 156789,
    pages: 12,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763336487731-ApexCorp-legal-2025-11-15-3.pdf'
  },
  {
    name: 'BlueSky Holdings-legal-2025-11-15-1.pdf',
    size: 167234,
    pages: 14,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763336490387-BlueSky Holdings-legal-2025-11-15-1.pdf'
  },
  {
    name: 'Brightstone LLC-legal-2025-11-15-11.pdf',
    size: 159876,
    pages: 13,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763336492227-Brightstone LLC-legal-2025-11-15-11.pdf'
  },
  {
    name: 'Everline Inc-legal-2025-11-15-9.pdf',
    size: 162345,
    pages: 12,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763336493556-Everline Inc-legal-2025-11-15-9.pdf'
  },
  {
    name: 'NovaTech-legal-2025-11-15-2.pdf',
    size: 171234,
    pages: 15,
    uploadedAt: new Date('2025-11-15').toISOString(),
    storedAs: '1763336494821-NovaTech-legal-2025-11-15-2.pdf'
  },
];

export async function GET() {
  console.log('[DEMO API] Demo documents endpoint called - returning hardcoded demo data');

  return NextResponse.json({
    success: true,
    documents: DEMO_DOCUMENTS,
    isDemo: true
  });
}
