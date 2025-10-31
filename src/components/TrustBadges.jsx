import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedInView } from '../hooks';
import CountUp from './CountUp';

const TrustBadges = () => {
  const { ref, inView } = useAnimatedInView(0.2);

  const badges = [
    {
      id: 1,
      icon: '⭐',
      value: '5+',
      label: 'Years Experience',
      description: 'Proven track record in design and construction'
    },
    {
      id: 2,
      icon: '🏗️',
      value: '100+',
      label: 'Projects Completed',
      description: 'Successfully delivered projects'
    },
    {
      id: 3,
      icon: '⭐',
      value: '4.8',
      label: 'Client Rating',
      description: 'Average customer satisfaction'
    },
    {
      id: 4,
      icon: '🎯',
      value: '98%',
      label: 'Satisfaction Rate',
      description: 'Happy clients recommend us'
    },
    {
      id: 5,
      icon: '🏆',
      value: 'Free',
      label: 'Consultation',
      description: 'No obligation initial consultation'
    },
    {
      id: 6,
      icon: '✅',
      value: '100%',
      label: 'On-Time Delivery',
      description: 'We deliver as promised'
    }
  ];

  return (
    <section className="trust-badges-section" ref={ref}>
      <div className="container">
        <motion.div
          className="trust-badges-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              className="trust-badge-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="trust-badge-icon">{badge.icon}</div>
              <div className="trust-badge-value">
                {(() => {
                  // Handle string values with + or %
                  if (typeof badge.value === 'string' && (badge.value.includes('+') || badge.value.includes('%'))) {
                    return badge.value;
                  }
                  // Handle 'Free' text
                  if (badge.value === 'Free' || badge.value === 'free') {
                    return badge.value;
                  }
                  // Try to parse as number for CountUp
                  const numericValue = parseFloat(badge.value);
                  if (!isNaN(numericValue) && isFinite(numericValue)) {
                    return <CountUp endValue={numericValue} duration={2000} />;
                  }
                  // Fallback to displaying the value as-is
                  return badge.value;
                })()}
              </div>
              <h3 className="trust-badge-label">{badge.label}</h3>
              <p className="trust-badge-description">{badge.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBadges;

