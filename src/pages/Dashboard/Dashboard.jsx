import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import { 
  FileUp, 
  BarChart3, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Plus,
  LayoutDashboard,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { 
  FILE_UPLOAD, 
  PROCESSING_STEPS_LIST, 
  MESSAGES 
} from '@/config/constants';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const {
    activeTab, setActiveTab,
    files, setFiles,
    isDragging, setIsDragging,
    isProcessing, setIsProcessing,
    currentStep, setCurrentStep,
    isComplete, setIsComplete,
    processedFileName, setProcessedFileName,
    reports, addReport,
    searchQuery, setSearchQuery,
    resetUpload
  } = useAppStore();

  const containerRef = useRef(null);
  const tabsRef = useRef(null);
  const indicatorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: 'fileName', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Entrance Animation
  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  // Animate Tab Indicator
  const updateIndicator = () => {
    const activeBtn = tabsRef.current?.querySelector(`.${styles.activeTab}`);
    if (activeBtn && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.5,
        ease: 'elastic.out(1, 0.75)'
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      const isValid = FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(ext);
      if (!isValid) toast.error(`${file.name} is not a supported format.`);
      return isValid;
    });

    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles]);
    }
  };

  const startProcessing = () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setCurrentStep(0);
    
    const process = async () => {
      for (let i = 0; i < PROCESSING_STEPS_LIST.length; i++) {
        setCurrentStep(i);
        await new Promise(r => setTimeout(r, 1500));
      }
      
      const fileName = files[0].name.replace(/\.[^/.]+$/, "") + "_processed.xlsx";
      setProcessedFileName(fileName);
      setIsProcessing(false);
      setIsComplete(true);
      
      addReport({
        id: Date.now(),
        fileName,
        fileType: 'xlsx',
        createdAt: new Date().toISOString()
      });
      
      toast.success(MESSAGES.SUCCESS.PROCESSING);
    };
    
    process();
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery]);

  const getRecentReportsCount = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return reports.filter(r => new Date(r.createdAt) >= sevenDaysAgo).length;
  }, [reports]);

  const processedData = useMemo(() => {
    // 1. Filter
    let result = reports.filter(r => 
      r.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. Sort
    result.sort((a, b) => {
      if (sortConfig.key === 'fileName') {
        const nameA = a.fileName.toLowerCase();
        const nameB = b.fileName.toLowerCase();
        if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      
      if (sortConfig.key === 'createdAt') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      return 0;
    });

    return result;
  }, [reports, searchQuery, sortConfig]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedData.slice(start, start + ITEMS_PER_PAGE);
  }, [processedData, currentPage]);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div ref={containerRef} className={styles.dashboardWrapper}>
      <div className={styles.dashboardHeader}>
        <div className={styles.titleInfo}>
          <h1><LayoutDashboard size={24} /> Dashboard</h1>
          <p>Seamlessly process your files and access analytics.</p>
        </div>

        <nav ref={tabsRef} className={styles.tabBar}>
          <div ref={indicatorRef} className={styles.activeIndicator} />
          <button 
            className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <FileUp size={18} />
            <span>Upload</span>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'reports' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart3 size={18} />
            <span>Reports</span>
          </button>
        </nav>
      </div>

      <div className={styles.contentContainer}>
        {activeTab === 'upload' ? (
          <div className={styles.card}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Upload Files</h2>
                <p>Add documents for AI-powered analysis</p>
              </div>
            </div>

            {!isProcessing && !isComplete ? (
              <div className={styles.uploadMain}>
                <div 
                  className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); validateAndAddFiles(Array.from(e.dataTransfer.files)); setIsDragging(false); }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input type="file" hidden ref={fileInputRef} multiple onChange={handleFileSelect} />
                  <Plus size={40} className={styles.plusIcon} />
                  <p>Drop files here or click to browse</p>
                  <span>Supported: PDF, DOCX, XLSX</span>
                </div>

                {files.length > 0 && (
                  <div className={styles.fileList}>
                    {files.map((f, i) => (
                      <div key={i} className={styles.fileItem}>
                        <FileUp size={16} />
                        <span className={styles.fileName}>{f.name}</span>
                        <button 
                          className={styles.removeFileBtn}
                          onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  className={styles.mainBtn} 
                  disabled={files.length === 0}
                  onClick={startProcessing}
                >
                  Process Files
                </button>
              </div>
            ) : isProcessing ? (
              <div className={styles.processingSection}>
                <h3>{PROCESSING_STEPS_LIST[currentStep]?.label || 'Preparing...'}</h3>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${((currentStep + 1) / PROCESSING_STEPS_LIST.length) * 100}%` }}
                  />
                </div>
                <p>AI is analyzing your documents. This may take a moment.</p>
              </div>
            ) : (
              <div className={styles.successSection}>
                <CheckCircle2 size={48} className={styles.successIcon} />
                <h3>Success!</h3>
                <p>Your file has been processed successfully.</p>
                <div className={styles.resultCard}>
                  <BarChart3 size={20} />
                  <span>{processedFileName}</span>
                </div>
                <div className={styles.successActions}>
                  <button className={styles.downloadBtn} onClick={() => toast.info('Download started...')}>
                    <Download size={18} /> Download Excel
                  </button>
                  <button className={styles.newBtn} onClick={resetUpload}>Start New</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.card}>
            <div className={styles.summaryStats}>
              <div className={styles.statCard}>
                <span>Total</span>
                <p>{reports.length}</p>
              </div>
              <div className={styles.statCard}>
                <span>Recently Added Reports</span>
                <p>{getRecentReportsCount}</p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <div className={styles.tableToolbar}>
                 <div className={styles.searchBox}>
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search reports..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <table className={styles.reportsTable}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('fileName')} className={styles.sortableHeader}>
                      <div className={styles.headerContent}>
                        File Name <SortIcon column="fileName" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('createdAt')} className={styles.sortableHeader}>
                      <div className={styles.headerContent}>
                        Created At <SortIcon column="createdAt" />
                      </div>
                    </th>
                    <th className={styles.textCenter}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(report => (
                    <tr key={report.id}>
                      <td className={styles.fileNameCell} data-label="File Name">
                        <div className={styles.fileIcon}>
                          {report.fileType === 'xlsx' ? <BarChart3 size={18} /> : <FileUp size={18} />}
                        </div>
                        <span title={report.fileName}>{report.fileName}</span>
                      </td>
                      <td className={styles.dateCell} data-label="Created At">
                        {new Date(report.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td data-label="Actions">
                        <div className={styles.actionGroup}>
                          <button className={styles.actionBtn} title="View">
                            <Plus size={16} />
                            <span>View</span>
                          </button>
                          <button className={styles.actionBtn} title="Download">
                            <Download size={16} />
                            <span>Download</span>
                          </button>
                          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete">
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    className={styles.pageBtn} 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    className={styles.pageBtn} 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {processedData.length === 0 && (
                <div className={styles.emptyState}>
                  <AlertCircle size={32} />
                  <p>No reports found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
