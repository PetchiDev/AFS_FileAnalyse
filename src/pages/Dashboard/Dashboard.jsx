import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
  ChevronRight,
  FileText,
  Eye
} from 'lucide-react';
import { useMsal } from '@azure/msal-react';
import analysisService from '@/services/analysis.service';
import { useAppStore } from '@/store/useAppStore';
import {
  FILE_UPLOAD,
  PROCESSING_STEPS_LIST,
  MESSAGES
} from '@/config/constants';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal/DeleteConfirmationModal';
import { getSafeViewerUrl } from '@/utils/fileUtils';
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
    reports, setReports,
    reportsLoading, setReportsLoading,
    reportsPagination, setReportsPagination,
    searchQuery, setSearchQuery,
    processResult, setProcessResult,
    resetUpload
  } = useAppStore();

  const navigate = useNavigate();

  const containerRef = useRef(null);
  const tabsRef = useRef(null);
  const indicatorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: 'fileName', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const { accounts } = useMsal();

  const loadHistory = async (page = 1, search = searchQuery) => {
    const isBypassActive = import.meta.env.VITE_BYPASS_AUTH === 'true';
    const objectId = accounts[0]?.localAccountId || (isBypassActive ? 'dev-user-001' : null);

    if (!objectId) return;

    setReportsLoading(true);
    try {
      const data = await analysisService.getProcessings({
        object_id: objectId,
        page_number: page,
        page_size: ITEMS_PER_PAGE,
        search_filename: search || undefined
      });
      setReports(data.records || []);
      setReportsPagination({
        totalRecords: data.total_records || 0,
        totalPages: data.total_pages || 1
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load processing history');
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      loadHistory(currentPage);
    }
  }, [activeTab, currentPage]);

  // Handle server-side search with 2s debounce
  useEffect(() => {
    if (activeTab !== 'reports') return;

    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page
      loadHistory(1, searchQuery);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const handleDownload = (e, url) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!url) {
      toast.error('Download link not available');
      return;
    }

    try {
      const viewerUrl = getSafeViewerUrl(url);
      window.open(viewerUrl, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to open download link');
    }
  };

  const startProcessing = () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setCurrentStep(0);

    const process = async () => {
      try {
        // Build FormData
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        // Get object_id (bypass check)
        const isBypassActive = import.meta.env.VITE_BYPASS_AUTH === 'true';
        const objectId = accounts[0]?.localAccountId || (isBypassActive ? 'dev-user-001' : null);

        if (objectId) {
          formData.append('object_id', objectId);
        }

        // Processing steps simulation (visual only)
        const stepInterval = 800;
        for (let i = 0; i < PROCESSING_STEPS_LIST.length - 1; i++) {
          setCurrentStep(i);
          await new Promise(r => setTimeout(r, stepInterval));
        }

        // Real API Call
        const result = await analysisService.processFiles(formData);

        setProcessResult(result);
        setProcessedFileName(result.output_file?.original_filename || 'processed_output.xlsx');
        setIsProcessing(false);
        setIsComplete(true);
        setCurrentStep(3); // Ready

        toast.success(MESSAGES.SUCCESS.PROCESSING);

        // Zero sync: refresh history
        loadHistory();
      } catch (error) {
        setIsProcessing(false);
        toast.error(error.message || MESSAGES.ERROR.PROCESSING_FAILED);
      }
    };

    process();
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;

    const isBypassActive = import.meta.env.VITE_BYPASS_AUTH === 'true';
    const objectId = accounts[0]?.localAccountId || (isBypassActive ? 'dev-user-001' : null);

    setIsDeleting(true);
    try {
      await analysisService.deleteProcessing(reportToDelete.id, objectId);
      toast.success('Report deleted successfully');
      loadHistory(currentPage);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to delete report');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setReportToDelete(null);
    }
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


  const paginatedData = reports;
  const totalPages = reportsPagination.totalPages;

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return (
      <span className={styles.sortType}>
        {column === 'fileName'
          ? (sortConfig.direction === 'asc' ? ' (A-Z)' : ' (Z-A)')
          : (sortConfig.direction === 'asc' ? ' (Oldest)' : ' (Newest)')
        }
        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </span>
    );
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
            onClick={() => {
              resetUpload();
              setActiveTab('upload');
            }}
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
                  <span>Supported: (.docx) (.doc) (.pdf) (.msg)</span>
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
                <h3>Processing Complete!</h3>
                <p>Your file has been successfully processed and is ready for download.</p>

                <div className={styles.resultList}>
                  {processResult?.output_file && (
                    <div className={styles.resultCard}>
                      <FileText size={20} />
                      <span title={processResult.output_file.original_filename}>
                        {processResult.output_file.original_filename}
                      </span>
                    </div>
                  )}
                  {!processResult && (
                    <div className={styles.resultCard}>
                      <BarChart3 size={20} />
                      <span>{processedFileName}</span>
                    </div>
                  )}
                </div>

                <div className={styles.successActions}>
                  <button
                    className={styles.viewBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (processResult?.output_file?.sas_url) {
                        window.open(getSafeViewerUrl(processResult.output_file.sas_url), '_blank');
                      } else {
                        toast.info('Opening preview...');
                      }
                    }}
                  >
                    <Eye size={18} /> View File
                  </button>
                  <button
                    className={styles.downloadBtn}
                    onClick={(e) => handleDownload(e, processResult?.output_file?.sas_url)}
                  >
                    <Download size={18} /> Download File
                  </button>
                  <button className={styles.newBtn} onClick={resetUpload}>Upload Another File</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.card}>
            <div className={styles.summaryStats}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FileText size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span>Total Reports</span>
                  <p>{reportsPagination.totalRecords || 0}</p>
                </div>
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
                        <div className={styles.cellValue}>
                          <div className={styles.fileIcon}>
                            <FileText size={18} />
                          </div>
                          <span title={report.output_file?.original_filename || 'Unknown'}>
                            {report.output_file?.original_filename || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className={styles.dateCell} data-label="Created At">
                        <div className={styles.cellValue}>
                          {new Date(report.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td data-label="Actions">
                        <div className={styles.cellValue}>
                          <div className={styles.actionGroup}>
                            <button
                              className={styles.actionBtn}
                              title="View"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate({
                                  to: '/processings/$id',
                                  params: { id: report.processing_id || report.id }
                                });
                              }}
                            >
                              <Eye size={16} />
                              <span>View</span>
                            </button>
                            <button
                              className={styles.actionBtn}
                              title="Download"
                              onClick={(e) => handleDownload(e, report.output_file?.sas_url)}
                            >
                              <Download size={16} />
                              <span>Download</span>
                            </button>
                            <button 
                              className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                              title="Delete"
                              onClick={() => handleDeleteClick(report)}
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages >= 1 && reports.length > 0 && (
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

              {reports.length === 0 && !reportsLoading && (
                <div className={styles.emptyState}>
                  <AlertCircle size={32} />
                  <p>No reports found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={reportToDelete?.output_file?.original_filename || 'this report'}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
