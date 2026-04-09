import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import {
  REPORTS_CONSTANTS,
  MOCK_REPORTS_DATA
} from '@/config/constants';
import styles from './Reports.module.css';

const Reports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('fileName'); // 'fileName' or 'createdAt'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' = A-Z, 'desc' = Z-A
  const tableRef = useRef(null);
  const headerRef = useRef(null);
  const itemsPerPage = REPORTS_CONSTANTS.ITEMS_PER_PAGE;

  // Handle column header click for sorting
  const handleSort = useCallback((column) => {
    if (sortColumn === column) {
      // Toggle direction
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New column, default to asc
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...MOCK_REPORTS_DATA];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter((item) =>
        item.fileName.toLowerCase().includes(query)
      );
    }

    // Sort by active column
    data.sort((a, b) => {
      let comparison = 0;

      if (sortColumn === 'fileName') {
        comparison = a.fileName.localeCompare(b.fileName);
      } else if (sortColumn === 'createdAt') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return data;
  }, [searchQuery, sortColumn, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = useMemo(
    () => filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage),
    [filteredAndSortedData, startIndex, itemsPerPage]
  );

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortColumn, sortDirection]);

  // GSAP entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      );
    }

    if (tableRef.current) {
      tl.fromTo(
        tableRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.2'
      );
    }
  }, []);

  // Animate table rows on data change
  useEffect(() => {
    if (tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(
        rows,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out'
        }
      );
    }
  }, [currentPage, searchQuery, sortColumn, sortDirection]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const getFileTypeIcon = useCallback((fileType) => {
    const iconColors = {
      pdf: '#EE202E',
      docx: '#2563EB',
      xlsx: '#16A34A'
    };

    const color = iconColors[fileType] || '#94A3B8';

    return (
      <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" style={{ color }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }, []);

  const handleDownload = useCallback((fileName) => {
    toast.success(`Downloading ${fileName}...`);
  }, []);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Render sort arrow for a column header
  const renderSortArrow = (column) => {
    const isActive = sortColumn === column;

    return (
      <span className={`${styles.sortArrows} ${isActive ? styles.sortArrowsActive : ''}`}>
        {isActive ? (
          sortDirection === 'asc' ? (
            <svg className={styles.sortArrowIcon} viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className={styles.sortArrowIcon} viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        ) : (
          <svg className={styles.sortArrowIcon} viewBox="0 0 24 24" fill="none">
            <path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    );
  };

  // Get sort label text for active column
  const getSortLabel = (column) => {
    if (sortColumn !== column) return '';
    if (column === 'fileName') {
      return sortDirection === 'asc' ? '(A–Z)' : '(Z–A)';
    }
    if (column === 'createdAt') {
      return sortDirection === 'asc' ? '(Oldest)' : '(Newest)';
    }
    return '';
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div ref={headerRef} className={styles.header}>
        <h1 className={styles.title}>{REPORTS_CONSTANTS.TITLE}</h1>
        <p className={styles.subtitle}>{REPORTS_CONSTANTS.SUBTITLE}</p>
      </div>

      {/* Search Bar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search files..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search reports"
            id="reports-search"
          />
          {searchQuery && (
            <button
              className={styles.clearSearchBtn}
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" fill="none" className={styles.clearIcon}>
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div ref={tableRef} className={styles.tableCard}>
        {filteredAndSortedData.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>{searchQuery ? `No results for "${searchQuery}"` : REPORTS_CONSTANTS.NO_REPORTS}</p>
            {searchQuery && (
              <button className={styles.clearSearchLink} onClick={handleClearSearch}>
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th
                      className={`${styles.thFileName} ${styles.sortableHeader} ${sortColumn === 'fileName' ? styles.sortableHeaderActive : ''}`}
                      onClick={() => handleSort('fileName')}
                      aria-sort={sortColumn === 'fileName' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                      role="columnheader"
                    >
                      <span className={styles.thContent}>
                        {REPORTS_CONSTANTS.TABLE_HEADERS.FILE_NAME}
                        <span className={styles.sortHint}>{getSortLabel('fileName')}</span>
                        {renderSortArrow('fileName')}
                      </span>
                    </th>
                    <th
                      className={`${styles.thCreatedAt} ${styles.sortableHeader} ${sortColumn === 'createdAt' ? styles.sortableHeaderActive : ''}`}
                      onClick={() => handleSort('createdAt')}
                      aria-sort={sortColumn === 'createdAt' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                      role="columnheader"
                    >
                      <span className={styles.thContent}>
                        {REPORTS_CONSTANTS.TABLE_HEADERS.CREATED_AT}
                        <span className={styles.sortHint}>{getSortLabel('createdAt')}</span>
                        {renderSortArrow('createdAt')}
                      </span>
                    </th>
                    <th className={styles.thAction}>{REPORTS_CONSTANTS.TABLE_HEADERS.ACTION}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((report) => (
                    <tr key={report.id} className={styles.tableRow}>
                      <td className={styles.tdFileName}>
                        <div className={styles.fileNameCell}>
                          {getFileTypeIcon(report.fileType)}
                          <span>{report.fileName}</span>
                        </div>
                      </td>
                      <td className={styles.tdCreatedAt}>
                        {formatDate(report.createdAt)}
                      </td>
                      <td className={styles.tdAction}>
                        <button
                          className={styles.downloadBtn}
                          onClick={() => handleDownload(report.fileName)}
                          aria-label={`Download ${report.fileName}`}
                        >
                          <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {REPORTS_CONSTANTS.DOWNLOAD_BUTTON}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={`${styles.pageBtn} ${styles.navBtn}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none">
                    <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                </button>

                <div className={styles.pageNumbers}>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      className={`${styles.pageBtn} ${styles.pageNum} ${page === currentPage ? styles.activePageBtn : ''}`}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className={`${styles.pageBtn} ${styles.navBtn}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none">
                    <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Results count */}
      {filteredAndSortedData.length > 0 && (
        <div className={styles.resultsInfo}>
          Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} files
        </div>
      )}
    </div>
  );
};

export default Reports;
