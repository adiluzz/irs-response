'use client'

import React from 'react'

type Option = { value: string; label: string }

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  options: Option[]
}

export const Select = React.forwardRef<HTMLSelectElement, Props>(function Select(
  { options, className = '', ...props },
  ref
) {
  return (
    <select
      ref={ref}
      {...props}
      className={[
        'w-full rounded-sm border border-tac-border bg-white px-3 py-2 text-sm text-tac-text-primary',
        'outline-none focus:ring-2 focus:ring-black/10',
        className,
      ].join(' ')}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
})
