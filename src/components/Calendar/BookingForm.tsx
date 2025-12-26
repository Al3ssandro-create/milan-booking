import { useState } from 'react';
import type { Booking, BookingFormData } from '../../types';

interface BookingFormProps {
  selectedRange: { start: Date | null; end: Date | null };
  onSubmit: (data: BookingFormData) => Promise<{ success: boolean; error?: string; booking?: Booking }>;
  onClearSelection: () => void;
}

export function BookingForm({ selectedRange, onSubmit, onClearSelection }: BookingFormProps) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSelectionKey, setLastSelectionKey] = useState('');
  
  // Derive a key from selection to detect changes
  const selectionKey = `${selectedRange.start?.getTime()}-${selectedRange.end?.getTime()}`;
  if (selectionKey !== lastSelectionKey) {
    setLastSelectionKey(selectionKey);
    if (error !== null) setError(null);
    if (success !== null) setSuccess(null);
  }

  const formatDate = (date: Date | null): string => {
    if (!date) return '—';
    return date.toLocaleDateString('it-IT', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatDateISO = (date: Date): string => {
    // Use local date components to avoid UTC offset shifting the day
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRange.start || !selectedRange.end) {
      setError('Seleziona check-in e check-out dal calendario');
      return;
    }

    if (!name.trim()) {
      setError('Inserisci il tuo nome');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await onSubmit({
        guestName: name.trim(),
        checkIn: formatDateISO(selectedRange.start),
        checkOut: formatDateISO(selectedRange.end),
        note: note.trim() || undefined,
      });

      if (result.success && result.booking) {
        setSuccess(result.booking);
        setName('');
        setNote('');
      } else {
        setError(result.error || 'Errore nella prenotazione');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSelection = selectedRange.start !== null;

  if (success) {
    return (
      <div className="bg-white border border-[#1A1A1A]/10 p-4 sm:p-6 md:p-8">
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] mb-2">
            Prenotato! 🛋️
          </h3>
          <p className="text-[#1A1A1A]/60 text-sm sm:text-base mb-6">
            {success.guestName}<br />
            <span className="text-xs sm:text-sm">{success.checkIn} → {success.checkOut}</span>
          </p>

          {success.note && (
            <p className="text-sm text-[#1A1A1A]/50 italic mb-6">
              "{success.note}"
            </p>
          )}

          <button
            onClick={() => {
              setSuccess(null);
              onClearSelection();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#1A1A1A] text-white text-sm uppercase tracking-widest
              hover:bg-[#C4573A] transition-colors"
          >
            Nuova prenotazione
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#1A1A1A]/10 p-4 sm:p-6 md:p-8">
      <h3 className="font-serif text-lg sm:text-xl text-[#1A1A1A] mb-4 sm:mb-6">
        Prenota il divano
      </h3>

      {/* Selected Dates Display */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#1A1A1A]/50 mb-2">
            Check-in
          </label>
          <div className={`p-3 border ${hasSelection ? 'border-[#C4573A] bg-[#C4573A]/5' : 'border-[#1A1A1A]/20'}`}>
            <span className={`font-serif ${hasSelection ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/30'}`}>
              {formatDate(selectedRange.start)}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#1A1A1A]/50 mb-2">
            Check-out
          </label>
          <div className={`p-3 border ${selectedRange.end ? 'border-[#C4573A] bg-[#C4573A]/5' : 'border-[#1A1A1A]/20'}`}>
            <span className={`font-serif ${selectedRange.end ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/30'}`}>
              {formatDate(selectedRange.end)}
            </span>
          </div>
        </div>
      </div>

      {!hasSelection && (
        <p className="text-sm text-[#1A1A1A]/50 italic mb-6">
          ← Seleziona le date dal calendario (clicca check-in, poi check-out)
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#1A1A1A]/50 mb-2">
            Il tuo nome *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Come ti chiami?"
            className="w-full px-4 py-3 border border-[#1A1A1A]/20 
              focus:border-[#1A1A1A] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#1A1A1A]/50 mb-2">
            Note (opzionale)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Motivo della visita, orario arrivo, richieste speciali..."
            rows={3}
            className="w-full px-4 py-3 border border-[#1A1A1A]/20 
              focus:border-[#1A1A1A] outline-none transition-colors resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-[#C4573A]/10 border border-[#C4573A]/30">
            <p className="text-sm text-[#C4573A]">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
          {hasSelection && !isSubmitting && (
            <button
              type="button"
              onClick={onClearSelection}
              className="px-4 py-3 border border-[#1A1A1A]/20 text-[#1A1A1A]/60
                text-xs sm:text-sm uppercase tracking-widest hover:border-[#1A1A1A] transition-colors
                order-2 sm:order-1"
            >
              Annulla
            </button>
          )}
          <button
            type="submit"
            disabled={!hasSelection || !selectedRange.end || isSubmitting}
            className="flex-1 px-6 py-3 bg-[#1A1A1A] text-white text-xs sm:text-sm uppercase tracking-widest
              hover:bg-[#C4573A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed
              order-1 sm:order-2"
          >
            {isSubmitting ? 'Salvataggio...' : 'Prenota'}
          </button>
        </div>
      </form>
    </div>
  );
}
