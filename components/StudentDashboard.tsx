
import React, { useState, useEffect, useRef } from 'react';
import { StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS } from '../constants';
import { 
  Video, Mic, MicOff, VideoOff, Send, MessageCircle, 
  User, Monitor, BookOpen, Settings, Layout, 
  PlusCircle, CheckCircle, Clock 
} from 'lucide-react';
import Whiteboard from './Whiteboard';

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
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Здравствуйте! Начнем наш урок. Сегодня тема: Present Continuous.', sender: 'teacher', time: '10:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'class' | 'courses'>('class');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Камера
  useEffect(() => {
    if (activeTab === 'class' && isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error("Ошибка камеры:", err);
          setIsCameraOn(false);
        });
    }
  }, [isCameraOn, isMicOn, activeTab]);

  // Скролл чата
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
  };

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 h-[calc(100vh-120px)] flex flex-col">
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab('class')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all flex items-center gap-2 ${activeTab === 'class' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Monitor size={16} /> Виртуальный класс
            </button>
            <button 
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all flex items-center gap-2 ${activeTab === 'courses' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Layout size={16} /> Мои курсы ({applications.length})
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.hash = '#apply'}
          className="bg-kz-blue text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 flex items-center gap-2"
        >
          <PlusCircle size={18} /> Новая заявка
        </button>
      </div>

      {activeTab === 'class' ? (
        /* Virtual Classroom View */
        <div className="flex-grow flex gap-6 overflow-hidden">
          
          {/* Main Content: Whiteboard */}
          <div className="flex-grow flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black text-gray-900 uppercase">Урок с учителем Александром</span>
            </div>
            <Whiteboard />
          </div>

          {/* Sidebar: Videos and Chat */}
          <div className="w-[350px] flex flex-col gap-6 flex-shrink-0">
            
            {/* Teacher Video Window */}
            <div className="bg-slate-900 rounded-[2.5rem] aspect-video relative overflow-hidden shadow-2xl border-4 border-white group">
              <img 
                src="https://ui-avatars.com/api/?name=Teacher+Alex&background=00afca&color=fff&size=400" 
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                alt="Teacher"
              />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl">
                <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Учитель (Online)
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                   <Video size={32} className="text-white" />
                </div>
              </div>
            </div>

            {/* Student Video Window */}
            <div className="bg-slate-800 rounded-[2.5rem] aspect-video relative overflow-hidden shadow-2xl border-4 border-white">
              {isCameraOn ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <User size={40} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Камера выключена</p>
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                 <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest tracking-tighter">Вы (Ученик)</span>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all ${isMicOn ? 'bg-white/20 text-white' : 'bg-rose-500 text-white shadow-lg'}`}
                    >
                      {isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
                    </button>
                    <button 
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all ${isCameraOn ? 'bg-white/20 text-white' : 'bg-rose-500 text-white shadow-lg'}`}
                    >
                      {isCameraOn ? <Video size={14} /> : <VideoOff size={14} />}
                    </button>
                 </div>
              </div>
            </div>

            {/* In-Class Chat */}
            <div className="flex-grow bg-white rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                <MessageCircle size={16} className="text-sky-500" />
                <span className="text-xs font-black text-gray-900 uppercase tracking-tight">Чат урока</span>
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-3 scroll-smooth">
                {messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium shadow-sm max-w-[85%] ${
                      m.sender === 'student' ? 'bg-sky-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] font-bold text-gray-300 mt-1 uppercase tracking-tighter">{m.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-50">
                <div className="relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Написать..."
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-2xl text-xs font-medium border border-transparent focus:bg-white focus:border-sky-500 outline-none transition-all"
                  />
                  <button type="submit" className="absolute right-2 top-1.5 p-1.5 text-sky-500 hover:scale-110 transition-transform">
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Courses List View */
        <div className="flex-grow overflow-y-auto pr-4">
          <div className="grid md:grid-cols-2 gap-6">
            {applications.length === 0 ? (
              <div className="col-span-2 bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
                <p className="text-gray-400 font-bold text-lg italic">У вас пока нет активных заявок</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-sky-100/20 transition-all group">
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-4">
                        <div className="bg-sky-50 text-sky-600 p-4 rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-all">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-900">
                            {SUBJECTS.find(s => s.id === app.subjectId)?.name}
                          </h3>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">ID: {app.id.toUpperCase()}</p>
                        </div>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                       app.status === ApplicationStatus.SCHEDULED ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                     }`}>
                       {app.status === ApplicationStatus.SCHEDULED ? 'Назначен' : 'В поиске'}
                     </span>
                   </div>
                   
                   <div className="bg-gray-50 p-5 rounded-3xl mb-6 flex justify-between items-center border border-gray-100">
                      <div className="flex flex-col gap-1">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic">Дата и время</p>
                        <p className="text-sm font-black text-gray-700 flex items-center gap-2">
                          <Clock size={14} className="text-sky-500" /> {app.preferredTime.date || 'Любой день'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">{app.preferredTime.time}</p>
                        <p className="text-[9px] text-sky-500 font-bold uppercase">{app.preferredTime.timezone}</p>
                      </div>
                   </div>

                   {app.status === ApplicationStatus.SCHEDULED && (
                     <button 
                       onClick={() => setActiveTab('class')}
                       className="w-full bg-kz-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-3"
                     >
                       <Video size={18} /> Перейти в класс
                     </button>
                   )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
