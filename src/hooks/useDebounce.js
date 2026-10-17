import { useEffect, useState } from 'react'

/**
 * Returns `value` after it has been stable for `delay` milliseconds.
 * Useful for search inputs that should not fire a request per keystroke.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
