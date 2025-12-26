export function Hero() {
  return (
    <section className="py-10 sm:py-16 md:py-24 text-center px-2">
      <div className="max-w-3xl mx-auto">
        {/* Tagline */}
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#C4573A] mb-4 sm:mb-6">
          Esclusivo • Limitato • Gratuito
        </p>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[#1A1A1A] leading-tight mb-6 sm:mb-8">
          Il divano-letto<br />
          <span className="italic">più ambito</span><br />
          di Milano
        </h1>

        {/* Manifesto */}
        <div className="max-w-xl mx-auto space-y-3 sm:space-y-4 text-sm sm:text-base text-[#1A1A1A]/70 leading-relaxed">
          <p>
            Benvenuto in Via Magellano 3 — la residenza ufficiale (e non ufficiale) 
            di Marta, Carola & Franci.
          </p>
          <p>
            Qui non troverai <span className="line-through">Superhost badges</span>, 
            <span className="line-through"> recensioni a 5 stelle</span>, o 
            <span className="line-through"> fee di pulizia nascoste</span>.
          </p>
          <p className="font-serif text-base sm:text-lg italic text-[#1A1A1A]">
            Solo un divano che ha visto cose. E un frigo che è sempre pieno.
          </p>
        </div>

        {/* CTA Arrow */}
        <div className="mt-8 sm:mt-12 animate-bounce">
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#1A1A1A]/30" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
