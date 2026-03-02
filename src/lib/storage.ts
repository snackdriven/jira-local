import type { AppData, JiraConnection, CachedFilter } from '../types';

const STORAGE_KEY = 'jira-wrapper-data';
const CACHE_KEY = 'jira-wrapper-cache';

// Simple encryption (base64 for obfuscation - not real security)
function encryptToken(token: string): string {
  return btoa(token);
}

function decryptToken(encrypted: string): string {
  try {
    return atob(encrypted);
  } catch {
    return encrypted; // Fallback if not encrypted
  }
}

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Decrypt API tokens
      data.connections = data.connections.map((conn: any) => ({
        ...conn,
        apiToken: decryptToken(conn.apiToken),
        lastConnected: new Date(conn.lastConnected),
        createdAt: new Date(conn.createdAt),
      }));
      if (data.customQueries) {
        data.customQueries = data.customQueries.map((q: any) => ({
          ...q,
          createdAt: new Date(q.createdAt),
        }));
      }
      return data;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  
  return {
    connections: [],
    favoriteFilters: [],
    customQueries: [],
    settings: {
      theme: 'auto',
      defaultViewMode: 'list',
      cacheTTL: 5, // 5 minutes
    },
  };
}

export function saveData(data: AppData): void {
  try {
    // Encrypt API tokens before saving
    const dataToSave = {
      ...data,
      connections: data.connections.map(conn => ({
        ...conn,
        apiToken: encryptToken(conn.apiToken),
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error: any) {
    console.error('Error saving data:', error);
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      throw new Error('Storage quota exceeded. Please clear some cached data.');
    }
    throw error;
  }
}

export function loadCache(): Record<string, CachedFilter> {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const cache = JSON.parse(stored);
      // Convert date strings back to Date objects
      Object.keys(cache).forEach(key => {
        cache[key] = {
          ...cache[key],
          cachedAt: new Date(cache[key].cachedAt),
          expiresAt: new Date(cache[key].expiresAt),
          tickets: cache[key].tickets.map((ticket: any) => ({
            ...ticket,
            created: new Date(ticket.created),
            updated: new Date(ticket.updated),
            dueDate: ticket.dueDate ? new Date(ticket.dueDate) : undefined,
          })),
        };
      });
      return cache;
    }
  } catch (error) {
    console.error('Error loading cache:', error);
  }
  return {};
}

const MAX_CACHE_ENTRIES = 50; // Limit cache size

export function saveCache(cache: Record<string, CachedFilter>): void {
  try {
    // Enforce cache size limit
    const keys = Object.keys(cache);
    if (keys.length > MAX_CACHE_ENTRIES) {
      // Remove oldest entries
      const sorted = keys.sort((a, b) => 
        cache[a].cachedAt.getTime() - cache[b].cachedAt.getTime()
      );
      const toRemove = sorted.slice(0, keys.length - MAX_CACHE_ENTRIES);
      toRemove.forEach(key => delete cache[key]);
    }
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error: any) {
    console.error('Error saving cache:', error);
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      // Clear old cache entries
      const keys = Object.keys(cache);
      if (keys.length > 0) {
        // Remove oldest 50% of entries
        const sorted = keys.sort((a, b) => 
          cache[a].cachedAt.getTime() - cache[b].cachedAt.getTime()
        );
        const toRemove = sorted.slice(0, Math.floor(sorted.length / 2));
        toRemove.forEach(key => delete cache[key]);
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      }
    }
  }
}

export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

export function exportData(): string {
  const data = loadData();
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): AppData {
  try {
    const data = JSON.parse(jsonString);
    saveData(data);
    return loadData();
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid data format');
  }
}

