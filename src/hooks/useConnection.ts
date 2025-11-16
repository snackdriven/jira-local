import { useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from '../lib/storage';
import { JiraClient } from '../lib/jira';
import type { JiraConnection } from '../types';

export function useConnection() {
  const [connections, setConnections] = useState<JiraConnection[]>([]);
  const [activeConnection, setActiveConnection] = useState<JiraConnection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = loadData();
    setConnections(data.connections);
    // Set first connected connection as active, or first connection
    const connected = data.connections.find(c => c.connected) || data.connections[0] || null;
    setActiveConnection(connected);
    setLoading(false);
  }, []);

  const saveConnections = useCallback((newConnections: JiraConnection[]) => {
    setConnections(newConnections);
    const data = loadData();
    data.connections = newConnections;
    saveData(data);
  }, []);

  const addConnection = useCallback(async (
    instanceUrl: string,
    email: string,
    apiToken: string,
    name?: string
  ): Promise<JiraConnection> => {
    const connection: JiraConnection = {
      id: crypto.randomUUID(),
      instanceUrl: instanceUrl.replace(/\/$/, ''), // Remove trailing slash
      email,
      apiToken,
      name: name || instanceUrl,
      connected: false,
      lastConnected: new Date(),
      createdAt: new Date(),
    };

    // Test connection
    const client = new JiraClient(connection);
    const isValid = await client.testConnection();
    
    if (!isValid) {
      throw new Error('Failed to connect to JIRA. Please check your credentials.');
    }

    connection.connected = true;
    connection.lastConnected = new Date();

    const newConnections = [...connections, connection];
    saveConnections(newConnections);
    setActiveConnection(connection);
    
    return connection;
  }, [connections, saveConnections]);

  const updateConnection = useCallback((id: string, updates: Partial<JiraConnection>) => {
    const newConnections = connections.map(conn =>
      conn.id === id ? { ...conn, ...updates, lastConnected: new Date() } : conn
    );
    saveConnections(newConnections);
    
    if (activeConnection?.id === id) {
      setActiveConnection(newConnections.find(c => c.id === id) || null);
    }
  }, [connections, activeConnection, saveConnections]);

  const deleteConnection = useCallback((id: string) => {
    const newConnections = connections.filter(conn => conn.id !== id);
    saveConnections(newConnections);
    
    if (activeConnection?.id === id) {
      setActiveConnection(newConnections[0] || null);
    }
  }, [connections, activeConnection, saveConnections]);

  const testConnection = useCallback(async (connection: JiraConnection): Promise<boolean> => {
    try {
      const client = new JiraClient(connection);
      const isValid = await client.testConnection();
      
      if (isValid) {
        updateConnection(connection.id, { connected: true });
      } else {
        updateConnection(connection.id, { connected: false });
      }
      
      return isValid;
    } catch {
      updateConnection(connection.id, { connected: false });
      return false;
    }
  }, [updateConnection]);

  const setActive = useCallback((connection: JiraConnection | null) => {
    setActiveConnection(connection);
  }, []);

  return {
    connections,
    activeConnection,
    loading,
    addConnection,
    updateConnection,
    deleteConnection,
    testConnection,
    setActive,
  };
}

