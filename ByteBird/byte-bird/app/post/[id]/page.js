"use client";
import { useState, useEffect, use as reactUse } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { 
  Bird, ArrowLeft, Heart, MessageSquare, 
  Home, Bell, Shield, Disc, Cpu, Zap
} from 'lucide-react';

export default function PostInspection({ params }) {
    const { id } = reactUse(params);
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("username");
        if (!user) router.push("/login");
        else {
            setUsername(user);
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/posts/${id}`);
            if (res.ok) {
                const data = await res.json();
                setPost(data);
            }
        } catch (err) { console.error("Data trace failed"); }
        finally { setLoading(false); }
    };

    const handleLike = async () => {
        try {
            const res = await fetch(`/api/posts/${id}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'LIKE', username: username }),
            });
            if (res.ok) fetchPost();
        } catch (err) { console.error("Uplink failed"); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        const res = await fetch(`/api/posts/${id}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'COMMENT', username, commentText }),
        });
        if (res.ok) { setCommentText(""); fetchPost(); }
    };

    if (loading) return (
        <div className="min-h-screen w-full bg-[#0f0f12] flex items-center justify-center text-fire-orange font-mono animate-pulse text-[10px] tracking-[0.4em]">
            [ SYNCING_PACKET_DATA... ]
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#0f0f12] text-amber-50 font-mono flex flex-col md:flex-row relative selection:bg-fire-orange/30">
            
            {/* Sidebar Navigation */}
            <aside className="fixed bottom-0 w-full md:sticky md:top-0 md:h-screen md:w-20 lg:w-72 border-t md:border-t-0 md:border-r border-fire-orange/20 bg-[#14141a] z-50 flex flex-row md:flex-col justify-around md:justify-between p-2 md:p-8">
                <div className="flex flex-row md:flex-col items-center gap-8 w-full">
                    <Link href="/dashboard" className="hidden md:block">
                        <Bird className="text-fire-orange w-10 h-10 drop-shadow-[0_0_8px_#ff8c00]" />
                    </Link>
                    <nav className="flex flex-row md:flex-col items-center justify-around w-full md:gap-4">
                        <Link href="/dashboard" className="flex-1 md:w-full"><NavBtn icon={<Home />} label="HOME" /></Link>
                        <Link href="/notifications" className="flex-1 md:w-full"><NavBtn icon={<Bell />} label="ALERTS" /></Link>
                        <Link href={`/profile/${username}`} className="flex-1 md:w-full"><NavBtn icon={<Shield />} label="IDENTITY" /></Link>
                        <Link href="/bookmarks" className="flex-1 md:w-full"><NavBtn icon={<Disc />} label="STORAGE" /></Link>
                    </nav>
                </div>
            </aside>

            {/* Main Column */}
            <main className="flex-1 w-full min-h-screen pb-24 md:pb-10 bg-black/10">
                <header className="sticky top-0 bg-[#0f0f12]/95 backdrop-blur-xl p-4 md:p-6 border-b border-fire-orange/30 z-30 flex items-center gap-6">
                    <button onClick={() => router.back()} className="text-fire-orange hover:text-fire-yellow transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xs md:text-sm font-black tracking-[0.3em] text-fire-gradient uppercase">Packet_Inspection</h1>
                </header>

                <div className="max-w-3xl mx-auto w-full px-4 py-8">
                    
                    {/* Balanced Post Card */}
                    <div className="glass-panel p-6 md:p-10 rounded-2xl border-fire-orange/10 mb-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-fire-red to-fire-orange rounded-lg flex items-center justify-center font-black text-white shadow-lg shrink-0">
                                {post?.author?.[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-fire-orange font-black italic text-sm">@{post?.author}</p>
                                <p className="text-[8px] text-fire-red/40 uppercase font-black tracking-widest">TS_{post?.id.slice(-6)}</p>
                            </div>
                        </div>

                        <p className="text-lg md:text-2xl font-bold leading-relaxed italic text-white mb-8 break-words">
                            "{post?.content}"
                        </p>

                        <div className="flex gap-8 py-4 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-fire-orange/40">
                            <button onClick={handleLike} className={`flex items-center gap-2 transition-all ${post?.likes?.includes(username) ? 'text-fire-red drop-shadow-[0_0_8px_#ff0000]' : 'text-fire-orange/40 hover:text-fire-red'}`}>
                                <Heart size={16} fill={post?.likes?.includes(username) ? "currentColor" : "none"} /> {post?.likes?.length || 0} Synapses
                            </button>
                            <span className="flex items-center gap-2"><MessageSquare size={16} /> {post?.comments?.length || 0} Relays</span>
                        </div>
                    </div>

                    {/* Reply Input (No borders, Seamless Glass) */}
                    <form onSubmit={handleComment} className="glass-panel p-6 rounded-2xl border-fire-orange/20 mb-10 shadow-xl">
                        <textarea 
                            className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 text-white italic text-base placeholder-fire-orange/10 resize-none p-0" 
                            placeholder=">> Input reply sequence..."
                            value={commentText}
                            rows="2"
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="flex justify-end border-t border-white/5 pt-4 mt-2">
                            <button type="submit" className="btn-fire-glow py-2 px-8 text-[10px] rounded-lg tracking-widest">UPLOAD_REPLY</button>
                        </div>
                    </form>

                    {/* Comments Stream */}
                    <div className="space-y-4 pb-10">
                        <h2 className="text-[8px] font-black uppercase tracking-[0.5em] text-fire-orange/20 mb-4 px-2">Data_Relays</h2>
                        {post?.comments?.map((c, i) => (
                            <div key={i} className="p-5 glass-panel rounded-xl border-white/5 flex gap-4 hover:border-fire-orange/20 transition-all">
                                <div className="w-9 h-9 border border-fire-orange/20 rounded-lg flex items-center justify-center text-[10px] font-black text-fire-orange shrink-0 bg-black/40">{c.author[0]}</div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-black text-fire-orange italic text-[10px]">@{c.author}</p>
                                        <Zap size={10} className="text-fire-red/20" />
                                    </div>
                                    <p className="text-slate-300 text-sm italic break-words leading-relaxed">{c.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
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