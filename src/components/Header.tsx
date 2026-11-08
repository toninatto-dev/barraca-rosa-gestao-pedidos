import { Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#D10068] via-[#E63970] to-[#D10068] text-white">
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-white blur-3xl" />
        <div className="absolute top-8 right-0 h-32 w-32 rounded-full bg-white blur-2xl" />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 py-10 text-center sm:py-14">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
          <Heart className="h-4 w-4 fill-white" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-wide uppercase">
            Food Trailer
          </span>
          <Heart className="h-4 w-4 fill-white" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl drop-shadow-lg">
          BARRACA ROSA
          <span className="inline-block ml-2" aria-hidden="true">♡</span>
        </h1>
        <p className="mt-4 text-base font-medium text-white/90 sm:text-lg max-w-xl mx-auto">
          Sabores, qualidade e carinho em cada lanche!
        </p>
      </div>
      <div className="h-2 w-full bg-gradient-to-r from-[#FBCFE8] via-white to-[#FBCFE8]" />
    </header>
  );
}
