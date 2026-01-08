// components/EducationalReferencesCheckbox.tsx
'use client'

import React from 'react'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'

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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        backgroundColor: 'grey.50',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: { xs: 20, sm: 24 },
              },
            }}
          />
        }
        label={
          <Typography
            sx={{
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Append IRS case law references to the draft
          </Typography>
        }
        sx={{
          margin: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          '& .MuiFormControlLabel-label': {
            cursor: disabled ? 'not-allowed' : 'pointer',
          },
        }}
      />
    </Box>
  )
}

// Keep default export for backwards compatibility with existing imports
export default EducationalReferencesCheckbox
