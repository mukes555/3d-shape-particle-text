import { useEffect, useRef, useState } from 'react'

export const DebouncedControl = ({ type = 'range', value, onChange, delay = 250, ...props }) => {
  const [localValue, setLocalValue] = useState(value)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const handler = setTimeout(() => {
      onChangeRef.current(localValue)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [localValue, delay])

  const handleChange = (e) => {
    const next = type === 'checkbox' ? e.target.checked : e.target.value
    setLocalValue(next)
  }

  return (
    <input
      type={type}
      value={type === 'checkbox' ? undefined : localValue}
      checked={type === 'checkbox' ? localValue : undefined}
      onChange={handleChange}
      {...props}
    />
  )
}

export const Switch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      className={`pgSwitch ${checked ? 'on' : ''}`}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="pgSwitchThumb" />
    </button>
  )
}

