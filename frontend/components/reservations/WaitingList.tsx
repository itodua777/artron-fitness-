import React from 'react';
import { Bell, User, Phone, CheckCircle, Clock, Trash2 } from 'lucide-react';

interface Reservation {
    _id: string;
    firstName: string;
    lastName: string;
    mobile: string;
    activityType: string;
    status: string;
    createdAt: string;
}

interface WaitingListProps {
    reservations: Reservation[];
    onNotify: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function WaitingList({ reservations, onNotify, onDelete }: WaitingListProps) {
    if (reservations.length === 0) {
        return (
            <div className="bg-[#161b22] rounded-xl border border-slate-800 p-8 text-center">
                <p className="text-slate-500 text-sm font-bold">მომლოდინეთა სია ცარიელია</p>
            </div>
        );
    }

    return (
        <div className="bg-[#161b22] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white uppercase text-sm flex items-center">
                    <Clock size={16} className="mr-2 text-amber-500" />
                    მომლოდინეთა რიგი
                </h3>
                <span className="bg-[#1f2937] text-slate-400 px-2 py-0.5 rounded text-xs font-black">{reservations.length}</span>
            </div>
            <div className="divide-y divide-slate-800">
                {reservations.map((res, index) => (
                    <div key={res._id} className="p-4 hover:bg-[#1f2937]/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-500 text-xs font-bold">
                                    {index + 1}
                                </span>
                                <div>
                                    <div className="font-bold text-white text-sm">{res.firstName} {res.lastName}</div>
                                    <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                        <Phone size={10} className="mr-1" /> {res.mobile}
                                    </div>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                                {res.activityType}
                            </span>
                        </div>

                        <div className="flex items-center justify-end space-x-2 mt-3">
                            <button
                                onClick={() => onDelete(res._id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                            {res.status === 'notified' ? (
                                <span className="flex items-center text-xs font-bold text-emerald-500">
                                    <CheckCircle size={14} className="mr-1" />
                                    შეტყობინებულია
                                </span>
                            ) : (
                                <button
                                    onClick={() => onNotify(res._id)}
                                    className="flex items-center px-3 py-1.5 bg-[#1f2937] hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-400 text-xs font-bold rounded-lg transition-all border border-slate-700 hover:border-emerald-500/30"
                                >
                                    <Bell size={12} className="mr-1.5" />
                                    შეტყობინება
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
