const images = [
  {
    src: 'assets/sofa/divano_1.jpeg',
    alt: 'Il divano nella sua gloria',
    caption: 'La star della casa',
  },
  {
    src: 'assets/sofa/divano_2.jpeg',
    alt: 'Angolo relax',
    caption: 'Perfetto per doom scrolling',
  },
  {
    src: 'assets/sofa/divano_3.jpeg',
    alt: 'Vista del soggiorno',
    caption: 'Luce naturale inclusa',
  },
];

export function Gallery() {
  return (
    <section className="py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] mb-3 sm:mb-4">
          Il Divano
        </h2>
        <p className="text-sm sm:text-base text-[#1A1A1A]/50">
          Documentazione fotografica del bene in oggetto
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`relative group overflow-hidden bg-[#1A1A1A]/5
              ${index === 0 ? 'sm:col-span-2 aspect-[16/9] sm:aspect-[2/1]' : 'aspect-[4/3]'}
            `}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500 
                group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 to-transparent 
              opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <p className="font-serif text-white text-sm sm:text-lg italic">
                  {image.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] sm:text-xs text-[#1A1A1A]/30 mt-4 sm:mt-6 italic">
        * Foto a scopo illustrativo. Il divano reale potrebbe presentare più briciole.
      </p>
    </section>
  );
}
