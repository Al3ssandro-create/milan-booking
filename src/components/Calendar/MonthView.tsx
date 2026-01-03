import { useMemo, useState } from 'react';
import type { Booking } from '../../types';

interface MonthViewProps {
  year: number;
  month: number;
  bookings: Booking[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
  selectedRange: { start: Date | null; end: Date | null };
}

const DAYS_FULL = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const DAYS_SHORT = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

export function MonthView({
  year,
  month,
  bookings,
  onPrevMonth,
  onNextMonth,
  onDateSelect,
  selectedRange,
}: MonthViewProps) {
  const [hoveredBookingId, setHoveredBookingId] = useState<string | null>(null);
  const [touchedBookingId, setTouchedBookingId] = useState<string | null>(null);
  
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Previous month days
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Next month days to fill grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }, [year, month]);

  const asYmd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const getBookingForDate = (date: Date): Booking | null => {
    const dateStr = asYmd(date);
    return bookings.find((b) => dateStr >= b.checkIn && dateStr < b.checkOut) || null;
  };

  // Check if a booking starts on this exact date (checkout is allowed on check-in day of another booking)
  const isBookingStartDate = (date: Date): boolean => {
    const dateStr = asYmd(date);
    return bookings.some((b) => b.checkIn === dateStr);
  };

  // selectedRange.end is the checkout date (day AFTER last night)
  // Visual range should show check-in through last night (end - 1 day)
  const isInSelectedRange = (date: Date): boolean => {
    if (!selectedRange.start) return false;
    const ds = asYmd(date);
    const start = asYmd(selectedRange.start);
    if (!selectedRange.end) return ds === start;
    // Last night = checkout - 1 day
    const lastNight = new Date(selectedRange.end);
    lastNight.setDate(lastNight.getDate() - 1);
    const lastNightStr = asYmd(lastNight);
    return ds >= start && ds <= lastNightStr;
  };

  const isRangeStart = (date: Date): boolean => {
    if (!selectedRange.start) return false;
    return asYmd(selectedRange.start) === asYmd(date);
  };

  const isRangeEnd = (date: Date): boolean => {
    if (!selectedRange.end) return false;
    // Visual end = last night (checkout - 1 day)
    const lastNight = new Date(selectedRange.end);
    lastNight.setDate(lastNight.getDate() - 1);
    return asYmd(lastNight) === asYmd(date);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 p-3 sm:p-6 md:p-8">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <button
          onClick={onPrevMonth}
          className="p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
          aria-label="Mese precedente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#1A1A1A]">
          {MONTHS[month]} {year}
        </h2>
        
        <button
          onClick={onNextMonth}
          className="p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
          aria-label="Mese successivo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers - Short on mobile */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {DAYS_FULL.map((day, i) => (
          <div
            key={day}
            className="text-center text-[10px] sm:text-xs uppercase tracking-widest text-[#1A1A1A]/40 py-1 sm:py-2"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{DAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const booking = getBookingForDate(date);
          const isPast = date < today;
          const isToday = date.toDateString() === today.toDateString();
          const inRange = isInSelectedRange(date);
          const isStart = isRangeStart(date);
          const isEnd = isRangeEnd(date);
          const showName = booking && (hoveredBookingId === booking.id || touchedBookingId === booking.id);

          // Allow selecting checkout on a day where another booking starts
          const canSelectForCheckout = selectedRange.start && !selectedRange.end && 
            date >= selectedRange.start && isBookingStartDate(date);
          const isClickable = !isPast && (!booking || canSelectForCheckout);

          return (
            <button
              key={index}
              onClick={() => isClickable && onDateSelect(date)}
              onMouseEnter={() => booking && setHoveredBookingId(booking.id)}
              onMouseLeave={() => setHoveredBookingId(null)}
              onTouchStart={() => booking && setTouchedBookingId(booking.id)}
              onTouchEnd={() => setTimeout(() => setTouchedBookingId(null), 1500)}
              disabled={isPast && !booking}
              className={`
                relative aspect-square flex items-center justify-center
                text-xs sm:text-sm transition-all duration-150 rounded-sm
                ${!isCurrentMonth ? 'text-[#1A1A1A]/20' : ''}
                ${isPast && isCurrentMonth && !booking ? 'text-[#1A1A1A]/30 cursor-not-allowed' : ''}
                ${isCurrentMonth && !isPast && !booking ? 'hover:bg-[#1A1A1A]/5 cursor-pointer' : ''}
                ${booking && isCurrentMonth ? 'cursor-default' : ''}
                ${booking && isCurrentMonth && booking.status === 'confirmed' ? 'bg-[#1A1A1A] text-white hover:opacity-80' : ''}
                ${booking && isCurrentMonth && booking.status === 'pending' ? 'bg-[#C4573A] text-white hover:opacity-80' : ''}
                ${inRange && !booking ? 'bg-[#C4573A]/10' : ''}
                ${(isStart || isEnd) && !booking ? 'bg-[#C4573A] text-white' : ''}
                ${isToday && !inRange && !booking ? 'ring-2 ring-[#1A1A1A]/20 ring-inset' : ''}
              `}
            >
              {showName ? (
                <span className="text-[9px] sm:text-[10px] font-medium truncate px-0.5 leading-tight">
                  {booking.guestName.split(' ')[0]}
                </span>
              ) : (
                <span className={`${isToday && !isStart && !isEnd && !booking ? 'font-semibold' : ''}`}>
                  {date.getDate()}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#1A1A1A]/10">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#1A1A1A] rounded-sm" />
          <span className="text-[10px] sm:text-xs text-[#1A1A1A]/50">Prenotato</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#C4573A] rounded-sm" />
          <span className="text-[10px] sm:text-xs text-[#1A1A1A]/50">In attesa</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#C4573A]/30 rounded-sm" />
          <span className="text-[10px] sm:text-xs text-[#1A1A1A]/50">Selezione</span>
        </div>
      </div>
      
      <p className="text-[10px] sm:text-xs text-[#1A1A1A]/30 mt-3 sm:mt-4 italic text-center">
        Tocca o passa sopra una data prenotata per vedere il nome
      </p>
    </div>
  );
}
