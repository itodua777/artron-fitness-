
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
    'menu.corporate': 'კორპორატიული',
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
    // Page Titles
    'title.dashboard': 'მთავარი პანელი',
    'title.user_list': 'მომხმარებელთა სია',
    'title.add_user': 'მომხმარებლის დამატება',
    'title.passes': 'აქტივობის რეგისტრაცია',
    'title.library': 'აქტივობის ბიბლიოთეკა',
    'title.corporate': 'კორპორატიული კლიენტები',
    'title.promotions': 'აქციების მართვა',
    'title.employees': 'თანამშრომლები',
    'title.market': 'ქარვასლა',
    'title.accessories': 'აქსესუარები',
    'title.messages': 'კომუნიკაცია მომხმარებელთან',
    'title.accounting': 'ბუღალტერია',
    'title.statistics': 'დეტალური სტატისტიკა',
    'title.settings': 'პარამეტრები',
    'title.profile': 'მომხმარებლის პროფილი',
    'title.artron': 'ARTRON',
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
    'menu.corporate': 'Corporate',
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
    // Page Titles
    'title.dashboard': 'Dashboard',
    'title.user_list': 'User List',
    'title.add_user': 'Add User',
    'title.passes': 'Activity Registration',
    'title.library': 'Activity Library',
    'title.corporate': 'Corporate Clients',
    'title.promotions': 'Promotions Management',
    'title.employees': 'Employees',
    'title.market': 'Market (POS)',
    'title.accessories': 'Accessories',
    'title.messages': 'User Communication',
    'title.accounting': 'Accounting',
    'title.statistics': 'Detailed Statistics',
    'title.settings': 'Settings',
    'title.profile': 'User Profile',
    'title.artron': 'ARTRON',
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
    // Page Titles
    'title.dashboard': 'Панель управления',
    'title.user_list': 'Список пользователей',
    'title.add_user': 'Добавить пользователя',
    'title.passes': 'Регистрация активности',
    'title.library': 'Библиотека услуг',
    'title.corporate': 'Корпоративные клиенты',
    'title.promotions': 'Управление акциями',
    'title.employees': 'Сотрудники',
    'title.market': 'Маркет (POS)',
    'title.accessories': 'Аксессуары',
    'title.messages': 'Связь с клиентами',
    'title.accounting': 'Бухгалтерия',
    'title.statistics': 'Статистика',
    'title.settings': 'Настройки',
    'title.profile': 'Профиль пользователя',
    'title.artron': 'ARTRON',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ka');

  const t = (key: string): string => {
    return translations[language][key] || key;
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
