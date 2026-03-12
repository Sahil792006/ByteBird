"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { 
  Bird, Home, Bell, Shield, Disc, Heart, MessageSquare, 
  UserPlus, ArrowLeft, Terminal, Activity, Zap, Cpu
} from "lucide-react";

export default function SolarNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("username");
        if (!user) router.push("/login");
        else {
            setUsername(user);
            fetchNotifications(user);
        }
    }, []);

    const fetchNotifications = async (user) => {
        try {
            const res = await fetch(`/api/notifications/${user}`);
            const data = await res.json();
            setNotifications(data);
        } catch (e) { console.error("Logs inaccessible"); }
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
                        <Link href="/notifications" className="flex-1 md:w-full"><NavBtn icon={<Bell />} label="ALERTS" active /></Link>
                        <Link href={`/profile/${username}`} className="flex-1 md:w-full"><NavBtn icon={<Shield />} label="IDENTITY" /></Link>
                        <Link href="/bookmarks" className="flex-1 md:w-full"><NavBtn icon={<Disc />} label="STORAGE" /></Link>
                    </nav>
                </div>
            </aside>

            {/* --- MAIN ALERTS STREAM --- */}
            <main className="flex-1 w-full max-w-2xl border-x-0 md:border-r border-fire-orange/10 min-h-screen pb-24 md:pb-0 bg-black/10">
                <header className="sticky top-0 bg-[#0f0f12]/90 backdrop-blur-xl p-4 md:p-6 border-b border-fire-orange/30 z-30 flex items-center gap-6">
                    <button onClick={() => router.back()} className="text-fire-orange hover:text-fire-yellow transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-black italic tracking-widest text-fire-gradient uppercase">Packet_Alert_Logs</h1>
                </header>

                <div className="p-4 space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className="glass-panel p-6 rounded-xl border-fire-orange/5 hover:border-fire-yellow/20 transition-all flex gap-6 group">
                                <div className="mt-1">
                                    {notif.type === 'LIKE' && <Heart className="text-fire-red fill-fire-red drop-shadow-[0_0_8px_#ff0000]" size={24} />}
                                    {notif.type === 'COMMENT' && <MessageSquare className="text-fire-orange" size={24} />}
                                    {notif.type === 'FOLLOW' && <UserPlus className="text-fire-yellow" size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-fire-red to-fire-orange rounded flex items-center justify-center font-black text-xs text-white">
                                            {notif.from[0].toUpperCase()}
                                        </div>
                                        <span className="font-black text-white italic text-sm underline decoration-fire-orange/20 underline-offset-4 cursor-pointer hover:text-fire-yellow transition-colors">@{notif.from}</span>
                                    </div>
                                    <p className="text-[11px] md:text-xs tracking-tight text-fire-orange/60 group-hover:text-fire-yellow transition-colors font-black uppercase">
                                        {notif.type === 'LIKE' && "Packet_intercepted_and_liked"}
                                        {notif.type === 'COMMENT' && "New_relay_comment_uploaded"}
                                        {notif.type === 'FOLLOW' && "Peer_to_peer_link_established"}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 opacity-20 text-[8px] font-black uppercase tracking-widest">
                                        <Activity size={10} /> LOG_TIME: {new Date(notif.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center space-y-6">
                            <Cpu className="mx-auto text-fire-orange/10 animate-pulse" size={48} />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-fire-orange/20 animate-pulse italic">
                                [ NO_INCOMING_PACKETS_DETECTED ]
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* --- RIGHT PANEL --- */}
            <aside className="hidden xl:block w-80 p-8 sticky top-0 h-screen">
                <div className="glass-panel p-6 rounded-2xl border-fire-orange/10">
                    <h2 className="text-[10px] font-black tracking-widest uppercase text-fire-gradient mb-6 italic underline decoration-fire-red decoration-2">System_Uptime_Monitor</h2>
                    <div className="space-y-4 text-[9px] font-black uppercase text-fire-orange/40">
                        <p className="flex justify-between"><span>Core_Status</span> <span className="text-green-500 italic">Stable</span></p>
                        <p className="flex justify-between"><span>Latency</span> <span className="text-fire-yellow">12ms</span></p>
                        <p className="flex justify-between"><span>Packet_Loss</span> <span className="text-fire-red">0.00%</span></p>
                    </div>
                </div>
            </aside>
        </div>
    );
}

// Nav Button Helper (Same as Dashboard)
function NavBtn({ icon, label, active = false }) {
    return (
      <div className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-4 p-2 md:p-4 transition-all group cursor-pointer border-b-2 lg:border-b-0 lg:border-l-4 rounded-sm
        ${active ? "text-fire-yellow border-fire-yellow bg-fire-yellow/5" : "text-fire-orange/30 border-transparent hover:text-fire-orange"}`}>
        <div className={`${active ? 'scale-110 drop-shadow-[0_0_8px_#ffdf00]' : 'group-hover:scale-110'} transition-transform`}>{icon}</div>
        <span className="text-[7px] lg:text-[11px] font-black tracking-widest uppercase">{label}</span>
      </div>
    );
}