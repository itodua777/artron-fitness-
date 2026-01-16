
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'ka' | 'en' | 'ru';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    ka: {
        // Sidebar
        'menu.dashboard': 'მთავარი',
        'menu.users': 'მომხმარებელი',
        'menu.user_list': 'მომხმარებლის სია',
        'menu.add_user': 'დამატება',
        'menu.activity_group': 'აქტივობის რეგისტრაცია',
        'menu.new_reg': 'ახალი რეგისტრაცია',
        'menu.library': 'აქტივობის ბიბლიოთეკა',
        'menu.corporate': 'კორპორატიული/პარტნიორები',
        'menu.promotions': 'აქციების მართვა',

        'menu.employees': 'თანამშრომლები',
        'menu.market': 'ქარვასლა',
        'menu.accessories': 'აქსესუარები',
        'menu.messages': 'კომუნიკაცია მომხმარებელთან',
        'menu.accounting': 'ბუღალტერია',
        'menu.statistics': 'სტატისტიკა',
        'menu.settings': 'პარამეტრები',
        'menu.logout': 'გასვლა',
        // Header
        'header.search': 'ძებნა...',
        'header.admin': 'ადმინისტრატორი',
        'header.manual_entry': 'შესვლა',
        'header.manual_exit': 'გასვლა',
        'header.notes': 'სამახსოვრო დაფა',
        'header.add_note': 'შენიშვნის დამატება',
        'header.note_placeholder': 'რა საკითხია მოსაგვარებელი?',
        'header.time_placeholder': 'დრო',
        'header.no_notes': 'ჩანაწერები არ არის',
        'header.add': 'დამატება',
    },
    en: {
        // Sidebar
        'menu.dashboard': 'Dashboard',
        'menu.users': 'Users',
        'menu.user_list': 'User List',
        'menu.add_user': 'Add User',
        'menu.activity_group': 'Activity Registration',
        'menu.new_reg': 'New Registration',
        'menu.library': 'Activity Library',
        'menu.corporate': 'Corporate/Partners',
        'menu.promotions': 'Promotions',
        'menu.employees': 'Employees',
        'menu.market': 'Market',
        'menu.accessories': 'Accessories',
        'menu.messages': 'User Communication',
        'menu.accounting': 'Accounting',
        'menu.statistics': 'Statistics',
        'menu.settings': 'Settings',
        'menu.logout': 'Logout',
        // Header
        'header.search': 'Search...',
        'header.admin': 'Administrator',
        'header.manual_entry': 'Enter',
        'header.manual_exit': 'Exit',
        'header.notes': 'Quick Notes',
        'header.add_note': 'Add Note',
        'header.note_placeholder': 'What needs to be done?',
        'header.time_placeholder': 'Time',
        'header.no_notes': 'No active notes',
        'header.add': 'Add',
    },
    ru: {
        // Sidebar
        'menu.dashboard': 'Главная',
        'menu.users': 'Пользователи',
        'menu.user_list': 'Список',
        'menu.add_user': 'Добавить',
        'menu.activity_group': 'Регистрация',
        'menu.new_reg': 'Новая регистрация',
        'menu.library': 'Библиотека услуг',
        'menu.corporate': 'Корпоративные',
        'menu.promotions': 'Акции',
        'menu.employees': 'Сотрудники',
        'menu.market': 'Маркет',
        'menu.accessories': 'Аксессуары',
        'menu.messages': 'Связь с клиентами',
        'menu.accounting': 'Бухгалтерия',
        'menu.statistics': 'Статистика',
        'menu.settings': 'Настройки',
        'menu.logout': 'Выйти',
        // Header
        'header.search': 'Поиск...',
        'header.admin': 'Администратор',
        'header.manual_entry': 'Вход',
        'header.manual_exit': 'Выход',
        'header.notes': 'Заметки',
        'header.add_note': 'Добавить заметку',
        'header.note_placeholder': 'Что нужно сделать?',
        'header.time_placeholder': 'Время',
        'header.no_notes': 'Нет заметок',
        'header.add': 'Добавить',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('ka');

    const t = (key: string): string => {
        return translations[language]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
