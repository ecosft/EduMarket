
import React from 'react';
import { UserRole, AdminSettings } from '../types';
import { GraduationCap, LogOut, LayoutDashboard, Home, Users, Phone, Mail, MapPin } from 'lucide-react';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; role: UserRole } | null;
  lang: 'ru' | 'kk';
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onSetLang: (lang: 'ru' | 'kk') => void;
  adminSettings: AdminSettings;
}

const Layout: React.FC<LayoutProps> = ({ children, user, lang, onNavigate, onLogout, onSetLang, adminSettings }) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Логотип */}
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => onNavigate('landing')}
            >
              <div className="bg-kz-blue p-2.5 rounded-2xl mr-3 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-sky-100">
                <GraduationCap className="text-white w-7 h-7" />
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{t.brand}</span>
            </div>

            {/* Навигация */}
            <div className="hidden lg:flex space-x-10 items-center">
              <button onClick={() => onNavigate('landing')} className="text-gray-500 hover:text-sky-600 font-bold text-sm transition-colors flex items-center gap-2">
                <Home size={18} /> {t.nav.home}
              </button>
              {user && (
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="text-gray-500 hover:text-sky-600 font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={18} /> {t.nav.dashboard}
                </button>
              )}
            </div>

            {/* Управление и Язык */}
            <div className="flex items-center gap-4">
              <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200">
                <button 
                  onClick={() => onSetLang('ru')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    lang === 'ru' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >RU</button>
                <button 
                  onClick={() => onSetLang('kk')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    lang === 'kk' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >KZ</button>
              </div>

              {!user ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onNavigate('login')}
                    className="text-gray-500 hover:text-sky-600 font-bold text-sm px-2"
                  >
                    {t.nav.login}
                  </button>
                  <button 
                    onClick={() => onNavigate('apply')}
                    className="bg-kz-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-all shadow-md shadow-sky-100"
                  >
                    {t.nav.becomeStudent}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user.name}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{user.role}</p>
                  </div>
                  <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors">
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

      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-kz-blue p-2 rounded-xl mr-3 shadow-lg shadow-sky-100">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-gray-900">{t.brand}</span>
              </div>
              <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                {lang === 'ru' 
                  ? 'Современная образовательная платформа для связи лучших учителей с амбициозными учениками по всему Казахстану.' 
                  : 'Үздік мұғалімдерді амбициялы оқушылармен байланыстыратын заманауи білім беру платформасы.'}
              </p>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs">{lang === 'ru' ? 'Разделы' : 'Бөлімдер'}</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><button onClick={() => onNavigate('landing')} className="hover:text-sky-500">{t.nav.home}</button></li>
                <li><button onClick={() => onNavigate('apply')} className="hover:text-sky-500">{t.nav.becomeStudent}</button></li>
                <li><button onClick={() => onNavigate('teacher-signup')} className="hover:text-sky-500">{t.nav.becomeTeacher}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs">{lang === 'ru' ? 'Связаться' : 'Байланыс'}</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li className="flex items-center gap-2"><Mail size={16} className="text-sky-500" /> {adminSettings.footerEmail}</li>
                <li className="flex items-center gap-2"><Phone size={16} className="text-sky-500" /> {adminSettings.footerPhone}</li>
                <li className="flex items-center gap-2"><MapPin size={16} className="text-sky-500" /> Almaty, Kazakhstan</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              © 2024 Oku.kz. {lang === 'ru' ? 'Все права защищены.' : 'Барлық құқықтар қорғалған.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
