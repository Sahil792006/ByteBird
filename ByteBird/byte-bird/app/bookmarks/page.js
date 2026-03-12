"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { 
  Bird, Home, Bell, Shield, Disc, ArrowLeft, 
  Terminal, Activity, Zap, Cpu, MessageSquare, Heart 
} from "lucide-react";

export default function SolarLocalStorage() {
    const [savedPosts, setSavedPosts] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("username");
        if (!user) router.push("/login");
        else {
            setUsername(user);
            fetchSavedData();
        }
    }, []);

    const fetchSavedData = async () => {
        try {
            const res = await fetch("/api/posts");
            const allPosts = await res.json();
            const savedIds = JSON.parse(localStorage.getItem("saved_bytes") || "[]");
            const filtered = allPosts.filter(p => savedIds.includes(p.id));
            setSavedPosts(filtered);
        } catch (e) {
            console.error("Storage read failed");
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = (e, postId) => {
        e.preventDefault();
        e.stopPropagation();
        const saved = JSON.parse(localStorage.getItem("saved_bytes") || "[]");
        const updated = saved.filter(id => id !== postId);
        localStorage.setItem("saved_bytes", JSON.stringify(updated));
        fetchSavedData(); 
        alert(">> PACKET_PURGED_FROM_LOCAL_NODE");
    };

    return (
        <div className="min-h-screen bg-[#0f0f12] text-amber-50 font-mono flex flex-col md:flex-row justify-center relative selection:bg-fire-orange/30">
            
            {/* --- RESPONSIVE SIDEBAR --- */}
            <aside className="fixed bottom-0 w-full md:sticky md:top-0 md:h-screen md:w-20 lg:w-80 border-t md:border-t-0 md:border-r border-fire-orange/20 bg-[#14141a] z-50 flex flex-row md:flex-col justify-around md:justify-between p-2 md:p-10">
                <div className="flex flex-row md:flex-col items-center gap-8">
                    <Link href="/dashboard" className="hidden md:block">
                        <Bird className="text-fire-orange w-10 h-10 drop-shadow-[0_0_8px_#ff8c00]" />
                    </Link>
                    <nav className="flex flex-row md:flex-col items-center justify-around w-full md:gap-4">
                        <Link href="/dashboard" className="flex-1 md:w-full"><NavBtn icon={<Home />} label="HOME" /></Link>
                        <Link href="/notifications" className="flex-1 md:w-full"><NavBtn icon={<Bell />} label="ALERTS" /></Link>
                        <Link href={`/profile/${username}`} className="flex-1 md:w-full"><NavBtn icon={<Shield />} label="IDENTITY" /></Link>
                        <Link href="/bookmarks" className="flex-1 md:w-full"><NavBtn icon={<Disc />} label="STORAGE" active /></Link>
                    </nav>
                </div>
            </aside>

            {/* --- MAIN STORAGE STREAM --- */}
            <main className="flex-1 w-full max-w-2xl border-x-0 md:border-r border-fire-orange/10 min-h-screen pb-24 md:pb-0 bg-black/10">
                <header className="sticky top-0 bg-[#0f0f12]/90 backdrop-blur-xl p-4 md:p-6 border-b border-fire-orange/30 z-30 flex items-center gap-6">
                    <button onClick={() => router.back()} className="text-fire-orange hover:text-fire-yellow transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-sm md:text-lg font-black italic tracking-widest text-fire-gradient uppercase">Local_Storage_Vault</h1>
                </header>

                <div className="p-4 space-y-4">
                    {loading ? (
                        <div className="p-20 text-center animate-pulse text-[10px] tracking-[0.5em] text-fire-orange">
                            [ READING_LOCAL_DISK... ]
                        </div>
                    ) : savedPosts.length > 0 ? (
                        savedPosts.map((post) => (
                            <div key={post.id} className="glass-panel p-5 md:p-6 rounded-xl border-fire-orange/5 hover:border-fire-yellow/20 transition-all group relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <Link href={`/profile/${post.author}`} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-fire-orange/10 border border-fire-orange/20 rounded flex items-center justify-center font-black text-xs text-fire-yellow">
                                            {post.author?.[0].toUpperCase()}
                                        </div>
                                        <span className="font-black text-white italic text-xs hover:text-fire-yellow transition-colors">@{post.author}</span>
                                    </Link>
                                    <button 
                                        onClick={(e) => removeBookmark(e, post.id)}
                                        className="text-[8px] font-black uppercase text-fire-red hover:text-white transition-colors border border-fire-red/20 px-2 py-1 rounded"
                                    >
                                        [ PURGE ]
                                    </button>
                                </div>

                                {/* Link to Inspect post */}
                                <Link href={`/post/${post.id}`} className="block">
                                    <p className="text-base md:text-lg text-slate-200 leading-relaxed font-medium italic break-words mb-6 hover:text-white transition-colors">
                                        {post.content}
                                    </p>
                                </Link>

                                <div className="flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-6">
                                        <MessageSquare size={16} className="text-fire-orange" />
                                        <Heart size={16} className="text-fire-red" />
                                        <Zap size={16} className="text-fire-yellow" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-fire-orange/40">
                                        REF_0x{post.id.slice(-4)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center space-y-6">
                            <Disc className="mx-auto text-fire-orange/10 animate-spin duration-[10000ms]" size={48} />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-fire-orange/20 italic">
                                [ NO_SAVED_PACKETS_IN_MEMORY ]
                            </p>
                            <Link href="/dashboard" className="inline-block text-[10px] text-fire-yellow underline decoration-fire-red underline-offset-8 font-black uppercase">
                                Return_to_Main_Stream
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* --- RIGHT PANEL --- */}
            <aside className="hidden xl:block w-80 p-8 sticky top-0 h-screen">
                <div className="glass-panel p-6 rounded-2xl border-fire-orange/10">
                    <h2 className="text-[10px] font-black tracking-widest uppercase text-fire-gradient mb-6 italic underline decoration-fire-red decoration-2">Memory_Overview</h2>
                    <div className="space-y-4 text-[9px] font-black uppercase text-fire-orange/40">
                        <p className="flex justify-between"><span>Disk_Usage</span> <span className="text-fire-yellow">{savedPosts.length * 0.4} KB</span></p>
                        <p className="flex justify-between"><span>Active_Nodes</span> <span className="text-white">{savedPosts.length}</span></p>
                        <p className="flex justify-between"><span>Authority</span> <span className="text-green-500 italic">User_Level</span></p>
                    </div>
                </div>
            </aside>
        </div>
    );
}

function NavBtn({ icon, label, active = false }) {
    return (
      <div className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-4 p-2 md:p-4 transition-all group cursor-pointer border-b-2 lg:border-b-0 lg:border-l-4 rounded-sm
        ${active ? "text-fire-yellow border-fire-yellow bg-fire-yellow/5" : "text-fire-orange/30 border-transparent hover:text-fire-orange"}`}>
        <div className={`${active ? 'scale-110 drop-shadow-[0_0_8px_#ffdf00]' : 'group-hover:scale-110'} transition-transform`}>{icon}</div>
        <span className="text-[7px] lg:text-[11px] font-black tracking-widest uppercase">{label}</span>
      </div>
    );
}   