'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, CheckCircle2, ShieldCheck, Activity, Users, CreditCard, TrendingUp, Package, Briefcase, BarChart3, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen relative overflow-hidden font-sans">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('/hero-bg-game.png')` }}
            >
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Activity className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">ARTRON</span>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">შესაძლებლობები</a>
                    <a href="#pricing" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">პაკეტები</a>
                    <a href="#about" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">ჩვენს შესახებ</a>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">
                        <Play size={16} fill="currentColor" />
                        <span>დემო ვერსია</span>
                    </button>
                    <Link href="/auth/login" className="px-6 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors">
                        შესვლა
                    </Link>
                    <Link href="/onboarding" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-600/20 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2 group">
                        <span>რეგისტრაცია</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">სისტემა აქტიურია v2.4</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight max-w-4xl">
                    მართე ფიტნეს ბიზნესი <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">მომავლის ტექნოლოგიებით</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
                    სრული ავტომატიზაცია, CRM, გაყიდვების ანალიტიკა და წევრების მართვა ერთ სივრცეში.
                    შექმნილია თანამედროვე ფიტნეს ცენტრებისთვის.
                </p>
            </div>

            {/* Features Section */}
            <div id="features" className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto px-8 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            ყველა ინსტრუმენტი <span className="text-blue-500">ერთ პლატფორმაზე</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Artron გთავაზობთ სრულყოფილ ეკოსისტემას თქვენი ბიზნესის ზრდისთვის
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Member Management */}
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-blue-500/30 transition-all group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                <Users className="text-blue-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">წევრების მართვა</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                დეტალური პროფილები, ჯანმრთელობის ისტორია, სტატუსები და აქტივობა ერთ სივრცეში.
                            </p>
                        </div>

                        {/* Passes & Sales */}
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-purple-500/30 transition-all group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                <CreditCard className="text-purple-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">გაყიდვები</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                აბონემენტების მოქნილი სისტემა, განვადებები და ავტომატური ინვოისინგი.
                            </p>
                        </div>

                        {/* Access Control */}
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-green-500/30 transition-all group">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                <ShieldCheck className="text-green-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">დაშვების კონტროლი</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                ტურნიკეტების ინტეგრაცია, FaceID მხარდაჭერა და ვიზიტების ლაივ მონიტორინგი.
                            </p>
                        </div>

                        {/* CRM */}
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-pink-500/30 transition-all group">
                            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                                <TrendingUp className="text-pink-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">CRM და ლიდები</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                აკონტროლეთ პოტენციური მომხმარებლები და გაზარდეთ გაყიდვების კონვერსია.
                            </p>
                        </div>

                        {/* Warehouse */}
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-orange-500/30 transition-all group">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                                <Package className="text-orange-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">საწყობი</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                პროდუქციის აღრიცხვა, მომწოდებლები და ინვენტარიზაციის ავტომატიზაცია.
                            </p>
                        </div>

                        {/* Staff */}
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all group">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                                <Briefcase className="text-indigo-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">თანამშრომლები</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                წვდომის დონეები, ცვლების განრიგი და KPI მაჩვენებლების კონტროლი.
                            </p>
                        </div>

                        {/* Analytics */}
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all group">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                                <BarChart3 className="text-cyan-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">ანალიტიკა</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                შემოსავლების დეტალური რეპორტები და ბიზნესის ზრდის ტენდენციები.
                            </p>
                        </div>

                        {/* Corporate */}
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-teal-500/30 transition-all group">
                            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
                                <Building2 className="text-teal-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">კორპორატიული</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                პარტნიორი კომპანიების და მათი თანამშრომლების სპეციალური პორტალი.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
