'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import ReservationModal from '@/components/reservations/ReservationModal';
import WaitingList from '@/components/reservations/WaitingList';

export default function SeatReservationPage() {
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        try {
            const res = await fetch(`${apiUrl}/api/reservations`);
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (error) {
            console.error('Failed to fetch reservations', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleNotifyReservation = async (id: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        try {
            await fetch(`${apiUrl}/api/reservations/${id}/notify`, { method: 'PATCH' });
            fetchReservations();
        } catch (error) {
            console.error('Failed to notify', error);
        }
    };

    const handleDeleteReservation = async (id: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        try {
            await fetch(`${apiUrl}/api/reservations/${id}`, { method: 'DELETE' });
            fetchReservations();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    return (
        <div className="flex-1 bg-slate-900 overflow-y-auto p-8 animate-fadeIn">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                            <Calendar className="mr-3 text-lime-400" size={32} />
                            ადგილის დაჯავშნა
                        </h1>
                        <p className="text-slate-500 text-sm">მართეთ ჯგუფური ვარჯიშების ჯავშნები და მომლოდინეთა სია.</p>
                    </div>

                    <button
                        onClick={() => setIsReservationModalOpen(true)}
                        className="py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span>ახალი ჯავშანი</span>
                    </button>
                </div>

                <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <WaitingList
                        reservations={reservations}
                        onNotify={handleNotifyReservation}
                        onDelete={handleDeleteReservation}
                    />
                </div>
            </div>

            <ReservationModal
                isOpen={isReservationModalOpen}
                onClose={() => setIsReservationModalOpen(false)}
                onSuccess={fetchReservations}
            />
        </div>
    );
}
