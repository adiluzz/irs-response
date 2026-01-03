'use client'

import React from 'react'

type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean
}

export function Label({ required, children, className = '', ...props }: Props) {
  return (
    <label
      {...props}
      className={`block text-sm font-medium text-tac-text-primary ${className}`.trim()}
    >
      {children}
      {required ? <span className="text-red-600"> *</span> : null}
    </label>
  )
}
