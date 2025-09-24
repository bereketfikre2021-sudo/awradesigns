import React from 'react';
import { motion } from 'framer-motion';

const WhyChooseUsLight = () => {
  const features = [
    {
      icon: '🎓',
      title: '5+ Years of Excellence',
      description: 'With over 5 years of dedicated service, we\'ve transformed 100+ spaces across Ethiopia, combining traditional craftsmanship with modern design principles.',
      stats: [
        { number: '100+', label: 'Projects Completed' },
        { number: '50+', label: 'Happy Clients' },
        { number: '5+', label: 'Years Experience' }
      ]
    },
    {
      icon: '🏗️',
      title: 'Expert Craftsmanship',
      description: 'Our skilled artisans bring decades of experience in architectural design, interior planning, and finishing work to every project.',
      highlights: ['Architectural Design', 'Interior Planning', 'Finishing Work', 'Quality Assurance']
    },
    {
      icon: '💡',
      title: 'Innovative Solutions',
      description: 'We blend traditional Ethiopian design elements with cutting-edge technology to create spaces that are both timeless and functional.',
      highlights: ['Modern Technology', 'Traditional Elements', 'Sustainable Design', 'Custom Solutions']
    },
    {
      icon: '🤝',
      title: 'Client-Focused Approach',
      description: 'Every project is tailored to your unique vision and needs, with transparent communication and dedicated support throughout the process.',
      highlights: ['Personalized Service', 'Transparent Communication', 'Dedicated Support', 'Quality Guarantee']
    }
  ];

  return (
    <section id="why-choose-us" className="why-choose-us-light">
      <div className="why-choose-container-light">
        {/* Hero Header */}
        <motion.div
          className="why-choose-hero-light"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="hero-content-light">
            <motion.div
              className="hero-badge-light"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="badge-text-light">Why Choose Awra Designs</span>
            </motion.div>
            
            <motion.h2
              className="hero-title-light"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Excellence in Every <span className="gradient-text-light">Project</span>
            </motion.h2>
            
            <motion.p
              className="hero-subtitle-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Discover what sets us apart in the world of architectural design and finishing work. 
              Our commitment to quality, innovation, and client satisfaction drives everything we do.
            </motion.p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="features-grid-light">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card-light"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-header-light">
                <div className="feature-icon-light">
                  <span className="icon-emoji">{feature.icon}</span>
                </div>
                <h3 className="feature-title-light">{feature.title}</h3>
              </div>
              
              <p className="feature-description-light">{feature.description}</p>
              
              {feature.stats && (
                <div className="feature-stats-light">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="stat-item-light">
                      <span className="stat-number-light">{stat.number}</span>
                      <span className="stat-label-light">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {feature.highlights && (
                <div className="feature-highlights-light">
                  {feature.highlights.map((highlight, highlightIndex) => (
                    <span key={highlightIndex} className="highlight-tag-light">
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="cta-section-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="cta-content-light">
            <h3 className="cta-title-light">Ready to Transform Your Space?</h3>
            <p className="cta-description-light">
              Let's discuss your project and bring your vision to life with our expert design and finishing services.
            </p>
            <motion.button
              className="cta-button-light"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsLight;
