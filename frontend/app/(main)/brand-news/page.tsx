'use client';
import React from 'react';
import { Search, Filter, ExternalLink, Flame, Tag, ShoppingBag, Store } from 'lucide-react';

export default function BrandNewsPage() {
    return (
        <div className="max-w-screen-2xl mx-auto p-6 space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Store className="text-lime-400" size={32} />
                        ბრენდ სიახლეები
                    </h1>
                    <p className="text-slate-400 font-medium">პარტნიორების ექსკლუზიური შეთავაზებები და სიახლეები Artron-ის წევრებისთვის</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* Nike Card */}
                <div className="bg-[#161b22] border border-slate-800 rounded-[2rem] overflow-hidden hover:border-lime-500/50 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-lime-500/10">
                    <div className="h-52 bg-gradient-to-br from-slate-800 to-black relative flex items-center justify-center p-8">
                        {/* Placeholder for Image */}
                        <div className="text-white/10 font-black text-6xl italic tracking-tighter select-none">NIKE</div>
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">-30% SALE</div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">Nike Pro Elite</h3>
                            <Flame size={18} className="text-orange-500 fill-orange-500/20" />
                        </div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            სპეციალური შეთავაზება Artron-ის წევრებისთვის. შეიძინეთ უახლესი კოლექცია 30%-იანი ფასდაკლებით ჩვენს ფილიალებში.
                        </p>
                        <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 border-dashed">
                                <span className="text-lime-400 font-mono font-bold text-xs tracking-widest">ARTRON2026</span>
                            </div>
                            <button className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors hover:bg-slate-800">
                                <ExternalLink size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Adidas Card */}
                <div className="bg-[#161b22] border border-slate-800 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
                    <div className="h-52 bg-gradient-to-br from-blue-950 to-black relative flex items-center justify-center p-8">
                        <div className="text-white/10 font-black text-5xl tracking-tighter select-none">adidas</div>
                        <div className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">NEW</div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">Ultraboost 5</h3>
                            <Tag size={18} className="text-blue-500 fill-blue-500/20" />
                        </div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            გაიცანით ახალი Ultraboost 5. მაქსიმალური ენერგიის დაბრუნება და კომფორტი ვარჯიშის დროს.
                        </p>
                        <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <div className="px-3 py-1.5">
                                <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">ოფიციალური პარტნიორი</span>
                            </div>
                            <button className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors hover:bg-slate-800">
                                <ExternalLink size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Optimum Nutrition Card */}
                <div className="bg-[#161b22] border border-slate-800 rounded-[2rem] overflow-hidden hover:border-purple-500/50 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
                    <div className="h-52 bg-gradient-to-br from-purple-950 to-black relative flex items-center justify-center p-8">
                        <div className="text-white/10 font-black text-6xl tracking-tighter select-none text-center">ON</div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">Gold Standard</h3>
                            <ShoppingBag size={18} className="text-purple-500 fill-purple-500/20" />
                        </div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            მსოფლიოს #1 პროტეინი. შეიძინეთ 2 დიდი შეფუთვა და მიიღეთ ბრენდირებული შეიკერი საჩუქრად.
                        </p>
                        <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 border-dashed">
                                <span className="text-lime-400 font-mono font-bold text-xs tracking-widest">GYM10</span>
                            </div>
                            <button className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors hover:bg-slate-800">
                                <ExternalLink size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* MyProtein Card */}
                <div className="bg-[#161b22] border border-slate-800 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10">
                    <div className="h-52 bg-gradient-to-br from-cyan-950 to-black relative flex items-center justify-center p-8">
                        <div className="text-white/10 font-black text-4xl tracking-tighter select-none text-center">MyProtein</div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">Vegan Clear</h3>
                            <ShoppingBag size={18} className="text-cyan-500 fill-cyan-500/20" />
                        </div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            ახალი ვეგანური პროტეინი ხილის გემოებით. გააგრილე ზაფხული ჯანსაღად.
                        </p>
                        <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <div className="px-3 py-1.5">
                                <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">მალე...</span>
                            </div>
                            <button className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors hover:bg-slate-800">
                                <ExternalLink size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
