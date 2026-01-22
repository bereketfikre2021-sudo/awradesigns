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

  return (
    <section id="how-we-work" ref={ref} className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            How We <span className="text-gradient">Work</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A streamlined process from concept to completion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowWeWork
