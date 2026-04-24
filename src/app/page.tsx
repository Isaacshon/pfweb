import { IconMenu } from '@/components/IconMenu'
import { FeatureGrid } from '@/components/FeatureGrid'
import { StepGuide } from '@/components/StepGuide'
import { GallerySlider } from '@/components/GallerySlider'
import { ScheduleTable } from '@/components/ScheduleTable'
import { ConferencePopup } from '@/components/ConferencePopup'

export default function Home() {
  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800", alt: "Event 1" },
    { src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800", alt: "Event 2" },
    { src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", alt: "Event 3" },
    { src: "https://images.unsplash.com/photo-1540575861501-7ad05823c95b?auto=format&fit=crop&q=80&w=800", alt: "Event 4" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <ConferencePopup />
      
      {/* 1. Hero Section (Reference: Dark/Bold) */}
      <section className="relative h-screen min-h-[700px] flex flex-col bg-slate-950 overflow-hidden">
        {/* Background Image/Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-950 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-60" 
            alt="Hero BG"
          />
        </div>

        {/* Navbar */}
        <header className="relative z-50 flex justify-between items-center px-8 md:px-16 py-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center font-black text-slate-900 text-xl">P</div>
            <span className="text-2xl font-black tracking-tighter text-white">PassionFruits</span>
          </div>
          <nav className="hidden md:flex gap-10 text-white/70 text-sm font-bold uppercase tracking-widest">
            <a href="#" className="text-brand-yellow border-b-2 border-brand-yellow">Home</a>
            <a href="#" className="hover:text-white transition-colors">Conference</a>
            <a href="#" className="hover:text-white transition-colors">Events</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </nav>
          <button className="px-6 py-2 bg-white text-slate-950 rounded-full font-bold text-xs uppercase tracking-widest">
            Join Now
          </button>
        </header>

        {/* Hero Content */}
        <div className="relative z-20 flex-grow flex flex-col items-center justify-center text-center px-4">
          <span className="inline-block px-4 py-1 border border-brand-yellow text-brand-yellow rounded-full text-xs font-bold tracking-[0.3em] uppercase mb-6 animate-fade-in">
            Kingdom Influence
          </span>
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8 max-w-5xl">
            PASSION<br/>FRUITS
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-12">
            A vibrant youth cultural mission movement dedicated to spreading the love of Jesus Christ through the creative language of culture.
          </p>
          <div className="flex gap-4">
            <button className="px-10 py-4 bg-brand-yellow text-slate-950 rounded-full font-black text-sm uppercase shadow-[0_0_30px_rgba(248,200,72,0.3)] hover:scale-105 transition-transform">
              Discover More
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-20 pb-10 flex justify-center">
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-yellow to-transparent" />
        </div>
      </section>

      {/* 2. Quick Menu (Icons) */}
      <section className="bg-white">
        <IconMenu />
      </section>

      {/* 3. Feature Content (2+4 Grid style from Reference) */}
      <section className="bg-white pb-24">
        <div className="text-center mb-4">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase">What's Happening</span>
        </div>
        <FeatureGrid />
      </section>

      {/* 4. Steps / Guide */}
      <section>
        <StepGuide />
      </section>

      {/* 5. Gallery Slider */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-brand-yellow font-black text-sm tracking-widest uppercase mb-2 block">Moments</span>
              <h2 className="text-4xl font-black text-slate-900">Passion in Action</h2>
            </div>
            <button className="text-slate-400 font-bold hover:text-brand-purple transition-colors">View All</button>
          </div>
          <GallerySlider images={galleryImages} />
        </div>
      </section>

      {/* 6. Schedule */}
      <ScheduleTable />

      {/* 7. Location Section */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-[2.5rem] overflow-hidden h-[400px] bg-slate-100 relative grayscale hover:grayscale-0 transition-all duration-700 shadow-xl border border-slate-200">
             <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black text-2xl uppercase tracking-tighter">
                [ Map Integration Ready ]
             </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-brand-purple font-bold text-sm tracking-widest uppercase mb-4">Contact Us</span>
            <h2 className="text-4xl font-black text-slate-900 mb-6">Find Us</h2>
            <div className="space-y-4 text-slate-500">
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-yellow">location_on</span>
                Toronto, Ontario, Canada
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-yellow">mail</span>
                passionfruits.ministry@gmail.com
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-yellow">phone</span>
                +1 (xxx) xxx-xxxx
              </p>
            </div>
            <button className="mt-10 px-8 py-3 border-2 border-slate-100 rounded-full w-fit font-bold hover:border-brand-yellow transition-all">
               Get Directions
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-black mb-6">PassionFruits</h3>
            <p className="text-white/40 max-w-sm leading-relaxed text-sm">
              We break away from rigid traditions to create a space where young people’s creative talents and raw passion become a bridge for the Gospel.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-brand-yellow">Navigation</h4>
            <ul className="space-y-4 text-white/50 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white">Conference 2026</a></li>
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="hover:text-white">Mission</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-brand-yellow">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-slate-950 transition-all">
                <span className="material-symbols-outlined text-lg">photo_camera</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-slate-950 transition-all">
                <span className="material-symbols-outlined text-lg">play_circle</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">
          © 2026 PassionFruits Ministry. Designed with Love.
        </div>
      </footer>
    </div>
  )
}
