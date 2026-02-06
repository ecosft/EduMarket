
import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Eraser, Trash2, Square } from 'lucide-react';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00AFCA');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ресайз канваса под родителя
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
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
    ctx.lineWidth = tool === 'eraser' ? brushSize * 5 : brushSize;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-inner border border-gray-100">
      {/* Toolbar */}
      <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTool('pencil')}
            className={`p-2.5 rounded-xl transition-all ${tool === 'pencil' ? 'bg-kz-blue text-white shadow-lg' : 'bg-white text-gray-400 hover:text-gray-600'}`}
          >
            <Pencil size={20} />
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={`p-2.5 rounded-xl transition-all ${tool === 'eraser' ? 'bg-kz-blue text-white shadow-lg' : 'bg-white text-gray-400 hover:text-gray-600'}`}
          >
            <Eraser size={20} />
          </button>
          <div className="h-8 w-px bg-gray-200 mx-2" />
          <div className="flex gap-1.5">
            {['#00AFCA', '#F8CC46', '#EF4444', '#10B981', '#000000'].map(c => (
              <button 
                key={c}
                onClick={() => { setColor(c); setTool('pencil'); }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === 'pencil' ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <button 
          onClick={clearCanvas}
          className="p-2.5 rounded-xl bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-grow relative bg-white cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
};

export default Whiteboard;
