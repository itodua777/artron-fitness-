'use client';

import React, { useState } from 'react';

export default function SuperAdminPage() {
    const [gymData, setGymData] = useState({
        name: '',
        brandName: '',
        address: '',
        contactEmail: '',
    });

    const [adminData, setAdminData] = useState({
        firstname: '',
        lastname: '',
        IdCard: '',
        email: '',
        mobile: '',
        password: '', // Optional
    });

    const [createdTenant, setCreatedTenant] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleGymChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGymData({ ...gymData, [e.target.name]: e.target.value });
    };

    const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    const registerGym = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/tenants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gymData),
            });
            if (!res.ok) throw new Error('Failed to create gym');
            const data = await res.json();
            setCreatedTenant(data);
            setMessage(`Gym "${data.name}" created! Now register the admin.`);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const registerAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createdTenant) {
            setError('No gym created yet.');
            return;
        }
        setError('');
        setMessage('');
        try {
            // Include tenantName for logging purposes
            const payload = { ...adminData, tenantName: createdTenant.name };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/tenants/${createdTenant._id}/admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to create admin');
            const data = await res.json();
            setMessage(`Admin "${data.firstname}" created and credentials saved to file!`);
            // Reset forms optionally
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-blue-400">Super Admin Dashboard</h1>

            {message && <div className="bg-green-600 p-4 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-600 p-4 rounded mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gym Registration */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">1. Register New Gym</h2>
                    <form onSubmit={registerGym} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Business Name</label>
                            <input name="name" value={gymData.name} onChange={handleGymChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Brand Name</label>
                            <input name="brandName" value={gymData.brandName} onChange={handleGymChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Address</label>
                            <input name="address" value={gymData.address} onChange={handleGymChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Contact Email</label>
                            <input name="contactEmail" type="email" value={gymData.contactEmail} onChange={handleGymChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" required />
                        </div>
                        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded font-bold transition">Create Gym</button>
                    </form>
                </div>

                {/* Admin Registration */}
                <div className={`bg-gray-800 p-6 rounded-lg border border-gray-700 ${!createdTenant ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h2 className="text-xl font-semibold mb-4 text-green-400">2. Register Gym Admin</h2>
                    <p className="text-xs text-gray-400 mb-4">For Gym: {createdTenant?.name || 'Waiting...'}</p>
                    <form onSubmit={registerAdmin} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">First Name</label>
                                <input name="firstname" value={adminData.firstname} onChange={handleAdminChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Last Name</label>
                                <input name="lastname" value={adminData.lastname} onChange={handleAdminChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">ID Card (Personal #)</label>
                            <input name="IdCard" value={adminData.IdCard} onChange={handleAdminChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Email (Login)</label>
                            <input name="email" type="email" value={adminData.email} onChange={handleAdminChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Mobile</label>
                            <input name="mobile" value={adminData.mobile} onChange={handleAdminChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Password (Optional - Auto-generated if empty)</label>
                            <input name="password" type="password" value={adminData.password} onChange={handleAdminChange} className="w-full bg-gray-700 border border-gray-600 p-2 rounded" placeholder="Leave empty to auto-generate" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-bold transition">Create Admin & Save Credentials</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
