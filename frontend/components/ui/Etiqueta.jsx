import React from 'react';

export const Badge = ({ color = 'primary', children }) => {
  const colorMap = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    light: 'bg-light text-primary',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color]}`}>
      {children}
    </span>
  );
};