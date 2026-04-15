import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030712]/60 backdrop-blur-md">
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 border border-white/10 text-white/90">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-sm font-medium tracking-tight text-white/90">NotesHub</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-white/50 transition-colors hover:text-white">
          Login
        </Link>
        <Link
          to="/signup"
          className="rounded-md border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/10"
        >
          Sign up
        </Link>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32 flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">
    <div className="flex-1 text-left opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
      <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
        <span className="mr-2 flex h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
        NotesHub 2.0 is now live
      </div>
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-[54px] leading-[1.1]">
        Notes that move at the <br className="hidden md:block"/>
        <span className="text-white/60">speed of thought.</span>
      </h1>
      <p className="mb-8 max-w-lg text-base text-white/50 md:text-lg leading-relaxed">
        Upload, manage, and share your PDF notes instantly. A secure, minimal workspace crafted for peak productivity.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/signup"
          className="flex w-full sm:w-auto items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:opacity-90"
        >
          Start for free
        </Link>
        <a
          href="#features"
          className="flex w-full sm:w-auto items-center justify-center rounded-md border border-white/10 bg-transparent px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:bg-white/5 hover:text-white"
        >
          Learn more
        </a>
      </div>
    </div>
    
    <div className="flex-1 w-full mx-auto max-w-md lg:max-w-none opacity-0 animate-[fadeIn_0.6s_ease-out_forwards_0.2s]">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-2 sm:p-3 shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
          {/* Mock UI window */}
          <div className="relative rounded-lg border border-white/5 bg-[#030712]/90 flex flex-col h-[320px] overflow-hidden">
             {/* Header */}
             <div className="flex h-12 items-center justify-between border-b border-white/5 px-4 bg-white/[0.02]">
                <div className="flex gap-1.5">
                   <div className="h-2.5 w-2.5 rounded-full bg-white/20"></div>
                   <div className="h-2.5 w-2.5 rounded-full bg-white/20"></div>
                   <div className="h-2.5 w-2.5 rounded-full bg-white/20"></div>
                </div>
                <div className="text-xs font-medium text-white/30 truncate px-4">noteshub.com/dashboard</div>
                <div className="w-8"></div>
             </div>
             {/* Body */}
             <div className="flex-1 p-4 flex gap-4 h-full">
                <div className="hidden sm:flex w-1/4 rounded-md border border-white/5 bg-white/[0.01] p-3 flex-col gap-3">
                   <div className="h-2 w-2/3 rounded-full bg-white/10"></div>
                   <div className="h-2 w-1/2 rounded-full bg-white/5"></div>
                   <div className="h-2 w-3/4 rounded-full bg-white/5"></div>
                   <div className="h-2 w-1/2 rounded-full bg-white/5 mt-4"></div>
                   <div className="h-2 w-full rounded-full bg-indigo-500/20"></div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                   <div className="rounded-md border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-between h-24">
                     <div className="flex justify-between items-start">
                       <div className="h-3 w-1/2 rounded-full bg-white/10"></div>
                       <div className="h-5 w-14 rounded-full border border-indigo-500/20 bg-indigo-500/10"></div>
                     </div>
                     <div className="h-2 w-1/3 rounded-full bg-white/5 mt-2"></div>
                   </div>
                   <div className="rounded-md border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-between h-24">
                     <div className="flex justify-between items-start">
                       <div className="h-3 w-1/3 rounded-full bg-white/10"></div>
                       <div className="h-5 w-14 rounded-full border border-emerald-500/20 bg-emerald-500/10"></div>
                     </div>
                     <div className="h-2 w-1/4 rounded-full bg-white/5 mt-2"></div>
                   </div>
                   <div className="rounded-md border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-between h-24 opacity-50">
                     <div className="flex justify-between items-start">
                       <div className="h-3 w-2/5 rounded-full bg-white/10"></div>
                     </div>
                     <div className="h-2 w-1/3 rounded-full bg-white/5 mt-2"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="group flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.04]">
    <div className="mb-4 inline-flex p-2 rounded-lg border border-white/5 bg-white/[0.02] text-white/40 transition-colors group-hover:text-white/80 group-hover:bg-white/[0.05]">
      {icon}
    </div>
    <h3 className="mb-2 text-base font-semibold tracking-tight text-white/90">{title}</h3>
    <p className="text-sm text-white/40 leading-relaxed grow">{description}</p>
  </div>
);

const Features = () => (
  <section id="features" className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
    <div className="mb-12 max-w-2xl border-l border-indigo-500/30 pl-4 sm:pl-6">
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl">Built for speed</h2>
      <p className="text-base text-white/50">Everything you need to manage your study materials without the clutter.</p>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FeatureCard 
        icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
        title="Instant Uploads" 
        description="Drag and drop your PDFs into the cloud. Fast, secure, and always synced." 
      />
      <FeatureCard 
        icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
        title="Quick Share" 
        description="Generate robust share links instantly. Control access with expiring URLs." 
      />
      <FeatureCard 
        icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
        title="Offline Access" 
        description="Download your notes anywhere. Available whenever you need them most." 
      />
      <FeatureCard 
        icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
        title="Privacy First" 
        description="Full control over your data. Delete notes securely with zero trace." 
      />
    </div>
  </section>
);

const CTA = () => (
  <section className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060a16] px-6 py-16 text-center shadow-sm sm:px-12 flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.1),transparent_60%)]"></div>
      
      <h2 className="relative mb-3 text-2xl font-bold tracking-tight text-white md:text-3xl">Ready to start?</h2>
      <p className="relative mb-8 max-w-md text-sm text-white/50 sm:text-base">
        Join the community of students and developers organizing their knowledge beautifully.
      </p>
      <Link
        to="/signup"
        className="relative inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        Sign up for free
      </Link>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full border-t border-white/5 bg-transparent py-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="text-sm font-medium tracking-tight">NotesHub</span>
      </div>
      <p className="text-center text-xs text-white/30 sm:text-left">© {new Date().getFullYear()} NotesHub. All rights reserved.</p>
    </div>
  </footer>
);

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#030712] text-slate-50 selection:bg-indigo-500/30 font-sans antialiased">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          <Hero />
          <Features />
          <CTA />
        </main>
        <Footer />
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
