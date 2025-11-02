import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Services = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [selectedService, setSelectedService] = useState(null)

  // ESC key handler to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && selectedService !== null) {
        setSelectedService(null)
      }
    }

    if (selectedService !== null) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [selectedService])

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const services = [
    {
      title: 'Architectural Design',
      description: 'Professional architectural design and planning services. We create stunning, functional spaces that inspire and transform your vision into reality.',
      detailedDescription: 'Complete building design from concept to construction drawings. We handle structural planning, space optimization, and regulatory compliance. Our architectural services include comprehensive site analysis, feasibility studies, and detailed construction documentation. We work closely with clients to ensure every design meets their needs while adhering to local building codes and regulations.',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      features: ['3D Visualization', 'Building Plans', 'Space Planning', 'Permit Assistance'],
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      iconColor: 'from-yellow-400 to-yellow-500',
    },
    {
      title: 'Interior Design',
      description: 'Complete interior design and space planning. From concept to completion, we design beautiful, functional interiors that reflect your style.',
      detailedDescription: 'Transform your living and working spaces with our comprehensive interior design services. We create cohesive designs that balance aesthetics, functionality, and your personal style. Our team handles everything from initial concept development to final installation, including furniture selection, color coordination, lighting design, and material sourcing. We ensure every detail contributes to a harmonious and inspiring environment.',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      features: ['Color Schemes', 'Furniture Selection', 'Lighting Design', 'Material Selection'],
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      iconColor: 'from-yellow-400 to-yellow-500',
    },
    {
      title: 'Finishing Work',
      description: 'High-quality finishing and construction services. Premium craftsmanship meets exceptional design in every detail of your project.',
      detailedDescription: 'Expert finishing work that elevates your space with premium materials and meticulous craftsmanship. We specialize in high-end finishes including custom cabinetry, premium flooring installations, decorative wall treatments, and specialty paint applications. Our skilled craftsmen ensure every surface, edge, and detail is executed to perfection, delivering a finished product that exceeds expectations.',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      features: ['Premium Materials', 'Expert Craftsmanship', 'Quality Assurance', 'Timely Completion'],
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      iconColor: 'from-yellow-400 to-yellow-500',
    },
    {
      title: 'Branding Services',
      description: 'Professional branding and visual identity design. We help businesses create compelling brands that resonate with their audience.',
      detailedDescription: 'Build a powerful brand identity that captures your business essence and connects with your target audience. Our branding services include comprehensive logo design, brand strategy development, visual identity systems, and brand guideline documentation. We create memorable brands that stand out in the market and communicate your unique value proposition effectively across all touchpoints.',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      features: ['Logo Design', 'Brand Identity', 'Visual Guidelines', 'Marketing Materials'],
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      iconColor: 'from-yellow-400 to-yellow-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="services" ref={ref} className="section-padding bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
          >
            Our <span className="text-gradient">Services</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Comprehensive architectural design, interior planning, finishing work, and branding services
            in Addis Ababa, Ethiopia
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-gray-900 rounded-2xl p-8 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 border border-gray-800 hover:border-yellow-500/50 overflow-hidden flex flex-col h-full"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="w-20 h-20 mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 relative">
                  {/* Glow Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-20 group-hover:opacity-40 rounded-xl blur-xl transition-opacity duration-300" />
                  
                  {/* Icon Container */}
                  <div className="relative w-full h-full bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 p-4 rounded-xl border-2 border-yellow-400/40 group-hover:border-yellow-400/80 group-hover:bg-gradient-to-br group-hover:from-yellow-400/20 group-hover:to-yellow-500/20 group-hover:shadow-lg group-hover:shadow-yellow-500/50 transition-all duration-300 flex items-center justify-center">
                    <div className="w-full h-full text-yellow-400 opacity-100 group-hover:text-yellow-300 transition-colors duration-300 flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-yellow-400 transition-colors text-center">
                  {service.title}
                </h3>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-800">
                  <motion.button
                    onClick={() => setSelectedService(service)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-black text-yellow-400 text-sm font-semibold rounded-md hover:bg-gray-900 transition-colors border border-gray-800"
                  >
                    Learn More
                  </motion.button>
                  <motion.button
                    onClick={scrollToContact}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-yellow-400 text-black text-sm font-semibold rounded-md hover:bg-yellow-300 transition-colors"
                  >
                    Book Consultation
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl w-full my-8 bg-gray-900 rounded-2xl border border-yellow-400/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-gray-800/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300 border-2 border-yellow-400/30 hover:border-yellow-400 shadow-lg hover:scale-110"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
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

              {/* Modal Content */}
              <div className="p-8 md:p-10 max-h-[80vh] overflow-y-auto">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 p-4 rounded-xl border-2 border-yellow-400/40 flex items-center justify-center">
                    <div className="w-full h-full text-yellow-400">
                      {selectedService.icon}
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {selectedService.title}
                  </h2>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                    {selectedService.description}
                  </p>
                </div>

                {/* Detailed Description */}
                <div className="mb-8">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {selectedService.detailedDescription}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {selectedService.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-300">
                        <svg
                          className="w-5 h-5 mr-3 text-yellow-400 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-6 border-t border-gray-800">
                  <motion.button
                    onClick={scrollToContact}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-500/30"
                  >
                    Book Consultation
                  </motion.button>
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

export default Services