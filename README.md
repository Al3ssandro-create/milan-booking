# Milan Sofa Booking

Piccolo sito React/TypeScript per gestire prenotazioni di un divano-letto condiviso a Milano (). Pensato per amici e famiglia: calendario, prevenzione conflitti, accesso con password semplice e salvataggio diretto su Google Sheets tramite SheetDB.

Caratteristiche principali
- Calendario mensile con selezione intervalli
- Prevenzione di sovrapposizioni tra prenotazioni
- Salvataggio persistente su Google Sheets via SheetDB
- Autenticazione leggera tramite password (localStorage)
- Guestbook con possibilità di cancellare prenotazioni future

Stack tecnico
- Vite + React (TypeScript)
- Tailwind CSS
- SheetDB / Google Sheets per persistenza senza backend

Quick start

1. Installa dipendenze

```bash
npm install
```

2. Aggiungi variabili d'ambiente

Copiati `.env.example` (se presente) oppure crea `.env` nella root con:

```
VITE_SHEETDB_API=https://sheetdb.io/api/v1/<your-sheet-id>
```

3. Avvia in sviluppo

```bash
npm run dev
```

Note su Google Sheet / SheetDB
- La Google Sheet deve avere intestazioni (prima riga) corrispondenti ai campi usati dall'app: `id`, `guestName`, `checkIn`, `checkOut`, `note`, `status`, `createdAt`.
- L'app invia anche `checkInDisplay` e `checkOutDisplay` (formato leggibile) così la sheet è più user-friendly.
- SheetDB a volte ritorna date come seriali (es. `46017`). L'hook `useBookings` normalizza questi seriali in `YYYY-MM-DD`.

Testing & verifica
- Apri l'app, seleziona un intervallo nel calendario, inserisci il nome e salva.
- Verifica nella Console del browser eventuali errori (F12 → Console).
- Controlla la Google Sheet per vedere la nuova riga con campi leggibili.

Contributi e sviluppo
- File principali: `src/hooks/useBookings.ts`, `src/components/Calendar/MonthView.tsx`, `src/components/Calendar/BookingForm.tsx`, `src/components/Sections/Guestbook.tsx`.
- Per richieste o bug apri un issue nel repository GitHub.

Licenza
- Questo repository non include una licenza specifica (aggiungi una `LICENSE` se necessario).

