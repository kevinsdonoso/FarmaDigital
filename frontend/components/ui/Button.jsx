import React from 'react';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  loading = false, // Añade loading aquí
  children,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm',
    outline: 'border border-blue-500 bg-white text-blue-500 hover:bg-blue-50 shadow-sm',
    ghost: 'text-blue-500 hover:bg-blue-50 shadow-none',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-11 px-8',
  };

  // Filtra loading para no pasarlo al DOM
  const { ...rest } = props;
  delete rest.loading;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? <span className="mr-2 animate-spin">⏳</span> : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };