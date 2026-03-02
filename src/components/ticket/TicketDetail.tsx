import { formatDateTime } from '../../lib/utils';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../types';
import type { JiraTicket } from '../../types';
import { X, ExternalLink, User, Calendar, Tag, Folder } from 'lucide-react';

interface TicketDetailProps {
  ticket: JiraTicket;
  onClose: () => void;
}

export function TicketDetail({ ticket, onClose }: TicketDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {ticket.key}
            </h2>
            <span className={`px-2 py-1 text-xs rounded border ${STATUS_COLORS[ticket.status.name] || STATUS_COLORS['To Do']}`}>
              {ticket.status.name}
            </span>
            <span className={`px-2 py-1 text-xs rounded border ${PRIORITY_COLORS[ticket.priority.name] || PRIORITY_COLORS['Medium']}`}>
              {ticket.priority.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={ticket.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Open in JIRA"
            >
              <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </a>
            <button
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onClose();
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {ticket.summary}
            </h3>
            {ticket.description && (
              <div className="prose dark:prose-invert max-w-none mt-4">
                <div
                  dangerouslySetInnerHTML={{ __html: ticket.description }}
                  className="text-gray-700 dark:text-gray-300"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Project</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {ticket.project.key} - {ticket.project.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Issue Type</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {ticket.issueType.name}
                </div>
              </div>
            </div>

            {ticket.assignee && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Assignee</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {ticket.assignee.displayName}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reporter</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {ticket.reporter.displayName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Created</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDateTime(ticket.created)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Updated</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDateTime(ticket.updated)}
                </div>
              </div>
            </div>

            {ticket.dueDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Due Date</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDateTime(ticket.dueDate)}
                  </div>
                </div>
              </div>
            )}

            {ticket.resolution && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Resolution</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {ticket.resolution}
                  </div>
                </div>
              </div>
            )}
          </div>

          {ticket.labels.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Labels
              </div>
              <div className="flex flex-wrap gap-2">
                {ticket.labels.map(label => (
                  <span
                    key={label}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ticket.components.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Components
              </div>
              <div className="flex flex-wrap gap-2">
                {ticket.components.map(component => (
                  <span
                    key={component.id}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                  >
                    {component.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

