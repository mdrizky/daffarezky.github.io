export function estimateReadingTime(text: string, wordsPerMinute = 200) {
  if (!text) return "1 min read"
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / wordsPerMinute))
  return `${minutes} min read`
}

export default estimateReadingTime
