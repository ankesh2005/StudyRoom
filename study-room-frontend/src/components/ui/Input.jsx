import React from 'react'

export const Input = React.forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'