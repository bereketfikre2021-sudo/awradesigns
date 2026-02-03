import { useInView } from 'react-intersection-observer'
import { Suspense } from 'react'

/**
 * Renders children only when the section is near the viewport.
 * Reduces initial JS work and defers below-the-fold content until needed.
 */
export default function LazySection({ children, fallback, rootMargin = '200px' }) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin,
    triggerOnce: true,
  })

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        <div className="min-h-[200px]" aria-hidden="true" />
      )}
    </div>
  )
}
