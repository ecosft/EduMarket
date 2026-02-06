
import React, { useState, useEffect, useRef } from 'react';
import { StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS } from '../constants';
import { Clock, CheckCircle, Calendar, Video, ArrowRight, MapPin, Camera, CameraOff, Send, MessageCircle, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'student' | 'teacher';
  time: string;
}

interface StudentDashboardProps {
  applications: StudentApplication[];
  onJoinLesson: (roomId: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ applications, onJoinLesson }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Здравствуйте! Я ваш учитель. Готовы к уроку?', sender: 'teacher', time: '10:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Камера: Включение/Выключение
  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error("Ошибка камеры:", err);
          setIsCameraOn(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, [isCameraOn]);

  // Скролл чата вниз
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Имитация ответа учителя через 1.5 сек
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Отлично, жду вас в виртуальном классе!',
        sender: 'teacher',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const scheduledApp = applications.find(a => a.status === ApplicationStatus.SCHEDULED);

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
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Личный кабинет</h1>
          <p className="text-gray-500 font-medium">Ваш путь к знаниям начинается здесь</p>
        </div>
        <button 
          onClick={() => window.location.hash = '#apply'}
          className="bg-kz-blue text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100"
        >
          Новая заявка
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Список заявок (Слева) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="text-sky-500" /> Активные курсы
          </h2>
          
          {applications.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
              <p className="text-gray-400 font-bold text-lg italic">У вас пока нет активных заявок</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-sky-100/20 transition-all group">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="bg-sky-50 text-sky-600 p-5 rounded-3xl group-hover:bg-sky-500 group-hover:text-white transition-all">
                      <Calendar size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-gray-900">
                          {SUBJECTS.find(s => s.id === app.subjectId)?.name}
                        </h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">ID: {app.id.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 bg-gray-50 p-5 rounded-3xl flex-grow max-w-md border border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                      <Calendar className="text-sky-400" size={18} />
                      <span>{app.preferredTime.date ? new Date(app.preferredTime.date).toLocaleDateString() : 'Любой день'}</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <span>{app.preferredTime.days.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                      <Clock className="text-sky-400" size={18} />
                      <span>{app.preferredTime.time}</span>
                      <span className="bg-sky-100 text-sky-600 px-2 py-0.5 rounded text-[10px] font-black uppercase ml-2">
                        {app.preferredTime.timezone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {app.status === ApplicationStatus.SCHEDULED && app.lessonRoomId && (
                      <button 
                        onClick={() => onJoinLesson(app.lessonRoomId!)}
                        className="bg-kz-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all flex items-center gap-3 shadow-xl shadow-sky-100 animate-pulse"
                      >
                        <Video size={20} /> В класс
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Инструменты обучения (Справа) */}
        <div className="space-y-8">
          {/* Проверка оборудования */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Camera className="text-sky-500" /> Оборудование
            </h3>
            <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden mb-6 shadow-inner border-4 border-slate-800">
              {isCameraOn ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover mirror transform scale-x-[-1]"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <CameraOff size={48} className="mb-3 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-40">Камера выключена</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                isCameraOn 
                ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
                : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
              }`}
            >
              {isCameraOn ? <><CameraOff size={18} /> Выключить</> : <><Camera size={18} /> Проверить камеру</>}
            </button>
          </div>

          {/* Чат с учителем */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col h-[500px] overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-sky-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl text-sky-500 shadow-sm">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Чат с учителем</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                    msg.sender === 'student' 
                    ? 'bg-sky-500 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-700 rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[9px] mt-2 font-bold uppercase opacity-60 ${
                      msg.sender === 'student' ? 'text-right' : 'text-left'
                    }`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-50 bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ваше сообщение..."
                  className="w-full pl-6 pr-14 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bg-sky-500 text-white p-2.5 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
