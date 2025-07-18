import React from 'react';

export const Input = ({ label, type = 'text', value, onChange, placeholder, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60A4BF] focus:border-[#60A4BF] text-gray-700 bg-white"
      {...props}
    />
  </div>
);