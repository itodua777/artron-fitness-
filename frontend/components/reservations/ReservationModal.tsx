import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail, FileText, Activity } from 'lucide-react';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReservationModal({ isOpen, onClose, onSuccess }: ReservationModalProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        personalId: '',
        mobile: '',
        email: '',
        activityType: 'Zumba'
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

        try {
            const res = await fetch(`${apiUrl}/api/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
                onClose();
                setFormData({
                    firstName: '',
                    lastName: '',
                    personalId: '',
                    mobile: '',
                    email: '',
                    activityType: 'Zumba'
                });
            } else {
                console.error('Failed to create reservation');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#161b22] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <Calendar className="mr-2 text-emerald-500" size={20} />
                        ადგილის დაჯავშნა
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">სახელი</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-3 text-slate-500" />
                                <input
                                    required
                                    type="text"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-slate-800 rounded-xl focus:border-emerald-500 outline-none text-sm text-white"
                                    placeholder="სახელი"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">გვარი</label>
                            <input
                                required
                                type="text"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-800 rounded-xl focus:border-emerald-500 outline-none text-sm text-white"
                                placeholder="გვარი"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">პირადი ნომერი</label>
                        <div className="relative">
                            <FileText size={14} className="absolute left-3 top-3 text-slate-500" />
                            <input
                                required
                                type="text"
                                value={formData.personalId}
                                onChange={e => setFormData({ ...formData, personalId: e.target.value })}
                                className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-slate-800 rounded-xl focus:border-emerald-500 outline-none text-sm text-white"
                                placeholder="010..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">მობილური</label>
                        <div className="relative">
                            <Phone size={14} className="absolute left-3 top-3 text-slate-500" />
                            <input
                                required
                                type="tel"
                                value={formData.mobile}
                                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-slate-800 rounded-xl focus:border-emerald-500 outline-none text-sm text-white"
                                placeholder="+995..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">ელ-ფოსტა</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3 top-3 text-slate-500" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-slate-800 rounded-xl focus:border-emerald-500 outline-none text-sm text-white"
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">აქტივობა</label>
                        <div className="relative">
                            <Activity size={14} className="absolute left-3 top-3 text-slate-500" />
                            <select
                                value={formData.activityType}
                                onChange={e => setFormData({ ...formData, activityType: e.target.value })}
                                className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-slate-800 rounded-xl focus:border-emerald-500 outline-none text-sm text-white appearance-none"
                            >
                                <option value="Zumba">ზუმბა</option>
                                <option value="Pilates">პილატესი</option>
                                <option value="Yoga">იოგა</option>
                                <option value="Crossfit">კროსფიტი</option>
                            </select>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all mt-4 disabled:opacity-50"
                    >
                        {loading ? 'იგზავნება...' : 'ადგილის დაჯავშნა'}
                    </button>
                </form>
            </div>
        </div>
    );
}
