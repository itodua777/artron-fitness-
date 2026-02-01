
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogIn, LogOut, ClipboardPen, Plus, Trash2, Clock, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Mail, Settings, AlertCircle, Check, LayoutGrid, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../app/contexts/LanguageContext';
import BranchSwitcher from './BranchSwitcher';
import NotificationSidePanel from './NotificationSidePanel';

interface HeaderProps {
    title?: string;
    tenantName?: string;
}

interface Note {
    id: number;
    text: string;
    time: string;
    date: string; // YYYY-MM-DD
    reminded: boolean;
}

interface Notification {
    id: number;
    type: 'EMAIL' | 'SYSTEM' | 'ALERT';
    sender: string;
    subject: string;
    content: string;
    time: string;
    isRead: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = "Dashboard", tenantName }) => {
    const { t } = useLanguage();

    // Note Board State
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteText, setNewNoteText] = useState('');
    const [newNoteTime, setNewNoteTime] = useState('');

    // Config State
    const [brandName, setBrandName] = useState('კუნთის მასა BEEF');
    const [headerConfig, setHeaderConfig] = useState({
        showLogin: false,
        showBookmark: false,
        showSearch: false,
        showAlert: false,
        showControlPanel: true
    });

    useEffect(() => {
        const loadConfig = () => {
            const savedConfig = localStorage.getItem('artron_header_config');
            if (savedConfig) setHeaderConfig(JSON.parse(savedConfig) || {});

            const savedProfile = localStorage.getItem('artron_company_profile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed && parsed.brandName) setBrandName(parsed.brandName);
                } catch (e) {
                    // ignore
                }
            }
        };
        loadConfig();
        window.addEventListener('storage', loadConfig);
        return () => window.removeEventListener('storage', loadConfig);
    }, []);

    // Notification State
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            type: 'EMAIL',
            sender: 'sales@partner.ge',
            subject: 'ინვოისი #8822',
            content: 'გამარჯობა, გიგზავნით გასული თვის ინვენტარიზაციის ინვოისს.',
            time: '10 წუთის წინ',
            isRead: false
        },
        {
            id: 2,
            type: 'SYSTEM',
            sender: 'ARTRON System',
            subject: 'სარეზერვო ასლი',
            content: 'მონაცემთა ბაზის სარეზერვო ასლი წარმატებით შეიქმნა.',
            time: '1 საათის წინ',
            isRead: false
        },
        // ... more notification mocks
    ]);

    // Calendar State
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date()); // For navigation
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // For selection (YYYY-MM-DD)

    // Animation State
    const [isRinging, setIsRinging] = useState(false);
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage");
            }
        }
    }, []);
    const notePanelRef = useRef<HTMLDivElement>(null);
    const notificationPanelRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        if (unreadCount > 0) {
            setIsRinging(true);
            const timer = setTimeout(() => setIsRinging(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [unreadCount]);

    // Manual Turnstile Trigger
    const handleManualTrigger = (type: 'ENTRY' | 'EXIT') => {
        const action = type === 'ENTRY' ? 'შესვლა' : 'გასვლა';
        // Use toast or similar in real app
        console.log(`ტურნიკეტი გაიღო: ${action} დაფიქსირებულია.`);
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    // --- Calendar Helpers ---
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentCalendarDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentCalendarDate(newDate);
    };

    const handleDateClick = (day: number) => {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(formattedDate);
    };

    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ka-GE', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    // Add Note
    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteText) return;
        const newNote: Note = { id: Date.now(), text: newNoteText, time: newNoteTime, date: selectedDate, reminded: false };
        setNotes([...notes, newNote]);
        setNewNoteText('');
        setNewNoteTime('');
    };

    // Delete Note
    const handleDeleteNote = (id: number) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    // Check Time for Notifications
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentDateStr = now.toISOString().split('T')[0];
            const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            setNotes(prevNotes => {
                let hasUpdates = false;
                const updatedNotes = prevNotes.map(note => {
                    if (note.date === currentDateStr && note.time === currentTime && !note.reminded) {
                        hasUpdates = true;
                        setIsRinging(true);
                        setTimeout(() => setIsRinging(false), 5000);
                        return { ...note, reminded: true };
                    }
                    return note;
                });
                return hasUpdates ? updatedNotes : prevNotes;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Close panels when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notePanelRef.current && !notePanelRef.current.contains(event.target as Node)) {
                setIsNotesOpen(false);
            }
            if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const monthNames = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოებმერი', 'დეკემბერი'];
    const weekDays = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];
    const filteredNotes = notes.filter(n => n.date === selectedDate);

    return (
        <header className="bg-slate-900 h-20 px-4 md:px-8 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30">
            <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                </div>
                {tenantName && <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest leading-none">for {tenantName}</span>}
            </div>

            <Link href="/pos" className="ml-8 hidden lg:flex items-center gap-3 px-5 py-2 rounded-full bg-white text-slate-900 shadow-lg shadow-purple-500/5 hover:bg-slate-50 transition-all">
                <span className="font-bold text-xs tracking-wider">ART-NEWS</span>
                <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></span>
                </div>
            </Link>

            <div className="flex items-center space-x-6">

                {/* Manual Turnstile Controls */}
                {headerConfig.showLogin && (
                    <div className="hidden lg:flex items-center space-x-3 mr-4">
                        <button onClick={() => handleManualTrigger('ENTRY')} className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 uppercase tracking-wide">
                            <LogIn size={16} /><span>{t('header.manual_entry')}</span>
                        </button>
                        <button onClick={() => handleManualTrigger('EXIT')} className="flex items-center space-x-2 px-4 py-2 bg-text-orange-500/10 text-orange-400 font-bold text-xs rounded-lg border border-orange-500/20 hover:bg-orange-500/20 transition-all active:scale-95 uppercase tracking-wide">
                            <LogOut size={16} /><span>{t('header.manual_exit')}</span>
                        </button>
                    </div>
                )}

                {/* Control Panel Toggle */}
                {headerConfig.showControlPanel && (
                    <div className="relative group">
                        <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors">
                            <LayoutGrid size={20} />
                        </button>
                        <div className="absolute right-0 top-12 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-50 animate-fadeIn origin-top-right hidden group-hover:block">
                            <div className="p-4 border-b border-slate-700 bg-slate-800/50 rounded-t-xl">
                                <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center">
                                    <LayoutGrid size={14} className="mr-2 text-indigo-400" />
                                    სამართავი პანელი
                                </h3>
                            </div>
                            <div className="p-2 grid grid-cols-2 gap-2">
                                <button className="flex flex-col items-center justify-center p-3 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-indigo-400">
                                    <Settings size={20} className="mb-2 opacity-50" />
                                    <span className="text-[10px] font-bold">პარამეტრები</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-3 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-indigo-400">
                                    <User size={20} className="mb-2 opacity-50" />
                                    <span className="text-[10px] font-bold">პროფილი</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-3 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-indigo-400">
                                    <Bell size={20} className="mb-2 opacity-50" />
                                    <span className="text-[10px] font-bold">Alerts</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-3 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-indigo-400">
                                    <LogOut size={20} className="mb-2 opacity-50" />
                                    <span className="text-[10px] font-bold">გასვლა</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Note Board Toggle */}
                {headerConfig.showBookmark && (
                    <div className="relative" ref={notePanelRef}>
                        <button onClick={() => { setIsNotesOpen(!isNotesOpen); setIsNotificationsOpen(false); }} className={`p-2 transition-colors ${isNotesOpen ? 'text-lime-400 bg-lime-500/10 rounded-lg' : 'text-slate-400 hover:text-lime-400'}`}>
                            <ClipboardPen size={20} />
                        </button>
                        {isNotesOpen && (
                            <div className="absolute right-0 top-12 w-80 md:w-96 bg-slate-900 rounded-2xl shadow-xl border border-slate-700 z-50 animate-fadeIn origin-top-right overflow-hidden flex flex-col">
                                {/* Similar content to original note board */}
                                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                                    <h3 className="font-bold text-white flex items-center"><ClipboardPen size={16} className="mr-2 text-lime-400" />{t('header.notes')}</h3>
                                    <button onClick={() => setIsNotesOpen(false)} className="text-slate-500 hover:text-red-400"><X size={18} /></button>
                                </div>

                                {/* Calendar in Note Board - Adjusted for Dark Mode */}
                                <div className="p-4 border-b border-slate-800">
                                    <div className="flex justify-between items-center mb-3">
                                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-800 rounded text-slate-400"><ChevronLeft size={16} /></button>
                                        <span className="font-bold text-sm text-slate-300">{monthNames[month]} {year}</span>
                                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-800 rounded text-slate-400"><ChevronRight size={16} /></button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center mb-2">{weekDays.map(d => <div key={d} className="text-[10px] text-slate-500 font-medium">{d}</div>)}</div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const d = i + 1;
                                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                            const isSelected = selectedDate === dateStr;
                                            return (
                                                <button key={d} onClick={() => handleDateClick(d)} className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all relative ${isSelected ? 'bg-lime-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}>
                                                    {d}{notes.some(n => n.date === dateStr) && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-lime-500 rounded-full"></span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-800/30">
                                    <form onSubmit={handleAddNote} className="mb-2 space-y-2">
                                        <input type="text" placeholder="ჩანაწერი ამ დღისთვის..." value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-white text-sm focus:border-lime-500 outline-none placeholder:text-slate-600" />
                                        <div className="flex space-x-2">
                                            <div className="relative flex-1"><Clock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" /><input type="time" value={newNoteTime} onChange={(e) => setNewNoteTime(e.target.value)} className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 text-sm focus:border-lime-500 outline-none" /></div>
                                            <button type="submit" className="px-4 py-2 bg-lime-500 text-slate-900 rounded-lg text-sm font-bold hover:bg-lime-400 transition-colors flex items-center"><Plus size={16} /></button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {headerConfig.showSearch && (
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder={t('header.search')} className="pl-10 pr-4 py-2 rounded-full border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent w-64 transition-all placeholder:text-slate-500" />
                    </div>
                )}

                {/* Bell Icon */}
                {headerConfig.showAlert && (
                    <div className="relative" ref={notificationPanelRef}>
                        <button
                            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsNotesOpen(false); }}
                            className={`relative p-2 transition-colors rounded-lg ${isNotificationsOpen ? 'text-lime-400 bg-lime-500/10' : 'text-slate-400 hover:text-lime-400'} ${isRinging ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''}`}
                        >
                            <Bell size={20} className={unreadCount > 0 ? 'fill-current' : ''} />
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-slate-900 flex items-center justify-center">{unreadCount}</span>}
                        </button>
                    </div>
                )}

                {/* Branch Switcher */}
                <BranchSwitcher />

                <div className="flex items-center space-x-3 pl-6 border-l border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-white">{user?.name || 'მომხმარებელი'}</p>
                        <p className="text-xs text-slate-400">{user?.role === 'DIRECTOR' ? 'დირექტორი' : user?.role || t('header.admin')}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                        <User size={20} />
                    </div>
                </div>

            </div>

            <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>
            <NotificationSidePanel
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onDismiss={deleteNotification}
                onDismissAll={clearAllNotifications}
            />
        </header>
    );
};

export default Header;
