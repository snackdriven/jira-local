import { formatDate } from '../../lib/utils';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../types';
import type { JiraTicket } from '../../types';
import { ExternalLink } from 'lucide-react';
import { memo } from 'react';

interface TicketCardProps {
  ticket: JiraTicket;
  onTicketClick: (ticket: JiraTicket) => void;
  variant?: 'default' | 'compact' | 'board';
}

export const TicketCard = memo(function TicketCard({ 
  ticket, 
  onTicketClick, 
  variant = 'default' 
}: TicketCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTicketClick(ticket);
    }
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onTicketClick(ticket)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-3"
      >
        <span className={`px-1.5 py-0.5 text-xs rounded border flex-shrink-0 ${PRIORITY_COLORS[ticket.priority.name] || PRIORITY_COLORS['Medium']}`}>
          {ticket.priority.name}
        </span>
        <span className="font-medium text-sm text-gray-900 dark:text-white flex-shrink-0">
          {ticket.key}
        </span>
        <span className="text-sm text-gray-900 dark:text-white truncate flex-1">
          {ticket.summary}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
          {formatDate(ticket.updated)}
        </span>
        <a
          href={ticket.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-shrink-0"
        >
          <ExternalLink className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        </a>
      </div>
    );
  }

  if (variant === 'board') {
    return (
      <div
        onClick={() => onTicketClick(ticket)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-gray-900 dark:text-white">
                {ticket.key}
              </span>
              <span className={`px-1.5 py-0.5 text-xs rounded border ${PRIORITY_COLORS[ticket.priority.name] || PRIORITY_COLORS['Medium']}`}>
                {ticket.priority.name}
              </span>
            </div>
            <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
              {ticket.summary}
            </p>
          </div>
          <a
            href={ticket.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ExternalLink className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          </a>
        </div>
        {ticket.assignee && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {ticket.assignee.displayName}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      onClick={() => onTicketClick(ticket)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {ticket.key}
            </h3>
            <span className={`px-2 py-1 text-xs rounded border ${STATUS_COLORS[ticket.status.name] || STATUS_COLORS['To Do']}`}>
              {ticket.status.name}
            </span>
            <span className={`px-2 py-1 text-xs rounded border ${PRIORITY_COLORS[ticket.priority.name] || PRIORITY_COLORS['Medium']}`}>
              {ticket.priority.name}
            </span>
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-2">
            {ticket.summary}
          </p>
        </div>
        <a
          href={ticket.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </a>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>Project: {ticket.project.key}</span>
        {ticket.assignee && (
          <span>Assignee: {ticket.assignee.displayName}</span>
        )}
        <span>Updated: {formatDate(ticket.updated)}</span>
      </div>
      {ticket.labels.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {ticket.labels.map(label => (
            <span
              key={label}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

