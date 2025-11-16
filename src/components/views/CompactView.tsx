import { TicketCard } from './TicketCard';
import type { JiraTicket } from '../../types';

interface CompactViewProps {
  tickets: JiraTicket[];
  onTicketClick: (ticket: JiraTicket) => void;
}

export function CompactView({ tickets, onTicketClick }: CompactViewProps) {
  return (
    <div className="space-y-1">
      {tickets.map(ticket => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onTicketClick={onTicketClick}
          variant="compact"
        />
      ))}
    </div>
  );
}

