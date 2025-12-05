import { useState, useEffect } from 'react';
import { ticketService } from '../../../services/api';
import { TicketReasonDto } from '../../models/models';

export const useTicketReasons = () => {
  const [ticketReasons, setTicketReasons] = useState<TicketReasonDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTicketReasons = async () => {
    setLoading(true)
    try {
      const res = await ticketService.getAllTicketReasons();
      setTicketReasons(res.reasons);
    } catch (error) {
      console.error("Error fetching ticket reasons:", error);
    }
      finally {
            setLoading(false);
        }
  };

  useEffect(() => {
    fetchTicketReasons();
  }, []);

  return { ticketReasons, fetchTicketReasons,loading };
};
