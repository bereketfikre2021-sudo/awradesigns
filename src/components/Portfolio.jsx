import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Portfolio = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)

  const categories = ['all', '3D', 'Living', 'Bedroom', 'Gym', 'Lobby', 'Bath']

  // ESC key handler to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleEsc)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  const portfolioItems = [
    {
      id: 1,
      category: '3D',
      image: '/images/3D_1 - Photo copy.webp',
      title: 'Modern 3D Visualization',
      description: 'A stunning 3D visualization showcasing contemporary architectural design with sophisticated lighting and modern furnishings.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Modern', '3D', 'Architecture'],
    },
    {
      id: 2,
      category: '3D',
      image: '/images/3D_2 - Photo copy.webp',
      title: 'Contemporary Design',
      description: 'Elegant contemporary space featuring minimalist design principles with premium materials and clean lines.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Contemporary', 'Minimalist', 'Premium'],
    },
    {
      id: 3,
      category: '3D',
      image: '/images/3D_3 - Photo copy.webp',
      title: 'Elegant Space Planning',
      description: 'Meticulously planned interior space maximizing functionality while maintaining aesthetic appeal.',
      year: '2023',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Planning', 'Functional', 'Design'],
    },
    {
      id: 4,
      category: '3D',
      image: '/images/3D_6 - Photo copy.webp',
      title: 'Luxury Interior',
      description: 'Premium luxury interior design featuring high-end finishes and bespoke furniture pieces.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: true,
      rating: 5,
      tags: ['Luxury', 'Premium', 'Interior'],
    },
    {
      id: 5,
      category: '3D',
      image: '/images/3D_8 - Photo copy.webp',
      title: 'Modern Architecture',
      description: 'Innovative architectural design blending form and function in a harmonious living space.',
      year: '2023',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Architecture', 'Modern', 'Innovative'],
    },
    {
      id: 6,
      category: '3D',
      image: '/images/3D_10 - Photo copy.webp',
      title: 'Premium Design',
      description: 'Sophisticated design solution featuring custom elements and premium material selections.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Premium', 'Custom', 'Design'],
    },
    {
      id: 7,
      category: 'Living',
      image: '/images/LIVING_11 - Photo copy.webp',
      title: 'Contemporary Living Room',
      description: 'Warm and inviting living space designed for comfort and social gatherings with modern aesthetics.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Living', 'Modern', 'Comfort'],
    },
    {
      id: 8,
      category: 'Living',
      image: '/images/LIVING_13 - Photo copy.webp',
      title: 'Elegant Living Space',
      description: 'Refined living area combining elegance with practicality, perfect for entertaining guests.',
      year: '2023',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Elegant', 'Refined', 'Living'],
    },
    {
      id: 9,
      category: 'Bedroom',
      image: '/images/Bed Rm_11 - Photo copy.webp',
      title: 'Luxury Bedroom Suite',
      description: 'Elegant master bedroom with custom furniture and premium finishes.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: true,
      rating: 5,
      tags: ['Luxury', 'Premium', 'Finishing'],
    },
    {
      id: 10,
      category: 'Bedroom',
      image: '/images/CH Bed 1_1 - Photo copy.webp',
      title: 'Modern Bedroom Design',
      description: 'Contemporary bedroom featuring smart storage solutions and modern design elements.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Modern', 'Bedroom', 'Smart'],
    },
    {
      id: 11,
      category: 'Gym',
      image: '/images/Gym_11 - Photo copy.webp',
      title: 'Fitness Space Design',
      description: 'State-of-the-art fitness facility designed to inspire and motivate with professional-grade equipment.',
      year: '2023',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Fitness', 'Gym', 'Professional'],
    },
    {
      id: 12,
      category: 'Gym',
      image: '/images/Gym_19 - Photo copy.webp',
      title: 'Home Gym Interior',
      description: 'Premium home gym setup with optimal space utilization and motivational design elements.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Gym', 'Home', 'Premium'],
    },
    {
      id: 13,
      category: 'Lobby',
      image: '/images/LOBBY_26 - Photo copy.webp',
      title: 'Grand Lobby Design',
      description: 'Impressive lobby space making a bold first impression with grand scale and luxurious finishes.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: true,
      rating: 5,
      tags: ['Luxury', 'Grand', 'Lobby'],
    },
    {
      id: 14,
      category: 'Lobby',
      image: '/images/LOBBY_30 - Photo copy.webp',
      title: 'Elegant Entryway',
      description: 'Sophisticated entrance design that welcomes guests with style and elegance.',
      year: '2023',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Elegant', 'Entryway', 'Sophisticated'],
    },
    {
      id: 15,
      category: 'Bath',
      image: '/images/Master Bath_11 - Photo copy.webp',
      title: 'Luxury Master Bathroom',
      description: 'Spa-like master bathroom retreat featuring premium fixtures and tranquil design for ultimate relaxation.',
      year: '2024',
      location: 'Addis Ababa, Ethiopia',
      featured: false,
      rating: 5,
      tags: ['Luxury', 'Bathroom', 'Premium'],
    },
  ]

  const filteredItems =
    selectedCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <section id="works" ref={ref} className="section-padding bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Our <span className="text-gradient">Revolutionary Projects</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our exceptional projects showcasing architectural excellence and interior design
            mastery
          </p>
        </motion.div>

        {/* Category Filter - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="hidden md:flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all uppercase tracking-wide relative overflow-hidden ${
                selectedCategory === category
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/50'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Category Filter - Mobile Tab Mode */}
        <div className="md:hidden mb-8">
          <div className="bg-gray-900 rounded-xl p-1 border border-gray-800">
            <div className="flex overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all uppercase tracking-wide ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-yellow-500/40 transition-all duration-300 cursor-pointer bg-black border-2 border-yellow-400/30 hover:border-yellow-400"
                onClick={() => setSelectedImage(item)}
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold">Featured</span>
                    </div>
                  )}
                </div>

                {/* Bottom Section - Text Information */}
                <div className="bg-black p-6 space-y-4">
                  {/* Category Badge, Year, and Rating */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="px-3 py-1.5 bg-yellow-400 text-black text-xs font-bold rounded-full uppercase tracking-wide">
                      {item.category === 'Bedroom' || item.category === 'Living' || item.category === 'Gym' || item.category === 'Lobby' || item.category === 'Bath' ? 'Interior Design' : item.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-white text-sm font-medium">{item.year}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white text-2xl font-bold leading-tight group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-white text-xs font-medium border border-white/20 rounded-full hover:border-yellow-400/50 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-5xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Top Right */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-14 h-14 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300 border-2 border-yellow-400/30 hover:border-yellow-400 shadow-2xl hover:scale-110 hover:rotate-90"
                aria-label="Close modal"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400/20 mb-6">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Project Details */}
              <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-yellow-400/20 shadow-2xl relative">
                {/* Close Button - Inside Details Card */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-gray-800/80 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 border border-gray-700 hover:border-yellow-400 hover:scale-110"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
                    {selectedImage.category}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {selectedImage.title}
                </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  {selectedImage.description}
                </p>

                {/* Project Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-800">
                  <div>
                    <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wide mb-2">
                      Year
                    </p>
                    <p className="text-white text-lg">
                      {selectedImage.year}
                    </p>
                  </div>
                  <div>
                    <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wide mb-2">
                      Location
                    </p>
                    <p className="text-white text-lg">
                      {selectedImage.location}
                    </p>
                  </div>
                </div>

                {/* ESC Key Hint */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-gray-500 text-sm text-center">
                    Press <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">ESC</kbd> to close
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Portfolio