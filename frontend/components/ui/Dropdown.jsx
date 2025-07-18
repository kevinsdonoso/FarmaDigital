import React from 'react';

export const Dropdown = ({ label, options, value, onChange, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60A4BF] focus:border-[#60A4BF] text-gray-900 bg-white"
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);