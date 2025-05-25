
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHandHistory } from '@/hooks/useHandHistory';
import { HandHistoryFilters } from '@/components/handHistory/HandHistoryFilters';
import { HandHistoryList } from '@/components/handHistory/HandHistoryList';
import { HandHistoryFilters as Filters } from '@/types/handHistory';
import StarfallEffect from '@/components/effects/StarfallEffect';

export default function HandHistoryPage() {
  const { hands, loading, totalCount, fetchHands } = useHandHistory();
  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<Filters>({});
  
  const HANDS_PER_PAGE = 20;
  const hasMore = hands.length < totalCount;

  useEffect(() => {
    fetchHands(appliedFilters, 1, HANDS_PER_PAGE);
    setCurrentPage(1);
  }, [appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    fetchHands(appliedFilters, nextPage, HANDS_PER_PAGE);
    setCurrentPage(nextPage);
  };

  return (
    <div className="min-h-screen bg-navy relative">
      <StarfallEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link to="/profile" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Perfil
            </Link>
          </Button>
          
          <div className="text-right">
            <h1 className="text-3xl font-bold text-white">Historial de Manos</h1>
            <p className="text-gray-400">
              {totalCount} manos encontradas
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <HandHistoryFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Hand List */}
        <HandHistoryList
          hands={hands}
          loading={loading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}
