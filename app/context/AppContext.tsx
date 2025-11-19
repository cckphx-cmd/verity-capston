'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface DocumentInfo {
  name: string;
  size: number;
  pages: number;
  uploadedAt: string;
  status?: 'processing' | 'completed' | 'failed';
}

interface Stats {
  totalDocs: number;
  totalPages: number;
  totalQuestions: number;
  accuracy: number;
}

interface AppContextType {
  documents: DocumentInfo[];
  messages: Message[];
  stats: Stats;
  selectedDocuments: string[];
  addDocument: (doc: DocumentInfo) => void;
  addDocuments: (docs: DocumentInfo[]) => void;
  addMessage: (msg: Message) => void;
  incrementQuestions: () => void;
  setDocuments: (docs: DocumentInfo[]) => void;
  setMessages: (msgs: Message[]) => void;
  removeDocument: (name: string) => void;
  clearAllDocuments: () => void;
  toggleDocumentSelection: (name: string) => void;
  selectAllDocuments: () => void;
  deselectAllDocuments: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper functions for localStorage
const getStoredData = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStoredData = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [documents, setDocumentsState] = useState<DocumentInfo[]>([]);
  const [messages, setMessagesState] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! Upload some documents and I can help you analyze them. What would you like to know?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [stats, setStats] = useState<Stats>({
    totalDocs: 0,
    totalPages: 0,
    totalQuestions: 0,
    accuracy: 94,
  });
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedDocs = getStoredData<DocumentInfo[]>('rag-documents', []);
    const storedMessages = getStoredData<Message[]>('rag-messages', [
      {
        role: 'assistant',
        content: 'Hello! Upload some documents and I can help you analyze them. What would you like to know?',
        timestamp: new Date().toISOString(),
      }
    ]);
    const storedStats = getStoredData<Stats>('rag-stats', {
      totalDocs: 0,
      totalPages: 0,
      totalQuestions: 0,
      accuracy: 94,
    });
    const storedSelected = getStoredData<string[]>('rag-selected', []);

    setDocumentsState(storedDocs);
    setMessagesState(storedMessages);
    setStats(storedStats);

    // Auto-select all documents if none selected but documents exist
    setSelectedDocuments(storedDocs.length > 0 && storedSelected.length === 0
      ? storedDocs.map(d => d.name)
      : storedSelected
    );
    setIsHydrated(true);
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      setStoredData('rag-documents', documents);
    }
  }, [documents, isHydrated]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      setStoredData('rag-messages', messages);
    }
  }, [messages, isHydrated]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      setStoredData('rag-stats', stats);
    }
  }, [stats, isHydrated]);

  // Save selected documents to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      setStoredData('rag-selected', selectedDocuments);
    }
  }, [selectedDocuments, isHydrated]);

  const addDocument = (doc: DocumentInfo) => {
    setDocumentsState(prev => [...prev, doc]);
    setStats(prev => ({
      ...prev,
      totalDocs: prev.totalDocs + 1,
      totalPages: prev.totalPages + doc.pages,
    }));
    // Auto-select new document
    setSelectedDocuments(prev => [...prev, doc.name]);
  };

  const addDocuments = (docs: DocumentInfo[]) => {
    setDocumentsState(prev => [...prev, ...docs]);
    setStats(prev => ({
      ...prev,
      totalDocs: prev.totalDocs + docs.length,
      totalPages: prev.totalPages + docs.reduce((sum, doc) => sum + doc.pages, 0),
    }));
    // Auto-select new documents
    setSelectedDocuments(prev => [...prev, ...docs.map(d => d.name)]);
  };

  const addMessage = (msg: Message) => {
    setMessagesState(prev => [...prev, { ...msg, timestamp: new Date().toISOString() }]);
  };

  const incrementQuestions = () => {
    setStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
    }));
  };

  const setDocuments = (docs: DocumentInfo[]) => {
    setDocumentsState(docs);
    setStats(prev => ({
      ...prev,
      totalDocs: docs.length,
      totalPages: docs.reduce((sum, doc) => sum + doc.pages, 0),
    }));
  };

  const setMessages = (msgs: Message[]) => {
    setMessagesState(msgs);
  };

  const removeDocument = (name: string) => {
    setDocumentsState(prev => {
      const filtered = prev.filter(doc => doc.name !== name);
      const removed = prev.find(doc => doc.name === name);

      setStats(prevStats => ({
        ...prevStats,
        totalDocs: prevStats.totalDocs - 1,
        totalPages: prevStats.totalPages - (removed?.pages || 0),
      }));

      return filtered;
    });
    // Remove from selected list
    setSelectedDocuments(prev => prev.filter(n => n !== name));
  };

  const clearAllDocuments = () => {
    setDocumentsState([]);
    setSelectedDocuments([]);
    setStats(prev => ({
      ...prev,
      totalDocs: 0,
      totalPages: 0,
    }));
  };

  const toggleDocumentSelection = (name: string) => {
    setSelectedDocuments(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const selectAllDocuments = () => {
    setSelectedDocuments(documents.map(d => d.name));
  };

  const deselectAllDocuments = () => {
    setSelectedDocuments([]);
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        messages,
        stats,
        selectedDocuments,
        addDocument,
        addDocuments,
        addMessage,
        incrementQuestions,
        setDocuments,
        setMessages,
        removeDocument,
        clearAllDocuments,
        toggleDocumentSelection,
        selectAllDocuments,
        deselectAllDocuments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
