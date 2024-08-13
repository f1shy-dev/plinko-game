import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Switch: React.FC<SwitchProps> = ({ id, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    onChange(event);
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="sr-only"
      />
      <div
        className={twMerge(
          'h-6 w-11 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50',
          isChecked ? 'bg-green-500' : 'bg-slate-900',
        )}
      >
        <div
          className={twMerge(
            'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
            isChecked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </div>
    </div>
  );
};

export default Switch;
