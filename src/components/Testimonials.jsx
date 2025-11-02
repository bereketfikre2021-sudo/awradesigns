import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Testimonials = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const testimonials = [
    {
      id: 1,
      name: 'Alemu Bekele',
      role: 'Business Owner',
      image: '/images/Alemu Bekele.webp',
      rating: 5,
      text: 'Awra Designs transformed our office space into a modern, inspiring work environment. Their attention to detail and professional approach exceeded our expectations. Highly recommended!',
    },
    {
      id: 2,
      name: 'Marta Asfaw',
      role: 'Homeowner',
      image: '/images/Marta Asfaw.webp',
      rating: 5,
      text: 'Working with Awra Finishing & Interior was a delightful experience. They understood our vision and brought it to life beautifully. Our home looks stunning!',
    },
    {
      id: 3,
      name: 'Yonas Tadesse',
      role: 'Restaurant Owner',
      image: '/images/Yonas Tadesse.webp',
      rating: 5,
      text: 'The interior design work done by Awra Designs transformed our restaurant completely. We\'ve received countless compliments from customers. Excellent craftsmanship!',
    },
    {
      id: 4,
      name: 'Tigist Mekonnen',
      role: 'Residential Client',
      image: '/images/Tigist Mekonnen.webp',
      rating: 5,
      text: 'Professional, reliable, and creative. Awra Designs delivered exactly what they promised. The finishing work is impeccable, and the design perfectly matches our style.',
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
    <section id="testimonials" ref={ref} className="section-padding bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.1) 1px, transparent 0)',
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
            What Our <span className="text-gradient">Clients Say</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Don't just take our word for it. See what our satisfied clients have to say about their experience with us.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-gray-900 rounded-2xl p-8 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 border border-gray-800 hover:border-yellow-400/50 relative overflow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Quote Icon */}
                <div className="mb-6">
                  <svg className="w-12 h-12 text-yellow-400/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h3.983v10h-9.984z" />
                  </svg>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 leading-relaxed text-base mb-6">
                  "{testimonial.text}"
                </p>

                {/* Client Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-400/30 group-hover:border-yellow-400 transition-colors">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials

