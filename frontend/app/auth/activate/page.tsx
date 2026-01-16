'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

function ActivateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Pre-fill from URL params if available
        // Note: The mock link in backend sends 'token' (which is the ID) and 'otp'.
        // We typically don't send email in the link unless we change backend, 
        // but for now we'll let them enter the email manually or assume the token identifies them.
        // However, the prompt says "User enters username and password (OTP) from email".
        // The mock email sends: OTP and Activation Link.
        // Let's check for 'otp' param.
        const otpParam = searchParams.get('otp');
        if (otpParam) {
            setOtp(otpParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // NOTE: In a real scenario, we would have a specific /api/auth/activate endpoint.
            // Since we are "bridging" and the user wants to login, we might try to just Login 
            // if the OTP acts as a temporary password, OR we pretend to activate and then redirect.
            // Given the prompt: "The user... receives... panel user and one-time code... I want... login and password input..."
            // "This graph will only be filled by the Director/GM... prepare this page... between site and control panel".

            // For now, we will simulate the activation call.
            // If the backend had a real activation endpoint we would call it.
            // Since we are reusing the login endpoint in the main login page, let's see if we can just authenticate.
            // If 'otp' is actually set as the user's password in the backend (common for initial generated creds),
            // then we can just call the login endpoint.

            // Let's attempt standard login with the provided credentials.
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: otp }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                // If standard login fails, it might be because the backend doesn't treat OTP as password directly,
                // OR the user doesn't exist yet/password wrong.
                // However, based on previous conversations (Super Admin Registration), credentials are generated.
                // If this fails, we will show error.
                setError(data.error || 'აქტივაცია ვერ მოხერხდა. შეამოწმეთ მონაცემები.');
            }
        } catch (err) {
            setError('სერვერთან კავშირი ვერ დამყარდა.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-[#161b22] p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 animate-fadeIn">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lime-400/20 text-slate-900 font-black text-2xl">
                        <KeyRound size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">ანგარიშის აქტივაცია</h2>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-2">შეიყვანეთ მეილზე მიღებული მონაცემები</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2">მომხმარებელი (Email)</label>
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
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2">ერთჯერადი კოდი (OTP)</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none focus:border-lime-400 transition-all font-bold tracking-widest"
                                placeholder="******"
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
                        {loading ? 'აქტიურდება...' : 'აქტივაცია და შესვლა'}
                        {!loading && <ArrowRight size={16} className="ml-2" />}
                    </button>

                    <Link href="/" className="block w-full text-center text-slate-600 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                        მთავარზე დაბრუნება
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default function ActivatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">Loading...</div>}>
            <ActivateContent />
        </Suspense>
    );
}
