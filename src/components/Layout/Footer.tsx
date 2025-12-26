interface FooterProps {
  onLogout: () => void;
}

export function Footer({ onLogout }: FooterProps) {
  return (
    <footer className="border-t border-[#1A1A1A]/10 bg-[#FAF9F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <p className="font-serif text-base sm:text-lg text-[#1A1A1A]">
              Casa di Marta, Carola & Franci
            </p>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/50 mt-1">
              Via Magellano 3, Milano
            </p>
          </div>
          
          <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6">
            <p className="text-[10px] sm:text-xs text-[#1A1A1A]/40 italic hidden sm:block">
              Solo amici & famiglia
            </p>
            <button
              onClick={onLogout}
              className="text-xs text-[#1A1A1A]/40 hover:text-[#C4573A] transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
