/**
 * Throttle function calls to at most once per `limit` ms.
 * Uses trailing edge so the final state is always applied.
 */
export function throttle(fn, limit) {
  let lastCall = 0
  let timeoutId = null
  return function throttled(...args) {
    const now = Date.now()
    const elapsed = now - lastCall
    if (elapsed >= limit) {
      lastCall = now
      fn.apply(this, args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(
        () => {
          timeoutId = null
          lastCall = Date.now()
          fn.apply(this, args)
        },
        limit - elapsed
      )
    }
  }
}
