import { useState } from 'react';
import type { Ticket } from '../../types';
import { ThreadList } from '../ThreadList/ThreadList';
import { ThreadDetail } from '../ThreadDetail/ThreadDetail';
import { NewThreadForm } from '../NewThreadForm/NewThreadForm';
import styles from './AsqioSupport.module.css';

type View = { type: 'list' } | { type: 'detail'; ticketId: string } | { type: 'new' };

export interface AsqioSupportProps {
  context?: Record<string, unknown>;
  className?: string;
}

export function AsqioSupport({ context, className }: AsqioSupportProps) {
  const [view, setView] = useState<View>({ type: 'list' });

  const handleSelectTicket = (ticket: Ticket) => {
    setView({ type: 'detail', ticketId: ticket.id });
  };

  const handleNewThread = () => {
    setView({ type: 'new' });
  };

  const handleBack = () => {
    setView({ type: 'list' });
  };

  const handleCreated = (ticket: Ticket) => {
    setView({ type: 'detail', ticketId: ticket.id });
  };

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      {view.type === 'list' && (
        <ThreadList
          onSelectTicket={handleSelectTicket}
          onNewThread={handleNewThread}
        />
      )}
      {view.type === 'detail' && (
        <ThreadDetail ticketId={view.ticketId} onBack={handleBack} />
      )}
      {view.type === 'new' && (
        <NewThreadForm
          context={context}
          onCreated={handleCreated}
          onCancel={handleBack}
        />
      )}
    </div>
  );
}
