// components/EducationalReferencesCheckbox.tsx
'use client'

import React from 'react'

interface EducationalReferencesCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  disabled?: boolean
}

export function EducationalReferencesCheckbox({
  checked,
  onChange,
  id = 'includeReferences',
  disabled = false,
}: EducationalReferencesCheckboxProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'var(--gray-50)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--gray-200)',
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: '18px',
          height: '18px',
          marginTop: '2px',
          accentColor: 'var(--gray-900)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />

      <label
        htmlFor={id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--gray-900)',
          }}
        >
          Append IRS case law references to the draft
        </span>
      </label>
    </div>
  )
}

// Keep default export for backwards compatibility with existing imports
export default EducationalReferencesCheckbox
