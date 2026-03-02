import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useJira } from './useJira';
import { loadCache, saveCache, loadData } from '../lib/storage';
import type { JiraConnection, JiraFilter, JiraTicket } from '../types';

export function useFilters(connection: JiraConnection | null) {
  const { client } = useJira(connection);
  const queryClient = useQueryClient();

  const filtersQuery = useQuery({
    queryKey: ['jira', 'filters', connection?.id],
    queryFn: async () => {
      if (!client) throw new Error('Not connected to JIRA');
      return client.getFilters();
    },
    enabled: !!client && !!connection?.connected,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });

  return {
    filters: filtersQuery.data || [],
    isLoading: filtersQuery.isLoading,
    error: filtersQuery.error,
    refetch: filtersQuery.refetch,
  };
}

export function useFilterTickets(
  connection: JiraConnection | null,
  filter: JiraFilter | null,
  maxResults: number = 100
) {
  const { client } = useJira(connection);
  const queryClient = useQueryClient();

  const ticketsQuery = useQuery({
    queryKey: ['jira', 'tickets', connection?.id, filter?.id, filter?.jql],
    queryFn: async () => {
      if (!client || !filter) throw new Error('Not connected or no filter selected');
      
      // Check cache first
      const cache = loadCache();
      const cacheKey = filter.id || `jql-${btoa(filter.jql).substring(0, 20)}`;
      const cached = cache[cacheKey];
      
      if (cached && cached.expiresAt > new Date()) {
        return cached.tickets;
      }

      // Fetch from JIRA
      const tickets = await client.searchJQL(filter.jql, maxResults);
      
      // Save to cache
      const data = loadData();
      const ttl = (data.settings.cacheTTL || 5) * 60 * 1000; // minutes to ms
      cache[cacheKey] = {
        filterId: filter.id || cacheKey,
        tickets,
        cachedAt: new Date(),
        expiresAt: new Date(Date.now() + ttl),
      };
      saveCache(cache);
      
      return tickets;
    },
    enabled: !!client && !!connection?.connected && !!filter,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const refreshTickets = async () => {
    if (!filter) return;
    
    // Clear cache
    const cache = loadCache();
    const cacheKey = filter.id || `jql-${btoa(filter.jql).substring(0, 20)}`;
    delete cache[cacheKey];
    saveCache(cache);
    
    // Invalidate query
    await queryClient.invalidateQueries({
      queryKey: ['jira', 'tickets', connection?.id, filter.id],
    });
  };

  return {
    tickets: ticketsQuery.data || [],
    isLoading: ticketsQuery.isLoading,
    error: ticketsQuery.error,
    refetch: refreshTickets,
  };
}

