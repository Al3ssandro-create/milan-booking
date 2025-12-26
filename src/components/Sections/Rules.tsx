const rules = [
  {
    emoji: '🔑',
    title: 'Check-in flessibile',
    description: 'Ovvero: scrivici su WhatsApp quando arrivi e speriamo che qualcuno sia in casa.',
  },
  {
    emoji: '🧹',
    title: 'Pulizia "inclusa"',
    description: 'Non c\'è una fee di pulizia, tanto abbiamo Carola.',
  },
  {
    emoji: '🍳',
    title: 'Cucina disponibile',
    description: 'Puoi usarla. Troverai: sale, olio, e ambizioni infrante di meal prep.',
  },
  {
    emoji: '🚿',
    title: 'Un bagno. Uno.',
    description: 'Siamo in tre (più te). Pianifica con saggezza.',
  },
  {
    emoji: '🔊',
    title: 'Silenzio dopo le 24:00',
    description: 'JK. Ma i vicini ci odiano già, quindi magari niente rave.',
  },
  {
    emoji: '🐈',
    title: 'Pet friendly*',
    description: '*Se il pet in questione è tranquillo, educato e non giudica.',
  },
  {
    emoji: '📍',
    title: 'Location',
    description: 'Dergano. Metro gialla a 30 secondi. Aperitivi? Casa o Rolloni.',
  },
  {
    emoji: '💶',
    title: 'Costo',
    description: 'Gratis. Ma una bottiglia di vino o un dolce non fanno mai male.',
  },
];

export function Rules() {
  return (
    <section className="py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] mb-3 sm:mb-4">
          Regole della Casa
        </h2>
        <p className="text-sm sm:text-base text-[#1A1A1A]/50 max-w-md mx-auto px-4">
          Guida non esaustiva alla sopravvivenza in Via Magellano 3
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        {rules.map((rule, index) => (
          <div 
            key={index}
            className="p-4 sm:p-6 border border-[#1A1A1A]/10 hover:border-[#C4573A]/30 
              transition-colors duration-200"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl">{rule.emoji}</span>
              <div>
                <h3 className="font-serif text-base sm:text-lg text-[#1A1A1A] mb-1 sm:mb-2">
                  {rule.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/60 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
