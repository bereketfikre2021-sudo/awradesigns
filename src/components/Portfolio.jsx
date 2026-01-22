import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { isMobile, prefersReducedMotion } from '../utils/deviceDetection'

const Portfolio = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false)

  useEffect(() => {
    setShouldReduceAnimations(isMobile() || prefersReducedMotion())
  }, [])

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)

  // ESC key handler to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && selectedProject) {
        setSelectedProject(null)
      }
    }

    if (selectedProject) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])

  const categories = ['all', '3D', 'Living', 'Bedroom', 'Gym', 'Lobby']

  const portfolioItems = [
    {
      id: 1,
      category: '3D',
      image: '/images/3D_1 - Photo copy.webp',
      title: 'Modern 3D Visualization',
      description: 'A stunning 3D visualization showcasing contemporary architectural design with sophisticated lighting and modern furnishings. This project demonstrates our expertise in creating photorealistic renderings that help clients visualize their spaces before construction begins.'
    },
    {
      id: 2,
      category: '3D',
      image: '/images/3D_2 - Photo copy.webp',
      title: 'Contemporary Design',
      description: 'Elegant contemporary space featuring minimalist design principles with premium materials and clean lines. This design emphasizes functionality while maintaining aesthetic appeal, creating a harmonious living environment.'
    },
    {
      id: 3,
      category: 'Living', 
      image: '/images/LIVING_11 - Photo copy.webp', 
      title: 'Living Room',
      description: 'Warm and inviting living space designed for comfort and social gatherings with modern aesthetics. The design combines cozy elements with contemporary style to create a welcoming atmosphere for family and guests.'
    },
    {
      id: 4,
      category: 'Bedroom', 
      image: '/images/Bed Rm_11 - Photo copy.webp', 
      title: 'Bedroom Suite',
      description: 'Elegant master bedroom with custom furniture and premium finishes. This serene retreat features carefully selected materials and a calming color palette designed to promote rest and relaxation.'
    },
    {
      id: 5,
      category: 'Gym', 
      image: '/images/Gym_11 - Photo copy.webp', 
      title: 'Fitness Space',
      description: 'State-of-the-art fitness facility designed to inspire and motivate with professional-grade equipment. The space maximizes functionality while creating an energizing environment for workouts.'
    },
    {
      id: 6,
      category: 'Lobby',
      image: '/images/LOBBY_26 - Photo copy.webp',
      title: 'Lobby Design',
      description: 'Impressive lobby space making a bold first impression with grand scale and luxurious finishes. This design creates a welcoming entrance that reflects the quality and professionalism of the establishment.'
    },
  ]

  const filteredItems =
    selectedCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory)

  return (
    <section id="works" ref={ref} className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Our <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore our portfolio of completed architectural and interior design projects.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-3 rounded-lg font-medium transition-all min-h-[44px] min-w-[80px] flex items-center justify-center ${
                selectedCategory === category
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group cursor-pointer hover:border-yellow-400/50 transition-all duration-300"
              whileHover={shouldReduceAnimations ? {} : { y: -4 }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <motion.img
                    src={item.image}
                    alt={item.title}
                  className="w-full h-full object-cover"
                    loading="lazy"
                  decoding="async"
                  fetchPriority={index < 3 ? "high" : "low"}
                  whileHover={shouldReduceAnimations ? {} : { scale: 1.1 }}
                  transition={shouldReduceAnimations ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="text-center"
                  >
                    <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-sm font-bold rounded-full">
                      {item.category}
                    </span>
                  </motion.div>
                      </div>
                {/* View Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="w-16 h-16 bg-yellow-400/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                <button
                  onClick={() => setSelectedProject(item)}
                  className="w-full px-4 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors min-h-[44px] flex items-center justify-center gap-2"
                >
                  <span>View Project</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.2) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-3xl w-full my-8 bg-gray-900 rounded-2xl border border-yellow-400/20 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-400/20 rounded-2xl blur-xl opacity-50" />

              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-gray-800/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300 border-2 border-yellow-400/30 hover:border-yellow-400 shadow-lg min-h-[48px] min-w-[48px]"
                aria-label="Close modal"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Modal Content */}
              <div className="relative z-10 p-6 md:p-10">
                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <span className="inline-block px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-full">
                    {selectedProject.category}
                  </span>
                </motion.div>

                {/* Image with Overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="aspect-[4/3] overflow-hidden rounded-xl mb-6 relative group"
                >
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                  {selectedProject.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300 leading-relaxed text-base md:text-lg mb-6"
                >
                  {selectedProject.description}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4 pt-6 border-t border-gray-800"
                >
                  <button
                    onClick={() => {
                      setSelectedProject(null)
                      setTimeout(() => {
                        const element = document.getElementById('contact')
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }, 200)
                    }}
                    className="flex-1 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors min-h-[48px] flex items-center justify-center gap-2"
                  >
                    <span>Get Quote</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                  <a
                    href="tel:+251923814125"
                    className="flex-1 px-6 py-3 border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-colors min-h-[48px] flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Now</span>
                  </a>
                </motion.div>

                {/* ESC Key Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-6 border-t border-gray-800"
                >
                  <p className="text-gray-500 text-sm text-center">
                    Press <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">ESC</kbd> to close
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Portfolio
