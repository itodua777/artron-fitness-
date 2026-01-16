import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token); // Save token
                onLoginSuccess();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Connection failed. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-[#161b22] p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 animate-fadeIn">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lime-400/20 text-slate-900 font-black text-2xl">
                        A
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">სისტემაში შესვლა</h2>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-2">შეიყვანეთ თქვენი მონაცემები</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2">ელ-ფოსტა</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none focus:border-lime-400 transition-all font-bold"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2">პაროლი</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none focus:border-lime-400 transition-all font-bold"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-400 text-xs font-bold">
                            <ShieldCheck size={16} className="mr-2 shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-lime-400 text-slate-900 font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? 'მოწმდება...' : 'შესვლა'}
                        {!loading && <ArrowRight size={16} className="ml-2" />}
                    </button>

                    <button type="button" onClick={onBack} className="w-full text-center text-slate-600 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                        უკან დაბრუნება
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginView;
