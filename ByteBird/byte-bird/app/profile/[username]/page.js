"use client";
import { useState, useEffect, use as reactUse } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { 
  Bird, ArrowLeft, Terminal, MessageSquare, Heart, 
  Zap, Home, Bell, Shield, Disc, Cpu, Activity, Edit3
} from "lucide-react";

export default function SolarProfile({ params }) {
    const resolvedParams = reactUse(params);
    const username = resolvedParams.username;
    
    const [userPosts, setUserPosts] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState("");
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const current = localStorage.getItem("username");
        setLoggedInUser(current);
        if (current === username) setIsOwnProfile(true);
        fetchUserPosts();
    }, [username]);

    const fetchUserPosts = async () => {
        try {
            const res = await fetch("/api/posts");
            const allPosts = await res.json();
            setUserPosts(allPosts.filter(p => p.author === username));
        } catch (err) {
            console.error("Data sync failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f12] text-amber-50 font-mono flex flex-col md:flex-row justify-center relative selection:bg-fire-orange/30">
            
            {/* --- RESPONSIVE SIDEBAR: BOTTOM ON MOBILE / LEFT ON DESKTOP --- */}
            <aside className="fixed bottom-0 w-full md:sticky md:top-0 md:h-screen md:w-20 lg:w-80 border-t md:border-t-0 md:border-r border-fire-orange/20 bg-[#14141a] z-50 flex flex-row md:flex-col justify-around md:justify-between p-2 md:p-8 lg:p-10">
                <div className="flex flex-row md:flex-col items-center gap-8">
                    <Link href="/dashboard" className="hidden md:block">
                        <Bird className="text-fire-orange w-10 h-10 drop-shadow-[0_0_8px_#ff8c00]" />
                    </Link>
                    <nav className="flex flex-row md:flex-col items-center justify-around w-full md:gap-4">
                        <Link href="/dashboard" className="flex-1 md:w-full"><NavBtn icon={<Home />} label="HOME" /></Link>
                        <Link href="/notifications" className="flex-1 md:w-full"><NavBtn icon={<Bell />} label="ALERTS" /></Link>
                        <Link href={`/profile/${loggedInUser}`} className="flex-1 md:w-full">
                            <NavBtn icon={<Shield />} label="IDENTITY" active={username === loggedInUser} />
                        </Link>
                        <Link href="/bookmarks" className="flex-1 md:w-full"><NavBtn icon={<Disc />} label="STORAGE" /></Link>
                    </nav>
                </div>
            </aside>

            {/* --- MAIN PROFILE COLUMN --- */}
            <main className="flex-1 w-full max-w-2xl border-x-0 md:border-r border-fire-orange/10 min-h-screen pb-24 md:pb-0">
                
                {/* Header */}
                <header className="sticky top-0 bg-[#0f0f12]/90 backdrop-blur-xl p-4 md:p-6 border-b border-fire-orange/30 z-30 flex items-center gap-4 md:gap-6">
                    <button onClick={() => router.back()} className="text-fire-orange hover:text-fire-yellow transition-all p-1">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="overflow-hidden">
                        <h1 className="text-base md:text-lg font-black italic tracking-widest text-fire-gradient uppercase truncate">@{username}</h1>
                        <p className="text-[8px] text-fire-red font-bold uppercase tracking-widest">{userPosts.length} Packets_Detected</p>
                    </div>
                </header>

                {/* Profile Identity Module */}
                <div className="p-6 md:p-8 border-b border-fire-orange/10 bg-[#14141a]/50">
                    <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-end">
                        {/* Squared Avatar */}
                        <div className="w-28 h-28 md:w-32 md:h-32 bg-black border-2 border-fire-orange flex items-center justify-center text-3xl md:text-4xl font-black text-fire-yellow shadow-[0_0_20px_rgba(255,140,0,0.15)] shrink-0">
                            {username?.[0].toUpperCase()}
                        </div>

                        {/* User Details */}
                        <div className="flex-1 text-center sm:text-left space-y-4">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase">Ident_Log: {username}</h2>
                                <p className="text-[10px] md:text-xs text-amber-50/40 mt-2 italic leading-relaxed">
                                    {`>> Senior_Infiltrator. Deploying code modules via ByteBird Terminal_v1.0.`}
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="flex gap-4 md:gap-8 justify-center sm:justify-start">
                                <div className="text-center sm:text-left">
                                    <p className="text-sm md:text-base font-black text-white">1.4k</p>
                                    <p className="text-[8px] text-fire-orange/50 uppercase font-black">Links</p>
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-sm md:text-base font-black text-white">892</p>
                                    <p className="text-[8px] text-fire-orange/50 uppercase font-black">Nodes</p>
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-sm md:text-base font-black text-white">0.0%</p>
                                    <p className="text-[8px] text-fire-orange/50 uppercase font-black">Loss</p>
                                </div>
                            </div>

                            {isOwnProfile && (
                                <button className="btn-fire-glow w-full sm:w-auto px-6 py-2 text-[10px] uppercase font-black flex items-center justify-center gap-2">
                                    <Edit3 size={14} /> Modify_Core_Logic
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-white/5 bg-black/20">
                    <button className="flex-1 py-4 text-[10px] font-black text-fire-yellow border-b-2 border-fire-yellow uppercase tracking-widest">Byte_Stream</button>
                    <button className="flex-1 py-4 text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest">Metadata</button>
                </div>

                {/* USER FEED */}
                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-20 text-center animate-pulse text-[10px] tracking-[0.5em] text-fire-orange">DECRYPTING...</div>
                    ) : userPosts.length > 0 ? (
                        userPosts.map((post) => (
                            <Link key={post.id} href={`/post/${post.id}`} className="block p-6 md:p-8 hover:bg-white/[0.02] transition-all group relative overflow-hidden">
                                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-fire-red to-fire-yellow scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                                
                                <div className="flex justify-between mb-4">
                                    <span className="text-[9px] md:text-[10px] font-mono text-fire-red/40 tracking-widest uppercase italic font-black">PKT_ID_{post.id.slice(-4)}</span>
                                    <span className="text-[8px] text-slate-600 font-black uppercase">{new Date(post.timestamp).toLocaleDateString()}</span>
                                </div>

                                <p className="text-base md:text-xl font-black text-white italic group-hover:text-fire-yellow transition-colors duration-300 break-words mb-6 leading-relaxed">
                                    {post.content}
                                </p>

                                <div className="flex gap-8 text-fire-orange/20 group-hover:text-fire-orange/40 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={16} />
                                        <span className="text-[10px] font-black">{post.comments?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Heart size={16} />
                                        <span className="text-[10px] font-black">{post.likes?.length || 0}</span>
                                    </div>
                                    <Zap size={16} />
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-20 text-center space-y-4">
                             <Cpu className="mx-auto text-white/5 animate-pulse" size={40} />
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">[ NODE_EMPTY ]</p>
                        </div>
                    )}
                </div>
            </main>

            {/* --- RIGHT SIDEBAR: Hidden on Mobile --- */}
            <aside className="hidden xl:block w-80 p-8 sticky top-0 h-screen">
                <div className="glass-panel p-6 rounded-2xl border-fire-orange/10">
                    <h2 className="text-[10px] font-black tracking-widest uppercase text-fire-gradient mb-6 italic underline decoration-fire-red">Node_Telemetry</h2>
                    <div className="space-y-4 text-[9px] font-black uppercase text-fire-orange/40">
                         <div className="flex justify-between"><span>Protocol</span> <span className="text-white italic">P2P_Byte</span></div>
                         <div className="flex justify-between"><span>Sync_Rate</span> <span className="text-fire-yellow">99.2%</span></div>
                         <div className="flex justify-between"><span>Authority</span> <span className="text-green-500 italic">Verified</span></div>
                    </div>
                </div>
            </aside>
        </div>
    );
}

// Global NavBtn Component
function NavBtn({ icon, label, active = false }) {
    return (
      <div className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-4 p-2 md:p-4 transition-all group cursor-pointer border-b-2 lg:border-b-0 lg:border-l-4 rounded-sm
        ${active ? "text-fire-yellow border-fire-yellow bg-fire-yellow/5" : "text-fire-orange/30 border-transparent hover:text-fire-orange"}`}>
        <div className={`${active ? 'scale-110 drop-shadow-[0_0_8px_#ffdf00]' : ''} transition-transform`}>{icon}</div>
        <span className="text-[7px] lg:text-[11px] font-black tracking-widest uppercase">{label}</span>
      </div>
    );
}