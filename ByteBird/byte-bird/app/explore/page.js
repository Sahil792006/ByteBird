"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { 
  Bird, Search, Users, Hash, 
  MessageSquare, Heart, Home, Bookmark, User, LogOut 
} from "lucide-react";

export default function ExplorePage() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("trending");
    const router = useRouter();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const postRes = await fetch("/api/posts");
                const userRes = await fetch("/api/users");
                const postData = await postRes.json();
                const userData = await userRes.json();
                setPosts(postData || []);
                setUsers(userData || []);
            } catch (e) {
                console.log("Error loading explore data");
            }
        };
        fetchAll();
    }, []);

    const filteredPosts = posts.filter(post => 
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 flex justify-center">
            
            {/* Sidebar */}
            <aside className="hidden md:flex w-72 border-r border-slate-800 p-6 sticky top-0 h-screen flex-col justify-between">
                <div className="space-y-8">
                    <Link href="/dashboard" className="flex items-center gap-3 px-2">
                        <Bird className="text-sky-400 w-8 h-8" />
                        <span className="text-2xl font-black italic text-white italic tracking-tighter">ByteBird</span>
                    </Link>
                    <nav className="space-y-2">
                        <Link href="/dashboard"><NavItem icon={<Home />} label="Home" /></Link>
                        <Link href="/explore"><NavItem icon={<Search />} label="Explore" active /></Link>
                        <NavItem icon={<Bookmark />} label="Bookmarks" />
                        <NavItem icon={<User />} label="Profile" />
                    </nav>
                </div>
                <button onClick={() => {localStorage.clear(); router.push('/')}} className="flex items-center gap-3 p-4 text-slate-400 hover:text-red-400 font-bold">
                    <LogOut size={20}/> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-2xl border-r border-slate-800 min-h-screen">
                <div className="sticky top-0 bg-[#0f172a]/80 backdrop-blur-md p-4 border-b border-slate-800 z-30">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search ByteBird..." 
                            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-sky-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex border-b border-slate-800">
                    <button onClick={() => setActiveTab('trending')} className={`flex-1 py-4 font-black transition ${activeTab === 'trending' ? 'text-sky-400 border-b-4 border-sky-400' : 'text-slate-500'}`}>Trending</button>
                    <button onClick={() => setActiveTab('people')} className={`flex-1 py-4 font-black transition ${activeTab === 'people' ? 'text-sky-400 border-b-4 border-sky-400' : 'text-slate-500'}`}>People</button>
                </div>

                <div className="divide-y divide-slate-800">
                    {activeTab === 'people' ? (
                        users.map(u => (
                            <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-800/20 transition">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center font-black">{u.username[0].toUpperCase()}</div>
                                    <p className="font-bold text-white">@{u.username}</p>
                                </div>
                                <button className="bg-white text-black px-4 py-1.5 rounded-lg font-bold text-sm">Follow</button>
                            </div>
                        ))
                    ) : (
                        filteredPosts.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-slate-800/30 transition">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold shrink-0">{post.author[0].toUpperCase()}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white">@{post.author}</span>
                                        </div>
                                        <p className="text-slate-300 mb-3">{post.content}</p>
                                        <div className="flex gap-6 text-slate-500">
                                            <span className="flex items-center gap-1 text-xs"><Heart size={14}/> {post.likes?.length || 0}</span>
                                            <span className="flex items-center gap-1 text-xs"><MessageSquare size={14}/> {post.comments?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Right Panel */}
            <aside className="hidden lg:block w-80 p-6 sticky top-0 h-screen">
                <div className="bg-slate-900/50 rounded-[2rem] p-6 border border-slate-800">
                    <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                        <Hash className="text-sky-400" /> Trends for you
                    </h2>
                    <div className="space-y-4">
                        <div className="cursor-pointer hover:opacity-70">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Technology · Trending</p>
                            <p className="text-white font-black">#ByteBirdV1</p>
                            <p className="text-xs text-slate-500 font-medium">1,240 Bytes</p>
                        </div>
                        <div className="cursor-pointer hover:opacity-70">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Development</p>
                            <p className="text-white font-black">#ReactHooks</p>
                            <p className="text-xs text-slate-500 font-medium">843 Bytes</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}

// Sub-components used in this file
function NavItem({ icon, label, active = false }) {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? "text-sky-400 bg-sky-500/10 border-l-4 border-sky-400 rounded-l-none" : "text-slate-400 hover:bg-slate-800"}`}>
            {icon} <span className="hidden md:block font-bold">{label}</span>
        </div>
    );
}