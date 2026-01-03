import { useState, useEffect, useCallback } from 'react';
import type { Booking, BookingFormData } from '../types';

const SHEETDB_API = (import.meta.env.VITE_SHEETDB_API as string) || '';

if (!SHEETDB_API) {
  console.warn('VITE_SHEETDB_API is not set. Please add it to your .env file.');
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SHEETDB_API);
      if (!response.ok) throw new Error('Failed to load bookings');
      const data = await response.json();
      // SheetDB returns array directly. Normalize date fields to YYYY-MM-DD.
      // Handles: Italian format "3 gen 2026", serial numbers, ISO dates
      const italianMonths: Record<string, number> = {
        'gen': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mag': 4, 'giu': 5,
        'lug': 6, 'ago': 7, 'set': 8, 'ott': 9, 'nov': 10, 'dic': 11
      };
      
      const normalizeDate = (val: any): string => {
        if (val == null) return '';
        const str = String(val).trim();
        
        // Already YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
        
        // Italian format: "3 gen 2026" or "15 dic 2025"
        const italianMatch = str.match(/^(\d{1,2})\s+([a-z]{3})\s+(\d{4})$/i);
        if (italianMatch) {
          const day = parseInt(italianMatch[1], 10);
          const monthStr = italianMatch[2].toLowerCase();
          const year = parseInt(italianMatch[3], 10);
          const month = italianMonths[monthStr];
          if (month !== undefined) {
            return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          }
        }
        
        // Numeric serial (Excel/Sheets epoch)
        if (/^\d+$/.test(str)) {
          const serial = Number(str);
          const ms = (serial - 25569) * 86400 * 1000;
          const d = new Date(ms);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${dd}`;
        }
        
        // Fallback: try parse as date
        try {
          const parsed = new Date(str);
          if (!isNaN(parsed.getTime())) {
            const y = parsed.getFullYear();
            const m = String(parsed.getMonth() + 1).padStart(2, '0');
            const dd = String(parsed.getDate()).padStart(2, '0');
            return `${y}-${m}-${dd}`;
          }
        } catch {
          // ignore
        }
        return str;
      };
      const normalized = (data || []).map((b: any) => ({
        ...b,
        checkIn: normalizeDate(b.checkIn),
        checkOut: normalizeDate(b.checkOut),
      }));
      setBookings(normalized);
      console.log(bookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const checkOverlap = useCallback(
    (checkIn: string, checkOut: string, excludeId?: string): Booking | null => {
      const newStart = new Date(checkIn);
      const newEnd = new Date(checkOut);

      for (const booking of bookings) {
        if (excludeId && booking.id === excludeId) continue;
        
        const existingStart = new Date(booking.checkIn);
        const existingEnd = new Date(booking.checkOut);

        // Check if ranges overlap
        if (newStart < existingEnd && newEnd > existingStart) {
          return booking;
        }
      }
      return null;
    },
    [bookings]
  );

  const deleteBooking = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // SheetDB: DELETE by id (assume colonna id)
        const url = `${SHEETDB_API}/id/${id}`;
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('SheetDB delete error:', response.status, errorText);
          throw new Error(`Errore ${response.status}`);
        }
        setBookings((prev) => prev.filter((b) => b.id !== id));
        return { success: true };
      } catch (err) {
        console.error('Delete booking error:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Errore nella cancellazione' };
      }
    },
    []
  );

  const addBooking = useCallback(
    async (formData: BookingFormData): Promise<{ success: boolean; error?: string; booking?: Booking }> => {
      // Validate dates
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      
      if (checkOut <= checkIn) {
        return { success: false, error: 'Check-out deve essere dopo check-in' };
      }

      // Check for overlaps
      const overlap = checkOverlap(formData.checkIn, formData.checkOut);
      if (overlap) {
        return {
          success: false,
          error: `Date in conflitto con la prenotazione di ${overlap.guestName} (${overlap.checkIn} - ${overlap.checkOut})`,
        };
      }

      // Create new booking
      const newBooking: Booking = {
        id: Date.now().toString(),
        guestName: formData.guestName,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        note: formData.note || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      try {
        // Dates are already in YYYY-MM-DD format, send as-is
        const payload = { data: [newBooking] };
        console.log('Sending to SheetDB:', JSON.stringify(payload, null, 2));
        
        const response = await fetch(SHEETDB_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        console.log(newBooking);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('SheetDB error:', response.status, errorText);
          throw new Error(`Errore ${response.status}`);
        }

        // Update local state
        setBookings((prev) => [...prev, newBooking]);
        return { success: true, booking: newBooking };
      } catch (err) {
        console.error('Booking save error:', err);
        return { 
          success: false, 
          error: err instanceof Error ? err.message : 'Errore nel salvataggio della prenotazione' 
        };
      }
    },
    [checkOverlap]
  );

  const getBookingsForDate = useCallback(
    (date: Date): Booking[] => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      return bookings.filter((booking) => {
        return dateStr >= booking.checkIn && dateStr < booking.checkOut;
      });
    },
    [bookings]
  );

  const getBookingsForMonth = useCallback(
    (year: number, month: number): Booking[] => {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      return bookings.filter((booking) => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        return checkIn <= monthEnd && checkOut >= monthStart;
      });
    },
    [bookings]
  );

  return {
    bookings,
    isLoading,
    error,
    addBooking,
    deleteBooking,
    checkOverlap,
    getBookingsForDate,
    getBookingsForMonth,
  };
}
