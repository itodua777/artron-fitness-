import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ARTRON',
    description: 'Gym Management System',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ka">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-slate-900 text-slate-300 antialiased font-sans">
                {children}
            </body>
        </html>
    );
}
