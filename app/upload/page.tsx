'use client';

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Navigation from '../components/Navigation';
import toast from 'react-hot-toast';
import { Upload, Loader2, FileText, CheckCircle2, XCircle, Clock, Search, Trash2, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const { documents, addDocuments, removeDocument, clearAllDocuments, selectedDocuments, toggleDocumentSelection, selectAllDocuments, deselectAllDocuments } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        addDocuments(data.documents);
        toast.success(`Successfully uploaded ${data.documents.length} document${data.documents.length > 1 ? 's' : ''}!`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteDocument = (name: string) => {
    if (deleteConfirm === name) {
      removeDocument(name);
      setDeleteConfirm(null);
      toast.success(`Deleted ${name}`);
    } else {
      setDeleteConfirm(name);
      setTimeout(() => setDeleteConfirm(null), 3000); // Auto-cancel after 3s
      toast(`Click again to confirm deletion of ${name}`, { icon: '⚠️' });
    }
  };

  const handleClearAll = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Delete all {documents.length} documents?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              clearAllDocuments();
              toast.dismiss(t.id);
              toast.success('All documents deleted');
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium"
          >
            Delete All
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream-100">
      <Navigation />

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-light text-cream-900 mb-2">
            Bring your documents in. We'll handle the rest.
          </h1>
          <p className="text-gray-600">
            Upload PDFs, Word files, and spreadsheets. We'll index them securely for fast, precise retrieval.
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`bg-cream-100 border-2 border-dashed rounded-2xl p-16 text-center mb-8 transition-colors ${
            dragActive
              ? 'border-cream-500 bg-cream-200'
              : 'border-cream-400 hover:border-cream-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div>
              <Loader2 className="mx-auto mb-4 text-cream-500 animate-spin" size={48} />
              <p className="text-lg text-cream-900 mb-2">Uploading and processing...</p>
              <p className="text-sm text-gray-600">This may take a moment</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-4 text-cream-500" size={48} />
              <p className="text-lg text-cream-900 mb-2">Drag & drop files here</p>
              <p className="text-sm text-gray-600 mb-1">or click to browse from your computer</p>
              <p className="text-xs text-cream-500 mb-6">
                Limit 200MB per file • PDF, DOCX, XLSX
              </p>

              <input
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-8 py-3 bg-cream-500 text-white rounded-lg font-medium cursor-pointer hover:bg-cream-600 transition-colors"
              >
                Browse files
              </label>
            </>
          )}
        </div>

        {/* Recently Processed Section */}
        <div className="bg-white rounded-xl p-6 border border-cream-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium text-cream-900">
                Documents ({documents.length})
              </h3>
              {documents.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedDocuments.length} selected
                </span>
              )}
            </div>
            {documents.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={selectedDocuments.length === documents.length ? deselectAllDocuments : selectAllDocuments}
                  className="px-3 py-2 text-cream-600 hover:bg-cream-100 rounded-lg transition-colors text-sm font-medium"
                >
                  {selectedDocuments.length === documents.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {documents.length > 0 && (
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-500 text-sm"
              />
            </div>
          )}

          {documents.length > 0 ? (
            filteredDocuments.length > 0 ? (
              <div className="space-y-3">
                {filteredDocuments
                  .slice()
                  .reverse()
                  .map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-cream-50 rounded-lg border border-cream-300 group hover:border-cream-400 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.name)}
                          onChange={() => toggleDocumentSelection(doc.name)}
                          className="w-4 h-4 text-cream-500 border-cream-300 rounded focus:ring-cream-500 cursor-pointer"
                        />
                        <FileText className="text-cream-500 flex-shrink-0" size={24} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-cream-900 truncate">
                            {doc.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-600">
                              {formatFileSize(doc.size)}
                            </span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-600">
                              {doc.pages} {doc.pages === 1 ? 'page' : 'pages'}
                            </span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <Clock size={12} />
                              {formatDate(doc.uploadedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Delete Button */}
                      <div className="flex items-center gap-3 ml-4">
                        {/* Status Indicator */}
                        {doc.status === 'completed' && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle2 size={14} />
                            Completed
                          </div>
                        )}
                        {doc.status === 'processing' && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            <Loader2 size={14} className="animate-spin" />
                            Processing
                          </div>
                        )}
                        {doc.status === 'failed' && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <XCircle size={14} />
                            Failed
                          </div>
                        )}
                        {!doc.status && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle2 size={14} />
                            Ready
                          </div>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteDocument(doc.name)}
                          className={`p-2 rounded-lg transition-all ${
                            deleteConfirm === doc.name
                              ? 'bg-red-500 text-white'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={deleteConfirm === doc.name ? 'Click again to confirm' : 'Delete document'}
                        >
                          {deleteConfirm === doc.name ? (
                            <AlertCircle size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="mx-auto mb-3 text-gray-400" size={40} />
                <p className="text-sm text-gray-600 mb-1">No documents match your search</p>
                <p className="text-xs text-gray-600">Try a different search term</p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto mb-3 text-gray-400" size={40} />
              <p className="text-sm text-gray-600 mb-1">No documents uploaded yet</p>
              <p className="text-xs text-gray-600">
                Upload your first document to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
