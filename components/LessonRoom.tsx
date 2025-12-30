
import React from 'react';
import { ArrowLeft, Video, Mic, Share2, MessageSquare, LogOut } from 'lucide-react';

interface LessonRoomProps {
  roomId: string;
  onExit: () => void;
}

const LessonRoom: React.FC<LessonRoomProps> = ({ roomId, onExit }) => {
  // Use Jitsi meet iframe
  const jitsiUrl = `https://meet.jit.si/${roomId}#config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-xl font-bold">Онлайн-класс: {roomId}</h2>
        </div>
        <div className="flex gap-4">
          <button onClick={onExit} className="bg-red-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all">
            <LogOut size={18} /> Выйти
          </button>
        </div>
      </div>

      {/* Main Classroom Area */}
      <div className="flex-grow relative bg-black">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full h-full border-none"
          title="Virtual Lesson"
        />
      </div>

      {/* Control Bar (Mock) */}
      <div className="bg-slate-800 p-6 flex justify-center gap-8 border-t border-slate-700">
         <button className="bg-slate-700 p-4 rounded-full text-white hover:bg-indigo-600 transition-colors"><Mic /></button>
         <button className="bg-slate-700 p-4 rounded-full text-white hover:bg-indigo-600 transition-colors"><Video /></button>
         <button className="bg-slate-700 p-4 rounded-full text-white hover:bg-indigo-600 transition-colors"><Share2 /></button>
         <button className="bg-indigo-600 p-4 rounded-full text-white hover:bg-indigo-700 transition-colors"><MessageSquare /></button>
      </div>
    </div>
  );
};

export default LessonRoom;
