'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import Navigation from '../components/Navigation';
import PDFModal from '../components/PDFModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, FileText, Clock, ArrowRight, Download, Command } from 'lucide-react';
import Link from 'next/link';

export default function WorkspacePage() {
  const { documents, messages, addMessage, incrementQuestions, selectedDocuments } = useAppContext();
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfModal, setPdfModal] = useState<{ filename: string; page: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || selectedDocuments.length === 0 || isProcessing) return;

    // Add user message
    addMessage({ role: 'user', content: inputMessage });
    setInputMessage('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage,
          documents: selectedDocuments,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage({
          role: 'assistant',
          content: data.response,
        });
        incrementQuestions();
      } else {
        throw new Error('Query failed');
      }
    } catch (error) {
      console.error('Query error:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Intercept citation link clicks to open PDF modal
  useEffect(() => {
    const handleCitationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('citation-link')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href) {
          // Extract filename and page from href like "/view/document.pdf#page=2"
          const match = href.match(/\/view\/([^#]+)#page=(\d+)/);
          if (match) {
            const filename = decodeURIComponent(match[1]);
            const page = parseInt(match[2], 10);
            setPdfModal({ filename, page });
          }
        }
      }
    };

    document.addEventListener('click', handleCitationClick);
    return () => document.removeEventListener('click', handleCitationClick);
  }, []);

  // Export conversation as markdown
  const exportConversation = () => {
    const markdown = messages
      .map(msg => {
        const role = msg.role === 'user' ? '**You**' : '**Assistant**';
        const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : '';
        return `${role} (${timestamp}):\n${msg.content}\n`;
      })
      .join('\n---\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K - Focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        input?.focus();
      }
      // Cmd/Ctrl + E - Export conversation
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        if (messages.length > 1) exportConversation();
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [messages]);

  const userQuestions = messages.filter(m => m.role === 'user');
  const recentQuestions = userQuestions.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-cream-100">
      <Navigation />

      <div className="flex h-[calc(100vh-73px)]">
        {/* MAIN AREA - Chat Interface */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Header with Input at Top */}
          <div className="border-b border-cream-300 px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-medium text-cream-900">Document Q&A</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedDocuments.length > 0
                    ? `Querying ${selectedDocuments.length} of ${documents.length} document${documents.length > 1 ? 's' : ''}`
                    : documents.length > 0
                    ? 'Select documents from the Upload page to start'
                    : 'Upload documents to start asking questions'}
                </p>
              </div>
              {messages.length > 1 && (
                <button
                  onClick={exportConversation}
                  className="flex items-center gap-2 px-4 py-2 text-cream-600 hover:bg-cream-100 rounded-lg transition-colors text-sm font-medium"
                  title="Export conversation (Cmd/Ctrl + E)"
                >
                  <Download size={18} />
                  Export
                </button>
              )}
            </div>

            {/* Input Area at Top */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
                placeholder="Ask a question about your documents..."
                className="flex-1 px-5 py-4 bg-white border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-500 text-cream-900 text-sm placeholder:text-gray-600"
                disabled={isProcessing || selectedDocuments.length === 0}
              />
              <button
                onClick={handleSendMessage}
                disabled={isProcessing || !inputMessage.trim() || selectedDocuments.length === 0}
                className="px-8 py-4 bg-cream-500 text-white rounded-lg hover:bg-cream-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Send'}
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Command size={12} />
                <span>K</span>
                <span className="ml-1">Focus</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Command size={12} />
                <span>E</span>
                <span className="ml-1">Export</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>Enter</span>
                <span className="ml-1">Send</span>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    msg.role === 'user'
                      ? 'bg-cream-500 text-white rounded-tr-sm'
                      : 'bg-cream-200 text-cream-900 border border-cream-300 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="text-sm leading-relaxed citation-content prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              className="citation-link"
                              onClick={(e) => {
                                e.preventDefault();
                                if (href?.startsWith('/view/')) {
                                  const match = href.match(/\/view\/([^#]+)#page=(\d+)/);
                                  if (match) {
                                    setPdfModal({
                                      filename: decodeURIComponent(match[1]),
                                      page: parseInt(match[2], 10)
                                    });
                                  }
                                }
                              }}
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  {msg.timestamp && (
                    <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-cream-100' : 'text-gray-600'}`}>
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-cream-200 text-cream-900 border border-cream-300 rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-3">
                  <Loader2 className="animate-spin text-cream-500" size={18} />
                  <span className="text-sm">Analyzing documents...</span>
                </div>
              </div>
            )}

            {documents.length === 0 && messages.length === 1 && (
              <div className="text-center py-16">
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-medium text-cream-900 mb-2">No documents uploaded yet</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Upload PDF documents to start asking questions and get AI-powered insights
                </p>
                <Link
                  href="/upload"
                  className="inline-block px-6 py-3 bg-cream-500 text-white rounded-lg text-sm font-medium hover:bg-cream-600 transition-colors"
                >
                  Upload Documents
                </Link>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* RIGHT SIDEBAR - Question History */}
        <div className="w-80 bg-cream-50 border-l border-cream-300 flex flex-col">
          <div className="p-6 border-b border-cream-300">
            <h3 className="text-sm font-semibold text-cream-900 uppercase tracking-wide">Recent Questions</h3>
            <p className="text-xs text-gray-600 mt-1">Click to reuse</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {recentQuestions.length > 0 ? (
              <div className="space-y-2">
                {recentQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputMessage(q.content)}
                    className="w-full text-left p-3 bg-white rounded-lg border border-cream-300 hover:border-cream-500 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="text-cream-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-cream-900 line-clamp-2 leading-relaxed">{q.content}</p>
                    </div>
                    {q.timestamp && (
                      <p className="text-[10px] text-gray-500 mt-2 ml-5">
                        {formatTimestamp(q.timestamp)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-xs text-gray-600">No questions yet</p>
                <p className="text-[10px] text-gray-500 mt-1">Your recent questions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {pdfModal && (
        <PDFModal
          isOpen={true}
          onClose={() => setPdfModal(null)}
          filename={pdfModal.filename}
          pageNumber={pdfModal.page}
        />
      )}
    </div>
  );
}
