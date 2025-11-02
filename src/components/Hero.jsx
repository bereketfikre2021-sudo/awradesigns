import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Hero = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

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

  const scrollToServices = () => {
    const element = document.getElementById('services')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95 z-10" />
        <img
          src="/images/Hero BG.webp"
          alt="Awra Designs Interior"
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
      </div>

      {/* Animated Background Particles & Golden Gradients */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
          className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 md:mb-10 text-white leading-tight tracking-tight"
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
          className="mb-8 md:mb-12"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-200 max-w-4xl mx-auto min-h-[1.2em]">
            {displayedText}
            <span
              className={`inline-block w-1 h-8 md:h-10 lg:h-12 bg-yellow-400 ml-2 align-middle transition-opacity duration-300 ${
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
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            onClick={scrollToServices}
            className="px-10 py-5 md:px-12 md:py-6 bg-yellow-400 text-black font-bold text-lg md:text-xl rounded-none hover:bg-yellow-300 transition-all duration-300 shadow-2xl shadow-yellow-500/30 uppercase tracking-wider"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Our Services
          </motion.button>
          <motion.button
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) element.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-10 py-5 md:px-12 md:py-6 border-2 border-white text-white font-bold text-lg md:text-xl rounded-none hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider backdrop-blur-sm bg-black/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Free Consultation
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-yellow-400/50 rounded-full flex justify-center p-2 cursor-pointer hover:border-yellow-400 transition-colors"
          onClick={() => {
            const element = document.getElementById('services')
            if (element) element.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-3 bg-yellow-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
