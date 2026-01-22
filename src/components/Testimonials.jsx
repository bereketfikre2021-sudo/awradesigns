import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { isMobile, prefersReducedMotion } from '../utils/deviceDetection'

const Testimonials = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false)

  useEffect(() => {
    setShouldReduceAnimations(isMobile() || prefersReducedMotion())
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const testimonials = [
    {
      id: 1,
      name: 'Alemu Bekele',
      role: 'Business Owner',
      image: '/images/Alemu Bekele.webp',
      rating: 5,
      text: 'Awra Designs transformed our office space into a modern, inspiring work environment. Their attention to detail and professional approach exceeded our expectations. Highly recommended!',
    },
    {
      id: 2,
      name: 'Marta Asfaw',
      role: 'Homeowner',
      image: '/images/Marta Asfaw.webp',
      rating: 5,
      text: 'Working with Awra Finishing & Interior was a delightful experience. They understood our vision and brought it to life beautifully. Our home looks stunning!',
    },
    {
      id: 3,
      name: 'Yonas Tadesse',
      role: 'Restaurant Owner',
      image: '/images/Yonas Tadesse.webp',
      rating: 5,
      text: 'The interior design work done by Awra Designs transformed our restaurant completely. We\'ve received countless compliments from customers. Excellent craftsmanship!',
    },
    {
      id: 4,
      name: 'Tigist Mekonnen',
      role: 'Residential Client',
      image: '/images/Tigist Mekonnen.webp',
      rating: 5,
      text: 'Professional, reliable, and creative. Awra Designs delivered exactly what they promised. The finishing work is impeccable, and the design perfectly matches our style.',
    },
  ]

  // Auto-slide functionality
  useEffect(() => {
    if (!inView || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [inView, testimonials.length, isPaused])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" ref={ref} className="section-padding bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. See what our satisfied clients have to say about their experience with us.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <motion.button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-yellow-400 hover:bg-gray-800 transition-all border border-gray-800 hover:border-yellow-400 min-h-[56px] min-w-[56px]"
            aria-label="Previous testimonial"
            whileHover={shouldReduceAnimations ? {} : { scale: 1.1 }}
            whileTap={shouldReduceAnimations ? {} : { scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-yellow-400 hover:bg-gray-800 transition-all border border-gray-800 hover:border-yellow-400 min-h-[56px] min-w-[56px]"
            aria-label="Next testimonial"
            whileHover={shouldReduceAnimations ? {} : { scale: 1.1 }}
            whileTap={shouldReduceAnimations ? {} : { scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Testimonial Card */}
          <div 
            className="relative h-[500px] md:h-[450px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={shouldReduceAnimations ? { duration: 0.2 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <div className="group bg-gray-900 rounded-2xl p-8 md:p-10 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 border border-gray-800 hover:border-yellow-400/50 relative overflow-hidden h-full">
                  {/* Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      {/* Quote Icon */}
                      <div className="mb-6">
                        <svg className="w-12 h-12 text-yellow-400/30" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h3.983v10h-9.984z" />
                        </svg>
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-gray-300 leading-relaxed text-lg md:text-xl mb-6">
                        "{testimonials[currentIndex].text}"
                      </p>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400/30 group-hover:border-yellow-400 transition-colors">
                        <img
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                          loading="eager"
                          decoding="async"
                          fetchPriority="high"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-gray-400">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-10 h-3 bg-yellow-400'
                    : 'w-3 h-3 bg-gray-700 hover:bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                whileHover={shouldReduceAnimations ? {} : { scale: 1.2 }}
                whileTap={shouldReduceAnimations ? {} : { scale: 0.9 }}
                style={{ minHeight: '12px', minWidth: index === currentIndex ? '40px' : '12px' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
