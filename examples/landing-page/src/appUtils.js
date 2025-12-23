export const getRouteFromHash = () => {
  const route = window.location.hash.replace('#', '').trim()
  if (route === 'playground') return 'playground'
  if (route === 'beta') return 'beta'
  return 'home'
}

export const copyText = async (text) => {
  if (!text) return false
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'fixed'
  el.style.top = '-9999px'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.focus()
  el.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(el)
  return ok
}

