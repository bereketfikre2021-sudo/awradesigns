import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const HowWeWork = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const steps = [
    {
      number: '01',
      title: 'Consultation',
      description: 'We start by understanding your vision, requirements, and budget. Free initial consultation to discuss your project goals.',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      features: ['Free consultation', 'Needs assessment', 'Budget discussion'],
    },
    {
      number: '02',
      title: 'Design & Planning',
      description: 'Our team creates detailed plans, 3D visualizations, and material selections. You\'ll see your vision come to life before we start.',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          <circle cx="17" cy="8" r="2" fill="currentColor" />
          <circle cx="19" cy="12" r="2" fill="currentColor" />
          <circle cx="17" cy="16" r="2" fill="currentColor" />
          <circle cx="15" cy="10" r="1.5" fill="currentColor" />
        </svg>
      ),
      features: ['3D visualizations', 'Detailed plans', 'Material selection'],
    },
    {
      number: '03',
      title: 'Execution',
      description: 'Professional implementation with regular updates and quality assurance. We ensure every detail meets our high standards.',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      ),
      features: ['Regular updates', 'Quality assurance', 'Timeline tracking'],
    },
    {
      number: '04',
      title: 'Delivery & Support',
      description: 'Final inspection, project handover, and ongoing support. We\'re here to ensure your complete satisfaction.',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      features: ['Final inspection', 'Project handover', 'Ongoing support'],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="how-we-work" ref={ref} className="section-padding bg-black relative overflow-hidden">
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
            How We <span className="text-gradient">Work</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white max-w-2xl mx-auto"
          >
            A streamlined process from concept to completion.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative"
        >
          {/* Connecting Lines */}
          {/* Horizontal line connecting step 01 to 02 */}
          <div className="hidden md:block absolute top-1/4 left-1/2 w-full h-px bg-gray-700 -translate-x-1/2 -translate-y-1/2 z-0" />
          
          {/* Vertical lines connecting rows */}
          <div className="hidden md:block absolute top-1/4 left-0 w-px h-full bg-gray-700 z-0" />
          <div className="hidden md:block absolute top-1/4 right-0 w-px h-full bg-gray-700 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative z-10 bg-gray-900 rounded-xl border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 p-6 lg:p-8 group"
            >
              {/* Yellow Border Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />

              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-20">
                <span className="text-black font-bold text-sm">{step.number}</span>
              </div>

              {/* Icon Container */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative w-24 h-24 lg:w-28 lg:h-28">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse" />
                  
                  {/* Icon Circle */}
                  <div className="relative w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-black p-4 shadow-2xl">
                    <div className="w-12 h-12 lg:w-14 lg:h-14">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                  {step.title}
                </h3>
                
                <p className="text-white leading-relaxed text-base lg:text-lg">
                  {step.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 pt-2">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-white">
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
                      <span className="text-base lg:text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default HowWeWork

