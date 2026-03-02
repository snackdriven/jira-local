import type { JiraConnection, JiraFilter, JiraTicket } from '../types';

const JIRA_API_VERSION = '3';
const MAX_RESULTS_PER_PAGE = 100; // JIRA API limit
const RATE_LIMIT_DELAY = 100; // ms between requests to avoid rate limits

// Rate limiting queue
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
      }
      
      const task = this.queue.shift();
      if (task) {
        this.lastRequestTime = Date.now();
        await task();
      }
    }
    this.processing = false;
  }
}

const rateLimiter = new RateLimiter();

export class JiraClient {
  private connection: JiraConnection;

  constructor(connection: JiraConnection) {
    this.connection = connection;
  }

  private getAuth(): string {
    return btoa(`${this.connection.email}:${this.connection.apiToken}`);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
    return rateLimiter.execute(async () => {
      const url = `${this.connection.instanceUrl}/rest/api/${JIRA_API_VERSION}${endpoint}`;
      
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              'Authorization': `Basic ${this.getAuth()}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });

          // Handle rate limiting with retry
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
            if (attempt < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
            throw new Error('Rate limit exceeded. Please wait before trying again.');
          }

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Authentication failed. Please check your credentials.');
            }
            if (response.status === 403) {
              throw new Error('Access forbidden. Please check your permissions.');
            }
            const errorText = await response.text();
            throw new Error(`JIRA API error: ${response.status} ${response.statusText}. ${errorText}`);
          }

          return response.json();
        } catch (error: any) {
          if (attempt === retries - 1) throw error;
          // Exponential backoff for network errors
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
      throw new Error('Request failed after retries');
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('/myself');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getFilters(): Promise<JiraFilter[]> {
    // JIRA API returns filters in pages, but typically user has < 100 filters
    const response = await this.request<{ values: any[] }>('/filter/search?maxResults=100');
    
    return response.values.map(filter => ({
      id: filter.id,
      name: filter.name,
      jql: filter.jql,
      description: filter.description,
      owner: filter.owner?.displayName || filter.owner?.accountId || '',
      favorite: filter.favourite || false,
    }));
  }

  async getFilterById(filterId: string): Promise<JiraFilter> {
    const filter = await this.request<any>(`/filter/${filterId}`);
    
    return {
      id: filter.id,
      name: filter.name,
      jql: filter.jql,
      description: filter.description,
      owner: filter.owner?.displayName || filter.owner?.accountId || '',
      favorite: filter.favourite || false,
    };
  }

  async searchJQL(jql: string, maxResults: number = 100): Promise<JiraTicket[]> {
    // Basic JQL validation
    if (!jql.trim()) {
      throw new Error('JQL query cannot be empty');
    }
    if (jql.length > 10000) {
      throw new Error('JQL query is too long (max 10000 characters)');
    }
    const allTickets: JiraTicket[] = [];
    let startAt = 0;
    const fields = 'summary,description,status,priority,assignee,reporter,issuetype,project,labels,components,created,updated,duedate,resolution';

    // Handle pagination - JIRA returns max 100 per request
    while (allTickets.length < maxResults) {
      const params = new URLSearchParams({
        jql,
        startAt: startAt.toString(),
        maxResults: Math.min(MAX_RESULTS_PER_PAGE, maxResults - allTickets.length).toString(),
        fields,
      });

      const response = await this.request<{ issues: any[]; total: number; maxResults: number }>(`/search?${params.toString()}`);
      
      const tickets = response.issues.map(issue => this.mapIssue(issue));
      allTickets.push(...tickets);

      // Check if we've got all results
      if (tickets.length < MAX_RESULTS_PER_PAGE || allTickets.length >= response.total || allTickets.length >= maxResults) {
        break;
      }

      startAt += tickets.length;
    }

    return allTickets.slice(0, maxResults);
  }

  private mapIssue(issue: any): JiraTicket {
    const baseUrl = this.connection.instanceUrl;
    
    return {
      key: issue.key,
      id: issue.id,
      summary: issue.fields.summary || '',
      description: issue.fields.description,
      status: {
        id: issue.fields.status.id,
        name: issue.fields.status.name,
        category: issue.fields.status.statusCategory?.key || 'todo',
      },
      priority: {
        id: issue.fields.priority?.id || '',
        name: issue.fields.priority?.name || 'Medium',
        iconUrl: issue.fields.priority?.iconUrl,
      },
      assignee: issue.fields.assignee ? {
        accountId: issue.fields.assignee.accountId,
        displayName: issue.fields.assignee.displayName,
        avatarUrl: issue.fields.assignee.avatarUrls?.['48x48'],
      } : undefined,
      reporter: {
        accountId: issue.fields.reporter.accountId,
        displayName: issue.fields.reporter.displayName,
        avatarUrl: issue.fields.reporter.avatarUrls?.['48x48'],
      },
      issueType: {
        id: issue.fields.issuetype.id,
        name: issue.fields.issuetype.name,
        iconUrl: issue.fields.issuetype.iconUrl,
      },
      project: {
        id: issue.fields.project.id,
        key: issue.fields.project.key,
        name: issue.fields.project.name,
      },
      labels: issue.fields.labels || [],
      components: (issue.fields.components || []).map((c: any) => ({
        id: c.id,
        name: c.name,
      })),
      created: new Date(issue.fields.created),
      updated: new Date(issue.fields.updated),
      dueDate: issue.fields.duedate ? new Date(issue.fields.duedate) : undefined,
      resolution: issue.fields.resolution?.name,
      url: `${baseUrl}/browse/${issue.key}`,
    };
  }
}

