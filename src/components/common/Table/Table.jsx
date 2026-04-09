import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Table.module.css';

/**
 * Reusable Table component
 * @param {Array} columns - Array of column definitions
 * @param {Array} data - Array of data objects
 * @param {Function} onSort - Callback for sorting (columnKey, direction)
 * @param {Object} sortConfig - Current sort configuration { key, direction }
 */
const SortIcon = ({ direction }) => {
  if (direction === 'asc') {
    return (
      <span className={styles.sortIcon} aria-label="sorted ascending">
        &#9650;
      </span>
    );
  }
  if (direction === 'desc') {
    return (
      <span className={styles.sortIcon} aria-label="sorted descending">
        &#9660;
      </span>
    );
  }
  return (
    <span className={styles.sortIconNeutral} aria-label="sortable">
      &#8597;
    </span>
  );
};

const Table = ({ 
  columns: initialColumns, 
  data, 
  pagination, 
  loading, 
  onSort, 
  sortConfig, 
  onFilter, 
  filters: externalFilters 
}) => {
  const { current, pageSize, total, onChange } = pagination || {};
  const totalPages = Math.ceil(total / pageSize);

  const handlePrev = () => {
    if (current > 1) onChange(current - 1);
  };

  const handleNext = () => {
    if (current < totalPages) onChange(current + 1);
  };

  // Internal state for columns to support reordering
  const [columns, setColumns] = useState(initialColumns);
  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  // Internal state for filters if not provided externally
  const [internalFilters, setInternalFilters] = useState({});
  const filters = externalFilters || internalFilters;

  // Column Reordering state
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    // Prevent drag if clicking inside an input
    if (e.target.tagName === 'INPUT') {
      e.preventDefault();
      return;
    }
    setDraggedColumn(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedColumn === index) return;
    setDragOverColumn(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedColumn === null || draggedColumn === index) return;

    const updatedColumns = [...columns];
    const item = updatedColumns.splice(draggedColumn, 1)[0];
    updatedColumns.splice(index, 0, item);

    setColumns(updatedColumns);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleSearchChange = (e, colKey) => {
    const value = e.target.value;
    if (onFilter) {
      onFilter(colKey, value);
    } else {
      setInternalFilters(prev => ({ ...prev, [colKey]: value }));
    }
  };


  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {columns.map((column, index) => {
              const effectiveKey = column.key || `col-${index}`;
              const isSortable = column.sortable && column.key;
              const isActive = sortConfig?.key === column.key;
              const direction = isActive ? sortConfig.direction : null;

              const handleSortClick = () => {
                if (!isSortable || !onSort) return;
                const nextDirection = direction === 'asc' ? 'desc' : 'asc';
                onSort(column.key, nextDirection);
              };

              const displayWidth = column.width || 'auto';

              return (
                <th
                  id={`th-${effectiveKey}`}
                  key={effectiveKey}
                  className={`${styles.th} ${isSortable ? styles.thSortable : ''} ${isActive ? styles.thActive : ''} ${dragOverColumn === index ? styles.dragOver : ''} ${column.reorderable !== false ? styles.thDraggable : ''}`}
                  style={{ width: displayWidth, textAlign: column.align || 'left' }}
                  draggable={column.reorderable !== false}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className={styles.thContent}>
                    <div 
                      className={styles.thLabel} 
                      onClick={isSortable ? handleSortClick : undefined}
                      style={{ justifyContent: column.align === 'center' ? 'center' : (column.align === 'right' ? 'flex-end' : 'flex-start') }}
                    >
                      {column.title}
                      {isSortable && <SortIcon direction={direction} />}
                    </div>
                    {column.searchable !== false && (
                      <div className={styles.searchContainer}>
                        <input
                          type="text"
                          className={styles.searchInput}
                          placeholder={`Search ${column.title}...`}
                          value={filters?.[column.key] || ''}
                          onChange={(e) => handleSearchChange(e, column.key)}
                          onClick={(e) => e.stopPropagation()} 
                          onMouseDown={(e) => e.stopPropagation()}
                          draggable="false"
                        />
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className={styles.loadingData}>
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <span>Loading Data</span>
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.tr}>
                {columns.map((column, colIndex) => {
                  const effectiveKey = column.key || `col-${colIndex}`;
                  const displayWidth = column.width || 'auto';
                  
                  return (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={styles.td}
                      style={{ 
                        textAlign: column.align || 'left',
                        width: displayWidth,
                        maxWidth: displayWidth,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.noData}>
                No Data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && total > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {((current - 1) * pageSize) + 1} to {Math.min(current * pageSize, total)} of {total} results
          </div>
          <div className={styles.paginationControls}>
            <button
              className={styles.pageButton}
              onClick={handlePrev}
              disabled={current === 1}
            >
              Previous
            </button>
            <span className={styles.pageStatus}>Page {current} of {totalPages}</span>
            <button
              className={styles.pageButton}
              onClick={handleNext}
              disabled={current === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool,
      searchable: PropTypes.bool,
      reorderable: PropTypes.bool,
      width: PropTypes.string,
      align: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSort: PropTypes.func,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
  onFilter: PropTypes.func,
  filters: PropTypes.object,
};

export default Table;
