import React, { useState, useEffect, useRef } from 'react';
import { DraggableCore } from 'react-draggable';
import { X } from 'phosphor-react';
import { twMerge } from 'tailwind-merge';

type DraggableWindowProps = {
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
};

const DraggableWindow: React.FC<DraggableWindowProps> = ({ onClose, className, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    const handleResize = () => {
      if (windowRef.current) {
        const { offsetWidth, offsetHeight } = windowRef.current;
        setPosition({
          x: Math.max(0, Math.min(position.x, window.innerWidth - offsetWidth)),
          y: Math.max(0, Math.min(position.y, window.innerHeight - offsetHeight)),
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  return (
    <DraggableCore onDrag={handleDrag}>
      <div
        ref={windowRef}
        className={twMerge(
          'z-50 w-[15rem] overflow-hidden rounded-md bg-slate-600 drop-shadow-lg',
          className,
        )}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div className="flex">
          <div className="flex flex-1 cursor-move items-center gap-2 bg-slate-800 px-4 py-2">
            <div>{children}</div>
          </div>
          <div className="ml-auto flex">
            <button
              onClick={onClose}
              className="bg-slate-800 px-5 py-3 text-slate-300 transition hover:bg-red-600 hover:text-white active:bg-red-700 active:text-white"
            >
              <X weight="bold" />
            </button>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </DraggableCore>
  );
};

export default DraggableWindow;
