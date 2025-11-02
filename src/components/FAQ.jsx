import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const FAQ = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      id: 1,
      question: 'What services do you offer?',
      answer: 'We offer comprehensive architectural design, interior planning, finishing work, and branding services. Our team handles everything from initial consultation to project completion, including 3D visualizations, detailed plans, material selection, and quality finishing work.',
    },
    {
      id: 2,
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on scope and complexity. A basic finishing project typically takes 2-4 weeks, while a complete interior design project can range from 4-12 weeks. Full architectural projects may take 3-6 months. We provide detailed timelines during consultation.',
    },
    {
      id: 3,
      question: 'Do you provide free consultations?',
      answer: 'Yes, we offer free initial consultations to discuss your project goals, requirements, and budget. During the consultation, we assess your needs and provide preliminary recommendations. This helps you make informed decisions before committing to a project.',
    },
    {
      id: 4,
      question: 'What is included in your pricing packages?',
      answer: 'Our pricing packages include consultation, design plans, material recommendations, project management, and quality assurance. Premium packages include 3D visualizations, premium material sourcing, unlimited revisions, and post-completion support. Detailed inclusions are available for each package.',
    },
    {
      id: 5,
      question: 'Can you work with my existing budget?',
      answer: 'Absolutely! We work with various budgets and can customize our services to fit your financial constraints. We prioritize essential elements first and can suggest cost-effective alternatives without compromising quality. Transparent pricing is provided upfront.',
    },
    {
      id: 6,
      question: 'Do you handle permits and regulations?',
      answer: 'Yes, we assist with architectural planning, permits, and regulatory compliance in Ethiopia. Our team is familiar with local building codes and can guide you through the permit process. We ensure all designs meet local regulations and standards.',
    },
  ]

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="faq" ref={ref} className="section-padding bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, 50, -50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
        {/* Moving Gradient Orbs */}
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 200, -200, 0],
            y: [0, 150, -150, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -150, 150, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
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
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Find answers to common questions about our services, process, and pricing.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              variants={itemVariants}
              className="group bg-gray-900 rounded-xl border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <h3 className="text-lg md:text-xl font-bold text-white pr-8 group-hover:text-yellow-400 transition-colors">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ

