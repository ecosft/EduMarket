
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

interface AdminSettings {
  notificationEmail: string;
  formspreeId: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<'ru' | 'kk'>('ru');
  const [currentPage, setCurrentPage] = useState('landing');
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    notificationEmail: '',
    formspreeId: ''
  });

  useEffect(() => {
    const savedApps = localStorage.getItem('edumarket_apps');
    if (savedApps) setApplications(JSON.parse(savedApps));

    const savedSettings = localStorage.getItem('edumarket_settings');
    if (savedSettings) setAdminSettings(JSON.parse(savedSettings));
    
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'landing';
      setCurrentPage(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('edumarket_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('edumarket_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

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
    
    // Auto-login logic
    if (!user) {
      const newUser: User = { id: 's1', name: data.name, role: UserRole.STUDENT, email: data.contact };
      setUser(newUser);
    }

    // Notification Logic
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
  };

  const loginAs = (role: UserRole) => {
    if (role === UserRole.STUDENT) setUser({ id: 's1', name: lang === 'ru' ? 'Иван Ученик' : 'Арман Оқушы', role, email: 'student@example.com' });
    if (role === UserRole.TEACHER) setUser({ id: 't1', name: 'Александр Иванов', role, email: 'teacher@example.com' });
    if (role === UserRole.ADMIN) setUser({ id: 'a1', name: 'Администратор', role, email: 'admin@example.com' });
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

    switch (currentPage) {
      case 'landing':
        return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
      case 'apply':
        return <ApplicationForm lang={lang} onSubmit={handleApply} />;
      case 'login':
        return (
          <div className="max-w-md mx-auto py-24 px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">{lang === 'ru' ? 'Войти как' : 'Кім ретінде кіру'}</h2>
            <div className="space-y-4">
              <button onClick={() => loginAs(UserRole.STUDENT)} className="w-full bg-white border border-gray-200 py-4 rounded-xl font-bold hover:border-sky-500 hover:text-sky-500 transition-all shadow-sm">{lang === 'ru' ? 'Студент' : 'Оқушы'}</button>
              <button onClick={() => loginAs(UserRole.TEACHER)} className="w-full bg-white border border-gray-200 py-4 rounded-xl font-bold hover:border-sky-500 hover:text-sky-500 transition-all shadow-sm">{lang === 'ru' ? 'Учитель' : 'Мұғалім'}</button>
              <button onClick={() => loginAs(UserRole.ADMIN)} className="w-full bg-white border border-gray-200 py-4 rounded-xl font-bold hover:border-sky-500 hover:text-sky-500 transition-all shadow-sm">{lang === 'ru' ? 'Администратор' : 'Администратор'}</button>
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
