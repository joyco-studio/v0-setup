// This will contain the compiled CSS as a string
// The actual CSS content will be injected by the build process
export const CSS_CONTENT = `/* CSS_PLACEHOLDER */`

let isInjected = false

export function injectStyles() {
  if (isInjected || typeof document === 'undefined') {
    return
  }

  // Check if styles are already injected
  if (document.querySelector('#v0-setup-styles')) {
    isInjected = true
    return
  }

  const style = document.createElement('style')
  style.id = 'v0-setup-styles'
  style.textContent = CSS_CONTENT
  document.head.appendChild(style)
  isInjected = true
}
