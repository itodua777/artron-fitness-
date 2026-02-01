
'use client';
import React from 'react';
import { X, CheckSquare, Trash2, Bell, Check } from 'lucide-react';
import { useLanguage } from '../app/contexts/LanguageContext';

interface Notification {
    id: number;
    type: 'EMAIL' | 'SYSTEM' | 'ALERT';
    sender: string;
    subject: string;
    content: string;
    time: string;
    isRead: boolean;
}

interface NotificationSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onDismiss: (id: number) => void;
    onDismissAll: () => void;
}

const NotificationSidePanel: React.FC<NotificationSidePanelProps> = ({
    isOpen,
    onClose,
    notifications,
    onDismiss,
    onDismissAll
}) => {
    const { t } = useLanguage();

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex items-center space-x-3">
                        <div className="bg-lime-500/10 p-2 rounded-lg">
                            <Bell size={20} className="text-lime-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">შეტყობინებები</h2>
                            <p className="text-xs text-slate-400 font-medium">თქვენ გაქვთ {notifications.length} ახალი შეტყობინება</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Dismiss All Toolbar */}
                {notifications.length > 0 && (
                    <div className="px-6 py-3 bg-slate-800/30 flex justify-end border-b border-slate-800">
                        <button
                            onClick={onDismissAll}
                            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-lime-400 transition-colors uppercase tracking-wider"
                        >
                            <CheckSquare size={14} />
                            <span>ყველას წაკითხვა</span>
                        </button>
                    </div>
                )}

                {/* Notification List */}
                <div className="overflow-y-auto h-[calc(100vh-140px)] p-4 space-y-3">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <Bell size={48} className="mb-4 opacity-20" />
                            <p className="text-sm">შეტყობინებები არ არის</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`group relative p-4 rounded-xl border transition-all duration-200 hover:border-slate-600 ${notification.isRead
                                    ? 'bg-slate-800/30 border-slate-800'
                                    : 'bg-slate-800 border-lime-500/30 shadow-lg shadow-lime-900/5'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        {/* Avatar / Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${notification.type === 'EMAIL' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                            notification.type === 'SYSTEM' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                            }`}>
                                            {notification.sender.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white leading-none mb-1">{notification.sender}</h4>
                                            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                                                {notification.time}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => onDismiss(notification.id)}
                                        className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-1"
                                    >
                                        <span className="text-[10px] font-bold hidden group-hover:block uppercase">Dismiss</span>
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="pl-[52px]">
                                    <h5 className="text-sm font-semibold text-slate-200 mb-1">{notification.subject}</h5>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        {notification.content}
                                    </p>
                                </div>

                                {!notification.isRead && (
                                    <div className="absolute left-0 top-6 w-1 h-8 bg-lime-500 rounded-r-full shadow-[0_0_10px_rgba(132,204,22,0.5)]"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationSidePanel;
