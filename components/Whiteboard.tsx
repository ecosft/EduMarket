
import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Eraser, Trash2, Type, Palette } from 'lucide-react';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00AFCA');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'text'>('pencil');
  
  // Состояния для текстового инструмента
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.putImageData(tempImage, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (tool !== 'text' || isTyping) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTextPos({ x, y });
    setIsTyping(true);
    setTextInput('');
    
    // Фокус на инпут после рендера
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submitText = () => {
    if (!textInput.trim()) {
      setIsTyping(false);
      return;
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.font = `bold ${brushSize * 5 + 12}px Inter, sans-serif`;
      ctx.fillStyle = color;
      ctx.fillText(textInput, textPos.x, textPos.y);
    }
    setIsTyping(false);
    setTextInput('');
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === 'text') return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === 'text') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 15 : brushSize;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (window.confirm('Очистить всю доску?')) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-white select-none overflow-hidden" onClick={handleCanvasClick}>
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className={`absolute inset-0 w-full h-full touch-none ${tool === 'text' ? 'cursor-text' : 'cursor-crosshair'}`}
      />

      {/* Floating Text Input */}
      {isTyping && (
        <div 
          className="absolute z-[60]"
          style={{ left: textPos.x, top: textPos.y - 20 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitText()}
            onBlur={submitText}
            className="bg-white/90 border-2 border-kz-blue rounded-lg px-3 py-1.5 outline-none shadow-xl text-gray-900 font-bold min-w-[150px]"
            placeholder="Напишите что-нибудь..."
            style={{ fontSize: `${brushSize * 3 + 12}px`, color: color }}
          />
        </div>
      )}

      {/* Floating Toolbox */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-white p-2 rounded-[2rem] shadow-2xl flex items-center gap-3">
          
          <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl">
            <button 
              onClick={(e) => { e.stopPropagation(); setTool('pencil'); setIsTyping(false); }}
              className={`p-3 rounded-xl transition-all ${tool === 'pencil' ? 'bg-kz-blue text-white shadow-lg scale-110' : 'text-gray-400 hover:text-gray-600'}`}
              title="Карандаш"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setTool('text'); }}
              className={`p-3 rounded-xl transition-all ${tool === 'text' ? 'bg-kz-blue text-white shadow-lg scale-110' : 'text-gray-400 hover:text-gray-600'}`}
              title="Текст"
            >
              <Type size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setTool('eraser'); setIsTyping(false); }}
              className={`p-3 rounded-xl transition-all ${tool === 'eraser' ? 'bg-kz-blue text-white shadow-lg scale-110' : 'text-gray-400 hover:text-gray-600'}`}
              title="Ластик"
            >
              <Eraser size={18} />
            </button>
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <div className="flex gap-2 px-2">
            {['#00AFCA', '#F8CC46', '#EF4444', '#10B981', '#000000'].map(c => (
              <button 
                key={c}
                onClick={(e) => { e.stopPropagation(); setColor(c); tool === 'eraser' && setTool('pencil'); }}
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-125 shadow-sm ${color === c && tool !== 'eraser' ? 'border-gray-800 scale-125' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <div className="flex items-center gap-3 px-2">
             <input 
               type="range" 
               min="1" 
               max="20" 
               value={brushSize} 
               onChange={(e) => setBrushSize(parseInt(e.target.value))}
               className="w-20 accent-kz-blue cursor-pointer"
             />
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <button 
            onClick={(e) => { e.stopPropagation(); clearCanvas(); }}
            className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
            title="Очистить всё"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
