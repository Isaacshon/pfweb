import Link from 'next/link'

type ScheduleEvent = {
  time: string
  title: string
  tone: 'purple' | 'yellow' | 'cream' | 'dark'
}

type ScheduleDay = {
  day: string
  date: string
  kicker: string
  events: ScheduleEvent[]
}

const schedule: ScheduleDay[] = [
  {
    day: 'DAY 1',
    date: 'AUG 13',
    kicker: 'Arrival & Opening Night',
    events: [
      { time: '5:00 – 7:00 PM', title: 'Registration + Dinner', tone: 'yellow' },
      { time: '7:00 – 11:00 PM', title: 'Worship + Response & Prayer + Overflow', tone: 'purple' },
      { time: '11:00 PM', title: 'Go Home', tone: 'cream' },
    ],
  },
  {
    day: 'DAY 2',
    date: 'AUG 14',
    kicker: 'Full Conference Day',
    events: [
      { time: '9:30 – 10:00 AM', title: 'Coffee Time', tone: 'cream' },
      { time: '10:00 – 11:30 AM', title: 'Morning Worship (Praise, Prayer, Message)', tone: 'purple' },
      { time: '11:30 AM – 1:00 PM', title: 'Social Time + Lunch', tone: 'yellow' },
      { time: '1:00 – 5:30 PM', title: 'Seminar & Activities', tone: 'dark' },
      { time: '5:30 – 7:00 PM', title: 'Social Time + Dinner', tone: 'yellow' },
      { time: '7:00 – 11:00 PM', title: 'Worship + Response & Prayer + Overflow', tone: 'purple' },
      { time: '11:00 PM', title: 'Go Home', tone: 'cream' },
    ],
  },
  {
    day: 'DAY 3',
    date: 'AUG 15',
    kicker: 'Community & Closing',
    events: [
      { time: '11:00 AM – 12:00 PM', title: 'Connection + Coffee Time', tone: 'cream' },
      { time: '12:00 – 1:00 PM', title: 'Lunch', tone: 'yellow' },
      { time: '1:00 – 3:30 PM', title: 'Church Ministry Fair', tone: 'dark' },
      { time: '3:30 – 4:00 PM', title: 'Gospel Performance', tone: 'purple' },
      { time: '4:00 – 6:00 PM', title: 'Dinner', tone: 'yellow' },
      { time: '6:00 – 9:00 PM', title: 'Open Worship', tone: 'purple' },
      { time: '9:00 – 11:00 PM', title: 'Clean Up', tone: 'cream' },
    ],
  },
]

const toneClasses: Record<ScheduleEvent['tone'], string> = {
  purple: 'border-brand-purple/25 bg-brand-purple/10 text-brand-dark',
  yellow: 'border-[#e9df84] bg-brand-yellow/70 text-brand-dark',
  cream: 'border-[#e8dfcc] bg-white/80 text-brand-dark',
  dark: 'border-brand-dark/10 bg-brand-dark text-white',
}

