export function isValidLink(arg: string): boolean {
  let url
  
  try {
    url = new URL(arg)
  } catch (_) {
    return false
  }

  return url.protocol === "http:" || url.protocol === "https:"
}