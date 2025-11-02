import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollableHeight = documentHeight - windowHeight
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', calculateScrollProgress)
    window.addEventListener('resize', calculateScrollProgress)
    calculateScrollProgress() // Initial calculation

    return () => {
      window.removeEventListener('scroll', calculateScrollProgress)
      window.removeEventListener('resize', calculateScrollProgress)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-gray-900/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: scrollProgress > 0 ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative h-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      >
        {/* Main gradient bar */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 shadow-lg shadow-yellow-500/50" />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default ProgressBar

