import React, { useState, useEffect } from 'react';

interface SelectProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  items: { value: string; label: string }[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({ id, value, onChange, items, disabled }) => {
  const [selectValue, setSelectValue] = useState(value);

  useEffect(() => {
    setSelectValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(event.target.value);
    onChange(event);
  };

  return (
    <div className="relative">
      <select
        id={id}
        value={selectValue}
        onChange={handleChange}
        disabled={disabled}
        className="block w-full appearance-none rounded-md border-2 border-slate-600 bg-slate-900 py-2 pl-3 pr-8 text-sm text-white transition hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500"
      >
        {items.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-3 text-slate-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;
