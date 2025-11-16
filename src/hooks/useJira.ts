import { useMemo } from 'react';
import { JiraClient } from '../lib/jira';
import type { JiraConnection } from '../types';

export function useJira(connection: JiraConnection | null) {
  const client = useMemo(() => {
    if (!connection || !connection.connected) return null;
    return new JiraClient(connection);
  }, [connection]);

  return { client };
}

