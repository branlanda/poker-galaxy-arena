
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  onLoadMore,
  hasMore = false,
  loading = false,
}: VirtualScrollListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { optimizedScrolling } = useMobileOptimizations();
  
  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.length
    );
    
    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  // Handle scroll with throttling for mobile
  const handleScroll = useMemo(() => {
    let ticking = false;
    
    return (event: React.UIEvent<HTMLDivElement>) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const newScrollTop = event.currentTarget.scrollTop;
          setScrollTop(newScrollTop);
          
          // Load more when near bottom
          if (onLoadMore && hasMore && !loading) {
            const scrollHeight = event.currentTarget.scrollHeight;
            const clientHeight = event.currentTarget.clientHeight;
            const scrollPosition = newScrollTop + clientHeight;
            
            if (scrollPosition >= scrollHeight - 200) {
              onLoadMore();
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
  }, [onLoadMore, hasMore, loading]);
  
  // Render visible items
  const visibleItems = useMemo(() => {
    const items_to_render = [];
    
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      if (items[i]) {
        items_to_render.push(
          <div
            key={i}
            style={{
              position: 'absolute',
              top: i * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(items[i], i)}
          </div>
        );
      }
    }
    
    return items_to_render;
  }, [visibleRange, items, itemHeight, renderItem]);
  
  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
      className={optimizedScrolling ? 'scroll-smooth' : ''}
    >
      <div
        style={{
          height: items.length * itemHeight,
          position: 'relative',
        }}
      >
        {visibleItems}
        
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: items.length * itemHeight,
              width: '100%',
              height: itemHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
