
import React from 'react';
import { StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS } from '../constants';
import { Clock, CheckCircle, Calendar, Video, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
  applications: StudentApplication[];
  onJoinLesson: (roomId: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ applications, onJoinLesson }) => {
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.NEW:
        return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">В поиске</span>;
      case ApplicationStatus.TEACHER_FOUND:
        return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Учитель найден</span>;
      case ApplicationStatus.SCHEDULED:
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Назначен урок</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Завершено</span>;
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
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Новая заявка
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 font-medium mb-6">У вас пока нет активных заявок</p>
          <button 
            onClick={() => window.location.hash = '#apply'}
            className="text-indigo-600 font-bold hover:underline"
          >
            Оставить первую заявку прямо сейчас
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 text-indigo-600 p-4 rounded-xl">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {SUBJECTS.find(s => s.id === app.subjectId)?.name}
                      </h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-gray-500 text-sm">Создано: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <p className="text-sm text-gray-600"><strong>Цель:</strong> {app.goal}</p>
                  <p className="text-sm text-gray-600"><strong>Время:</strong> {app.preferredTime}</p>
                </div>

                <div className="flex gap-3">
                  {app.status === ApplicationStatus.SCHEDULED && app.lessonRoomId && (
                    <button 
                      onClick={() => onJoinLesson(app.lessonRoomId!)}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      <Video size={18} /> Войти в класс
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600 p-2">
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
