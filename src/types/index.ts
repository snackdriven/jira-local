export interface JiraConnection {
  id: string;
  instanceUrl: string;
  email: string;
  apiToken: string; // Will be encrypted in storage
  name?: string;
  connected: boolean;
  lastConnected: Date;
  createdAt: Date;
}

export interface JiraFilter {
  id: string;
  name: string;
  jql: string;
  description?: string;
  owner: string;
  favorite: boolean;
  viewMode?: ViewMode;
}

export type ViewMode = 'list' | 'board' | 'table' | 'timeline' | 'compact';

export interface JiraTicket {
  key: string;
  id: string;
  summary: string;
  description?: string;
  status: {
    id: string;
    name: string;
    category: string; // 'todo' | 'inprogress' | 'done'
  };
  priority: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  assignee?: {
    accountId: string;
    displayName: string;
    avatarUrl?: string;
  };
  reporter: {
    accountId: string;
    displayName: string;
    avatarUrl?: string;
  };
  issueType: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  project: {
    id: string;
    key: string;
    name: string;
  };
  labels: string[];
  components: Array<{ id: string; name: string }>;
  created: Date;
  updated: Date;
  dueDate?: Date;
  resolution?: string;
  url: string;
}

export interface CachedFilter {
  filterId: string;
  tickets: JiraTicket[];
  cachedAt: Date;
  expiresAt: Date;
}

export interface AppData {
  connections: JiraConnection[];
  favoriteFilters: string[];
  customQueries: Array<{
    id: string;
    name: string;
    jql: string;
    createdAt: Date;
  }>;
  settings: {
    theme?: 'light' | 'dark' | 'auto';
    defaultViewMode?: ViewMode;
    cacheTTL?: number; // minutes
  };
}

export const PRIORITY_COLORS: Record<string, string> = {
  'Highest': 'bg-red-100 text-red-800 border-red-300',
  'High': 'bg-orange-100 text-orange-800 border-orange-300',
  'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Low': 'bg-blue-100 text-blue-800 border-blue-300',
  'Lowest': 'bg-gray-100 text-gray-800 border-gray-300',
};

export const STATUS_COLORS: Record<string, string> = {
  'To Do': 'bg-gray-100 text-gray-800 border-gray-300',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
  'Done': 'bg-green-100 text-green-800 border-green-300',
  'Blocked': 'bg-red-100 text-red-800 border-red-300',
  'Review': 'bg-purple-100 text-purple-800 border-purple-300',
};

