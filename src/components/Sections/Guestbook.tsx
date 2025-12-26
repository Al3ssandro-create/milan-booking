import type { Booking } from '../../types';
import { useState } from 'react';

interface GuestbookProps {
  bookings: Booking[];
  onDeleteBooking?: (id: string) => Promise<void>;
}

export function Guestbook({ bookings, onDeleteBooking }: GuestbookProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Sort by check-in date, most recent first, show only past or confirmed
  const pastBookings = bookings
    .filter((b) => b.status === 'confirmed' || new Date(b.checkOut) < new Date())
    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
  // Future bookings (for delete)
  const futureBookings = bookings
    .filter((b) => new Date(b.checkIn) >= new Date())
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  const formatDateRange = (checkIn: string, checkOut: string): string => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('it-IT', opts)} — ${end.toLocaleDateString('it-IT', opts)}`;
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] mb-3 sm:mb-4">
          Guestbook
        </h2>
        <p className="text-sm sm:text-base text-[#1A1A1A]/50">
          Chi è passato di qui (e ha dormito su quel divano)
        </p>
      </div>

      {pastBookings.length === 0 ? (
        <div className="text-center py-8 sm:py-12 border border-dashed border-[#1A1A1A]/20">
          <p className="text-sm sm:text-base text-[#1A1A1A]/40 italic">
            Nessun ospite ancora... potresti essere il primo!
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {pastBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 sm:p-6 bg-white border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20
                transition-colors duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#1A1A1A]">
                    {booking.guestName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1A1A1A]/50 mt-0.5 sm:mt-1">
                    {formatDateRange(booking.checkIn, booking.checkOut)}
                  </p>
                </div>
                {booking.note && (
                  <div className="sm:text-right">
                    <p className="text-xs sm:text-sm text-[#1A1A1A]/60 italic max-w-xs">
                      "{booking.note}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sezione cancellazione future bookings */}
      {futureBookings.length > 0 && onDeleteBooking && (
        <div className="mt-10 sm:mt-14">
          <h3 className="font-serif text-lg sm:text-xl text-[#1A1A1A] mb-2">Prenotazioni future</h3>
          <div className="space-y-3 sm:space-y-4">
            {futureBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 sm:p-6 bg-[#FAF9F7] border border-[#C4573A]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
              >
                <div>
                  <span className="font-serif text-[#C4573A]">{booking.guestName}</span>
                  <span className="ml-2 text-xs text-[#1A1A1A]/50">{formatDateRange(booking.checkIn, booking.checkOut)}</span>
                  {booking.note && (
                    <span className="ml-2 text-xs text-[#1A1A1A]/40 italic">"{booking.note}"</span>
                  )}
                </div>
                <button
                  className="text-xs px-3 py-1 rounded bg-[#C4573A] text-white hover:bg-[#a33e25] transition disabled:opacity-60"
                  disabled={deletingId === booking.id}
                  onClick={async () => {
                    setDeletingId(booking.id);
                    await onDeleteBooking(booking.id);
                    setDeletingId(null);
                  }}
                >
                  {deletingId === booking.id ? 'Cancellazione...' : 'Cancella'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 sm:mt-12 text-center">
        <p className="text-[10px] sm:text-xs text-[#1A1A1A]/30">
          Le recensioni su Tripadvisor? No grazie, ci basta il passaparola.
        </p>
      </div>
    </section>
  );
}
