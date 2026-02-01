'use client';

import React, { useEffect, useState } from 'react';
import {
    Building2,
    Globe2,
    Landmark,
    Ruler,
    Dumbbell,
    LayoutTemplate,
    Network,
    BookOpen,
    Check
} from 'lucide-react';

interface SymbiosisProps {
    onboardingStep: number;
    completionPercentage: number;
    onNodeClick: (view: any) => void;
}

const NODES = [
    { id: 'COMPANY', label: 'კომპანია', icon: Building2, step: 0, angle: 270, color: 'text-purple-500', bg: 'bg-purple-500' },
    { id: 'MODELING', label: 'მოდელირება', icon: Ruler, step: 1, angle: 315, color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { id: 'INVENTORY', label: 'ინვენტარი', icon: Dumbbell, step: 2, angle: 0, color: 'text-sky-500', bg: 'bg-sky-500' },
    { id: 'DIGITAL', label: 'ციფრული', icon: Globe2, step: 3, angle: 45, color: 'text-pink-500', bg: 'bg-pink-500' },
    { id: 'BANK', label: 'ბანკი', icon: Landmark, step: 4, angle: 90, color: 'text-orange-500', bg: 'bg-orange-500' },
    { id: 'STRUCTURE', label: 'სტრუქტურა', icon: Network, step: 5, angle: 135, color: 'text-blue-500', bg: 'bg-blue-500' },
    { id: 'BUILDER', label: 'აწყობა', icon: LayoutTemplate, step: 6, angle: 180, color: 'text-indigo-500', bg: 'bg-indigo-500' },
    { id: 'INSTRUCTIONS', label: 'ინსტრუქცია', icon: BookOpen, step: 7, angle: 225, color: 'text-indigo-400', bg: 'bg-indigo-400' },
];

export default function Symbiosis({ onboardingStep, completionPercentage, onNodeClick }: SymbiosisProps) {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    // Calculate positions
    const radius = 180; // Distance from center
    const center = { x: 250, y: 250 }; // SVG Center

    const getNodePos = (angle: number) => {
        const rad = (angle * Math.PI) / 180;
        return {
            x: center.x + radius * Math.cos(rad),
            y: center.y + radius * Math.sin(rad)
        };
    };

    // Tentacle Path Generator
    const getTentaclePath = (start: { x: number, y: number }, end: { x: number, y: number }, isActive: boolean) => {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        // Control points for organic curve
        const cp1 = {
            x: start.x + (end.x - start.x) * 0.3 + (isActive ? Math.random() * 10 - 5 : 0),
            y: start.y + (end.y - start.y) * 0.3
        };
        const cp2 = {
            x: start.x + (end.x - start.x) * 0.7,
            y: start.y + (end.y - start.y) * 0.7 - (isActive ? 20 : 0)
        };

        return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
    };

    return (
        <div className="w-full bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden min-h-[600px] flex items-center justify-center">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0) 70%)' }}></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Main Container */}
            <div className="relative w-[500px] h-[500px] z-10 scale-90 md:scale-100 transition-transform">

                {/* SVG Layer for Tentacles */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <linearGradient id="tentacleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {NODES.map((node) => {
                        const pos = getNodePos(node.angle);
                        const isActive = onboardingStep > node.step;
                        const isCurrent = onboardingStep === node.step;

                        return (
                            <g key={node.id}>
                                {/* Connection Line */}
                                <path
                                    d={getTentaclePath(center, pos, isActive || isCurrent)}
                                    fill="none"
                                    stroke={isActive ? `url(#tentacleGradient)` : '#334155'}
                                    strokeWidth={isActive ? 3 : 1.5}
                                    strokeLinecap="round"
                                    className={`transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-20'}`}
                                    filter={isActive ? "url(#glow)" : ""}
                                >
                                    {isActive && (
                                        <animate
                                            attributeName="stroke-dasharray"
                                            from="0, 1000"
                                            to="1000, 0"
                                            dur="1.5s"
                                            begin="0s"
                                            fill="freeze"
                                        />
                                    )}
                                </path>

                                {/* Pulse Effect on Line */}
                                {isActive && (
                                    <circle r="3" fill="#fff">
                                        <animateMotion
                                            dur={`${2 + Math.random()}s`}
                                            repeatCount="indefinite"
                                            path={getTentaclePath(center, pos, true)}
                                        />
                                    </circle>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Central Core (3D Symbiosis) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 z-20">
                    <div className="relative w-full h-full flex items-center justify-center group cursor-default">

                        {/* Outer Glow */}
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>

                        {/* 3D Sphere Effect */}
                        <div className="relative w-36 h-36 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden backdrop-blur-sm bg-slate-900/80 border border-slate-700/50 flex items-center justify-center z-30 isolation-auto">

                            {/* Inner Gradient Sphere */}
                            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5),inset_0_-2px_10px_rgba(255,255,255,0.1)]"></div>

                            {/* Core Light Source */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/40 to-indigo-500/40 blur-xl animate-pulse"></div>

                            {/* Tech Rings */}
                            <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-spin-slow"></div>
                            <div className="absolute inset-4 rounded-full border border-indigo-500/10 animate-reverse-spin border-dashed"></div>

                            {/* Data Content */}
                            <div className="relative z-40 text-center flex flex-col items-center">
                                <span className={`block text-4xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent drop-shadow-lg transition-all duration-700 ${completionPercentage === 100 ? 'text-emerald-400' : ''}`}>
                                    {Math.round(completionPercentage)}%
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">დასრულებულია</span>

                                {/* Status Indicator */}
                                <div className={`mt-3 px-2 py-0.5 rounded-full text-[9px] font-bold border ${completionPercentage === 100 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                    {completionPercentage === 100 ? 'სისტემა მზადაა' : 'მიმდინარეობს'}
                                </div>
                            </div>

                            {/* Glass Reflection */}
                            <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-full pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                {/* Nodes */}
                {NODES.map((node) => {
                    const pos = getNodePos(node.angle);
                    const isActive = onboardingStep > node.step;
                    const isCurrent = onboardingStep === node.step;
                    const isLocked = onboardingStep < node.step;

                    return (
                        <div
                            key={node.id}
                            style={{
                                left: pos.x,
                                top: pos.y,
                                transform: 'translate(-50%, -50%)',
                                width: '120px'
                            }}
                            className={`absolute z-30 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
                                ${isLocked ? 'grayscale opacity-50' : 'hover:scale-105'}
                            `}
                            onClick={() => !isLocked && onNodeClick(node.id)}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            {/* Icon Circle */}
                            <div className={`
                                w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 relative z-10
                                ${isActive ? 'bg-slate-900 border border-slate-700 text-white shadow-emerald-500/10' : ''}
                                ${isCurrent ? 'bg-slate-800 text-indigo-400 border-2 border-indigo-500 shadow-indigo-500/20' : ''}
                                ${isLocked ? 'bg-slate-900/50 text-slate-700 border border-slate-800' : ''}
                                group-hover:bg-slate-800
                            `}>
                                <node.icon size={28} className={`transition-colors duration-300 ${isActive ? node.color : ''}`} />

                                {/* Success Badge */}
                                {isActive && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg">
                                        <Check size={12} className="text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Label - Always Visible Now */}
                            <div className={`
                                mt-3 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 backdrop-blur-md
                                ${isCurrent ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 translate-y-0 opacity-100' : ''}
                                ${isActive && !isCurrent ? 'bg-slate-800/80 text-slate-300 border border-slate-700/50' : ''}
                                ${isLocked ? 'text-slate-600' : ''}
                                group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-600
                            `}>
                                {node.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes reverse-spin {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                } 
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-reverse-spin {
                    animation: reverse-spin 25s linear infinite;
                }
            `}</style>
        </div>
    );
}
