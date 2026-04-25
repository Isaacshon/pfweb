import Link from 'next/link'

const events = [
  { title: 'PF Youth Camp 2025', date: 'Mar 8, 2025', category: 'Worship', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600' },
  { title: '2 Years Anniversary', date: 'Jan 7, 2025', category: 'Worship', image: 'https://images.unsplash.com/photo-1540575861501-7ad05823c95b?auto=format&fit=crop&q=80&w=600' },
  { title: 'Vancouver Evangelism Night', date: 'Nov 30, 2024', category: 'Mission', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=600' },
  { title: '2024 Retreat — Harvest', date: 'Sep 1, 2024', category: 'Retreat', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600' },
  { title: 'Worship & Prayer Night — Fresh Wind', date: 'Jun 8, 2024', category: 'Worship', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600' },
  { title: 'Italy Mission: Milano', date: 'Jun 8, 2024', category: 'Mission', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600' },
  { title: 'February Worship & Prayer Night', date: 'Jun 8, 2024', category: 'Worship', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600' },
  { title: 'End of Year Celebration', date: 'Dec 23, 2023', category: 'Event', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600' },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <Link href="/"><img src="/logo.png" alt="PassionFruits" className="h-20 md:h-28 w-auto -my-4 drop-shadow-md" /></Link>
        <nav className="hidden lg:flex gap-12 text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-purple transition-all">Home</Link>
          <Link href="/conference" className="hover:text-brand-purple transition-all">Conference</Link>
          <Link href="/events" className="text-brand-purple border-b-2 border-brand-purple pb-1">Events</Link>
          <Link href="/about" className="hover:text-brand-purple transition-all">About</Link>
        </nav>
        <Link href="/contact" className="px-10 py-3 bg-brand-purple text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md">Contact</Link>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block">Archive</span>
          <h1 className="text-6xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter">Events</h1>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={i} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-[10px] font-black uppercase tracking-widest">{event.category}</span>
                  <span className="text-slate-400 text-xs font-bold">{event.date}</span>
                </div>
                <h3 className="font-black text-xl text-brand-dark group-hover:text-brand-purple transition-colors">{event.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
