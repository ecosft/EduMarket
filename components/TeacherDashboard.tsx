
import React from 'react';
import { Teacher, StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS } from '../constants';
import { User, Briefcase, GraduationCap, DollarSign, List, CheckCircle } from 'lucide-react';

interface TeacherDashboardProps {
  teacher: Teacher;
  availableApplications: StudentApplication[];
  onAcceptApplication: (appId: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, availableApplications, onAcceptApplication }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <div className="text-center mb-8">
              <img src={teacher.photo} alt={teacher.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-50 object-cover" />
              <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
              <p className="text-indigo-600 font-medium">Преподаватель</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Briefcase className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Опыт</p>
                  <p className="text-gray-900 font-medium">{teacher.experience}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Образование</p>
                  <p className="text-gray-900 font-medium">{teacher.education}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Стоимость урока</p>
                  <p className="text-gray-900 font-medium">{teacher.pricePerHour} ₽ / час</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-8 border border-gray-200 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
              Редактировать профиль
            </button>
          </div>
        </div>

        {/* Applications Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-8">
            <List className="text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Доступные заявки</h2>
          </div>

          <div className="space-y-6">
            {availableApplications.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                <p className="text-gray-500 font-medium">Пока нет подходящих заявок в вашем регионе</p>
              </div>
            ) : (
              availableApplications.map((app) => (
                <div key={app.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {SUBJECTS.find(s => s.id === app.subjectId)?.name}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold tracking-tight text-[10px]">{app.level}</span>
                        <span>Ученик: {app.studentName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-600 font-bold">Заявка #{app.id.slice(0, 5)}</p>
                      <p className="text-gray-400 text-xs">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Fixed Error: 'goal' property does not exist on StudentApplication. Replaced with relevant info. */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Сведения</p>
                      <p className="text-gray-700 text-sm leading-relaxed">Уровень: {app.level}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">Почта: {app.email}</p>
                    </div>
                    {/* Fixed Error: PreferredTime is an object and cannot be rendered directly. Formatting to JSX. */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Желаемое время</p>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        <p>{app.preferredTime.date ? new Date(app.preferredTime.date).toLocaleDateString() : '—'} | {app.preferredTime.days.join(', ')}</p>
                        <p>{app.preferredTime.time} ({app.preferredTime.timezone})</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onAcceptApplication(app.id)}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle size={20} /> Принять заявку и связаться
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
