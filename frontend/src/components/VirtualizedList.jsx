import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/VirtualizedList.css';

const VirtualizedList = ({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5,
  renderItem,
  className = '',
  onScroll = null
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleCount + overscan * 2
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = (e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    onScroll && onScroll(newScrollTop);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (items.length === 0) {
    return (
      <div 
        className={`virtualized-list empty ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="empty-message">No items to display</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`virtualized-list ${className}`}
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item) => (
          <div
            key={item.index}
            className="virtualized-item"
            style={{
              position: 'absolute',
              top: item.top,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, item.index)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Hook for infinite scrolling
export const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isFetching && hasMore && !isLoading) {
      callback();
      setIsFetching(false);
    }
  }, [isFetching, hasMore, isLoading, callback]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const threshold = 100; // pixels from bottom

    if (scrollHeight - scrollTop - clientHeight < threshold && hasMore && !isLoading) {
      setIsFetching(true);
    }
  };

  return { handleScroll };
};

// Hook for search with debouncing
export const useSearch = (items, searchTerm, searchFields = []) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm) return items;

    return items.filter(item => {
      return searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      });
    });
  }, [items, debouncedSearchTerm, searchFields]);

  return filteredItems;
};

export default VirtualizedList;
