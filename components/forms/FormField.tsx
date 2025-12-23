import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Label row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <label
          htmlFor={htmlFor}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--gray-700)',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--red-600)', marginLeft: '2px' }}>*</span>
          )}
        </label>
        {hint && (
          <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
            {hint}
          </span>
        )}
      </div>

      {/* Input */}
      {children}

      {/* Error message */}
      {error && (
        <span style={{ fontSize: '12px', color: 'var(--red-600)' }}>
          {error}
        </span>
      )}
    </div>
  );
}