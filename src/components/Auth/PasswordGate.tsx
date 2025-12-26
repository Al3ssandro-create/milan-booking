import { useState } from 'react';

interface PasswordGateProps {
  onLogin: (phrase: string) => boolean;
}

export function PasswordGate({ onLogin }: PasswordGateProps) {
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(phrase);
    if (!success) {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="max-w-md w-full text-center">
        {/* Logo & Title */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#1A1A1A] mb-3 sm:mb-4">
            Via Magellano 3
          </h1>
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#1A1A1A]/50">
            Milano
          </p>
        </div>

        {/* Intro Text */}
        <p className="font-serif text-lg sm:text-xl text-[#1A1A1A]/70 mb-8 sm:mb-12 leading-relaxed">
          Il divano-letto più ambito di Milano.<br />
          <span className="italic">Solo per amici & famiglia.</span>
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-[#1A1A1A]/50 mb-2 sm:mb-3">
              Frase segreta
            </label>
            <input
              type="text"
              value={phrase}
              onChange={(e) => {
                setPhrase(e.target.value);
                setError(false);
              }}
              placeholder="Sussurra la parola magica..."
              className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 text-center font-serif text-base sm:text-lg
                transition-all duration-200 outline-none
                ${error 
                  ? 'border-[#C4573A] text-[#C4573A]' 
                  : 'border-[#1A1A1A]/20 focus:border-[#1A1A1A]'
                }
                ${isShaking ? 'animate-shake' : ''}
              `}
            />
            {error && (
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#C4573A] italic">
                Mmh, non è quella giusta...
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 sm:py-4 bg-[#1A1A1A] text-white text-xs sm:text-sm uppercase tracking-widest
              hover:bg-[#C4573A] transition-colors duration-300"
          >
            Entra
          </button>
        </form>

        {/* Hint */}
        <p className="mt-8 sm:mt-12 text-[10px] sm:text-xs text-[#1A1A1A]/30">
          Suggerimento: pensa al comfort estremo 🛋️
        </p>
      </div>
    </div>
  );
}
