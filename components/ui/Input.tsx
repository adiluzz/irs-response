'use client'

import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { className = '', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      {...props}
      className={[
        'w-full rounded-sm border border-tac-border bg-white px-3 py-2 text-sm text-tac-text-primary',
        'outline-none focus:ring-2 focus:ring-black/10',
        className,
      ].join(' ')}
    />
  )
})
