
'use client';
import React from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LanguageProvider>
            <div className="flex bg-slate-50 h-screen font-sans text-slate-900 overflow-hidden animate-fadeIn">
                <Sidebar />
                <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                    {/* Header Title will need to be dynamic per page, but for now generic. 
                 Ideally, Header uses a context or Zustand to set title, or we pass it down if we move Header into pages.
                 Here we use a generic Header and let pages potentially update title via a Context or just generic 'Dashboard'. 
                 Start with generic 'Artron' or current path?
              */}
                    <Header title="ARTRON" />
                    <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-900">
                        {/* Layout background matches body */}
                        <div className="min-h-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </LanguageProvider>
    );
}
