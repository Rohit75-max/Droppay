import React from 'react';

/**
 * A highly reusable Button component configured for the Drope design system.
 * 
 * @param {string} variant - Visual style: 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} size - Size: 'sm' | 'md' | 'lg' | 'icon'
 * @param {boolean} disabled - Whether the button is interactable
 * @param {React.ReactNode} children - Button contents
 * @param {string} className - Optional Tailwind utility classes to layer on
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  // Base structural classes for all buttons
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95';

  // Dynamic visual variants mapped to Drope's aesthetic
  const variants = {
    primary: 'bg-[#111111] text-white hover:bg-[#111111]/90 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:shadow-none',
    secondary: 'bg-[#FFCA28] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[2px_2px_0px_#111111] active:shadow-none',
    outline: 'bg-transparent border-2 border-[#111111]/20 text-[#111111] hover:bg-[#111111]/5 hover:border-[#111111]',
    ghost: 'bg-transparent hover:bg-black/5 text-[#111111]',
  };

  // Pre-configured proportional sizing classes
  const sizes = {
    sm: 'h-8 px-4 text-[10px] rounded-full',
    md: 'h-11 px-6 text-xs rounded-full',
    lg: 'h-14 px-8 text-sm rounded-full',
    icon: 'h-10 w-10 rounded-full',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