function DayColumn({ day }: { day: ScheduleDay }) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-[#e7dece] bg-white/75 shadow-[0_24px_70px_rgba(18,28,42,0.07)] backdrop-blur-sm">
      <div className="relative overflow-hidden border-b border-[#e8dfcc] bg-brand-dark p-6 text-white sm:p-7">
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-brand-purple/25 blur-3xl" />
        <div className="absolute -bottom-16 left-8 h-28 w-28 rounded-full bg-brand-yellow/15 blur-2xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-yellow">{day.kicker}</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">{day.day}</h2>
          </div>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-xs font-black tracking-[0.12em] text-white/90">
            {day.date}
          </span>
        </div>
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="absolute bottom-7 left-[2.15rem] top-7 w-px bg-gradient-to-b from-brand-purple/10 via-brand-purple/35 to-brand-purple/5" />
        <div className="space-y-4">
          {day.events.map((event, index) => (
            <div key={`${day.day}-${event.time}-${event.title}`} className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-4">
              <div className="relative z-10 flex justify-center pt-5">
                <span className={`h-3 w-3 rounded-full border-[3px] border-white shadow-sm ${event.tone === 'purple' ? 'bg-brand-purple' : event.tone === 'yellow' ? 'bg-[#d8c84a]' : event.tone === 'dark' ? 'bg-brand-dark' : 'bg-slate-300'}`} />
              </div>
              <div className={`rounded-[1.4rem] border p-4 transition-transform duration-300 hover:-translate-y-0.5 sm:p-5 ${toneClasses[event.tone]}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <p className={`font-mono text-[11px] font-black uppercase tracking-[0.12em] ${event.tone === 'dark' ? 'text-white/65' : 'text-brand-purple'}`}>
                    {event.time}
                  </p>
                  <span className={`hidden text-[10px] font-black uppercase tracking-[0.18em] sm:block ${event.tone === 'dark' ? 'text-brand-yellow' : 'text-slate-400'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-black leading-snug tracking-[-0.02em] sm:text-lg">
                  {event.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function ConferencePage() {
  return (
    <div className="min-h-screen bg-[#fbfaf3] text-brand-dark selection:bg-brand-purple selection:text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-dark/95 text-white shadow-[0_10px_40px_rgba(18,28,42,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center">
            <img src="/logo.png" alt="PassionFruits" className="h-11 w-auto brightness-0 invert" />
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] font-black uppercase tracking-[0.18em] text-white/60 md:flex">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span className="text-brand-yellow">Conference</span>
            <Link href="/events" className="transition hover:text-white">Events</Link>
            <Link href="/about" className="transition hover:text-white">About</Link>
          </nav>

          <Link
            href="/conference/register"
            className="rounded-full bg-brand-yellow px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-brand-dark transition hover:-translate-y-0.5 active:scale-95 sm:px-6"
          >
            Register
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-brand-dark px-5 py-16 text-white sm:px-6 md:py-24 lg:px-8 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(154,120,180,0.28),transparent_35%),radial-gradient(circle_at_82%_18%,rgba(255,251,189,0.13),transparent_30%),linear-gradient(135deg,#121c2a_0%,#18263a_48%,#0f1724_100%)]" />
          <div className="absolute inset-0 opacity-[0.055] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.8)_0_1px,transparent_1px_72px)]" />
          <div className="absolute -bottom-48 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-brand-purple/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-5xl">
              <div className="mb-7 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-brand-yellow/25 bg-brand-yellow/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-yellow">
                  August 13–15, 2026
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/70">
                  Toronto, Ontario
                </span>
              </div>

              <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-brand-purple">PassionFruits Conference 2026</p>
              <h1 className="max-w-5xl text-[clamp(3.2rem,10vw,7.5rem)] font-black uppercase leading-[0.82] tracking-[-0.065em] text-white">
                Conference<br />Schedule
              </h1>
              <div className="mt-8 flex max-w-3xl items-start gap-4 border-l-4 border-brand-yellow pl-5">
                <p className="text-base font-semibold leading-7 text-white/70 sm:text-lg sm:leading-8">
                  Judges: Conquest to Conquer — three days of worship, community, seminars, ministry, and connection.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-5 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-brand-purple/[0.055] to-transparent" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-brand-purple">Three Days / One Story</p>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.045em] sm:text-5xl">Plan Your Days</h2>
              </div>
              <p className="max-w-lg text-sm font-semibold leading-7 text-slate-500">
                Follow the schedule below for each day. Times are shown in Toronto local time and may be adjusted slightly on site.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
              {schedule.map((day) => <DayColumn key={day.day} day={day} />)}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-6 md:pb-24 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-brand-yellow px-6 py-9 text-brand-dark shadow-[0_28px_80px_rgba(18,28,42,0.10)] sm:px-10 sm:py-11 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="absolute -right-16 -top-24 h-60 w-60 rounded-full border-[40px] border-brand-purple/10" />
            <div className="relative max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-purple">PassionFruits Conference 2026</p>
              <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-[-0.04em] sm:text-4xl">
                Ready to join the conference?
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-brand-dark/65">
                Complete the registration form and we’ll have your information ready for conference check-in.
              </p>
            </div>
            <Link
              href="/conference/register"
              className="relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-dark px-8 py-5 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(18,28,42,0.18)] transition hover:-translate-y-0.5 active:scale-95 sm:w-auto lg:mt-0"
            >
              Registration Form
              <span className="material-icons text-lg" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
