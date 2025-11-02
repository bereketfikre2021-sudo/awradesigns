import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'

const WhyChoose = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [counts, setCounts] = useState({
    projects: 0,
    clients: 0,
    years: 0,
    satisfaction: 0,
  })

  useEffect(() => {
    if (inView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const interval = duration / steps

      const counters = {
        projects: { target: 100, suffix: '+' },
        clients: { target: 50, suffix: '+' },
        years: { target: 5, suffix: '+' },
        satisfaction: { target: 98, suffix: '%' },
      }

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setCounts({
          projects: Math.min(Math.floor(counters.projects.target * progress), counters.projects.target),
          clients: Math.min(Math.floor(counters.clients.target * progress), counters.clients.target),
          years: Math.min(Math.floor(counters.years.target * progress), counters.years.target),
          satisfaction: Math.min(Math.floor(counters.satisfaction.target * progress), counters.satisfaction.target),
        })

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [inView])

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

  const metrics = [
    { value: counts.projects, suffix: '+', label: 'PROJECTS COMPLETED' },
    { value: counts.clients, suffix: '+', label: 'HAPPY CLIENTS' },
    { value: counts.years, suffix: '+', label: 'YEARS EXPERIENCE' },
    { value: counts.satisfaction, suffix: '%', label: 'CLIENT SATISFACTION' },
  ]

  const excellenceFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Fair & Transparent Pricing',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Detailed Upfront Quotes',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Flexible Payment Plans',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Quality Guarantee',
    },
  ]

  return (
    <section id="why-choose" ref={ref} className="section-padding bg-black relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Why Choose <span className="text-gradient">Awra Designs ?</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white max-w-3xl mx-auto"
          >
            Where innovation meets tradition, and every project becomes a masterpiece
          </motion.p>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          {/* Block 1: Years of Masterful Craftsmanship - Large Left Block */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-gray-900 rounded-2xl p-8 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-4 mb-4 relative">
              <div className="relative">
                <svg className="w-12 h-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v6" />
                </svg>
              </div>
              <span className="absolute left-0 -top-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                Proven Excellence
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              5+ Years of Masterful Craftsmanship
            </h3>
            <p className="text-white text-base md:text-lg leading-relaxed mb-6">
              With over 5 years of dedicated service, we've transformed 100+ spaces across Ethiopia. Our journey combines traditional Ethiopian craftsmanship with cutting-edge design principles, creating timeless spaces that honor heritage while embracing innovation.
            </p>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-black rounded-xl p-4 text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                      {metric.value}{metric.suffix}
                    </span>
                  </div>
                  <div className="text-xs text-white uppercase tracking-wider">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Block 2: Timeless Design Philosophy - Top Right */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                <circle cx="19" cy="8" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Timeless Design Philosophy
            </h3>
            <p className="text-white text-sm leading-relaxed mb-4">
              We create spaces that transcend trends, blending functionality with aesthetic perfection to tell your unique story.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs text-yellow-400 border border-yellow-400/50 rounded-full">
                Custom Solutions
              </span>
              <span className="px-3 py-1 text-xs text-yellow-400 border border-yellow-400/50 rounded-full">
                Cultural Sensitivity
              </span>
            </div>
          </motion.div>

          {/* Block 3: Premium Quality Standards - Bottom Right */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Premium Quality Standards
            </h3>
            <p className="text-white text-sm leading-relaxed mb-4">
              We source only the finest materials and work with master craftsmen to ensure every detail exceeds expectations.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs text-yellow-400 border border-yellow-400/50 rounded-full">
                Premium Materials
              </span>
              <span className="px-3 py-1 text-xs text-yellow-400 border border-yellow-400/50 rounded-full">
                Master Craftsmen
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Block 4: Transparent Excellence - Bottom Full Width */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-900 rounded-2xl p-8 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Transparent Excellence
              </h3>
              <p className="text-white text-base md:text-lg leading-relaxed">
                No hidden costs, no surprises. We provide detailed quotes upfront with flexible payment options, delivering exceptional value without compromising on quality or craftsmanship.
              </p>
            </div>
            
            {/* Sub-blocks Grid */}
            <div className="grid grid-cols-2 gap-4">
              {excellenceFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-black rounded-xl p-4 border border-gray-800 hover:border-yellow-400/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center text-yellow-400 mb-2">
                    {feature.icon}
                  </div>
                  <div className="text-sm font-semibold text-white text-center">
                    {feature.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyChoose

