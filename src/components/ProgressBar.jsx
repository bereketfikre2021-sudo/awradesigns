import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { throttle } from '../utils/throttle'

const SCROLL_THROTTLE_MS = 80

const ProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollableHeight = documentHeight - windowHeight
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      setScrollProgress(Math.min(progress, 100))
    }
    const throttled = throttle(calculateScrollProgress, SCROLL_THROTTLE_MS)
    window.addEventListener('scroll', throttled, { passive: true })
    window.addEventListener('resize', throttled)
    calculateScrollProgress()
    return () => {
      window.removeEventListener('scroll', throttled)
      window.removeEventListener('resize', throttled)
    }
  }, [])

  const progressPercentage = Math.round(scrollProgress)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {scrollProgress > 5 && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-8 right-8 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.button
            onClick={scrollToTop}
            className="relative w-32 h-12 md:w-40 md:h-14 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-2xl shadow-yellow-500/50 border-2 border-white/20 flex items-center justify-center cursor-pointer group overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-yellow-400 rounded-xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Progress bar inside button */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-xl overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-b-xl"
                initial={{ width: 0 }}
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2 md:gap-3">
              {/* Percentage */}
              <motion.div
                className="flex items-baseline gap-0.5"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xl md:text-2xl font-black text-black tabular-nums">
                  {progressPercentage}
                </span>
                <span className="text-xs md:text-sm font-bold text-black/70">%</span>
              </motion.div>

              {/* Divider */}
              <div className="w-px h-6 bg-black/20" />

              {/* Icon */}
              <motion.svg
                className="w-5 h-5 md:w-6 md:h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{
                  y: isHovered ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </motion.svg>
            </div>

            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '200%' } : { x: '-100%' }}
              transition={{ duration: 0.6 }}
            />

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-white/30 rounded-bl-xl" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProgressBar
