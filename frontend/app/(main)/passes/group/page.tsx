'use client';

import React from 'react';
import { Users } from 'lucide-react';

export default function GroupActivityPage() {
    return (
        <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center text-center max-w-md w-full animate-fadeIn">
                <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mb-6 text-purple-600 shadow-lg shadow-purple-100">
                    <Users size={40} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2">ჯგუფური აქტივობები</h1>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    ეს გვერდი დამუშავების პროცესშია. მალე შეძლებთ ჯგუფური აქტივობების მართვას.
                </p>
                <div className="px-6 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest">
                    მალე...
                </div>
            </div>
        </div>
    );
}
