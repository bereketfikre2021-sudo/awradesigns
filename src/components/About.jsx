import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const About = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for perfection in every project, ensuring the highest quality standards.',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We embrace cutting-edge design trends and technologies to create exceptional spaces.',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
    },
    {
      title: 'Integrity',
      description: 'We build trust through transparent communication and honest business practices.',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      title: 'Commitment',
      description: 'We are dedicated to bringing your vision to life with passion and dedication.',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
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
    <section id="about" ref={ref} className="section-padding bg-black relative overflow-hidden">
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
            About <span className="text-gradient">Awra Finishing & Interior</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Creating exceptional architectural spaces and compelling brands in Addis Ababa, Ethiopia
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Story */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Our Story</h3>
            <div className="md:space-y-6 space-y-4">
              {/* Mobile Version - Short */}
              <motion.p 
                className="md:hidden text-gray-300 leading-relaxed text-sm relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></span>
                <span className="block pl-5">Awra Finishing & Interior, based in Addis Ababa, Ethiopia, has over 5 years of experience in architectural design and interior planning. They specialize in creating functional, beautiful, and sustainable spaces.</span>
              </motion.p>
              
              {/* Desktop Version - Full */}
              <motion.p 
                className="hidden md:block text-gray-300 leading-relaxed text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Awra Finishing & Interior has been a trusted name in architectural design and interior
                planning in Addis Ababa, Ethiopia for over 5 years. We specialize in creating
                exceptional spaces that combine functionality, beauty, and sustainability.
              </motion.p>
              
              {/* Mobile Version - Short */}
              <motion.p 
                className="md:hidden text-gray-300 leading-relaxed text-sm relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></span>
                <span className="block pl-5">Their expert team offers services in architecture, interior design, finishing work, and branding. They have successfully completed over 100 projects, ranging from residential to commercial.</span>
              </motion.p>
              
              {/* Desktop Version - Full */}
              <motion.p 
                className="hidden md:block text-gray-300 leading-relaxed text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Our expert team brings together years of combined experience in architecture,
                interior design, finishing work, and branding services. We've successfully completed
                over 100 projects, ranging from residential homes to commercial spaces.
              </motion.p>
              
              {/* Mobile Version - Short */}
              <motion.p 
                className="md:hidden text-gray-300 leading-relaxed text-sm relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></span>
                <span className="block pl-5">Their mission is to transform visions into reality, creating inspiring spaces and impactful brands, while building lasting client relationships through exceptional service.</span>
              </motion.p>
              
              {/* Desktop Version - Full */}
              <motion.p 
                className="hidden md:block text-gray-300 leading-relaxed text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Our mission is to transform your vision into reality, creating spaces that inspire and
                brands that resonate. We believe in building lasting relationships with our clients
                through exceptional service and outstanding results.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Column - Mission/Vision */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-yellow-400/50 transition-all duration-300">
              <h4 className="text-2xl font-bold text-yellow-400 mb-4">Our Mission</h4>
              <p className="text-gray-300 leading-relaxed">
                To provide exceptional architectural design and interior planning services that
                transform spaces and create compelling brands, while maintaining the highest standards
                of quality and client satisfaction.
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-yellow-400/50 transition-all duration-300">
              <h4 className="text-2xl font-bold text-yellow-400 mb-4">Our Vision</h4>
              <p className="text-gray-300 leading-relaxed">
                To be the leading design firm in Ethiopia, recognized for our innovative designs,
                exceptional craftsmanship, and commitment to excellence in every project we undertake.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.h3
            variants={itemVariants}
            className="text-3xl font-bold text-white mb-12 text-center"
          >
            Our Core Values
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 border border-gray-800 hover:border-yellow-400/50 group"
              >
                <div className="flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 text-yellow-400 group-hover:text-yellow-300">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {value.title}
                </h4>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
