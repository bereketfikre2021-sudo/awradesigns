import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { isMobile, prefersReducedMotion, isLowEndDevice } from '../utils/deviceDetection'

const Hero = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false)

  useEffect(() => {
    setShouldReduceAnimations(isMobile() || prefersReducedMotion() || isLowEndDevice())
  }, [])

  const [displayedText, setDisplayedText] = useState('')
  const fullText = 'Professional Architecture & Design'
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (!inView) return

    let currentIndex = 0
    setDisplayedText('')
    setShowCursor(true)

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 80) // Typing speed

    return () => {
      clearInterval(typingInterval)
    }
  }, [inView, fullText])

  // Cursor blink effect
  useEffect(() => {
    if (displayedText === fullText) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 530)
      return () => clearInterval(cursorInterval)
    } else if (displayedText.length > 0) {
      setShowCursor(true)
    }
  }, [displayedText, fullText])

  const scrollToPortfolio = () => {
    const element = document.getElementById('works')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-8 md:py-12"
    >
      {/* Background Image with Beautiful Effects */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <motion.img
          src="/images/Hero BG.webp"
          alt="Awra Designs Interior"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          initial={shouldReduceAnimations ? { scale: 1 } : { scale: 1.1 }}
          animate={inView ? { scale: 1 } : (shouldReduceAnimations ? { scale: 1 } : { scale: 1.1 })}
          transition={shouldReduceAnimations ? { duration: 0 } : { duration: 1.5, ease: 'easeOut' }}
        />
        
        {/* Gradient Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-10" />
        
        {/* Radial Gradient for Focus */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80 z-10" 
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)'
          }}
        />
        
        {/* Animated Light Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-400/10 z-10"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Subtle Vignette Effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] z-10" />
      </div>

      {/* Animated Background Particles & Golden Gradients */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none" style={{ willChange: 'transform' }}>
          {[...Array(isMobile() ? 8 : 12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-30 container-custom text-center px-4 max-w-5xl mx-auto"
      >
        {/* Main Heading */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 text-white leading-tight tracking-tight"
        >
          <span className="block mb-2">Awra Finishing</span>
          <span className="block text-gradient bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            & Interior
          </span>
        </motion.h1>

        {/* Typing Subtitle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 md:mb-8"
        >
          <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-200 max-w-3xl mx-auto min-h-[1.2em]">
            {displayedText}
            <span
              className={`inline-block w-0.5 h-5 md:h-6 bg-yellow-400 ml-2 align-middle transition-opacity duration-300 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={scrollToPortfolio}
            className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black font-semibold text-base md:text-lg rounded-full overflow-hidden shadow-2xl shadow-yellow-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Our Projects
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
          <motion.a
            href="tel:+251923814125"
            className="group relative px-8 py-4 md:px-10 md:py-5 border-2 border-white/30 text-white font-semibold text-base md:text-lg rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Free Consultation
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
          </motion.a>
        </motion.div>
      </motion.div>

    </section>
  )
}

export default Hero
