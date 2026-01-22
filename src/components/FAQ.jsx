import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const FAQ = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'What services do you offer?',
      answer: 'We offer comprehensive architectural design, interior planning, finishing work, and branding services. Our team specializes in creating exceptional spaces that combine functionality, beauty, and sustainability.',
    },
    {
      question: 'How long does a project take?',
      answer: 'Project timelines vary based on scope and complexity. Basic design projects typically take 2-4 weeks, while complete design and implementation projects can take 3-6 months. We provide detailed timelines during the initial consultation.',
    },
    {
      question: 'Do you provide free consultations?',
      answer: 'Yes, we offer free initial consultations to discuss your project goals, requirements, and budget. This allows us to understand your vision and provide tailored recommendations for your space.',
    },
    {
      question: 'What areas do you serve?',
      answer: 'We primarily serve Addis Ababa, Ethiopia, and surrounding areas. We have successfully completed over 100 projects across Ethiopia, including residential homes, commercial spaces, and office buildings.',
    },
    {
      question: 'Do you work with a fixed budget?',
      answer: 'Yes, we work with various budget ranges and can tailor our services to fit your financial constraints. During the consultation, we discuss your budget and provide options that maximize value while achieving your design goals.',
    },
    {
      question: 'What is included in your design process?',
      answer: 'Our design process includes initial consultation, concept development, detailed planning, 3D visualizations, material selection, and project management. We ensure regular communication and updates throughout the entire process.',
    },
  ]

  return (
    <section id="faq" ref={ref} className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about our services and process.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl border border-gray-800"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-yellow-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
