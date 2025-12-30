
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import ApplicationForm from './components/ApplicationForm';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import LessonRoom from './components/LessonRoom';
import { UserRole, StudentApplication, ApplicationStatus, User } from './types';
import { MOCK_TEACHERS } from './constants';
import { translations } from './translations';
import { Shield, ArrowLeft, LogIn } from 'lucide-react';

interface AdminSettings {
  notificationEmail: string;
  formspreeId: string;
  adminUsername?: string;
  adminPassword?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<'ru' | 'kk'>('ru');
  const [currentPage, setCurrentPage] = useState('landing');
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    notificationEmail: '',
    formspreeId: '',
    adminUsername: 'admin',
    adminPassword: 'admin123'
  });

  // Auth specific state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const savedApps = localStorage.getItem('okukz_apps');
    if (savedApps) setApplications(JSON.parse(savedApps));

    const savedSettings = localStorage.getItem('okukz_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setAdminSettings(prev => ({
        ...prev,
        ...parsed
      }));
    }
    
    const savedUser = localStorage.getItem('okukz_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'landing';
      setCurrentPage(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('okukz_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('okukz_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('okukz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('okukz_user');
    }
  }, [user]);

  const handleSetLang = (newLang: 'ru' | 'kk') => setLang(newLang);

  const handleApply = async (data: any) => {
    const newApp: StudentApplication = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user?.id || 'guest',
      studentName: data.name,
      contact: data.contact,
      subjectId: data.subjectId,
      goal: data.goal,
      level: data.level,
      preferredTime: data.preferredTime,
      status: ApplicationStatus.NEW,
      createdAt: new Date().toISOString()
    };
    setApplications([...applications, newApp]);
    
    if (!user) {
      const newUser: User = { id: 's1', name: data.name, role: UserRole.STUDENT, email: data.contact };
      setUser(newUser);
    }

    if (adminSettings.formspreeId) {
      try {
        await fetch(`https://formspree.io/f/${adminSettings.formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _subject: `Новая заявка: ${data.name}`,
            ...data,
            appId: newApp.id
          })
        });
      } catch (e) {
        console.error("Failed to send background email via Formspree", e);
      }
    } else if (adminSettings.notificationEmail) {
      const subject = encodeURIComponent(`Новая заявка: ${data.name}`);
      const body = encodeURIComponent(
        `Имя: ${data.name}\nКонтакт: ${data.contact}\nПредмет: ${data.subjectId}\nЦель: ${data.goal}\nУровень: ${data.level}\nВремя: ${data.preferredTime}`
      );
      window.open(`mailto:${adminSettings.notificationEmail}?subject=${subject}&body=${body}`);
    }
  };

  const handleNavigate = (page: string) => {
    window.location.hash = page;
    setAuthError('');
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate against stored credentials in settings
    const storedUser = adminSettings.adminUsername || 'admin';
    const storedPass = adminSettings.adminPassword || 'admin123';

    if (adminCreds.username === storedUser && adminCreds.password === storedPass) {
      const adminUser: User = { id: 'a1', name: 'Администратор', role: UserRole.ADMIN, email: 'admin@example.com' };
      setUser(adminUser);
      handleNavigate('dashboard');
      setShowAdminLogin(false);
      setAdminCreds({ username: '', password: '' });
    } else {
      setAuthError(translations[lang].auth.error);
    }
  };

  const loginAs = (role: UserRole) => {
    if (role === UserRole.ADMIN) {
      setShowAdminLogin(true);
      return;
    }
    if (role === UserRole.STUDENT) setUser({ id: 's1', name: lang === 'ru' ? 'Иван Ученик' : 'Арман Оқушы', role, email: 'student@example.com' });
    if (role === UserRole.TEACHER) setUser({ id: 't1', name: 'Александр Иванов', role, email: 'teacher@example.com' });
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    handleNavigate('landing');
  };

  const renderContent = () => {
    if (activeLessonId) {
      return <LessonRoom roomId={activeLessonId} onExit={() => setActiveLessonId(null)} />;
    }

    const t = translations[lang];

    switch (currentPage) {
      case 'landing':
        return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
      case 'apply':
        return <ApplicationForm lang={lang} onSubmit={handleApply} />;
      case 'login':
        return (
          <div className="max-w-md mx-auto py-24 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              {!showAdminLogin ? (
                <>
                  <h2 className="text-2xl font-bold text-center mb-8">{t.auth.roleSelect}</h2>
                  <div className="space-y-4">
                    <button onClick={() => loginAs(UserRole.STUDENT)} className="w-full bg-gray-50 border border-gray-200 py-4 rounded-xl font-bold hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500 transition-all shadow-sm">
                      {lang === 'ru' ? 'Студент' : 'Оқушы'}
                    </button>
                    <button onClick={() => loginAs(UserRole.TEACHER)} className="w-full bg-gray-50 border border-gray-200 py-4 rounded-xl font-bold hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500 transition-all shadow-sm">
                      {lang === 'ru' ? 'Учитель' : 'Мұғалім'}
                    </button>
                    <div className="pt-4 border-t border-gray-100 mt-4">
                      <button 
                        onClick={() => loginAs(UserRole.ADMIN)} 
                        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors py-2"
                      >
                        <Shield size={16} /> {t.auth.loginAsAdmin}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { setShowAdminLogin(false); setAuthError(''); }}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium text-sm transition-colors"
                  >
                    <ArrowLeft size={16} /> {t.auth.back}
                  </button>
                  <div className="flex justify-center mb-6">
                    <div className="bg-sky-100 text-sky-600 p-4 rounded-2xl">
                      <Shield size={32} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-6">{t.auth.loginAsAdmin}</h2>
                  <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t.auth.username}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                        value={adminCreds.username}
                        onChange={e => setAdminCreds({...adminCreds, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t.auth.password}</label>
                      <input 
                        type="password" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                        value={adminCreds.password}
                        onChange={e => setAdminCreds({...adminCreds, password: e.target.value})}
                      />
                    </div>
                    {authError && <p className="text-red-500 text-xs font-medium">{authError}</p>}
                    <button 
                      type="submit" 
                      className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold hover:bg-sky-600 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <LogIn size={20} /> {t.auth.submit}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        );
      case 'dashboard':
        if (!user) return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
        if (user.role === UserRole.STUDENT) {
          return <StudentDashboard applications={applications} onJoinLesson={setActiveLessonId} />;
        }
        if (user.role === UserRole.TEACHER) {
          const teacher = MOCK_TEACHERS.find(t => t.id === user.id) || MOCK_TEACHERS[0];
          const available = applications.filter(app => app.status === ApplicationStatus.NEW);
          return <TeacherDashboard teacher={teacher} availableApplications={available} onAcceptApplication={() => {}} />;
        }
        if (user.role === UserRole.ADMIN) {
          return (
            <AdminDashboard 
              applications={applications} 
              teachers={MOCK_TEACHERS} 
              onAssignTeacher={() => {}}
              adminSettings={adminSettings}
              onUpdateSettings={setAdminSettings}
              lang={lang}
            />
          );
        }
        return null;
      default:
        return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
    }
  };

  return (
    <Layout user={user} lang={lang} onNavigate={handleNavigate} onLogout={handleLogout} onSetLang={handleSetLang}>
      {renderContent()}
    </Layout>
  );
};

export default App;
