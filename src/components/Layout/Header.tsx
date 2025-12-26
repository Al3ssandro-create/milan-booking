import type { TabId } from '../../types';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; shortLabel: string }[] = [
  { id: 'calendar', label: 'Prenota', shortLabel: '📅' },
  { id: 'gallery', label: 'Il Divano', shortLabel: '🛋️' },
  { id: 'rules', label: 'Regole', shortLabel: '📋' },
  { id: 'guestbook', label: 'Guestbook', shortLabel: '📖' },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F7]/95 backdrop-blur-sm border-b border-[#1A1A1A]/10">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="font-serif text-lg sm:text-2xl tracking-tight text-[#1A1A1A] truncate">
              Via Magellano 3
            </h1>
            <span className="hidden sm:inline text-xs uppercase tracking-widest text-[#1A1A1A]/50">
              Milano
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex gap-0.5 sm:gap-1 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm tracking-wide transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-[#C4573A] border-b-2 border-[#C4573A]'
                    : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A] border-b-2 border-transparent'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-base">{tab.shortLabel}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
