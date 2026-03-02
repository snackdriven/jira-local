import { TicketCard } from './TicketCard';
import type { JiraTicket } from '../../types';

interface BoardViewProps {
  tickets: JiraTicket[];
  onTicketClick: (ticket: JiraTicket) => void;
}

export function BoardView({ tickets, onTicketClick }: BoardViewProps) {
  // Group tickets by status
  const ticketsByStatus = tickets.reduce((acc, ticket) => {
    const status = ticket.status.name;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(ticket);
    return acc;
  }, {} as Record<string, JiraTicket[]>);

  const statuses = Object.keys(ticketsByStatus);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statuses.map(status => (
        <div
          key={status}
          className="flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {status} ({ticketsByStatus[status].length})
          </h3>
          <div className="space-y-3">
            {ticketsByStatus[status].map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onTicketClick={onTicketClick}
                variant="board"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

