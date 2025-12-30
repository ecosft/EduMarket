
import React from 'react';
import { StudentApplication, ApplicationStatus, Teacher } from '../types';
import { SUBJECTS } from '../constants';
import { translations } from '../translations';
import { Shield, Settings, Users, BookOpen, CheckCircle, Mail, Key } from 'lucide-react';

interface AdminSettings {
  notificationEmail: string;
  formspreeId: string;
  adminUsername?: string;
  adminPassword?: string;
}

interface AdminDashboardProps {
  applications: StudentApplication[];
  teachers: Teacher[];
  lang: 'ru' | 'kk';
  adminSettings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
  onAssignTeacher: (appId: string, teacherId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  applications, 
  teachers, 
  lang,
  adminSettings, 
  onUpdateSettings,
  onAssignTeacher 
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-red-100 text-red-600 p-3 rounded-2xl">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{lang === 'ru' ? 'Админ-панель' : 'Админ-панелі'}</h1>
          <p className="text-gray-500 text-sm">{lang === 'ru' ? 'Управление платформой и пользователями' : 'Платформа мен пайдаланушыларды басқару'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <Users className="mx-auto text-sky-600 mb-2" />
          <p className="text-3xl font-bold">{applications.length}</p>
          <p className="text-gray-500 text-sm">{lang === 'ru' ? 'Всего заявок' : 'Барлық өтінімдер'}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <BookOpen className="mx-auto text-sky-600 mb-2" />
          <p className="text-3xl font-bold">{teachers.length}</p>
          <p className="text-gray-500 text-sm">{lang === 'ru' ? 'Преподавателей' : 'Оқытушылар'}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <Settings className="mx-auto text-sky-600 mb-2" />
          <p className="text-3xl font-bold">{SUBJECTS.length}</p>
          <p className="text-gray-500 text-sm">{lang === 'ru' ? 'Активных предметов' : 'Белсенді пәндер'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Applications Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-bold">{lang === 'ru' ? 'Все заявки' : 'Барлық өтінімдер'}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-4">Ученик</th>
                    <th className="px-8 py-4">Предмет</th>
                    <th className="px-8 py-4">Статус</th>
                    <th className="px-8 py-4">Учитель</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic">
                        {lang === 'ru' ? 'Заявок пока нет' : 'Әзірге өтінімдер жоқ'}
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-gray-900">{app.studentName}</p>
                          <p className="text-xs text-gray-400">{app.contact}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-gray-700">{SUBJECTS.find(s => s.id === app.subjectId)?.name}</p>
                          <p className="text-xs text-gray-400">{app.level}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            app.status === ApplicationStatus.NEW ? 'bg-blue-100 text-blue-600' :
                            app.status === ApplicationStatus.SCHEDULED ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {app.status === ApplicationStatus.NEW ? (
                            <select 
                              onChange={(e) => onAssignTeacher(app.id, e.target.value)}
                              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                            >
                              <option value="">Выбрать...</option>
                              {teachers.filter(t => t.subjects.includes(app.subjectId)).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="text-green-500" size={16} />
                              {teachers.find(t => t.id === app.assignedTeacherId)?.name}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-8">
          {/* Notification Settings Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="text-sky-500" />
              <h2 className="text-xl font-bold text-gray-900">{t.admin.settingsTitle}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{t.admin.emailLabel}</label>
                <input 
                  type="email" 
                  placeholder={t.admin.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  value={adminSettings.notificationEmail}
                  onChange={e => onUpdateSettings({ ...adminSettings, notificationEmail: e.target.value })}
                />
                <p className="text-[10px] text-gray-400 italic">Сюда будут приходить заявки по email (mailto)</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{t.admin.formspreeLabel}</label>
                <input 
                  type="text" 
                  placeholder="e.g. xnqyvrbw"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  value={adminSettings.formspreeId}
                  onChange={e => onUpdateSettings({ ...adminSettings, formspreeId: e.target.value })}
                />
                <p className="text-[10px] text-gray-500 leading-tight">
                  {t.admin.formspreeHint}. Создайте форму на <a href="https://formspree.io" target="_blank" className="text-sky-600 font-bold underline">formspree.io</a>
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Key className="text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">{t.admin.securityTitle}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{t.admin.usernameLabel}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  value={adminSettings.adminUsername}
                  onChange={e => onUpdateSettings({ ...adminSettings, adminUsername: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{t.admin.passwordLabel}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  value={adminSettings.adminPassword}
                  onChange={e => onUpdateSettings({ ...adminSettings, adminPassword: e.target.value })}
                />
                <p className="text-[10px] text-gray-400 italic">Эти данные используются для входа в админ-панель</p>
              </div>

              <div className="pt-4">
                 <button 
                  onClick={() => alert(t.admin.settingsSaved)}
                  className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> {t.admin.saveSettings}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
