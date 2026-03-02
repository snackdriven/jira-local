import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { validateJiraUrl } from '../../lib/utils';

interface ConnectionSetupProps {
  onConnect: (instanceUrl: string, email: string, apiToken: string, name?: string) => Promise<void>;
  onCancel: () => void;
}

export function ConnectionSetup({ onConnect, onCancel }: ConnectionSetupProps) {
  const [instanceUrl, setInstanceUrl] = useState('');
  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testingSuccess, setTestingSuccess] = useState(false);

  const handleTest = async () => {
    if (!instanceUrl || !email || !apiToken) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateJiraUrl(instanceUrl)) {
      setError('Invalid JIRA URL. Must be a valid https://*.atlassian.net URL');
      return;
    }

    setTesting(true);
    setError(null);
    setTestingSuccess(false);

    try {
      // Import here to avoid circular dependency
      const { JiraClient } = await import('../../lib/jira');
      const tempConnection = {
        id: 'temp',
        instanceUrl,
        email,
        apiToken,
        connected: false,
        lastConnected: new Date(),
        createdAt: new Date(),
      };
      const client = new JiraClient(tempConnection);
      const isValid = await client.testConnection();
      
      if (isValid) {
        setTestingSuccess(true);
      } else {
        setError('Connection test failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async () => {
    if (!instanceUrl || !email || !apiToken) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateJiraUrl(instanceUrl)) {
      setError('Invalid JIRA URL');
      return;
    }

    setError(null);
    try {
      await onConnect(instanceUrl, email, apiToken, name || undefined);
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connect to JIRA
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your JIRA Cloud instance details to get started
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {testingSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Connection test successful!</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JIRA Instance URL *
            </label>
            <input
              type="url"
              value={instanceUrl}
              onChange={(e) => {
                setInstanceUrl(e.target.value);
                setTestingSuccess(false);
              }}
              placeholder="https://your-company.atlassian.net"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your JIRA Cloud instance URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setTestingSuccess(false);
              }}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Token *
            </label>
            <input
              type="password"
              value={apiToken}
              onChange={(e) => {
                setApiToken(e.target.value);
                setTestingSuccess(false);
              }}
              placeholder="Enter your JIRA API token"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              <a
                href="https://id.atlassian.com/manage-profile/security/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Create an API token
              </a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Connection Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My JIRA Instance"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              onClick={handleTest}
              disabled={testing || !instanceUrl || !email || !apiToken}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
            <button
              onClick={handleConnect}
              disabled={!testingSuccess}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

