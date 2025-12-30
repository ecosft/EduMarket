
import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, LogOut, LayoutDashboard, Home, Languages as LangIcon } from 'lucide-react';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; role: UserRole } | null;
  lang: 'ru' | 'kk';
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onToggleLang: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, lang, onNavigate, onLogout, onToggleLang }) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => onNavigate('landing')}
            >
              <div className="bg-sky-500 p-2 rounded-lg mr-2 group-hover:bg-sky-600 transition-colors">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">{t.brand}</span>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              <button onClick={() => onNavigate('landing')} className="text-gray-600 hover:text-sky-600 font-medium transition-colors flex items-center gap-1">
                <Home size={18} /> {t.nav.home}
              </button>
              {user && (
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="text-gray-600 hover:text-sky-600 font-medium transition-colors flex items-center gap-1"
                >
                  <LayoutDashboard size={18} /> {t.nav.dashboard}
                </button>
              )}
              
              <button 
                onClick={onToggleLang}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm font-bold transition-all text-gray-700 border border-gray-200"
              >
                <LangIcon size={16} className="text-sky-500" />
                {lang === 'ru' ? 'KZ' : 'RU'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {!user ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => onNavigate('apply')}
                    className="bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-sky-600 transition-all shadow-md"
                  >
                    {t.nav.becomeStudent}
                  </button>
                  <button 
                    onClick={() => onNavigate('login')}
                    className="border border-sky-500 text-sky-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-sky-50 transition-all"
                  >
                    {t.nav.login}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-6">
            <GraduationCap className="text-sky-500 w-8 h-8 mr-2" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">{t.brand}</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 EduMarket. {lang === 'ru' ? 'Все права защищены.' : 'Барлық құқықтар қорғалған.'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
