import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import '../styles/Pagination.css';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav className={`pagination ${className}`} aria-label="Pagination">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="pagination-controls">
        {showFirstLast && currentPage > 1 && (
          <button
            className="pagination-btn first"
            onClick={() => handlePageClick(1)}
            aria-label="Go to first page"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}
        
        {showPrevNext && currentPage > 1 && (
          <button
            className="pagination-btn prev"
            onClick={() => handlePageClick(currentPage - 1)}
            aria-label="Go to previous page"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}
        
        {showStartEllipsis && (
          <div className="pagination-ellipsis">
            <FontAwesomeIcon icon={faEllipsisH} />
          </div>
        )}
        
        {visiblePages.map(page => (
          <button
            key={page}
            className={`pagination-btn page ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageClick(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        {showEndEllipsis && (
          <div className="pagination-ellipsis">
            <FontAwesomeIcon icon={faEllipsisH} />
          </div>
        )}
        
        {showPrevNext && currentPage < totalPages && (
          <button
            className="pagination-btn next"
            onClick={() => handlePageClick(currentPage + 1)}
            aria-label="Go to next page"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
        
        {showFirstLast && currentPage < totalPages && (
          <button
            className="pagination-btn last"
            onClick={() => handlePageClick(totalPages)}
            aria-label="Go to last page"
          >
            <FontAwesomeIcon icon={faChevronRight} />
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
