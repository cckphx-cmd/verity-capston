'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function PDFViewerPage() {
  const params = useParams();
  const router = useRouter();
  const filename = params.filename as string;
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    // Get page number from URL hash (e.g., #page=5)
    const hash = window.location.hash;
    if (hash.startsWith('#page=')) {
      const page = parseInt(hash.replace('#page=', ''), 10);
      if (!isNaN(page) && page > 0) {
        setPageNumber(page);
      }
    }
  }, []);

  const pdfUrl = `/api/pdf/${encodeURIComponent(filename)}#page=${pageNumber}`;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-cream-300 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-cream-600 hover:text-cream-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="h-6 w-px bg-cream-300" />
          <h1 className="text-lg font-medium text-cream-900">{decodeURIComponent(filename)}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Page {pageNumber}</span>
          <a
            href={`/api/pdf/${encodeURIComponent(filename)}`}
            download={filename}
            className="flex items-center gap-2 px-4 py-2 bg-cream-500 text-white rounded-lg hover:bg-cream-600 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 p-6">
        <div className="h-full bg-white rounded-xl border border-cream-300 overflow-hidden shadow-sm">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title={`PDF Viewer - ${filename}`}
            style={{ minHeight: 'calc(100vh - 160px)' }}
          />
        </div>
      </div>
    </div>
  );
}
