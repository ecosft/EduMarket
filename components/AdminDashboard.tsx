
import React from 'react';
import { StudentApplication, ApplicationStatus, Teacher } from '../types';
import { SUBJECTS } from '../constants';
// Added CheckCircle to imports
import { Shield, Settings, Users, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';

interface AdminDashboardProps {
  applications: StudentApplication[];
  teachers: Teacher[];
  onAssignTeacher: (appId: string, teacherId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ applications, teachers, onAssignTeacher }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-red-100 text-red-600 p-3 rounded-2xl">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
          <p className="text-gray-500 text-sm">Управление платформой и пользователями</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <Users className="mx-auto text-indigo-600 mb-2" />
          <p className="text-3xl font-bold">{applications.length}</p>
          <p className="text-gray-500 text-sm">Всего заявок</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <BookOpen className="mx-auto text-indigo-600 mb-2" />
          <p className="text-3xl font-bold">{teachers.length}</p>
          <p className="text-gray-500 text-sm">Преподавателей</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <Settings className="mx-auto text-indigo-600 mb-2" />
          <p className="text-3xl font-bold">{SUBJECTS.length}</p>
          <p className="text-gray-500 text-sm">Активных предметов</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-xl font-bold">Все заявки</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Ученик</th>
                <th className="px-8 py-4">Предмет</th>
                <th className="px-8 py-4">Статус</th>
                <th className="px-8 py-4">Назначить учителя</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
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
                        className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
