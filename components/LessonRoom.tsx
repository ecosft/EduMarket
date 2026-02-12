
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Video, Mic, Share2, MessageSquare, Send, User, Files, Download, ExternalLink, FileText, Move, MicOff, VideoOff, X } from 'lucide-react';
import Whiteboard from './Whiteboard';

interface Message {
  id: string;
  text: string;
  sender: 'student' | 'teacher';
  time: string;
}

interface Position {
  x: number;
  y: number;
}

const LessonRoom: React.FC<{ roomId: string; onExit: () => void }> = ({ roomId, onExit }) => {
  const [messages, setMessages] = useState<Message[]>([{ id: '1', text: 'Добрый день! Сегодня разберем тему Past Simple.', sender: 'teacher', time: '12:00' }]);
  const [inputText, setInputText] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [activePanel, setActivePanel] = useState<'chat' | 'materials'>('chat');
  
  const [teacherPos, setTeacherPos] = useState<Position>({ x: 20, y: 100 });
  const [studentPos, setStudentPos] = useState<Position>({ x: 20, y: 280 });
  const [activeWindow, setActiveWindow] = useState<'teacher' | 'student'>('teacher');

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent, type: 'teacher' | 'student') => {
    if ((e.target as HTMLElement).closest('button')) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = type === 'teacher' ? teacherPos : studentPos;
    setActiveWindow(type);
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - 270, initialPos.x + (moveEvent.clientX - startX)));
      const newY = Math.max(80, Math.min(window.innerHeight - 160, initialPos.y + (moveEvent.clientY - startY)));
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'teacher', // В этой комнате отправитель учитель
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  useEffect(() => {
    if (isCamOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(() => setIsCamOn(false));
    }
  }, [isCamOn, isMicOn]);

  // Используем scrollTop вместо scrollIntoView
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, activePanel]);

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm relative z-50">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ArrowLeft size={20} className="text-gray-400" /></button>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Урок Английского</h2>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span><span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">LIVE • 24:15</span></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-gray-100 p-1 rounded-xl mr-4">
              <button onClick={() => setActivePanel('chat')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activePanel === 'chat' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400'}`}>Чат</button>
              <button onClick={() => setActivePanel('materials')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activePanel === 'materials' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400'}`}>Материалы</button>
           </div>
           <button onClick={onExit} className="bg-rose-50 text-rose-500 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100">Завершить</button>
        </div>
      </header>

      <div className="flex-grow relative overflow-hidden flex">
        <div className="flex-grow relative z-0">
          <Whiteboard />
        </div>

        <div style={{ left: `${teacherPos.x}px`, top: `${teacherPos.y}px`, zIndex: activeWindow === 'teacher' ? 40 : 30 }} className="absolute w-[240px] bg-slate-900 rounded-[1.5rem] aspect-video overflow-hidden shadow-2xl border-2 border-white cursor-move" onMouseDown={(e) => handleDrag(e, 'teacher')}>
          <img src="https://ui-avatars.com/api/?name=Teacher+Smith&background=00afca&color=fff&size=400" className="w-full h-full object-cover opacity-70 pointer-events-none" />
          <div className="absolute top-2 left-2 bg-black/40 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest">Teacher</div>
        </div>

        <div style={{ left: `${studentPos.x}px`, top: `${studentPos.y}px`, zIndex: activeWindow === 'student' ? 40 : 30 }} className="absolute w-[240px] bg-slate-800 rounded-[1.5rem] aspect-video overflow-hidden shadow-2xl border-2 border-white cursor-move" onMouseDown={(e) => handleDrag(e, 'student')}>
          {isCamOn ? <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1] pointer-events-none" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-900 text-[8px] font-black uppercase tracking-widest">Cam OFF</div>}
          <div className="absolute bottom-2 right-2 flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); setIsMicOn(!isMicOn); }} className={`p-1 rounded-lg ${isMicOn ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'}`}><Mic size={10} /></button>
              <button onClick={(e) => { e.stopPropagation(); setIsCamOn(!isCamOn); }} className={`p-1 rounded-lg ${isCamOn ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'}`}><Video size={10} /></button>
          </div>
        </div>

        <div className="w-[320px] h-full bg-white/90 backdrop-blur-xl border-l border-gray-100 shadow-2xl z-40 flex flex-col">
          <div className="p-4 border-b border-gray-50 flex items-center gap-2">
            {activePanel === 'chat' ? <MessageSquare size={14} className="text-kz-blue" /> : <Files size={14} className="text-kz-blue" />}
            <span className="text-[10px] font-black uppercase text-gray-900 tracking-tight">{activePanel === 'chat' ? 'Чат' : 'Материалы'}</span>
          </div>
          
          {activePanel === 'chat' ? (
            <div className="flex-grow flex flex-col overflow-hidden">
               <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-3 scroll-smooth">
                 {messages.map(m => (
                   <div key={m.id} className={`flex flex-col ${m.sender === 'teacher' ? 'items-end' : 'items-start'}`}>
                     <div className={`px-3 py-2 rounded-2xl text-[11px] font-medium shadow-sm max-w-[90%] ${m.sender === 'teacher' ? 'bg-kz-blue text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'}`}>{m.text}</div>
                     <span className="text-[7px] font-bold text-gray-300 mt-1 uppercase">{m.time}</span>
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
                      className="flex-grow px-4 py-2.5 rounded-xl bg-gray-50 text-[11px] font-medium outline-none border border-transparent focus:border-kz-blue" 
                    />
                    <button 
                      type="submit"
                      className="p-2.5 bg-kz-blue text-white rounded-xl hover:bg-sky-600 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
               </form>
            </div>
          ) : (
            <div className="p-4 space-y-3 overflow-y-auto">
              {[
                { title: 'Грамматика.pdf', type: 'pdf' },
                { title: 'Задание.docx', type: 'doc' },
                { title: 'Видео-урок', type: 'link' }
              ].map((mat, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-50 hover:border-sky-200 transition-all cursor-pointer group">
                  <div className="p-2 rounded-lg bg-sky-50 text-sky-500"><FileText size={16} /></div>
                  <div className="flex-grow text-[10px] font-bold text-gray-900">{mat.title}</div>
                  <Download size={14} className="text-gray-300 group-hover:text-sky-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonRoom;
