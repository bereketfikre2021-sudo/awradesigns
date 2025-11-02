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
      name: 'Basic Finishing',
      price: '50,000',
      description: 'Ideal for small projects with essential features',
      services: [
        'Basic consultation',
        'Simple design concepts',
        'Material recommendations',
        'Basic finishing work',
        'Project timeline',
      ],
      popular: false,
      gradient: 'from-gray-800 to-gray-900',
      buttonText: 'Get Started',
    },
    {
      name: 'Standard Interior',
      price: '120,000',
      description: 'Most popular, balanced approach to interior design',
      services: [
        'Comprehensive consultation',
        'Detailed design plans',
        '3D visualizations',
        'Material selection',
        'Color coordination',
        'Project management',
        'Regular updates',
      ],
      popular: true,
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      buttonText: 'Contact Us',
    },
    {
      name: 'Premium Design',
      price: '250,000',
      description: 'Full luxury experience with professional design',
      services: [
        'Premium consultation',
        'Custom design solutions',
        'High-end 3D renderings',
        'Premium material sourcing',
        'Complete project management',
        'Luxury finishing work',
        'Unlimited revisions',
        'Post-completion support',
      ],
      popular: false,
      gradient: 'from-yellow-500/30 to-yellow-600/30',
      buttonText: 'Contact Us',
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
    <section id="pricing" ref={ref} className="section-padding bg-black relative overflow-hidden">
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
            Choose Your <span className="text-gradient">Innovation Level</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Transparent pricing for our design services. All projects are customized to your needs and budget.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-gray-900 rounded-2xl p-8 shadow-2xl transition-all duration-300 border-2 ${
                plan.popular
                  ? 'border-yellow-400/50 lg:scale-105'
                  : 'border-gray-800 hover:border-yellow-400/30'
              } overflow-hidden`}
            >
              {/* Glow Effect for Popular */}
              {plan.popular && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl opacity-20 blur-xl" />
              )}

              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 rounded-bl-lg font-bold text-sm">
                    POPULAR
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <p className="text-gray-400 mb-6 text-sm">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl md:text-5xl font-bold text-yellow-400">
                    {plan.price}
                  </span>
                  <span className="text-yellow-400 text-lg font-medium ml-2">ETB</span>
                </div>

                {/* Services List */}
                <ul className="space-y-3 mb-8">
                  {plan.services.map((service, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300">
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
                      {service}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  onClick={scrollToContact}
                  className={`w-full px-6 py-4 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg shadow-yellow-500/50'
                      : 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 hover:border-yellow-400/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export default Pricing
