// components/ExplanationPicker.tsx

'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2.5 } }}>
      {/* Reason Dropdown */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="explanation-reason-label" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {label}
          </InputLabel>
          <Select
            labelId="explanation-reason-label"
            id="explanation-reason"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            label={label}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            <MenuItem value="">
              <em>— Select a reason —</em>
            </MenuItem>
            {reasons.map((reason) => (
              <MenuItem key={reason.id} value={reason.id}>
                {reason.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedReason && (
          <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, color: 'text.secondary', mt: 0.5 }}>
            {selectedReason.short}
          </Typography>
        )}
      </Box>

      {/* User Note Textarea */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          id="user-note"
          label="Additional Details (Optional)"
          value={userNote}
          onChange={(e) => onUserNoteChange(e.target.value)}
          placeholder="Add a brief note with specific details (1-2 sentences)..."
          multiline
          rows={2}
          inputProps={{ maxLength: 300 }}
          fullWidth
          sx={{
            '& .MuiInputBase-input': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
            },
          }}
        />
        <Typography variant="caption" sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, color: 'text.secondary', textAlign: 'right' }}>
          {userNote.length}/300
        </Typography>
      </Box>

      {/* Expanded Preview */}
      {value && expandedPreview && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 500 }}>
            Preview of Expanded Explanation
          </Typography>
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              lineHeight: 1.5,
              backgroundColor: 'grey.50',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              color: 'text.secondary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {expandedPreview}
          </Box>
          <Typography variant="caption" sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, color: 'text.secondary' }}>
            This text will be inserted into your letter.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ExplanationPicker;