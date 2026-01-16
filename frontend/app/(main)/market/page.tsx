'use client';
import React, { useState } from 'react';
import {
    Plus, ShoppingCart, Trash2, Minus, CreditCard, Banknote
} from 'lucide-react';
import { MarketItem } from '@/app/types';

// Mock Data
const initialGroceries: MarketItem[] = [
    { id: 1, name: 'ენერგეტიკული სასმელი', price: 5.00, stock: 45, category: 'სასმელები', image: 'https://picsum.photos/400/400?random=10' },
    { id: 2, name: 'პროტეინის ბატონი', price: 8.50, stock: 30, category: 'კვება', image: 'https://picsum.photos/400/400?random=11' },
    { id: 3, name: 'წყალი (0.5ლ)', price: 2.00, stock: 120, category: 'სასმელები', image: 'https://picsum.photos/400/400?random=12' },
    { id: 4, name: 'ესპრესო', price: 4.00, stock: 500, category: 'ყავა', image: 'https://picsum.photos/400/400?random=13' },
];

export default function MarketPage() {
    const [selectedCategory, setSelectedCategory] = useState('ყველა');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'terminal'>('cash');

    // Data States
    const [groceries, setGroceries] = useState<MarketItem[]>(initialGroceries);
    const [cart, setCart] = useState<{ item: MarketItem, qty: number }[]>([]);

    // --- Handlers ---
    const addToCart = (product: MarketItem) => {
        const existing = cart.find(x => x.item.id === product.id);
        if (existing) {
            setCart(cart.map(x => x.item.id === product.id ? { ...x, qty: x.qty + 1 } : x));
        } else {
            setCart([...cart, { item: product, qty: 1 }]);
        }
    };

    const removeFromCart = (id: number) => setCart(cart.filter(x => x.item.id !== id));

    const adjustQty = (id: number, delta: number) => {
        setCart(cart.map(x => {
            if (x.item.id === id) {
                return { ...x, qty: Math.max(1, x.qty + delta) };
            }
            return x;
        }));
    };

    const calculateTotal = () => cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0).toFixed(2);

    const filteredGroceries = selectedCategory === 'ყველა'
        ? groceries
        : groceries.filter(item => item.category === selectedCategory);

    return (
        <div className="space-y-6 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col">

            {/* TERMINAL VIEW */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0 animate-fadeIn">
                {/* Product Grid Area */}
                <div className="lg:col-span-3 flex flex-col min-h-0">
                    {/* Filter Tabs */}
                    <div className="flex space-x-3 pb-4 overflow-x-auto shrink-0 no-scrollbar">
                        {['ყველა', 'სასმელები', 'კვება', 'ყავა', 'ალკოჰოლი'].map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all shadow-sm border ${selectedCategory === cat
                                    ? 'bg-lime-500 text-slate-900 border-lime-500'
                                    : 'bg-[#161b22] text-slate-500 border-slate-800 hover:border-slate-700 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable Grid */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredGroceries.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-[#161b22] rounded-[2rem] border border-slate-800 overflow-hidden cursor-pointer hover:shadow-xl hover:border-lime-500/50 transition-all duration-300 group flex flex-col h-72"
                                >
                                    <div className="relative h-40 overflow-hidden bg-[#0d1117]">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-black text-white shadow-lg border border-white/10">
                                            ₾ {product.price.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{product.category}</div>
                                            <h3 className="font-black text-white text-sm leading-tight line-clamp-2">{product.name}</h3>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className={`text-[10px] font-black uppercase ${product.stock < 10 ? 'text-red-500' : 'text-slate-500'}`}>
                                                ნაშთი: {product.stock}
                                            </span>
                                            <div className="w-9 h-9 rounded-2xl bg-[#0d1117] text-slate-400 flex items-center justify-center group-hover:bg-lime-500 group-hover:text-slate-900 group-hover:rotate-90 transition-all duration-300">
                                                <Plus size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Panel */}
                <div className="lg:col-span-1 bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 flex flex-col h-full overflow-hidden">
                    <div className="p-6 border-b border-slate-800 bg-[#0d1117]/50 flex items-center space-x-3">
                        <div className="p-2 bg-[#0d1117] rounded-xl shadow-sm text-slate-400 border border-slate-800"><ShoppingCart size={20} /></div>
                        <h3 className="font-black text-white text-sm uppercase tracking-widest">მიმდინარე შეკვეთა</h3>
                    </div>

                    {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-600 opacity-60">
                            <ShoppingCart size={48} strokeWidth={1} className="mb-4" />
                            <p className="text-sm font-black uppercase tracking-tighter">კალათა ცარიელია</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.item.id} className="flex items-center justify-between bg-[#0d1117] p-4 rounded-2xl border border-slate-800 group animate-fadeIn">
                                    <div className="flex-1">
                                        <h4 className="text-xs font-black text-white line-clamp-1">{item.item.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-500">₾{item.item.price} / ერთ.</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => adjustQty(item.item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-[#161b22] rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all active:scale-90"><Minus size={14} /></button>
                                        <span className="text-xs font-black w-4 text-center text-white">{item.qty}</span>
                                        <button onClick={() => adjustQty(item.item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-[#161b22] rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all active:scale-90"><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.item.id)} className="ml-3 p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="p-6 bg-[#0d1117] border-t border-slate-800 space-y-4">

                        {/* Payment Method Selection */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === 'cash'
                                    ? 'bg-[#1f2937] border-lime-500 text-lime-500'
                                    : 'bg-[#161b22] border-slate-800 text-slate-500 hover:border-slate-700'
                                    }`}
                            >
                                <Banknote size={20} className="mb-2" />
                                <span className="text-[10px] font-black uppercase">ნაღდი</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('terminal')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === 'terminal'
                                    ? 'bg-[#1f2937] border-blue-500 text-blue-500'
                                    : 'bg-[#161b22] border-slate-800 text-slate-500 hover:border-slate-700'
                                    }`}
                            >
                                <CreditCard size={20} className="mb-2" />
                                <span className="text-[10px] font-black uppercase">ტერმინალი</span>
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">ჯამური თანხა</span>
                            <span className="font-black text-white text-2xl">₾ {calculateTotal()}</span>
                        </div>
                        <button
                            disabled={cart.length === 0}
                            onClick={() => {
                                alert(`გადახდა წარმატებით შესრულდა! მეთოდი: ${paymentMethod === 'cash' ? 'ნაღდი' : 'ტერმინალი'}`);
                                setCart([]);
                            }}
                            className="w-full py-4 bg-lime-500 text-slate-900 font-black rounded-2xl hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/10 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed uppercase text-xs tracking-widest"
                        >
                            გადახდა
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
