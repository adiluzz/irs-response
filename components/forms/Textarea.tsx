import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({ hasError = false, style, ...props }: TextareaProps) {
  return (
    <textarea
      style={{
        width: '100%',
        padding: '10px 12px',
        fontSize: '14px',
        lineHeight: 1.6,
        color: 'var(--gray-900)',
        backgroundColor: '#ffffff',
        border: `1px solid ${hasError ? 'var(--red-600)' : 'var(--gray-300)'}`,
        borderRadius: 'var(--radius-md)',
        outline: 'none',
        resize: 'vertical',
        minHeight: '100px',
        fontFamily: 'inherit',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = hasError ? 'var(--red-600)' : 'var(--blue-500)';
        e.target.style.boxShadow = hasError 
          ? '0 0 0 3px var(--red-50)' 
          : '0 0 0 3px var(--blue-50)';
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = hasError ? 'var(--red-600)' : 'var(--gray-300)';
        e.target.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
}