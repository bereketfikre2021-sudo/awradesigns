import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Pricing = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const pricingPlans = [
    {
      name: 'Basic',
      price: '50,000',
      description: 'Ideal for small projects',
    },
    {
      name: 'Standard',
      price: '120,000',
      description: 'Most popular, balanced approach',
      popular: true,
    },
    {
      name: 'Premium',
      price: '250,000',
      description: 'Full luxury experience',
    },
  ]

  return (
    <section id="pricing" ref={ref} className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Our <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Transparent pricing for our design services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gray-900 rounded-xl p-8 border-2 ${
                plan.popular ? 'border-yellow-400' : 'border-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="text-yellow-400 text-sm font-bold mb-2">POPULAR</div>
              )}
              <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
              <p className="text-gray-400 mb-6 text-sm">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-yellow-400">
                  {plan.price}
                </span>
                <span className="text-yellow-400 ml-2">ETB</span>
              </div>
              <button
                onClick={scrollToContact}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Contact Us
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
