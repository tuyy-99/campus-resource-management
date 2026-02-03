"use client";

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  variant?: 'default' | 'search';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, variant = 'default', className = '', ...props }, ref) => {
    const baseClasses = variant === 'search' 
      ? 'input max-w-sm' 
      : 'input';
    
    const inputClasses = `${baseClasses} ${error ? 'border-red-500 dark:border-red-400' : ''} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="form-label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="form-help">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';