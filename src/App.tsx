import { useState } from 'react';
import { useConnection } from './hooks/useConnection';
import { useFilters } from './hooks/useFilters';
import { useFilterTickets } from './hooks/useFilters';
import { useTheme } from './hooks/useTheme';
import { useViewMode } from './hooks/useViewMode';
import { ConnectionSetup } from './components/jira/ConnectionSetup';
import { ConnectionStatus } from './components/jira/ConnectionStatus';
import { FilterList } from './components/jira/FilterList';
import { ThemeToggle } from './components/layout/ThemeToggle';
import { ViewToggle } from './components/layout/ViewToggle';
import { ListView } from './components/views/ListView';
import { BoardView } from './components/views/BoardView';
import { TableView } from './components/views/TableView';
import { TimelineView } from './components/views/TimelineView';
import { CompactView } from './components/views/CompactView';
import { TicketDetail } from './components/ticket/TicketDetail';
import type { JiraFilter, JiraTicket } from './types';
import { Plus } from 'lucide-react';

function App() {
  const {
    activeConnection,
    addConnection,
    deleteConnection,
    testConnection,
    loading: connectionLoading,
  } = useConnection();
  
  const { theme, setTheme } = useTheme();
  const [showConnectionSetup, setShowConnectionSetup] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<JiraFilter | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<JiraTicket | null>(null);
  const [filterSearchQuery, setFilterSearchQuery] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);

  const { filters, isLoading: filtersLoading, error: filtersError } = useFilters(activeConnection);
  const { viewMode, setViewMode } = useViewMode(selectedFilter?.id);
  const { tickets, isLoading: ticketsLoading, error: ticketsError, refetch: refreshTickets } = 
    useFilterTickets(activeConnection, selectedFilter);

  const handleConnect = async (instanceUrl: string, email: string, apiToken: string, name?: string) => {
    await addConnection(instanceUrl, email, apiToken, name);
    setShowConnectionSetup(false);
  };

  const handleTestConnection = async () => {
    if (!activeConnection) return;
    setTestingConnection(true);
    try {
      await testConnection(activeConnection);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleDisconnect = () => {
    if (activeConnection) {
      deleteConnection(activeConnection.id);
      setSelectedFilter(null);
      setSelectedTicket(null);
    }
  };

  const handleCustomQuery = () => {
    // TODO: Implement custom JQL query modal
    console.log('Custom JQL query');
  };

  if (connectionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!activeConnection) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            JIRA Filter Wrapper
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect to your JIRA instance to view and manage your filters
          </p>
          <button
            onClick={() => setShowConnectionSetup(true)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Connect to JIRA
          </button>
        </div>
        {showConnectionSetup && (
          <ConnectionSetup
            onConnect={handleConnect}
            onCancel={() => setShowConnectionSetup(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                JIRA Filter Wrapper
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle theme={theme} onThemeChange={setTheme} />
              <button
                onClick={() => setShowConnectionSetup(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Add Connection"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="space-y-4 mb-4">
            <ConnectionStatus
              connection={activeConnection}
              onTest={handleTestConnection}
              onDisconnect={handleDisconnect}
              testing={testingConnection}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Filters
            </h2>
            {filtersError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {filtersError instanceof Error ? filtersError.message : 'Failed to load filters'}
              </div>
            )}
            {filtersLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p>Loading filters...</p>
              </div>
            ) : (
              <FilterList
                filters={filters}
                selectedFilter={selectedFilter}
                onSelect={setSelectedFilter}
                onCustomQuery={handleCustomQuery}
                searchQuery={filterSearchQuery}
                onSearchChange={setFilterSearchQuery}
              />
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {!selectedFilter ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg">Select a filter to view tickets</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedFilter.name}
                  </h2>
                  {selectedFilter.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedFilter.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                  <button
                    onClick={refreshTickets}
                    disabled={ticketsLoading}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {ticketsError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {ticketsError instanceof Error ? ticketsError.message : 'Failed to load tickets'}
                </div>
              )}

              {ticketsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg">No tickets found</p>
                </div>
              ) : (
                <div className="view-transition">
                  {viewMode === 'list' && (
                    <ListView
                      tickets={tickets}
                      onTicketClick={setSelectedTicket}
                    />
                  )}
                  {viewMode === 'board' && (
                    <BoardView
                      tickets={tickets}
                      onTicketClick={setSelectedTicket}
                    />
                  )}
                  {viewMode === 'table' && (
                    <TableView
                      tickets={tickets}
                      onTicketClick={setSelectedTicket}
                    />
                  )}
                  {viewMode === 'timeline' && (
                    <TimelineView
                      tickets={tickets}
                      onTicketClick={setSelectedTicket}
                    />
                  )}
                  {viewMode === 'compact' && (
                    <CompactView
                      tickets={tickets}
                      onTicketClick={setSelectedTicket}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showConnectionSetup && (
        <ConnectionSetup
          onConnect={handleConnect}
          onCancel={() => setShowConnectionSetup(false)}
        />
      )}

      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

export default App;

