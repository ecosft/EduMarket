
import React, { useState, useEffect, useRef } from 'react';
import { StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS } from '../constants';
import { 
  Video, Mic, MicOff, VideoOff, Send, MessageCircle, 
  User, Monitor, BookOpen, Settings, Layout, 
  Clock, Move, Maximize2, Minimize2, FileText, Download, ExternalLink, Files,
  Calendar, CheckCircle2, History, PlayCircle
} from 'lucide-react';
import Whiteboard from './Whiteboard';

interface Message {
  id: string;
  text: string;
  sender: 'student' | 'teacher';
  time: string;
}

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'link';
  size?: string;
}

interface Position {
  x: number;
  y: number;
}

interface StudentDashboardProps {
  applications: StudentApplication[];
  onJoinLesson: (roomId: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ applications, onJoinLesson }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [rightPanel, setRightPanel] = useState<'chat' | 'materials' | 'none'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Здравствуйте! Начнем наш урок. Сегодня тема: Present Continuous.', sender: 'teacher', time: '10:00' }
  ]);
  const [materials] = useState<Material[]>([
    { id: 'm1', title: 'Грамматика: Present Continuous', type: 'pdf', size: '1.2 MB' },
    { id: 'm2', title: 'Список неправильных глаголов', type: 'doc', size: '450 KB' },
    { id: 'm3', title: 'Упражнения для закрепления', type: 'link' }
  ]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'class'>('courses');
  
  const [teacherPos, setTeacherPos] = useState<Position>({ x: 20, y: 20 });
  const [studentPos, setStudentPos] = useState<Position>({ x: 20, y: 210 });
  const [activeWindow, setActiveWindow] = useState<'teacher' | 'student'>('teacher');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const classroomRef = useRef<HTMLDivElement>(null);

  const upcomingLessons = applications.filter(app => 
    app.status === ApplicationStatus.NEW || 
    app.status === ApplicationStatus.SCHEDULED || 
    app.status === ApplicationStatus.TEACHER_FOUND
  );
  
  const completedLessons = applications.filter(app => 
    app.status === ApplicationStatus.COMPLETED
  );

  const handleDrag = (e: React.MouseEvent, type: 'teacher' | 'student') => {
    if ((e.target as HTMLElement).closest('button')) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = type === 'teacher' ? teacherPos : studentPos;
    setActiveWindow(type);
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!classroomRef.current) return;
      const rect = classroomRef.current.getBoundingClientRect();
      const newX = Math.max(10, Math.min(rect.width - 290, initialPos.x + (moveEvent.clientX - startX)));
      const newY = Math.max(10, Math.min(rect.height - 180, initialPos.y + (moveEvent.clientY - startY)));
      if (type === 'teacher') setTeacherPos({ x: newX, y: newY });
      else setStudentPos({ x: newX, y: newY });
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    if (activeTab === 'class' && isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(() => setIsCameraOn(false));
    }
  }, [isCameraOn, isMicOn, activeTab]);

  // Заменяем scrollIntoView на scrollTop для предотвращения прокрутки всей страницы
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, rightPanel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden font-sans">
      <div className="bg-white px-6 py-3 border-b border-gray-100 flex justify-between items-center z-50">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setActiveTab('courses')} className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all flex items-center gap-2 ${activeTab === 'courses' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400'}`}>
            <Layout size={14} /> Моё обучение
          </button>
          <button onClick={() => setActiveTab('class')} className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all flex items-center gap-2 ${activeTab === 'class' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400'}`}>
            <Monitor size={14} /> Класс
          </button>
        </div>
        
        {activeTab === 'class' && (
          <div className="flex items-center gap-4">
             <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setRightPanel(rightPanel === 'chat' ? 'none' : 'chat')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${rightPanel === 'chat' ? 'bg-sky-500 text-white shadow-md' : 'text-gray-500'}`}
                >
                  <MessageCircle size={12} /> Чат
                </button>
                <button 
                  onClick={() => setRightPanel(rightPanel === 'materials' ? 'none' : 'materials')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${rightPanel === 'materials' ? 'bg-sky-500 text-white shadow-md' : 'text-gray-500'}`}
                >
                  <Files size={12} /> Материалы
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="flex-grow relative overflow-hidden bg-gray-50">
        {activeTab === 'class' ? (
          <div ref={classroomRef} className="absolute inset-0 flex">
            <div className="flex-grow relative z-0">
              <Whiteboard />
            </div>

            <div 
              style={{ left: `${teacherPos.x}px`, top: `${teacherPos.y}px`, zIndex: activeWindow === 'teacher' ? 40 : 30 }}
              className="absolute w-[260px] bg-slate-900 rounded-[1.5rem] aspect-video overflow-hidden shadow-2xl border-2 border-white cursor-move"
              onMouseDown={(e) => handleDrag(e, 'teacher')}
            >
              <img src="https://ui-avatars.com/api/?name=Teacher+Alex&background=00afca&color=fff&size=400" className="w-full h-full object-cover opacity-80 pointer-events-none" />
              <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">Учитель</div>
            </div>

            <div 
              style={{ left: `${studentPos.x}px`, top: `${studentPos.y}px`, zIndex: activeWindow === 'student' ? 40 : 30 }}
              className="absolute w-[260px] bg-slate-800 rounded-[1.5rem] aspect-video overflow-hidden shadow-2xl border-2 border-white cursor-move"
              onMouseDown={(e) => handleDrag(e, 'student')}
            >
              {isCameraOn ? <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1] pointer-events-none" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-900 text-[8px] font-black uppercase tracking-widest opacity-40">Камера OFF</div>}
              <div className="absolute bottom-2 right-2 flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setIsMicOn(!isMicOn); }} className={`p-1 rounded-lg ${isMicOn ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'}`}><Mic size={10} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setIsCameraOn(!isCameraOn); }} className={`p-1 rounded-lg ${isCameraOn ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'}`}><Video size={10} /></button>
              </div>
            </div>

            {rightPanel !== 'none' && (
              <div className="w-[340px] h-full bg-white/80 backdrop-blur-xl border-l border-gray-100 shadow-2xl z-40 flex flex-col">
                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rightPanel === 'chat' ? <MessageCircle size={14} className="text-sky-500" /> : <Files size={14} className="text-sky-500" />}
                    <span className="text-[10px] font-black uppercase text-gray-900 tracking-widest">{rightPanel === 'chat' ? 'Чат урока' : 'Материалы'}</span>
                  </div>
                  <button onClick={() => setRightPanel('none')} className="text-gray-400 hover:text-gray-600"><Minimize2 size={14} /></button>
                </div>

                {rightPanel === 'chat' ? (
                  <>
                    <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-3 scroll-smooth">
                      {messages.map(m => (
                        <div key={m.id} className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}>
                          <div className={`px-3 py-2 rounded-2xl text-[12px] font-medium shadow-sm max-w-[85%] ${m.sender === 'student' ? 'bg-sky-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'}`}>{m.text}</div>
                          <span className="text-[7px] font-bold text-gray-300 mt-0.5 uppercase tracking-tighter">{m.time}</span>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-50">
                      <div className="relative flex items-center gap-2">
                        <input 
                          type="text" 
                          value={inputText} 
                          onChange={e => setInputText(e.target.value)} 
                          placeholder="Написать..." 
                          className="flex-grow px-4 py-2.5 rounded-xl bg-gray-50 text-[11px] font-medium border border-transparent focus:border-sky-500 outline-none" 
                        />
                        <button 
                          type="submit" 
                          className="p-2.5 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors shadow-sm shadow-sky-100"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {materials.map(mat => (
                      <div key={mat.id} className="group p-4 rounded-2xl bg-white border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${mat.type === 'pdf' ? 'bg-rose-50 text-rose-500' : mat.type === 'doc' ? 'bg-blue-50 text-blue-500' : 'bg-sky-50 text-sky-500'}`}>
                            <FileText size={18} />
                          </div>
                          <div className="flex-grow overflow-hidden">
                            <h4 className="text-xs font-black text-gray-900 truncate tracking-tight">{mat.title}</h4>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{mat.type.toUpperCase()} {mat.size && `• ${mat.size}`}</p>
                          </div>
                          <button className="text-gray-300 group-hover:text-sky-500 transition-colors">
                            {mat.type === 'link' ? <ExternalLink size={14} /> : <Download size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 h-full overflow-y-auto bg-gray-50/50">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="bg-sky-50 p-4 rounded-2xl text-sky-500"><PlayCircle size={24} /></div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">{upcomingLessons.length}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Предстоящих уроков</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="bg-green-50 p-4 rounded-2xl text-green-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">{completedLessons.length}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Пройдено занятий</p>
                  </div>
                </div>
                <div className="bg-kz-blue p-6 rounded-[2rem] shadow-lg shadow-sky-100 flex items-center gap-4 text-white">
                  <div className="bg-white/20 p-4 rounded-2xl"><Calendar size={24} /></div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest">Следующий урок</p>
                    <p className="text-sm font-bold opacity-90">Завтра, 18:00</p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Video size={20} className="text-sky-500" />
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Предстоящие уроки</h2>
                </div>
                
                {upcomingLessons.length === 0 ? (
                  <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-400 font-bold italic">У вас пока нет запланированных уроков</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingLessons.map((app) => (
                      <div key={app.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:border-sky-100 transition-all flex flex-col group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl group-hover:scale-110 transition-transform"><BookOpen size={20} /></div>
                            <div>
                              <h3 className="font-black text-gray-900">{SUBJECTS.find(s => s.id === app.subjectId)?.name}</h3>
                              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Уровень: {app.level}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            app.status === ApplicationStatus.SCHEDULED ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {app.status === ApplicationStatus.SCHEDULED ? 'Запланирован' : 'Ожидает'}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex-grow">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 mb-2"><Calendar size={14} className="text-sky-400" /> {app.preferredTime.date || 'Скоро'}</div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600"><Clock size={14} className="text-sky-400" /> {app.preferredTime.time}</div>
                        </div>
                        {app.status === ApplicationStatus.SCHEDULED ? (
                          <button 
                            onClick={() => { setActiveTab('class'); onJoinLesson(app.lessonRoomId || 'room-1'); }}
                            className="w-full bg-kz-blue text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-100"
                          >
                            <PlayCircle size={14} /> Перейти к уроку
                          </button>
                        ) : (
                          <button className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">Ожидание подтверждения</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <History size={20} className="text-gray-400" />
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">История занятий</h2>
                </div>
                {completedLessons.length === 0 ? (
                  <div className="bg-white/40 p-12 rounded-[2.5rem] border border-gray-100 text-center">
                    <p className="text-gray-400 font-bold text-sm italic">Здесь будут отображаться ваши пройденные уроки</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedLessons.map((app) => (
                      <div key={app.id} className="bg-white/60 p-6 rounded-[2.5rem] border border-gray-100 transition-all flex flex-col grayscale opacity-80 hover:grayscale-0 hover:opacity-100">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 text-gray-400 p-3 rounded-2xl"><CheckCircle2 size={20} /></div>
                            <div>
                              <h3 className="font-bold text-gray-700">{SUBJECTS.find(s => s.id === app.subjectId)?.name}</h3>
                              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{app.preferredTime.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
