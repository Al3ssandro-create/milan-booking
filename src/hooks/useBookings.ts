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
      // SheetDB returns array directly. Normalize date fields — Google Sheets may return
      // dates as serial numbers (e.g. "46017"). Convert serial -> JS date -> YYYY-MM-DD.
      const normalizeDate = (val: any): string => {
        if (val == null) return '';
        // already YYYY-MM-DD
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
        // numeric serial in string or number
        if (typeof val === 'number' || (typeof val === 'string' && /^\d+$/.test(val))) {
          const serial = Number(val);
          // Excel/Sheets serial -> JS Date: serial days since 1899-12-30 (Excel epoch)
          const ms = (serial - 25569) * 86400 * 1000;
          const d = new Date(ms);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${dd}`;
        }
        // fallback: try parse ISO
        try {
          const parsed = new Date(String(val));
          if (!isNaN(parsed.getTime())) {
            const y = parsed.getFullYear();
            const m = String(parsed.getMonth() + 1).padStart(2, '0');
            const dd = String(parsed.getDate()).padStart(2, '0');
            return `${y}-${m}-${dd}`;
          }
        } catch {
          // ignore
        }
        return String(val);
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
        // Save to SheetDB - include human-readable display fields so the sheet isn't numeric
        const formatDisplay = (iso: string) => {
          try {
            const d = new Date(iso + 'T00:00:00');
            return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
          } catch {
            return iso;
          }
        };

        const payloadItem: any = {
          ...newBooking,
          checkInDisplay: formatDisplay(newBooking.checkIn),
          checkOutDisplay: formatDisplay(newBooking.checkOut),
        };

        const payload = { data: [payloadItem] };
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
