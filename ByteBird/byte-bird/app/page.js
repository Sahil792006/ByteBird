import React from 'react';
import Link from 'next/link';
import { Bird, Zap, ArrowRight, Flame, Cpu, Terminal } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f12] text-white flex flex-col relative overflow-hidden selection:bg-fire-orange/30">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-fire-red/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fire-yellow/10 rounded-full blur-[120px] pointer-events-none" />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-[#14141a]/80 backdrop-blur-md border-b border-fire-orange/20 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Bird className="text-fire-orange w-8 h-8 drop-shadow-[0_0_8px_#ff8c00]" />
            <span className="text-2xl font-black italic tracking-tighter text-fire-gradient uppercase">ByteBird</span>
          </Link>
          <div className="hidden md:flex gap-10 items-center">
            <Link href="/dashboard" className="text-xs font-black tracking-widest text-fire-orange/60 hover:text-fire-yellow transition-colors uppercase">Explore_Stream</Link>
            <Link href="/login" className="text-xs font-black tracking-widest text-fire-orange/60 hover:text-fire-yellow transition-colors uppercase">Login_Gate</Link>
            <Link href="/signup" className="btn-fire-glow py-2 px-6 text-[10px] rounded-lg">Initialize_Core</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center z-10">
        <div className="inline-flex items-center gap-2 bg-fire-red/10 border border-fire-red/20 text-fire-red px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 animate-pulse">
           <Zap size={14} /> Solar_Link_Established
        </div>
        
        <h1 className="text-5xl md:text-9xl font-black italic text-white leading-tight md:leading-[0.85] tracking-tighter mb-10 uppercase">
          CODE. SHARE.<br />
          <span className="text-fire-gradient drop-shadow-[0_0_20px_rgba(255,140,0,0.3)]">IGNITE_LOGIC.</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-amber-50/40 mb-16 max-w-2xl font-bold italic tracking-tight uppercase leading-relaxed">
          The high-performance micro-blogging mainframe. <br className="hidden md:block"/> 
          Deploy <span className="text-white underline decoration-fire-orange underline-offset-8">Bytes</span> or dive into deep <span className="text-white underline decoration-fire-yellow underline-offset-8">Blogs</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link href="/signup" className="btn-fire-glow px-12 py-5 text-xl rounded-xl text-center">
            START_WRITING <ArrowRight className="inline ml-2" />
          </Link>
          <Link href="/dashboard" className="border-2 border-fire-orange/20 text-fire-orange px-12 py-5 font-black text-xl hover:border-fire-yellow hover:text-fire-yellow transition-all italic text-center uppercase tracking-widest">
            View_Feed
          </Link>
        </div>
      </main>

      <footer className="py-10 text-center border-t border-white/5">
         <p className="text-[10px] font-black text-fire-red/40 tracking-[0.5em] uppercase">© 2026 Solar_Byte_Mainframe // All_Systems_Go</p>
      </footer>
    </div>
  );
}