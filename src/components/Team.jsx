import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Team = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

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
    <section id="team" ref={ref} className="section-padding bg-black relative overflow-hidden">
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
            Our <span className="text-gradient">Expert Team</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Meet the talented professionals behind Awra Designs. Our team brings together decades of
            combined experience in architecture, interior design, and branding.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="space-y-4 group"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Black Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {member.name}
                </h3>
                <p className="text-sm md:text-base font-medium text-white uppercase tracking-wide">
                  {member.role === 'Founder and Lead Architect' ? 'FOUNDER & LEAD ARCHITECT' : 
                   member.role === 'Lead Interior Designer' ? 'LEAD INTERIOR DESIGNER' :
                   member.role === 'Senior Architect' ? 'SENIOR ARCHITECT' :
                   member.role === 'Brand Designer' ? 'BRAND DESIGNER' : member.role.toUpperCase()}
                </p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Team