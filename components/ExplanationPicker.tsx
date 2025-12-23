// components/ExplanationPicker.tsx

'use client';

import React, { useMemo } from 'react';

export type ReasonOption = {
  id: string;
  title: string;
  short: string;
};

interface ExplanationPickerProps {
  reasons: ReasonOption[];
  value: string;
  onChange: (reasonId: string) => void;
  userNote: string;
  onUserNoteChange: (note: string) => void;
  generateExpandedExplanation: (reasonId: string, userNote?: string) => string;
  label?: string;
}

export function ExplanationPicker({
  reasons,
  value,
  onChange,
  userNote,
  onUserNoteChange,
  generateExpandedExplanation,
  label = 'Reason for Response',
}: ExplanationPickerProps) {
  const selectedReason = useMemo(
    () => reasons.find((r) => r.id === value),
    [reasons, value]
  );

  const expandedPreview = useMemo(() => {
    if (!value) return '';
    return generateExpandedExplanation(value, userNote);
  }, [value, userNote, generateExpandedExplanation]);

  return (
    <div className="explanation-picker" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Reason Dropdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          htmlFor="explanation-reason"
          style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
        >
          {label}
        </label>
        <select
          id="explanation-reason"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="">— Select a reason —</option>
          {reasons.map((reason) => (
            <option key={reason.id} value={reason.id}>
              {reason.title}
            </option>
          ))}
        </select>
        {selectedReason && (
          <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {selectedReason.short}
          </span>
        )}
      </div>

      {/* User Note Textarea */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          htmlFor="user-note"
          style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
        >
          Additional Details (Optional)
        </label>
        <textarea
          id="user-note"
          value={userNote}
          onChange={(e) => onUserNoteChange(e.target.value)}
          placeholder="Add a brief note with specific details (1-2 sentences)..."
          rows={2}
          maxLength={300}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <span style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>
          {userNote.length}/300
        </span>
      </div>

      {/* Expanded Preview */}
      {value && expandedPreview && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label
            style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
          >
            Preview of Expanded Explanation
          </label>
          <div
            style={{
              padding: '12px',
              fontSize: '13px',
              lineHeight: '1.5',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              color: '#4b5563',
              whiteSpace: 'pre-wrap',
            }}
          >
            {expandedPreview}
          </div>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
            This text will be inserted into your letter.
          </span>
        </div>
      )}
    </div>
  );
}

export default ExplanationPicker;