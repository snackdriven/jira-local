import { Star, Search } from 'lucide-react';
import type { JiraFilter } from '../../types';

interface FilterListProps {
  filters: JiraFilter[];
  selectedFilter: JiraFilter | null;
  onSelect: (filter: JiraFilter) => void;
  onCustomQuery: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterList({
  filters,
  selectedFilter,
  onSelect,
  onCustomQuery,
  searchQuery,
  onSearchChange,
}: FilterListProps) {
  const filteredFilters = filters.filter(filter =>
    filter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    filter.jql.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search filters..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          onClick={onCustomQuery}
          className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        >
          Custom JQL
        </button>
      </div>

      {filteredFilters.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No filters found</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onSelect(filter)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(filter);
                }
              }}
              className={`w-full text-left p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                selectedFilter?.id === filter.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{filter.name}</h4>
                    {filter.favorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  {filter.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {filter.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono truncate">
                    {filter.jql}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

