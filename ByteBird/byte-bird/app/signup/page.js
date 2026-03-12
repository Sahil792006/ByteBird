"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bird, User, Mail, Lock, ArrowRight, Zap } from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) {
            setError("ERR: Passwords_Mismatch");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) router.push('/login');
            else {
                const data = await res.json();
                setError(data.error || "ERR: Initialization_Failed");
            }
        } catch (err) {
            setError("ERR: System_Offline");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center p-6 relative overflow-hidden font-mono">
            {/* Background Glow */}
            <div className="absolute w-[600px] h-[600px] bg-fire-red/10 rounded-full blur-[150px] -z-10" />

            <div className="max-w-md w-full bg-[#14141a]/80 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.2)] border border-fire-red/10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-black border-2 border-fire-red flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                        <Bird className="text-fire-orange w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">New_Core</h1>
                    <p className="text-fire-red/50 text-[10px] font-black uppercase tracking-[0.3em]">Initialize System Identity</p>
                </div>

                {error && (
                    <div className="bg-fire-red/20 border border-fire-red text-white p-4 text-xs font-black mb-6 text-center italic tracking-widest uppercase">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-black/40">
                        <input 
                            type="text" 
                            placeholder=">> SET_USERNAME" 
                            required 
                            className="w-full px-6 py-4 bg-transparent text-white placeholder-white/10 border-none outline-none ring-0 focus:ring-0 italic font-bold"
                            onChange={e => setFormData({...formData, username: e.target.value})} 
                        />
                    </div>
                    <div className="bg-black/40">
                        <input 
                            type="email" 
                            placeholder=">> SET_EMAIL_ADDRESS" 
                            required 
                            className="w-full px-6 py-4 bg-transparent text-white placeholder-white/10 border-none outline-none ring-0 focus:ring-0 italic font-bold"
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div className="bg-black/40">
                        <input 
                            type="password" 
                            placeholder=">> SET_ACCESS_KEY" 
                            required 
                            className="w-full px-6 py-4 bg-transparent text-white placeholder-white/10 border-none outline-none ring-0 focus:ring-0 italic font-bold"
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                    <div className="bg-black/40">
                        <input 
                            type="password" 
                            placeholder=">> CONFIRM_ACCESS_KEY" 
                            required 
                            className="w-full px-6 py-4 bg-transparent text-white placeholder-white/10 border-none outline-none ring-0 focus:ring-0 italic font-bold"
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                        />
                    </div>

                    <button disabled={loading} className="btn-fire-glow w-full py-5 mt-4 flex items-center justify-center gap-3 italic text-lg">
                        {loading ? "INITIALIZING..." : "START_WRITING"} <Zap size={20} />
                    </button>
                </form>

                <p className="text-center mt-10 text-white/20 font-black text-[10px] tracking-widest uppercase">
                    Core Established? <Link href="/login" className="text-fire-orange underline decoration-fire-yellow underline-offset-8 hover:text-white transition-colors ml-2">Access_Gateway</Link>
                </p>
            </div>
        </div>
    );
}