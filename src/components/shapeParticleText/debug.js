export const createDebugLogger = (enabled) => {
  if (!enabled) {
    return {
      error: () => {},
      warn: () => {}
    }
  }

  return {
    error: (...args) => console.error(...args),
    warn: (...args) => console.warn(...args)
  }
}

