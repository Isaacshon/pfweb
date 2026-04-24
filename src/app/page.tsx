import { GallerySlider } from '@/components/GallerySlider'

export default function Home() {
  const galleryImages = [
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKOWsM_-MA0yRUQA91KTsrkBSn3UbypE7-kytfG335lUZ67jqKn2JbYGYU-0nzmH5WhkYo8OOzVSnnRsghO3cfns0tY81fXoB0qhnJbrp3qeT2Q0fnhyGlWh5mC3R-i9cTf2fcjriJQNFdOxlbxNpB9KALUa_mLw0XN8iYMTvX1VvK7pWkedb53IG0Kr36PgyxPnh0QWZhnvVv-THOUlD5EDIV9zqJDnl_xHJ41JlFrOvk7tB_j3Z_3QW3puokWoOrsOhxM6XzQyrM", alt: "Tropical fruits" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCub6ki-acdsxs2ScSVqkqxnij4WqaPJOIJ5IMyCmZ1wKSs3OPyZhhmtcWMZJyoRa3feYhwmdVPog8JIns-SoWKdTyPUF2p-v-MarHWshQZM2z9NWM08PqkW9kxPBWeHo9l8beoS53RZLuPGjvTZ-z1BJicnUhVdEKbo__BwK4ho6sfnJoYScsCRkPw83JtWCo8hCsW6b664-M3dN04tbumm2IFTcFXQI73UMv7Zq2KFwoqZjhlsrBK5Mes-ocMVihn_FhOOhlmtbtr", alt: "Community gathering outdoors" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGCTKNi5nL8_JH1P12ONr25xXi5E70MqajNrQv162lA8qo5-ld6ESKd-r4iyTKM2-AmZ56-E25DS_94OUY_UTLX-C67okfX6rehyO2PTh63ckTlvyGuXh-6bHeeTPKQITAonjOOvVSwDsEfEH1wtQGwc-76AQATDSNLq8vW-GKOQrgxQBeg0UuJZMOuV1aDlHbOR-Iw1PO95rXFFoRUIQPVFLb9lLMS3E7PolYmKpFuP8_bPM42HwxnVQSjm9uNd3QInLDWSHUiTjB", alt: "Yoga class" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9PMXZd2FKn7-WS4fMtq2i7Ssp-4StchYPhHdIW43gSXz2m2EPkrnFWS1r_ZQD0drW-WBYBzABjrFgzKfKRhu_-zK7nH4uBPvYOCdrmo5Si-Vxt6-Fbl23fRypL6p1q4qVMuu_Y5oEo0IC6zeRb2biqVbwc3Rg6xLWb2sI0wZZgBXvZmk0Z0V-q0Rqx6eUtEYjyLLd_9NeqzHCLJOxTtG8x-3PLjfIttl5oPYHB1rcA12yEX42aONI0BSYvr20IGtC7T_B4oxjWKa8", alt: "Healthy smoothie bowl" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_F0mU6AICf2wNIYkE6mSsZ93E9uoTyjRZ45sraoF8JFgmYVwURqGHe6HVTUgHsKofJoYObl7kbZY10szfEGKFz-F_Uf88YNewglGGRkSyamNf6OnsNlWuJCDg9fy3cdhIssNS-hNfcA5cR4KPFGKS1wZ-IkShOg_zVU-fHdgUdAUYkhandZx8s-nBd4MCistJNMbksDseegwzrwCR9F66KwMAvg_-HIVZMFwxyhp1Cq2hePWTiwykhj97FBVeOeCdouvy6C6Il5Wk", alt: "Group hiking" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA-94hOU85PHQKmib2x-iIE5coGvgHOxeaocgwnRWOmPWKFT8e7t1J1XNtxdA7x4AJ8fCjrTgy8XmAxTRfFGjfnisoS9rH4kTUN_XZmSWqC6RUBWpEWBZJ1xHiM2BE4QkSB1pgroOQBNCFMTW1DPBf8Wt14JefNThEOJyONtZg_ZpLg45psYM0-QiVHN-zikVSrS3mEEZWMd_cEcG_IaYn3pjQfTRKsjBJWuWSVThK1b2fc2ds8O9xONV1oW0dZoyq4Zk90aEiVu3r", alt: "Fresh organic vegetables" },
  ]

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm antialiased">
        <div className="flex justify-between items-center h-20 px-8 max-w-7xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-brand-purple">PassionFruits</div>
          <nav className="hidden md:flex gap-8">
            <a className="text-brand-yellow font-bold border-b-2 border-brand-yellow pb-1" href="#">About Us</a>
            <a className="text-slate-600 font-medium hover:text-brand-yellow transition-colors" href="#">Services</a>
            <a className="text-slate-600 font-medium hover:text-brand-yellow transition-colors" href="#">Events</a>
            <a className="text-slate-600 font-medium hover:text-brand-yellow transition-colors" href="#">Contact</a>
          </nav>
          <button className="hidden md:block bg-brand-yellow text-slate-900 px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform duration-200 active:scale-95 shadow-[0_4px_12px_rgba(248,200,72,0.3)]">
            Join Now
          </button>
          <button className="md:hidden text-on-surface">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative w-full min-h-[819px] flex items-center justify-center overflow-hidden bg-surface-container-lowest">
          <div className="absolute inset-0 z-0">
            <img
              alt="A group of diverse friends laughing and enjoying a sunny outdoor picnic"
              className="w-full h-full object-cover object-center opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY-J_2Kj5x__OGV2j0rZ1882K7q1CQSPRla3_EHyRYJR0RmHTX5SJtO6-M-jTpMO2jfTFJkOazImX2VTlgLIDhPgy8r5fXVRf-_CcIxoHDmiJH8FxVXJULfPxwnho5jVxfuyH2ht4FyvA-Hsg29Kjg2Bg8968IQIXvF4gPd8i5C1k8ZL4NWexgMXhmk_5naMe3GEYI3l1LZWGBMe3E8cS3LW_Ilp0mINV9vekXd7BU787neI8qpuQv3OjhcQbdJxYL9__HRyyKVVY0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-container-max mx-auto px-gutter text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 text-brand-purple mb-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
              <span className="font-bold text-xs uppercase tracking-widest">Welcome to the Community</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-on-background mb-md max-w-4xl mx-auto leading-tight">
              Vibrant Living,<br />
              <span className="text-brand-yellow relative">
                Juicy Experiences
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-brand-yellow/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-lg">
              Join a radiant community dedicated to holistic wellness, creative connection, and effortlessly organized lifestyles. Discover your zest for life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-sm">
              <button className="px-8 py-4 bg-brand-yellow text-slate-900 rounded-full font-bold hover:scale-105 transition-transform duration-200 active:scale-95 shadow-[0_4px_16px_rgba(248,200,72,0.4)] w-full sm:w-auto">
                Explore Our Services
              </button>
              <button className="px-8 py-4 border-2 border-brand-purple text-brand-purple rounded-full font-bold hover:bg-brand-purple/5 transition-colors duration-200 w-full sm:w-auto">
                Watch the Video
              </button>
            </div>
          </div>
          <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-tertiary-container/40 blur-sm"></div>
          <div className="absolute bottom-1/4 right-10 w-12 h-12 rounded-full bg-brand-yellow/30 blur-md"></div>
        </section>

        {/* Our Services */}
        <section className="py-xl bg-surface px-gutter relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-container-low rounded-l-[100px] -z-10 opacity-50"></div>
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-sm">Our Services</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Curated experiences designed to nourish your mind, body, and creative spirit.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {[
                { title: "Holistic Retreats", icon: "self_improvement", color: "brand-yellow", desc: "Immersive getaways focused on restorative practices, mindfulness, and deep relaxation in nature." },
                { title: "Community Events", icon: "groups", color: "brand-purple", desc: "Vibrant gatherings, from local market pop-ups to organized social mixers, fostering genuine connections." },
                { title: "Nutrition Coaching", icon: "local_dining", color: "brand-yellow", desc: "Personalized guidance to cultivate healthy eating habits and discover the joy of nourishing whole foods." },
                { title: "Creative Workshops", icon: "palette", color: "brand-purple", desc: "Hands-on sessions exploring various artistic mediums, encouraging self-expression and skill-building." }
              ].map((service, i) => (
                <div key={i} className={`bg-surface-container-lowest rounded-lg p-[32px] shadow-sm hover:-translate-y-2 transition-transform duration-300 border-t-4 ${service.color === 'brand-yellow' ? 'border-brand-yellow' : 'border-brand-purple'}`}>
                  <div className={`w-16 h-16 ${service.color === 'brand-yellow' ? 'bg-brand-yellow/20' : 'bg-brand-purple/20'} rounded-full flex items-center justify-center mb-md`}>
                    <span className={`material-symbols-outlined ${service.color === 'brand-yellow' ? 'text-brand-yellow' : 'text-brand-purple'} text-3xl`}>{service.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-purple mb-sm">{service.title}</h3>
                  <p className="text-on-surface-variant">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="py-xl bg-surface-bright px-gutter">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-sm">Moments of Joy</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Glimpses into our vibrant community life and the beautiful experiences we share.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <GallerySlider images={galleryImages} />
            </div>

            <div className="text-center mt-lg">
              <button className="px-8 py-4 bg-brand-yellow text-slate-900 rounded-full font-bold hover:scale-105 transition-transform duration-200 active:scale-95 shadow-[0_4px_16px_rgba(248,200,72,0.4)]">
                View Full Gallery
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-xl bg-brand-purple px-gutter text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-display text-4xl md:text-5xl mb-md text-brand-yellow">Ready to add some zest?</h2>
            <p className="text-lg md:text-xl text-white/90 mb-lg max-w-2xl mx-auto">
              Step into a space where wellness meets vibrant community. Start your journey with PassionFruits today.
            </p>
            <button className="px-8 py-4 bg-brand-yellow text-slate-900 rounded-full font-bold hover:scale-105 transition-transform duration-200 active:scale-95 shadow-[0_4px_20px_rgba(248,200,72,0.5)]">
              Join the Community
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="py-xl bg-surface-bright px-gutter">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg relative z-10 border-8 border-white">
                <img
                  alt="A diverse group of young adults sitting in a circle in a bright, modern studio space"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsNnLLFviWsbJ6Fn1-OwnqXWQr3Fed5-zHF-V63LGmDsB2TflxeWuWjhatVdStjQ9hOlcsVYleYiZGXl8N41mITFKGn_FHMJNHV89rSAIHHNrIscSD5q05fbaJZw4uhVbvKodXng099TfvvU0vNoMXdF8UxeEVV8L6LWtzuYrVmm17bNsOD0FS65FkObnkII8iN3LfiBCAURTYorASCGMlIEkqpBiZThFNoiPtaPYqGp8D_9QtjX1oHDUaB1Oupx3soD9KvvqzdmBy"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-full h-full bg-brand-yellow/30 rounded-xl -z-0"></div>
            </div>
            <div className="order-1 md:order-2 space-y-md">
              <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-bold uppercase tracking-wider text-xs mb-2">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-purple leading-tight">Cultivating connection in a disconnected world.</h2>
              <p className="text-on-surface-variant leading-relaxed">
                At PassionFruits, we believe that a fulfilling life is built on a foundation of holistic health and strong, authentic relationships. We are more than just a platform; we are a vibrant ecosystem designed to bring people together.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                Our mission is to effortlessly organize the chaos of modern living, providing curated experiences that spark joy, foster personal growth, and build lasting bonds. Whether you're seeking a moment of zen or a burst of creative energy, there's a place for you here.
              </p>
              <div className="pt-sm">
                <a className="inline-flex items-center gap-2 font-bold text-brand-purple hover:text-brand-yellow transition-colors border-b-2 border-brand-purple hover:border-brand-yellow pb-1" href="#">
                  Read Our Full Story <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-purple w-full border-t border-brand-purple/20 text-sm leading-relaxed mt-auto text-white/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16 max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold text-brand-yellow mb-4">PassionFruits</div>
            <p className="text-white/60 mb-6 max-w-xs">Radiant, communal, and effortlessly organized.</p>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><a className="hover:text-brand-yellow hover:translate-x-1 transition-transform duration-200 inline-block" href="#">About Us</a></li>
              <li><a className="hover:text-brand-yellow hover:translate-x-1 transition-transform duration-200 inline-block" href="#">Services</a></li>
              <li><a className="hover:text-brand-yellow hover:translate-x-1 transition-transform duration-200 inline-block" href="#">Events</a></li>
              <li><a className="hover:text-brand-yellow hover:translate-x-1 transition-transform duration-200 inline-block" href="#">Contact</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a className="hover:text-brand-yellow hover:translate-x-1 transition-transform duration-200 inline-block" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-brand-yellow hover:translate-x-1 transition-transform duration-200 inline-block" href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-brand-purple transition-colors" href="#">
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-brand-purple transition-colors" href="#">
                <span className="material-symbols-outlined">mail</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-white/50">
          © 2024 PassionFruits Community. Radiant, communal, and effortlessly organized.
        </div>
      </footer>
    </div>
  )
}
