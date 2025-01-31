import React from 'react';

export const Button = React.forwardRef(({ 
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium
        transition-colors focus-visible:outline-none focus-visible:ring-1
        focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50
        ${className}
      `}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
