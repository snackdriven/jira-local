import { useState } from 'react';
import { formatDate } from '../../lib/utils';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../types';
import type { JiraTicket } from '../../types';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface TableViewProps {
  tickets: JiraTicket[];
  onTicketClick: (ticket: JiraTicket) => void;
}

type SortField = 'key' | 'summary' | 'status' | 'priority' | 'assignee' | 'updated';
type SortDirection = 'asc' | 'desc';

export function TableView({ tickets, onTicketClick }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'key':
        aValue = a.key;
        bValue = b.key;
        break;
      case 'summary':
        aValue = a.summary;
        bValue = b.summary;
        break;
      case 'status':
        aValue = a.status.name;
        bValue = b.status.name;
        break;
      case 'priority':
        aValue = a.priority.name;
        bValue = b.priority.name;
        break;
      case 'assignee':
        aValue = a.assignee?.displayName || '';
        bValue = b.assignee?.displayName || '';
        break;
      case 'updated':
        aValue = a.updated.getTime();
        bValue = b.updated.getTime();
        break;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-primary-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary-600" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <button
                onClick={() => handleSort('key')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                Key
                <SortIcon field="key" />
              </button>
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <button
                onClick={() => handleSort('summary')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                Summary
                <SortIcon field="summary" />
              </button>
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <button
                onClick={() => handleSort('status')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                Status
                <SortIcon field="status" />
              </button>
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <button
                onClick={() => handleSort('priority')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                Priority
                <SortIcon field="priority" />
              </button>
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <button
                onClick={() => handleSort('assignee')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                Assignee
                <SortIcon field="assignee" />
              </button>
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <button
                onClick={() => handleSort('updated')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                Updated
                <SortIcon field="updated" />
              </button>
            </th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {sortedTickets.map(ticket => (
            <tr
              key={ticket.id}
              onClick={() => onTicketClick(ticket)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTicketClick(ticket);
                }
              }}
              tabIndex={0}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <td className="p-3 font-medium text-gray-900 dark:text-white">{ticket.key}</td>
              <td className="p-3 text-gray-900 dark:text-white">{ticket.summary}</td>
              <td className="p-3">
                <span className={`px-2 py-1 text-xs rounded border ${STATUS_COLORS[ticket.status.name] || STATUS_COLORS['To Do']}`}>
                  {ticket.status.name}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 text-xs rounded border ${PRIORITY_COLORS[ticket.priority.name] || PRIORITY_COLORS['Medium']}`}>
                  {ticket.priority.name}
                </span>
              </td>
              <td className="p-3 text-gray-600 dark:text-gray-400">
                {ticket.assignee?.displayName || 'Unassigned'}
              </td>
              <td className="p-3 text-gray-600 dark:text-gray-400 text-sm">
                {formatDate(ticket.updated)}
              </td>
              <td className="p-3">
                <a
                  href={ticket.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

