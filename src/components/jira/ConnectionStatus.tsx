import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { JiraConnection } from '../../types';
import { formatDateTime } from '../../lib/utils';

interface ConnectionStatusProps {
  connection: JiraConnection;
  onTest: () => void;
  onDisconnect: () => void;
  testing?: boolean;
}

export function ConnectionStatus({ connection, onTest, onDisconnect, testing }: ConnectionStatusProps) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {connection.connected ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {connection.name || connection.instanceUrl}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {connection.instanceUrl}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onTest}
            disabled={testing}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test'}
          </button>
          <button
            onClick={onDisconnect}
            className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Status: {connection.connected ? 'Connected' : 'Disconnected'}</span>
        {connection.lastConnected && (
          <span>Last connected: {formatDateTime(connection.lastConnected)}</span>
        )}
      </div>
    </div>
  );
}

