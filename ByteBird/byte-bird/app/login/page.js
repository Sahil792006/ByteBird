"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bird, Mail, Lock, LogIn, Cpu } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                router.push('/dashboard');
            } else {
                setError(data.error || "Access_Denied: Invalid_Credentials");
            }
        } catch (err) {
            setError("System_Error: Connection_Lost");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center p-6 relative overflow-hidden font-mono">
            {/* Background Glow */}
            <div className="absolute w-[500px] h-[500px] bg-fire-orange/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-md w-full bg-[#14141a]/80 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_50px_rgba(255,60,0,0.15)] border border-fire-orange/10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-black border-2 border-fire-orange flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,140,0,0.3)]">
                        <Bird className="text-fire-yellow w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Login_Gate</h1>
                    <p className="text-fire-orange/50 text-[10px] font-black uppercase tracking-[0.3em]">Accessing Solar Mainframe</p>
                </div>

                {error && (
                    <div className="bg-fire-red/10 border-l-4 border-fire-red text-fire-red p-4 text-xs font-black mb-6 italic animate-pulse uppercase">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-fire-orange/30 group-focus-within:text-fire-yellow transition-colors" size={18} />
                        <input 
                            type="email" 
                            placeholder="AUTH_EMAIL_ID" 
                            required 
                            className="w-full pl-12 pr-4 py-4 bg-black/40 text-white placeholder-white/10 border-none outline-none ring-0 focus:ring-0 focus:outline-none italic font-bold"
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-fire-orange/30 group-focus-within:text-fire-yellow transition-colors" size={18} />
                        <input 
                            type="password" 
                            placeholder="ACCESS_KEY" 
                            required 
                            className="w-full pl-12 pr-4 py-4 bg-black/40 text-white placeholder-white/10 border-none outline-none ring-0 focus:ring-0 focus:outline-none italic font-bold"
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </div>

                    <button disabled={loading} className="btn-fire-glow w-full py-4 flex items-center justify-center gap-3 italic">
                        {loading ? "ESTABLISHING..." : "EXECUTE_LOGIN"} <LogIn size={18} />
                    </button>
                </form>

                <p className="text-center mt-10 text-white/20 font-black text-[10px] tracking-widest uppercase">
                    No Credentials? <Link href="/signup" className="text-fire-yellow underline decoration-fire-red underline-offset-8 hover:text-white transition-colors ml-2">Register_New_Core</Link>
                </p>
            </div>
        </div>
    );
}