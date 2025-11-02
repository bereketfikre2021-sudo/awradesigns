import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Footer = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const [activeModal, setActiveModal] = useState(null)

  // ESC key handler to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && activeModal) {
        setActiveModal(null)
      }
    }

    if (activeModal) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [activeModal])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const footerLinks = {
    services: [
      'Architectural Design',
      'Interior Design',
      'Finishing Work',
      'Brand Identity',
    ],
    company: [
      { name: 'About Us', id: 'about' },
      { name: 'Our Work', id: 'works' },
      { name: 'Contact', id: 'contact' },
      { name: 'Our Process', id: 'how-we-work' },
    ],
  }

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
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <footer ref={ref} className="bg-black text-white relative overflow-hidden">
      <div className="container-custom relative z-10 py-16">
        {/* Mobile Footer - Simple Version */}
        <div className="md:hidden">
          <div className="text-center space-y-8 pb-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/images/Asset 1.svg"
                alt="Awra Designs Logo"
                className="h-14 w-auto mx-auto mb-4 filter drop-shadow-lg"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-white mb-2">
                Awra Finishing & Interior
              </h3>
              <p className="text-gray-400 text-sm px-4">
                Creating exceptional architectural spaces and compelling brands
              </p>
            </motion.div>

            {/* Social Links and Chat Button */}
            <div className="space-y-3">
              {/* Social Links - Rectangle */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: 'Facebook',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ),
                    link: 'https://web.facebook.com/people/Awra-Designs/100089517497042/',
                  },
                  {
                    name: 'Instagram',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ),
                    link: 'https://www.instagram.com/awradesigns/',
                  },
                  {
                    name: 'TikTok',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    ),
                    link: 'https://www.tiktok.com/@awrainteriors',
                  },
                  {
                    name: 'Telegram',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    ),
                    link: 'https://t.me/AwraDesigns',
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 border border-gray-800 hover:border-yellow-400/50"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              {/* Chat Button */}
              <motion.a
                href="https://wa.me/251923814125"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-semibold shadow-lg shadow-yellow-500/20"
              >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Chat with Us</span>
            </motion.a>
            </div>
          </div>

          {/* Mobile Copyright */}
          <div className="pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs mb-3">
              © 2025 Awra Finishing & Interior
            </p>
          </div>
        </div>

        {/* Desktop Footer - Original */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 mb-12 border-b border-gray-800"
        >
          {/* Column 1: Company Info */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-6 cursor-pointer inline-block"
              onClick={scrollToTop}
            >
              <img
                src="/images/Asset 1.svg"
                alt="Awra Designs Logo"
                className="h-16 lg:h-20 w-auto filter drop-shadow-lg"
                loading="lazy"
              />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Awra Finishing & Interior
            </h3>
            <p className="text-white leading-relaxed text-base">
              Creating exceptional architectural spaces and compelling brands with professional design and premium finishing services.
            </p>
          </motion.div>

          {/* Column 2: Our Services - Hidden on Mobile */}
          <motion.div variants={itemVariants} className="hidden md:block">
            <h4 className="text-lg font-bold mb-6 text-yellow-400">
              Our Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((service, index) => (
                <li key={index}>
                  <motion.button
                    onClick={() => scrollToSection('services')}
                    whileHover={{ x: 5 }}
                    className="text-white hover:text-yellow-400 transition-colors text-left"
                  >
                    {service}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Company - Hidden on Mobile */}
          <motion.div variants={itemVariants} className="hidden md:block">
            <h4 className="text-lg font-bold mb-6 text-yellow-400">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <motion.button
                    onClick={() => scrollToSection(link.id)}
                    whileHover={{ x: 5 }}
                    className="text-white hover:text-yellow-400 transition-colors text-left"
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Connect With Us */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1">
            <h4 className="text-lg font-bold mb-6 text-yellow-400">
              Connect With Us
            </h4>
            <p className="text-white text-base mb-6 leading-relaxed">
              Follow us for design inspiration and project updates
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-3 mb-3">
              {[
                {
                  name: 'Facebook',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                  link: 'https://web.facebook.com/people/Awra-Designs/100089517497042/',
                },
                {
                  name: 'Instagram',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ),
                  link: 'https://www.instagram.com/awradesigns/',
                },
                {
                  name: 'TikTok',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  ),
                  link: 'https://www.tiktok.com/@awrainteriors',
                },
                {
                  name: 'Telegram',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  ),
                  link: 'https://t.me/AwraDesigns',
                },
              ].map((social, index) => (
                  <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 h-12 bg-gray-800 rounded-md flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                  </motion.a>
              ))}
            </div>

            {/* Chat with Us Button */}
            <motion.a
              href="https://wa.me/251923814125"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 px-5 h-12 bg-yellow-400 text-white rounded-md hover:bg-yellow-300 transition-colors font-semibold w-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Chat with Us</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Bottom Section - Desktop Only */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="hidden md:block text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-white text-sm">
              © 2025 Awra Finishing & Interior. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <motion.button
                onClick={() => setActiveModal('privacy')}
                whileHover={{ color: '#fbbf24' }}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </motion.button>
              <motion.button
                onClick={() => setActiveModal('terms')}
                whileHover={{ color: '#fbbf24' }}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Policy Modals */}
      <AnimatePresence>
        {activeModal && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActiveModal(null)}
          >
              <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl w-full my-8 bg-gray-900 rounded-2xl border border-yellow-400/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-gray-800/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300 border-2 border-yellow-400/30 hover:border-yellow-400 shadow-lg hover:scale-110"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="p-8 md:p-10 max-h-[80vh] overflow-y-auto">
                {activeModal === 'privacy' && (
              <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-gradient">
                      Privacy Policy
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="space-y-6 text-gray-300 leading-relaxed">
                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">1. Introduction</h3>
                        <p>
                          Awra Finishing & Interior ("we," "our," or "us") is committed to protecting your privacy. 
                          This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                          when you visit our website and use our services.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">2. Information We Collect</h3>
                        <p className="mb-2">We may collect information about you in a variety of ways:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Personal identification information (name, email address, phone number)</li>
                          <li>Contact information provided through our contact forms</li>
                          <li>Usage data and analytics information</li>
                          <li>Information you provide when requesting our services</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">3. How We Use Your Information</h3>
                        <p className="mb-2">We use the information we collect to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Provide, maintain, and improve our services</li>
                          <li>Respond to your inquiries and requests</li>
                          <li>Send you updates about our services (with your consent)</li>
                          <li>Monitor and analyze usage patterns</li>
                          <li>Detect, prevent, and address technical issues</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">4. Data Security</h3>
                        <p>
                          We implement appropriate technical and organizational security measures to protect your 
                          personal information. However, no method of transmission over the Internet or electronic 
                          storage is 100% secure.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">5. Your Rights</h3>
                        <p className="mb-2">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Access your personal information</li>
                          <li>Correct inaccurate data</li>
                          <li>Request deletion of your data</li>
                          <li>Opt-out of marketing communications</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">6. Contact Us</h3>
                        <p>
                          If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="mt-2">
                          <strong className="text-yellow-400">Email:</strong> info@awradesigns.com<br />
                          <strong className="text-yellow-400">Phone:</strong> +251-92-381-4125<br />
                          <strong className="text-yellow-400">Location:</strong> Addis Ababa, Ethiopia
                        </p>
                      </section>
              </div>
            </div>
                )}

                {activeModal === 'terms' && (
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-gradient">
                Terms of Service
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="space-y-6 text-gray-300 leading-relaxed">
                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">1. Agreement to Terms</h3>
                        <p>
                          By accessing and using this website, you accept and agree to be bound by the terms 
                          and provision of this agreement. If you do not agree to these terms, please do not 
                          use our website.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">2. Services</h3>
                        <p className="mb-2">
                          Awra Finishing & Interior provides architectural design, interior planning, finishing 
                          work, and branding services. We reserve the right to modify or discontinue any service 
                          at any time.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">3. Use License</h3>
                        <p className="mb-2">Permission is granted to temporarily download materials on our website for:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Personal, non-commercial transitory viewing only</li>
                          <li>Information purposes related to our services</li>
                        </ul>
                        <p className="mt-3">
                          This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Modify or copy the materials</li>
                          <li>Use the materials for any commercial purpose</li>
                          <li>Attempt to reverse engineer any software</li>
                          <li>Remove any copyright or proprietary notations</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">4. Disclaimer</h3>
                        <p>
                          The materials on our website are provided on an 'as is' basis. We make no warranties, 
                          expressed or implied, and hereby disclaim all other warranties including without limitation, 
                          implied warranties or conditions of merchantability, fitness for a particular purpose, 
                          or non-infringement of intellectual property.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">5. Limitations</h3>
                        <p>
                          In no event shall Awra Finishing & Interior or its suppliers be liable for any damages 
                          (including, without limitation, damages for loss of data or profit, or due to business 
                          interruption) arising out of the use or inability to use the materials on our website.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">6. Revisions</h3>
                        <p>
                          We may revise these terms of service at any time without notice. By using this website 
                          you are agreeing to be bound by the then current version of these terms of service.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">7. Contact Information</h3>
                        <p>
                          For questions about these Terms of Service, contact us at:
                        </p>
                        <p className="mt-2">
                          <strong className="text-yellow-400">Email:</strong> info@awradesigns.com<br />
                          <strong className="text-yellow-400">Phone:</strong> +251-92-381-4125<br />
                          <strong className="text-yellow-400">Location:</strong> Addis Ababa, Ethiopia
                        </p>
                      </section>
                    </div>
                  </div>
                )}

                {activeModal === 'cookies' && (
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-gradient">
                Cookie Policy
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="space-y-6 text-gray-300 leading-relaxed">
                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">1. What Are Cookies</h3>
                        <p>
                          Cookies are small text files that are placed on your computer or mobile device when you 
                          visit a website. They are widely used to make websites work more efficiently and to provide 
                          information to the owners of the site.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">2. How We Use Cookies</h3>
                        <p className="mb-2">We use cookies for the following purposes:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>To enable certain functions of the website</li>
                          <li>To provide analytics and improve user experience</li>
                          <li>To store your preferences and settings</li>
                          <li>To enhance security and prevent fraud</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">3. Types of Cookies We Use</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-yellow-300 mb-2">Essential Cookies</h4>
                            <p>
                              These cookies are necessary for the website to function properly. They enable basic 
                              functions like page navigation and access to secure areas of the website.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-yellow-300 mb-2">Analytics Cookies</h4>
                            <p>
                              These cookies help us understand how visitors interact with our website by collecting 
                              and reporting information anonymously.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-yellow-300 mb-2">Preference Cookies</h4>
                            <p>
                              These cookies allow the website to remember information that changes the way the 
                              website behaves or looks, such as your preferred language.
                            </p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">4. Managing Cookies</h3>
                        <p className="mb-2">
                          Most web browsers allow you to control cookies through their settings preferences. 
                          However, limiting cookies may impact your ability to use certain features of our website. 
                          You can:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Delete cookies that have already been set</li>
                          <li>Block cookies from being set in the future</li>
                          <li>Set your browser to notify you when cookies are being set</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">5. Third-Party Cookies</h3>
                        <p>
                          In addition to our own cookies, we may also use various third-party cookies to report 
                          usage statistics and deliver advertisements. These third-party cookies are governed by 
                          their respective privacy policies.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">6. Changes to This Policy</h3>
                        <p>
                          We may update this Cookie Policy from time to time to reflect changes in our practices 
                          or for other operational, legal, or regulatory reasons.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">7. Contact Us</h3>
                        <p>
                          If you have any questions about our use of cookies, please contact us at:
                        </p>
                        <p className="mt-2">
                          <strong className="text-yellow-400">Email:</strong> info@awradesigns.com<br />
                          <strong className="text-yellow-400">Phone:</strong> +251-92-381-4125<br />
                          <strong className="text-yellow-400">Location:</strong> Addis Ababa, Ethiopia
                        </p>
                      </section>
                    </div>
                  </div>
                )}

                {/* ESC Key Hint */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <p className="text-gray-500 text-sm text-center">
                    Press <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">ESC</kbd> to close
                  </p>
            </div>
          </div>
        </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        className="group fixed bottom-8 right-8 w-20 h-20 z-50"
        aria-label="Scroll to top"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
      >
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-0.5"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="w-full h-full rounded-full bg-black" />
        </motion.div>
        
        {/* Middle ring with gradient */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        
        {/* Inner glowing core */}
        <motion.div
          className="absolute inset-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl shadow-yellow-500/70"
          animate={{
            boxShadow: [
              '0 0 20px rgba(250, 204, 21, 0.7)',
              '0 0 40px rgba(250, 204, 21, 0.9), 0 0 60px rgba(250, 204, 21, 0.5)',
              '0 0 20px rgba(250, 204, 21, 0.7)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Shimmer wave */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            animate={{
              background: [
                'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Icon */}
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.svg
              className="w-8 h-8 text-black relative z-10"
          fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
        >
          <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </motion.svg>
          </div>
        </motion.div>
        
        {/* Particle effect dots */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 8
          const radius = 45
          const centerX = 40 // Half of 80px button width
          const centerY = 40 // Half of 80px button height
          
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
              style={{
                left: `${centerX}px`,
                top: `${centerY}px`,
              }}
              animate={{
                x: [
                  0,
                  Math.cos(angle) * radius,
                  0,
                ],
                y: [
                  0,
                  Math.sin(angle) * radius,
                  0,
                ],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
            />
          )
        })}
        
        {/* Pulsing rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0 rounded-full border-2 border-yellow-400/30"
            animate={{
              scale: [1, 1.5 + i * 0.3, 1.5 + i * 0.3],
              opacity: [0.6, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.button>
    </footer>
  )
}

export default Footer
