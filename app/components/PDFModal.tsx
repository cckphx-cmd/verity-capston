'use client';

import { useEffect } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  pageNumber?: number;
}

export default function PDFModal({ isOpen, onClose, filename, pageNumber = 1 }: PDFModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const pdfUrl = `/api/pdf/${encodeURIComponent(filename)}#page=${pageNumber}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 bottom-0 w-[70vw] bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300 bg-cream-50">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-cream-900 truncate">
              {decodeURIComponent(filename)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Page {pageNumber}</p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <a
              href={`/api/pdf/${encodeURIComponent(filename)}`}
              download={filename}
              className="p-2 text-cream-600 hover:bg-cream-200 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download size={20} />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-cream-600 hover:bg-cream-200 rounded-lg transition-colors"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title={`PDF Viewer - ${filename}`}
          />
        </div>
      </div>
    </>
  );
}
