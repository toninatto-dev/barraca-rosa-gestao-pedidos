import { Heart, Instagram, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-br from-[#D10068] to-[#E63970] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-center text-lg font-bold sm:text-xl">
          Qualidade que você sente, sabor que você ama!{' '}
          <span aria-hidden="true">♡</span>
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/5517999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 rounded-full px-3 py-1"
            aria-label="WhatsApp da Barraca Rosa"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            (17) 99999-9999
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 rounded-full px-3 py-1"
            aria-label="Instagram da Barraca Rosa"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            @barracarosa
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-white/70 text-xs">
          <Heart className="h-3 w-3 fill-current" aria-hidden="true" />
          <span>Feito com carinho por Thais</span>
          <Heart className="h-3 w-3 fill-current" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
