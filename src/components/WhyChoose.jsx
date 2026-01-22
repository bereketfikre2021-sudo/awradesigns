import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const WhyChoose = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

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

  return (
    <section id="why-choose" ref={ref} className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Why Choose <span className="text-gradient">Us</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Where innovation meets tradition, and every project becomes a masterpiece
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
        <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800"
            >
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
                </motion.div>
              ))}
            </div>
      </div>
    </section>
  )
}

export default WhyChoose
