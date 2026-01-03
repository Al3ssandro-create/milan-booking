import { useState, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useBookings } from './hooks/useBookings';
import { PasswordGate } from './components/Auth/PasswordGate';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Hero } from './components/Sections/Hero';
import { MonthView } from './components/Calendar/MonthView';
import { BookingForm } from './components/Calendar/BookingForm';
import { Gallery } from './components/Sections/Gallery';
import { Rules } from './components/Sections/Rules';
import { Guestbook } from './components/Sections/Guestbook';
import type { TabId } from './types';
import './App.css';

function App() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const { bookings, isLoading: bookingsLoading, addBooking, deleteBooking, getBookingsForMonth } = useBookings();
  
  const [activeTab, setActiveTab] = useState<TabId>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedRange((prev) => {
      // If no start date, set it
      if (!prev.start) {
        return { start: date, end: null };
      }
      // If start date exists but no end, and new date is same or after start
      if (!prev.end && date >= prev.start) {
        // For single-night: checkOut = day after checkIn
        const checkOut = new Date(date);
        checkOut.setDate(checkOut.getDate() + 1);
        return { start: prev.start, end: checkOut };
      }
      // Otherwise, start a new selection
      return { start: date, end: null };
    });
  }, []);

  const handleClearSelection = () => {
    setSelectedRange({ start: null, end: null });
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="animate-pulse font-serif text-2xl text-[#1A1A1A]/50">
          Caricamento...
        </div>
      </div>
    );
  }

  // Auth gate
  if (!isAuthenticated) {
    return <PasswordGate onLogin={login} />;
  }

  const monthBookings = getBookingsForMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          {/* Hero - always visible */}
          <Hero />
          
          {/* Tab Content */}
          {activeTab === 'calendar' && (
            <section className="pb-10 sm:pb-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  {bookingsLoading ? (
                    <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 text-center">
                      <p className="text-[#1A1A1A]/50 animate-pulse text-sm sm:text-base">
                        Caricamento calendario...
                      </p>
                    </div>
                  ) : (
                    <MonthView
                      year={currentDate.getFullYear()}
                      month={currentDate.getMonth()}
                      bookings={monthBookings}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                      onDateSelect={handleDateSelect}
                      selectedRange={selectedRange}
                    />
                  )}
                </div>
                <div>
                  <BookingForm
                    selectedRange={selectedRange}
                    onSubmit={addBooking}
                    onClearSelection={handleClearSelection}
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'gallery' && <Gallery />}
          {activeTab === 'rules' && <Rules />}
          {activeTab === 'guestbook' && <Guestbook bookings={bookings} onDeleteBooking={async (id) => { await deleteBooking(id); }} />}
        </div>
      </main>

      <Footer onLogout={logout} />
    </div>
  );
}

export default App;
