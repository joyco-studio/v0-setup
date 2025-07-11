import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to normalize indentation for code display
export const normalizeIndentation = (code: string): string => {
  const lines = code.split('\n')

  // Filter out empty lines to find minimum indentation
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0)

  if (nonEmptyLines.length === 0) return code

  // Find the minimum indentation level
  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^(\s*)/)
      return match ? match[1].length : 0
    })
  )

  // Remove the minimum indentation from all lines
  const normalizedLines = lines.map((line) => {
    if (line.trim().length === 0) return line // Keep empty lines as is
    return line.slice(minIndent)
  })

  return normalizedLines.join('\n').trim()
}

export const copy = async (content: string) => {
  try {
    const normalizedContent = normalizeIndentation(content)

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(normalizedContent)
    } else {
      // Fallback for older browsers or insecure contexts
      const textArea = document.createElement('textarea')
      textArea.value = normalizedContent
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
