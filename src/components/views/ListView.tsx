import { TicketCard } from './TicketCard';
import type { JiraTicket } from '../../types';

interface ListViewProps {
  tickets: JiraTicket[];
  onTicketClick: (ticket: JiraTicket) => void;
}

export function ListView({ tickets, onTicketClick }: ListViewProps) {
  return (
    <div className="space-y-3">
      {tickets.map(ticket => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onTicketClick={onTicketClick}
          variant="default"
        />
      ))}
    </div>
  );
}

