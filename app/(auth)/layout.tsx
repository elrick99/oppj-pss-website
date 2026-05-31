import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-royal relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-dark via-royal to-royal-light" />
        
        {/* Decorative circles */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full border border-white/5" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full border border-gold/20" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="mb-8">
            <Image
              src="/logo-oppj.png"
              alt="OPPJ Logo"
              width={120}
              height={120}
              className="mb-6"
            />
          </div>
          <h1 className="font-serif text-4xl xl:text-5xl font-bold text-white mb-4">
            Bienvenue dans la<br />
            <span className="text-gold">communauté OPPJ</span>
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Rejoignez plus de 450 jeunes catholiques engagés de la Paroisse Sacrés Stigmates.
          </p>
          
          {/* Stats */}
          <div className="flex gap-8 mt-10">
            <div>
              <div className="font-serif text-3xl font-bold text-gold">450+</div>
              <div className="text-white/60 text-sm">Membres actifs</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-gold">12</div>
              <div className="text-white/60 text-sm">Événements/an</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-gold">8</div>
              <div className="text-white/60 text-sm">Ans d&apos;existence</div>
            </div>
          </div>
        </div>
        
        {/* Dove illustration */}
        <div className="absolute bottom-10 right-10 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
            <path d="M85 35c-5-10-15-15-25-15-8 0-15 3-20 8l-5-3c-3-2-7-2-10 0l-5 3c-2 1-3 4-2 6l3 8c-3 5-5 11-5 17 0 20 18 36 40 36s40-16 40-36c0-10-4-18-11-24zm-45 5c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5z"/>
          </svg>
        </div>
      </div>
      
      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-off-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
