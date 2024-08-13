import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  items: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ items, ...props }) => (
  <select {...props} className="w-full rounded-md border-2 border-slate-600 bg-slate-900 py-2 px-3 text-sm text-white">
    {items.map(({ value, label }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);