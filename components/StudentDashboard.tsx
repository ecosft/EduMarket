
import React from 'react';
import { StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS } from '../constants';
import { Clock, CheckCircle, Calendar, Video, ArrowRight, MapPin } from 'lucide-react';

interface StudentDashboardProps {
  applications: StudentApplication[];
  onJoinLesson: (roomId: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ applications, onJoinLesson }) => {
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.NEW:
        return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">В поиске</span>;
      case ApplicationStatus.TEACHER_FOUND:
        return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">Учитель найден</span>;
      case ApplicationStatus.SCHEDULED:
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">Назначен урок</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">Завершено</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои заявки</h1>
          <p className="text-gray-500">Здесь вы можете отслеживать статус вашего обучения</p>
        </div>
        <button 
          onClick={() => window.location.hash = '#apply'}
          className="bg-kz-blue text-white px-6 py-2 rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
        >
          Новая заявка
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-300 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 font-medium mb-6">У вас пока нет активных заявок</p>
          <button 
            onClick={() => window.location.hash = '#apply'}
            className="text-sky-600 font-bold hover:underline"
          >
            Оставить первую заявку прямо сейчас
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-sky-50 text-sky-600 p-4 rounded-2xl">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900">
                        {SUBJECTS.find(s => s.id === app.subjectId)?.name}
                      </h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">ID: {app.id.toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-2xl flex-grow max-w-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Calendar className="text-sky-400" size={16} />
                    <span>{app.preferredTime.date ? new Date(app.preferredTime.date).toLocaleDateString() : '—'}</span>
                    <span className="text-gray-300 mx-1">|</span>
                    <span>{app.preferredTime.days.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Clock className="text-sky-400" size={16} />
                    <span>{app.preferredTime.time}</span>
                    <span className="flex items-center gap-1 bg-sky-100 text-sky-600 px-2 py-0.5 rounded text-[10px] font-black ml-2 uppercase">
                      <MapPin size={10} /> {app.preferredTime.timezone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-center">
                  {app.status === ApplicationStatus.SCHEDULED && app.lessonRoomId && (
                    <button 
                      onClick={() => onJoinLesson(app.lessonRoomId!)}
                      className="bg-kz-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-600 transition-all flex items-center gap-2 shadow-lg shadow-sky-100"
                    >
                      <Video size={18} /> Войти в класс
                    </button>
                  )}
                  <button className="bg-gray-50 text-gray-400 hover:text-sky-500 p-3 rounded-xl transition-all">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
