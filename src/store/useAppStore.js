import { create } from 'zustand';
import { MOCK_REPORTS_DATA } from '@/config/constants';

export const useAppStore = create((set) => ({
  // Navigation
  activeTab: 'upload', // 'upload' or 'reports'
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Upload State
  files: [],
  isDragging: false,
  isProcessing: false,
  currentStep: -1,
  isComplete: false,
  processedFileName: '',
  error: null,

  // Reports State
  reports: [...MOCK_REPORTS_DATA],
  searchQuery: '',

  // Actions
  setFiles: (files) => set({ files }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setIsComplete: (isComplete) => set({ isComplete }),
  setProcessedFileName: (processedFileName) => set({ processedFileName }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addReport: (report) => set((state) => ({ 
    reports: [report, ...state.reports] 
  })),

  resetUpload: () => set({
    files: [],
    isProcessing: false,
    currentStep: -1,
    isComplete: false,
    processedFileName: '',
    error: null
  })
}));
