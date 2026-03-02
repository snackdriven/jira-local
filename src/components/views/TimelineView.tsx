import { formatDate } from '../../lib/utils';
import { PRIORITY_COLORS } from '../../types';
import type { JiraTicket } from '../../types';
import { ExternalLink } from 'lucide-react';

interface TimelineViewProps {
  tickets: JiraTicket[];
  onTicketClick: (ticket: JiraTicket) => void;
}

export function TimelineView({ tickets, onTicketClick }: TimelineViewProps) {
  // Group tickets by date (updated date)
  const ticketsByDate = tickets.reduce((acc, ticket) => {
    const dateKey = formatDate(ticket.updated);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(ticket);
    return acc;
  }, {} as Record<string, JiraTicket[]>);

  const dates = Object.keys(ticketsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="space-y-6">
      {dates.map(date => (
        <div key={date}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sticky top-0 bg-gray-50 dark:bg-gray-950 py-2">
            {date}
          </h3>
          <div className="space-y-2 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            {ticketsByDate[date].map(ticket => (
              <div
                key={ticket.id}
                onClick={() => onTicketClick(ticket)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onTicketClick(ticket);
                  }
                }}
                tabIndex={0}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {ticket.key}
                      </span>
                      <span className={`px-1.5 py-0.5 text-xs rounded border ${PRIORITY_COLORS[ticket.priority.name] || PRIORITY_COLORS['Medium']}`}>
                        {ticket.priority.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {ticket.status.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {ticket.summary}
                    </p>
                    {ticket.assignee && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {ticket.assignee.displayName}
                      </p>
                    )}
                  </div>
                  <a
                    href={ticket.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <ExternalLink className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

