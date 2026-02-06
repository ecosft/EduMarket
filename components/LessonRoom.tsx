
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Video, Mic, Share2, MessageSquare, LogOut, Send, User, Monitor, X, Settings } from 'lucide-react';
import Whiteboard from './Whiteboard';

interface Message {
  id: string;
  text: string;
  sender: 'student' | 'teacher';
  time: string;
}

interface LessonRoomProps {
  roomId: string;
  onExit: () => void;
}

const LessonRoom: React.FC<LessonRoomProps> = ({ roomId, onExit }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Добрый день! Сегодня разберем тему Past Simple.', sender: 'teacher', time: '12:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCamOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera error:", err));
    }
  }, [isCamOn, isMicOn]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <div className="h-8 w-px bg-gray-100" />
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Урок Английского</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">В прямом эфире • 24:15</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-100 transition-all">
            <Share2 size={16} /> Поделиться экраном
          </button>
          <button onClick={onExit} className="bg-red-50 text-red-500 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100">
            Завершить урок
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex p-6 gap-6 overflow-hidden">
        
        {/* Left: Whiteboard (Main Learning Tool) */}
        <div className="flex-grow flex flex-col">
          <Whiteboard />
        </div>

        {/* Right Sidebar: Video Feeds & Chat */}
        <div className="w-80 flex flex-col gap-6 flex-shrink-0 overflow-y-auto">
          
          {/* Teacher Camera (Top) */}
          <div className="bg-gray-900 rounded-[2.5rem] aspect-video relative overflow-hidden shadow-xl border-4 border-white">
            <img 
              src="https://ui-avatars.com/api/?name=Teacher+Smith&background=00afca&color=fff&size=400" 
              className="w-full h-full object-cover opacity-80"
              alt="Teacher"
            />
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Учитель: Александр</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-kz-blue/20 p-4 rounded-full animate-ping">
                <Video size={32} className="text-kz-blue opacity-50" />
              </div>
            </div>
          </div>

          {/* Student Camera (Bottom) */}
          <div className="bg-slate-800 rounded-[2.5rem] aspect-video relative overflow-hidden shadow-xl border-4 border-white">
            {isCamOn ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror transform scale-x-[-1]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <User size={32} className="text-slate-600 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Камера выключена</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Вы (Ученик)</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMicOn(!isMicOn)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isMicOn ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                  <Mic size={14} />
                </button>
                <button onClick={() => setIsCamOn(!isCamOn)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isCamOn ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                  <Video size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex-grow bg-white rounded-[2.5rem] border border-gray-100 shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center gap-2">
              <MessageSquare size={16} className="text-kz-blue" />
              <span className="text-xs font-black uppercase text-gray-900 tracking-tight">Чат урока</span>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl text-xs font-medium max-w-[90%] shadow-sm ${m.sender === 'student' ? 'bg-kz-blue text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                  <span className="text-[8px] font-bold text-gray-300 mt-1 uppercase">{m.time}</span>
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
                  placeholder="Сообщение..."
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-xl text-xs font-medium border border-transparent focus:bg-white focus:border-kz-blue outline-none transition-all"
                />
                <button type="submit" className="absolute right-2 top-1.5 p-1.5 text-kz-blue hover:scale-110 transition-transform">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Control Bar (Optional floating or fixed) */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 flex justify-center gap-4">
         <button className="flex flex-col items-center gap-1 group">
            <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-kz-blue group-hover:text-white transition-all text-gray-400">
              <Monitor size={20} />
            </div>
            <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Доска</span>
         </button>
         <button className="flex flex-col items-center gap-1 group">
            <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-kz-blue group-hover:text-white transition-all text-gray-400">
              <Settings size={20} />
            </div>
            <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Настройки</span>
         </button>
      </div>
    </div>
  );
};

export default LessonRoom;
