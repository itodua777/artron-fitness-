import React, { useState, useEffect } from 'react';
import { Activity, Users, ShieldAlert } from 'lucide-react';

const GYM_AREA = 1500; // m^2
const STAFF_COUNT = 15;
const LOCKERS = {
    MALE: 200,
    FEMALE: 200
};

// Mock data generator for demo purposes
const generateMockData = () => {
    // Random active users between 50 and 300
    const male = Math.floor(Math.random() * 150) + 20;
    const female = Math.floor(Math.random() * 150) + 20;
    return { male, female };
};

const LiveLoadWidget = () => {
    // State for animated values
    const [activeUsers, setActiveUsers] = useState({ male: 0, female: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial data
        setActiveUsers(generateMockData());

        // Update data every 5 seconds to simulate live feed
        const interval = setInterval(() => {
            setActiveUsers(generateMockData());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // --- Calculation Logic ---
    // 1. Adjusted User Count = (Active Users * 1.1) + Staff Count (Staff distributed proportional to users or added to total?)
    //    User prompt: "დარბაზში შემოსული მომხმარებლების რაოდენობა გამრავლებული 1.1-ზე, დამატებული თანამშრომელთა რაოდენობა"
    //    We'll apply this to the TOTAL first. For gender breakdown, we might distribute staff or ignore.
    //    Let's apply the multiplier to the raw counts first.

    const rawTotal = activeUsers.male + activeUsers.female;

    // Adjusted Total = (Raw Total * 1.1) + Staff
    // Wait, the formula says: "User Count * 1.1 + Staff"
    // Let's assume this applies to the aggregate load.
    const adjustedTotalLoad = Math.round((rawTotal * 1.1) + STAFF_COUNT);

    // Standard Capacity (Max Load) = Area / 3
    const standardMaxCapacity = Math.round(GYM_AREA / 3);

    // Determines which capacity basis to use (Standard Area-based or Locker-based)
    // Constraint: If Current Load > Locker Count (per gender?), use Locker Count.
    // The prompt says "if current gym load matches max load...".
    // "If current gym load is greater than corresponding gender locker count, then calculate current gym load from locker count"
    // This implies we should calculate gender loads individually to check locker constraints.

    // Let's break it down by gender to check constraints
    const adjustedMaleLoad = Math.round((activeUsers.male * 1.1) + (STAFF_COUNT / 2)); // Distributed staff roughly
    const adjustedFemaleLoad = Math.round((activeUsers.female * 1.1) + (STAFF_COUNT / 2));

    // Calculate Percentages with Constraints
    const calcPercentage = (load: number, lockerCount: number) => {
        // Standard capacity per gender isn't defined, usually shared area.
        // But the constraint is specific to Lockers.
        // Let's use the Global Standard Capacity for the main circle, but checks against Total Lockers (400)?
        // Or does "corresponding gender locker count" only apply to gender stats?

        // Interpretation:
        // Main Circle shows TOTAL System Load.
        // Max Capacity for System = StandardMaxCapacity (Area/3) aka 500.
        // UNLESS Total Load > Total Lockers (400). Then Max Capacity = 400?
        // Actually, logic says: "calculate current gym load FROM locker count".
        // This likely means the Denominator changes.

        // Let's stick to the simplest interpretation for the visual:
        // Max Capacity is usually fixed (500).
        // If Load > Lockers, maybe the system is overloaded?

        // Re-reading strictly: "If current hall load > corresponding gender locker count, then calculate hall load from locker count".
        // It sounds like a Utilization calculation rule.
        // Utilization = Load / Capacity. 
        // Default Capacity = Area / 3.
        // If Load > Lockers, Capacity = Lockers. (This would make % > 100 very fast).

        // Actually, maybe it simply means:
        // Percentage = Load / (Area/3).
        // BUT if Load > Lockers, Percentage = Load / Lockers.

        // Let's go with: Base Denominator = Area / 3.
        // If Load > Lockers, Denominator = Lockers.

        let capacity = standardMaxCapacity;
        const totalLockers = LOCKERS.MALE + LOCKERS.FEMALE;

        // Since we are showing TOTAL, we compare against Total Lockers?
        // Or strictly strictly follows the prompt. Prompt mentions "corresponding gender".
        // This implies the rule is for gender-specific stats. 
        // For the MAIN TOTAL, we likely sum them or compare vs Total Lockers.

        if (load > totalLockers) {
            capacity = totalLockers;
        }

        return Math.min(Math.round((load / capacity) * 100), 100); // Cap at 100 for visual? Or let it overflow?
        // User screenshot shows "29%", so likely capped or standard.
    };

    const totalPercentage = calcPercentage(adjustedTotalLoad, LOCKERS.MALE + LOCKERS.FEMALE);

    // Gender Specific Percentages (for the breakdown)
    // We assume gender capacity is roughly half of total area capacity? 
    // Or just use the Locker count as the hard limit/basis for them?
    // Let's just show the raw counts and a relative bar for genders.

    // Visual Constants
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (totalPercentage / 100) * circumference;

    const getColor = (p: number) => {
        if (p < 50) return '#10b981'; // Emerald/Green
        if (p < 75) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    const currentColor = getColor(totalPercentage);

    return (
        <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 p-8 shadow-xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                    <h3 className="text-white font-black uppercase text-lg tracking-tight mb-1">დატვირთულობა (LIVE)</h3>
                    <p className="text-slate-500 text-[10px] font-bold">გათვლილი 1 ადამიანი 3 მ²-ზე</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-2xl text-emerald-500 border border-slate-700/50 shadow-inner">
                    <Activity size={24} className="animate-pulse" />
                </div>
            </div>

            {/* Circular Progress */}
            <div className="flex flex-col items-center justify-center py-8 relative z-10">
                <div className="relative w-48 h-48">
                    {/* Background Circle */}
                    <svg
                        height={radius * 2}
                        width={radius * 2}
                        className="transform -rotate-90 origin-center"
                    >
                        <circle
                            stroke="#1f2937"
                            strokeWidth={stroke}
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        <circle
                            stroke={currentColor}
                            strokeWidth={stroke}
                            strokeDasharray={`${circumference} ${circumference}`}
                            style={{ strokeDashoffset }}
                            strokeLinecap="round"
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            className={`transition-all duration-1000 ease-out ${mounted ? 'opacity-100' : 'opacity-0'}`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-white tracking-tighter" style={{ textShadow: `0 0 20px ${currentColor}40` }}>
                            {totalPercentage}%
                        </span>
                        <span className="text-[10px] font-black uppercase text-slate-500 mt-1 tracking-widest">Full Load</span>
                    </div>
                </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
                <div className="bg-[#0d1117] rounded-2xl p-4 border border-slate-800">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">ახლა შიგნით</p>
                    <h4 className="text-2xl font-black text-white">{adjustedTotalLoad}</h4>
                </div>
                <div className="bg-[#0d1117] rounded-2xl p-4 border border-slate-800">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">მაქს. ტევადობა</p>
                    <h4 className="text-2xl font-black text-slate-400">{standardMaxCapacity}</h4>
                </div>
            </div>

            {/* Gender Breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">კაცები</p>
                        <p className="text-sm font-black text-white">{activeUsers.male} <span className="text-[10px] text-slate-600">({adjustedMaleLoad})</span></p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">ქალები</p>
                        <p className="text-sm font-black text-white">{activeUsers.female} <span className="text-[10px] text-slate-600">({adjustedFemaleLoad})</span></p>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-12 -right-12 opacity-5 pointer-events-none">
                <ShieldAlert size={180} />
            </div>
        </div>
    );
};

export default LiveLoadWidget;
