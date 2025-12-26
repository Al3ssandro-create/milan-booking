export interface Booking {
  id: string;
  guestName: string;
  checkIn: string; // ISO date string YYYY-MM-DD
  checkOut: string; // ISO date string YYYY-MM-DD
  note?: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface BookingFormData {
  guestName: string;
  checkIn: string;
  checkOut: string;
  note?: string;
}

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
};

export type TabId = 'calendar' | 'gallery' | 'rules' | 'guestbook';
