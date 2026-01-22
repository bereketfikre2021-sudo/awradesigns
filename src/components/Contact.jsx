import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Contact = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('https://formspree.io/f/mrbykzlb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="section-padding bg-black">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-lg text-gray-400">
            Ready to transform your space? Contact us for a free consultation.
          </p>
        </motion.div>

        {/* Mobile: Icons only in a row */}
        <div className="flex justify-center gap-6 mb-8 md:hidden">
          <a href="tel:+251923814125" className="text-yellow-400 hover:text-yellow-300 transition-colors" aria-label="Phone">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
          <a href="https://wa.me/251923814125" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="WhatsApp">
            <img 
              src="/images/whatsapp-color-svgrepo-com.svg" 
              alt="WhatsApp" 
              className="w-8 h-8"
              loading="lazy"
              decoding="async"
            />
          </a>
          <a href="mailto:info@awradesigns.com" className="text-yellow-400 hover:text-yellow-300 transition-colors" aria-label="Email">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          <a href="#footer" className="text-yellow-400 hover:text-yellow-300 transition-colors" aria-label="Location">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
        </div>

        {/* Desktop: Full cards with icons, labels, and links */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="mb-3">
              <svg className="w-8 h-8 text-yellow-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-sm text-gray-400 mb-2">Phone</h3>
            <a href="tel:+251923814125" className="text-white hover:text-yellow-400 transition-colors block">
              +251-92-381-4125
            </a>
          </div>
          <div className="text-center">
            <div className="mb-3">
              <img 
                src="/images/whatsapp-color-svgrepo-com.svg" 
                alt="WhatsApp" 
                className="w-8 h-8 mx-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3 className="text-sm text-gray-400 mb-2">WhatsApp</h3>
            <a href="https://wa.me/251923814125" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors block">
              Chat with us
            </a>
          </div>
          <div className="text-center">
            <div className="mb-3">
              <svg className="w-8 h-8 text-yellow-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm text-gray-400 mb-2">Email</h3>
            <a href="mailto:info@awradesigns.com" className="text-white hover:text-yellow-400 transition-colors block">
              info@awradesigns.com
            </a>
          </div>
          <div className="text-center">
            <div className="mb-3">
              <svg className="w-8 h-8 text-yellow-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-sm text-gray-400 mb-2">Location</h3>
            <p className="text-white">Addis Ababa, Ethiopia</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900 rounded-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg focus:border-yellow-400 outline-none text-white placeholder-gray-500 transition-colors"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg focus:border-yellow-400 outline-none text-white placeholder-gray-500 transition-colors"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg focus:border-yellow-400 outline-none text-white placeholder-gray-500 transition-colors"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Message"
              required
              className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg focus:border-yellow-400 outline-none resize-none text-white placeholder-gray-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-900/50 border border-green-500/50 rounded-lg text-green-400 text-center text-sm">
                Message sent successfully!
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-400 text-center text-sm">
                Failed to send message. Please try again.
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
