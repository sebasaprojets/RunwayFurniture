/**
 * Editorial photography hot-linked from Unsplash (free to use under the Unsplash License;
 * hot-linking images.unsplash.com is Unsplash's recommended delivery method).
 * Every remote image has a bundled local fallback, swapped in automatically if it fails to load.
 */
const base = 'https://images.unsplash.com/photo-'

export function unsplash(id: string, w = 1600) {
  return `${base}${id}?auto=format&fit=crop&w=${w}&q=80`
}

const fallbacks = new Map<string, string>()

/** Register a remote photo with its local fallback and return the remote URL. */
export function photo(id: string, fallback: string, w = 1600) {
  const url = unsplash(id, w)
  fallbacks.set(url, fallback)
  return url
}

/** One capture-phase listener covers every <img> on the page. */
export function installImageFallback() {
  window.addEventListener(
    'error',
    (e) => {
      const el = e.target
      if (!(el instanceof HTMLImageElement)) return
      const fb = fallbacks.get(el.getAttribute('src') ?? '')
      if (fb && el.src !== fb) el.src = fb
    },
    true,
  )
}
