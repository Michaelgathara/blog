export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200 // Average reading speed
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  
  if (minutes === 1) {
    return "1 min read"
  }
  
  return `${minutes} min read`
}

export const extractTextFromHtml = (html) => {
  // Simple HTML tag removal for reading time calculation
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
}
