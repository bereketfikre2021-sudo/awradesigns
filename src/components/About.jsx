import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const About = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [activeTab, setActiveTab] = useState('about')

  const features = [
    {
      title: '5+ Years Experience',
      description: 'Over 5 years of dedicated service in architectural design and interior planning.',
    },
    {
      title: '100+ Projects',
      description: 'Successfully completed over 100 projects across Ethiopia.',
    },
    {
      title: 'Expert Team',
      description: 'Skilled professionals with years of combined experience.',
    },
    {
      title: 'Quality Guarantee',
      description: 'We ensure the highest standards in every project.',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Consultation',
      description: 'We start by understanding your vision, requirements, and budget.',
    },
    {
      number: '02',
      title: 'Design & Planning',
      description: 'Our team creates detailed plans and 3D visualizations.',
    },
    {
      number: '03',
      title: 'Execution',
      description: 'Professional implementation with regular updates.',
    },
    {
      number: '04',
      title: 'Delivery',
      description: 'Final inspection and project handover.',
    },
  ]

  const teamMembers = [
    {
      name: 'Tesfahun Tsegaye',
      role: 'Founder and Lead Architect',
      image: '/images/Tesfahun Tsegaye.webp',
      description: 'Visionary founder and lead architect with exceptional expertise in architectural design and project leadership',
    },
    {
      name: 'Sarah Bekele',
      role: 'Lead Interior Designer',
      image: '/images/Sarah Bekele.webp',
      description: 'Creative visionary with expertise in modern interior design',
    },
    {
      name: 'Daniel Haile',
      role: 'Senior Architect',
      image: '/images/Daniel Haile.webp',
      description: 'Experienced architect specializing in commercial and residential projects',
    },
    {
      name: 'Bereket Fikre',
      role: 'Brand Designer',
      image: '/images/Bereket Fikre.webp',
      description: 'Creative designer bringing brands to life with compelling visuals',
    },
  ]

  const services = [
    {
      title: 'Architectural Design',
      description: 'Professional architectural design and planning services.',
    },
    {
      title: 'Interior Design',
      description: 'Complete interior design and space planning.',
    },
    {
      title: 'Finishing Work',
      description: 'High-quality finishing and construction services.',
    },
    {
      title: 'Branding Services',
      description: 'Professional branding and visual identity design.',
    },
  ]

  const tabs = [
    { id: 'about', label: 'About Us' },
    { id: 'why', label: 'Why Choose Us' },
    { id: 'work', label: 'How We Work' },
    { id: 'services', label: 'Our Services' },
    { id: 'team', label: 'Our Team' },
  ]

  return (
    <section id="about" ref={ref} className="section-padding bg-black">
      <div className="container-custom max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            About <span className="text-gradient">Awra Finishing & Interior</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-yellow-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'about' && (
              <div className="max-w-5xl mx-auto">
                <div className="relative">
                  {/* Decorative Quote Icon */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-0">
                    <svg className="w-16 h-16 md:w-20 md:h-20 text-yellow-400/10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h3.983v10h-9.984z" />
                    </svg>
                  </div>

                  {/* Main Content Card */}
                  <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl p-8 md:p-12 border border-yellow-400/20 shadow-2xl overflow-hidden">
                    {/* Animated Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 opacity-50"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* First Paragraph with Large Opening */}
                      <div className="mb-8">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                          <span className="text-yellow-400 text-3xl md:text-4xl lg:text-5xl font-black">Awra Finishing & Interior</span>
                          <br />
                          <span className="text-xl md:text-2xl lg:text-3xl font-normal text-gray-300">has been transforming spaces in</span>
                          <br />
                          <span className="text-yellow-400/90">Addis Ababa, Ethiopia</span>
                          <span className="text-xl md:text-2xl lg:text-3xl font-normal text-gray-300"> for over </span>
                          <span className="text-yellow-400 text-3xl md:text-4xl font-bold">5 years</span>
                          <span className="text-yellow-400">.</span>
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
                      </div>

                      {/* Second Paragraph with Highlighted Words */}
                      <div className="text-center">
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
                          We blend{' '}
                          <span className="relative inline-block mx-1">
                            <span className="text-yellow-400 font-bold">functionality</span>
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400/50 transform -skew-x-12"></span>
                          </span>
                          ,{' '}
                          <span className="relative inline-block mx-1">
                            <span className="text-yellow-400 font-bold">beauty</span>
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400/50 transform -skew-x-12"></span>
                          </span>
                          , and{' '}
                          <span className="relative inline-block mx-1">
                            <span className="text-yellow-400 font-bold">sustainability</span>
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400/50 transform -skew-x-12"></span>
                          </span>
                          {' '}to create exceptional architectural and interior spaces that{' '}
                          <span className="text-yellow-400 font-semibold italic">inspire</span>
                          .
                        </p>
                      </div>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-yellow-400/30 rounded-tl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-yellow-400/30 rounded-br-2xl"></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'why' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                  >
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'work' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                  >
                    <div className="text-yellow-400 text-2xl font-bold mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                  >
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'team' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="space-y-4">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default About
