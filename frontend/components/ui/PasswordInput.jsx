import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  showToggle = true, 
  ...props 
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60A4BF] focus:border-[#60A4BF] text-gray-700 bg-white ${
            showToggle ? 'pr-12' : 'pr-4'
          }`}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            onClick={() => setShow(!show)}
            tabIndex={-1}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};