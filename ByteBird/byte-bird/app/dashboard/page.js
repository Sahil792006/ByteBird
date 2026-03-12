"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bird, Home, Bell, Shield, Disc, Terminal, MessageSquare, 
  Heart, Zap, Cpu, LogOut, Search, Plus, ArrowRight
} from "lucide-react";

export default function SolarDashboard() {
  const inputRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) router.push("/login");
    else {
      setUsername(user);
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        content, 
        author: username,
        likes: [], 
        comments: [] 
      }),
    });
    setContent("");
    fetchPosts();
  };

  // --- NEW: INTERACTION HANDLERS ---
  // Inside SolarDashboard Component

const handleLike = async (postId) => {
    try {
        const res = await fetch(`/api/posts/${postId}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type: 'LIKE', 
                username: username // Ensure this matches state
            }),
        });
        if (res.ok) fetchPosts(); // Refresh UI count
    } catch (err) {
        console.error("Like failed");
    }
};

const handleBookmark = (e, postId) => {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem("saved_bytes") || "[]");
    let updated;
    if (saved.includes(postId)) {
        updated = saved.filter(id => id !== postId);
        alert(">> PACKET_DELETED_FROM_LOCAL_STORAGE");
    } else {
        updated = [...saved, postId];
        alert(">> PACKET_SECURED_IN_LOCAL_STORAGE");
    }
    localStorage.setItem("saved_bytes", JSON.stringify(updated));
    fetchPosts(); // Refresh UI to update the icon color
};

  return (
    <div className="min-h-screen bg-[#0f0f12] text-amber-50 flex flex-col md:flex-row justify-center relative overflow-x-hidden">
      {/* SIDEBAR */}
      <aside className="fixed bottom-0 w-full md:sticky md:top-0 md:h-screen md:w-20 lg:w-80 border-t md:border-t-0 md:border-r border-fire-orange/20 bg-[#14141a] z-50 flex flex-row md:flex-col justify-around md:justify-between p-2 md:p-8 lg:p-10">
        <div className="flex flex-row md:flex-col items-center justify-around w-full md:gap-8">
          <div className="hidden md:flex items-center gap-3 mb-4">
            <Bird className="text-fire-orange w-8 h-8 lg:w-10 lg:h-10 drop-shadow-[0_0_8px_#ff8c00]" />
            <span className="hidden lg:block text-2xl font-black italic tracking-tighter text-fire-gradient">BYTEBIRD</span>
          </div>

          <nav className="flex flex-row md:flex-col items-center justify-around w-full md:gap-2">
            <Link href="/dashboard" className="flex-1 md:w-full"><NavBtn icon={<Home />} label="HOME" active /></Link>
            <Link href="/notifications" className="flex-1 md:w-full"><NavBtn icon={<Bell />} label="ALERTS" /></Link>
            <Link href={`/profile/${username}`} className="flex-1 md:w-full"><NavBtn icon={<Shield />} label="IDENTITY" /></Link>
            <Link href="/bookmarks" className="flex-1 md:w-full"><NavBtn icon={<Disc />} label="STORAGE" /></Link>
          </nav>

          <button onClick={() => inputRef.current?.focus()} className="md:btn-fire-glow md:w-full md:py-3 lg:py-4 flex items-center justify-center rounded-full md:rounded-lg p-3 md:p-0 bg-gradient-to-br from-fire-red to-fire-orange text-white shadow-lg">
            <Terminal className="w-5 h-5 md:w-4 md:h-4 lg:hidden" />
            <Plus className="md:hidden w-6 h-6" />
            <span className="hidden lg:block tracking-widest uppercase italic text-[10px]">Execute_Byte</span>
          </button>
        </div>

        <button onClick={() => { localStorage.clear(); router.push("/"); }} className="hidden md:flex items-center gap-2 text-fire-red hover:text-fire-yellow transition-all font-black text-[10px] uppercase">
          <LogOut size={16} /> <span className="hidden lg:block">Terminate</span>
        </button>
      </aside>

      {/* FEED */}
      <main className="flex-1 w-full max-w-2xl border-x-0 md:border-r border-fire-orange/10 bg-black/10 min-h-screen pb-24 md:pb-0">
        <header className="sticky top-0 bg-[#0f0f12]/90 backdrop-blur-xl p-4 md:p-6 border-b border-fire-orange/30 z-30 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-black italic tracking-widest text-fire-gradient">SOLAR_STREAM</h2>
          <Cpu className="text-fire-yellow animate-spin duration-[6000ms] w-5 h-5" />
        </header>

        <div className="p-4 md:p-6 m-2 md:m-4 glass-panel rounded-xl">
          <div className="flex gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-fire-red to-fire-orange rounded-lg flex items-center justify-center font-black text-white shrink-0">
              {username[0]?.toUpperCase()}
            </div>
            <div className="flex-1 space-y-4">
              <textarea
                ref={inputRef}
                className="w-full bg-transparent border-none outline-none p-0 text-base md:text-xl focus:ring-0 resize-none text-white italic"
                placeholder=">> Write logic..."
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end pt-3 border-t border-white/5">
                <button onClick={handlePost} disabled={!content} className="btn-fire-glow py-2 px-6 md:px-8 text-[10px] rounded-lg">DEPLOY</button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 md:px-4 pb-10 space-y-3 md:space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 md:p-6 glass-panel rounded-xl hover:border-fire-yellow/30 transition-all group">
              <div className="flex gap-3 md:gap-4">
                <Link href={`/profile/${post.author}`} className="w-8 h-8 md:w-10 md:h-10 border border-fire-orange/40 rounded-lg flex items-center justify-center font-black text-xs text-fire-orange shrink-0">
                  {post.author?.[0].toUpperCase()}
                </Link>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-2">
                    <Link href={`/profile/${post.author}`} className="font-black text-fire-orange italic text-xs md:text-sm group-hover:text-fire-yellow truncate pr-2 underline-offset-4 hover:underline">@{post.author}</Link>
                    <span className="text-[8px] md:text-[10px] font-mono text-fire-red/50 uppercase tracking-widest shrink-0">TS_{post.id.slice(-4)}</span>
                  </div>
                  
                  <Link href={`/post/${post.id}`}>
                    <p className="text-sm md:text-lg text-slate-100 leading-relaxed font-medium italic break-words mb-4">
                        {post.content}
                    </p>
                  </Link>
                  
                  {/* --- INTERACTION ROW --- */}
                  <div className="mt-4 flex justify-between items-center text-fire-orange/30">
                    <div className="flex gap-6 md:gap-8">
                      {/* COMMENT */}
                      <Link href={`/post/${post.id}`} className="flex items-center gap-1.5 hover:text-fire-yellow transition-colors">
                        <MessageSquare size={16} />
                        <span className="text-[10px] font-black">{post.comments?.length || 0}</span>
                      </Link>

                      {/* LIKE */}
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${post.likes?.includes(username) ? 'text-fire-red' : 'hover:text-fire-red'}`}
                      >
                        <Heart size={16} fill={post.likes?.includes(username) ? "currentColor" : "none"} />
                        <span className="text-[10px] font-black">{post.likes?.length || 0}</span>
                      </button>

                      <Zap size={16} className="hover:text-fire-yellow cursor-pointer" />
                    </div>

                    {/* BOOKMARK */}
                    <button onClick={(e) => handleBookmark(e, post.id)}>
                        <Disc size={16} className={`hover:text-white transition-all ${JSON.parse(typeof window !== 'undefined' ? localStorage.getItem("saved_bytes") || "[]" : "[]").includes(post.id) ? 'text-fire-yellow fill-fire-yellow/20' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <aside className="hidden xl:block w-80 p-8 sticky top-0 h-screen">
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-[10px] font-black tracking-widest uppercase mb-6 text-fire-gradient">Discovery_Protocol</h3>
          <div className="space-y-6">
            <DiscoveryItem label="#NextJS15" bits="1.4k" />
            <DiscoveryItem label="#TailwindV4" bits="980" />
            <DiscoveryItem label="#SolarFlux" bits="451" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function NavBtn({ label, icon, active }) {
  return (
    <div className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-4 p-2 md:p-4 transition-all group cursor-pointer border-b-2 lg:border-b-0 lg:border-l-4 rounded-sm
      ${active ? "text-fire-yellow border-fire-yellow bg-fire-yellow/5" : "text-fire-orange/30 border-transparent hover:text-fire-orange"}`}>
      <div className={`${active ? 'scale-110 drop-shadow-[0_0_8px_#ffdf00]' : ''} transition-transform`}>{icon}</div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-fire-red rounded-full animate-ping shadow-[0_0_10px_#ff0000]"></div>
      <span className="text-[7px] lg:text-[11px] font-black tracking-widest uppercase">{label}</span>
    </div>
  );
}

function DiscoveryItem({ label, bits }) {
    return (
        <div className="cursor-pointer group">
            <p className="font-bold italic group-hover:text-fire-yellow transition-colors text-white">{label}</p>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-tighter">{bits} Pkts</p>
        </div>
    )
}