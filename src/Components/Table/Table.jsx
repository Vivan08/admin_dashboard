import React, { useState, useMemo } from 'react';
import './Table.css';

const Table = ({ columns, data, onRowClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting logic
  const sortedData = useMemo(() => {
    let sortableData = [...data];
    
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableData;
  }, [data, sortConfig]);

  // Filtering logic
  const filteredData = useMemo(() => {
    if (!filterText) return sortedData;
    
    return sortedData.filter(row =>
      columns.some(column =>
        String(row[column.key])
          .toLowerCase()
          .includes(filterText.toLowerCase())
      )
    );
  }, [sortedData, filterText, columns]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="table-wrapper">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
          className="table-search"
        />
        <span className="table-count">
          Showing {paginatedData.length} of {filteredData.length} entries
        </span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  className={column.sortable !== false ? 'sortable' : ''}
                >
                  <div className="th-content">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <span className="sort-icon">{getSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'clickable' : ''}
                >
                  {columns.map(column => (
                    <td key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and adjacent pages
                return page === 1 || 
                       page === totalPages || 
                       Math.abs(page - currentPage) <= 1;
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="pagination-ellipsis">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;