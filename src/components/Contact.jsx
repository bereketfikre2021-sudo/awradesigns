import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Validation helpers
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim())
// Ethiopian phone: optional; if provided, allow +251..., 251..., 09..., 9... (min 9 digits)
const isValidPhone = (phone) => {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.length === 0) return true
  return digits.length >= 9
}

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

  const [errors, setErrors] = useState({ name: '', email: '', phone: '', message: '' })
  const [touched, setTouched] = useState({ name: false, email: false, phone: false, message: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const validateField = (name, value) => {
    switch (name) {
      case 'name': {
        const v = (value || '').trim()
        if (!v) return 'Name is required'
        if (v.length < 2) return 'Name must be at least 2 characters'
        return ''
      }
      case 'email': {
        const v = (value || '').trim()
        if (!v) return 'Email is required'
        if (!isValidEmail(v)) return 'Please enter a valid email address'
        return ''
      }
      case 'phone': {
        const v = (value || '').trim()
        if (!v) return ''
        if (!isValidPhone(v)) return 'Enter at least 9 digits (e.g. +251 92 381 4125)'
        return ''
      }
      case 'message': {
        const v = (value || '').trim()
        if (!v) return 'Message is required'
        if (v.length < 10) return 'Message must be at least 10 characters'
        return ''
      }
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      message: validateField('message', formData.message),
    }
    setErrors(newErrors)
    setTouched({ name: true, email: true, phone: true, message: true })
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('https://formspree.io/f/mrbykzlb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
        setErrors({ name: '', email: '', phone: '', message: '' })
        setTouched({ name: false, email: false, phone: false, message: false })
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

  const isFormValid =
    formData.name.trim().length >= 2 &&
    isValidEmail(formData.email) &&
    (formData.phone.trim() === '' || isValidPhone(formData.phone)) &&
    formData.message.trim().length >= 10

  const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Addis+Ababa,Ethiopia'

  const inputClass = (name) =>
    `w-full px-3 py-2.5 text-sm bg-black/40 border rounded-md focus:outline-none text-white placeholder-gray-500 transition-colors ${
      touched[name] && errors[name]
        ? 'border-red-500/60 focus:border-red-400'
        : 'border-gray-800 focus:border-yellow-400/70'
    }`

  return (
    <section id="contact" ref={ref} className="py-12 md:py-16 bg-black">
      <div className="container-custom max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Get in <span className="text-gradient">touch</span>
          </h2>
        </motion.div>

        {/* Single row: contact links */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8">
          <a href="tel:+251923814125" className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm" aria-label="Phone">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+251 92 381 4125</span>
          </a>
          <a href="https://wa.me/251923814125" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm" aria-label="WhatsApp">
            <img src="/images/whatsapp-color-svgrepo-com.svg" alt="" className="w-5 h-5 flex-shrink-0" loading="lazy" decoding="async" />
            <span>WhatsApp</span>
          </a>
          <a href="mailto:info@awradesigns.com" className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm" aria-label="Email">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>info@awradesigns.com</span>
          </a>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm" aria-label="Location">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Addis Ababa</span>
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-gray-800 rounded-lg p-5 md:p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Name"
                  required
                  aria-invalid={touched.name && !!errors.name}
                  aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                  className={inputClass('name')}
                />
                {touched.name && errors.name && (
                  <p id="name-error" className="mt-1 text-xs text-red-400" role="alert">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email"
                  required
                  aria-invalid={touched.email && !!errors.email}
                  aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                  className={inputClass('email')}
                />
                {touched.email && errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-400" role="alert">{errors.email}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Phone (optional)"
                aria-invalid={touched.phone && !!errors.phone}
                aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
                className={inputClass('phone')}
              />
              {touched.phone && errors.phone && (
                <p id="phone-error" className="mt-1 text-xs text-red-400" role="alert">{errors.phone}</p>
              )}
            </div>
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                placeholder="Message"
                required
                aria-invalid={touched.message && !!errors.message}
                aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                className={`${inputClass('message')} resize-none`}
              />
              {touched.message && errors.message && (
                <p id="message-error" className="mt-1 text-xs text-red-400" role="alert">{errors.message}</p>
              )}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="px-5 py-2.5 text-sm font-medium bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
              {submitStatus === 'success' && (
                <span className="text-sm text-green-400">Sent.</span>
              )}
              {submitStatus === 'error' && (
                <span className="text-sm text-red-400">Failed — try again.</span>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
