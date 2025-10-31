import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimatedInView } from '../hooks';
import { getImagePath } from '../utils';
import LazyImage from './LazyImage';

const CaseStudies = () => {
  const { ref, inView } = useAnimatedInView(0.2);
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Sample case studies - Replace with real case studies
  const caseStudies = useMemo(() => [
    {
      id: 1,
      title: 'Modern Residential Villa',
      type: 'Residential',
      location: 'Addis Ababa',
      client: 'Private Homeowner',
      budget: '2,500,000 ETB',
      timeline: '8 months',
      description: 'Complete renovation of a 300sqm villa, combining modern design with traditional Ethiopian elements.',
      challenge: 'Transforming an outdated 1980s villa into a modern, energy-efficient home while preserving its character.',
      solution: 'Integrated smart home technology, sustainable materials, and open-plan design while maintaining the original structure.',
      results: 'Increased property value by 60%, 40% reduction in energy costs, and a stunning transformation that exceeded expectations.',
      images: [
        '/images/3D_1 - Photo copy.webp',
        '/images/3D_2 - Photo copy.webp',
        '/images/3D_3 - Photo copy.webp',
      ],
      featured: true
    },
    {
      id: 2,
      title: 'Corporate Office Design',
      type: 'Commercial',
      location: 'Addis Ababa',
      client: 'Tech Company',
      budget: '1,800,000 ETB',
      timeline: '6 months',
      description: 'Contemporary office space design for a growing tech company, emphasizing collaboration and productivity.',
      challenge: 'Creating a flexible workspace that accommodates current needs while allowing for future growth.',
      solution: 'Modular design with flexible meeting spaces, modern amenities, and biophilic elements for employee wellbeing.',
      results: '95% employee satisfaction, increased productivity, and a space that attracts top talent.',
      images: [
        '/images/LOBBY_26 - Photo copy.webp',
        '/images/LOBBY_30 - Photo copy.webp',
      ],
      featured: true
    },
    {
      id: 3,
      title: 'Restaurant Interior',
      type: 'Commercial',
      location: 'Addis Ababa',
      client: 'Restaurant Owner',
      budget: '1,200,000 ETB',
      timeline: '4 months',
      description: 'Vibrant restaurant design that celebrates Ethiopian culture while offering a modern dining experience.',
      challenge: 'Balancing traditional Ethiopian aesthetics with contemporary dining expectations.',
      solution: 'Fusion design approach with traditional patterns, modern lighting, and efficient kitchen layout.',
      results: '40% increase in customer satisfaction, 25% increase in revenue, and recognition as top dining destination.',
      images: [
        '/images/Gym_11 - Photo copy.webp',
        '/images/Gym_19 - Photo copy.webp',
      ],
      featured: false
    },
    {
      id: 4,
      title: 'Apartment Renovation',
      type: 'Residential',
      location: 'Addis Ababa',
      client: 'Apartment Owner',
      budget: '800,000 ETB',
      timeline: '3 months',
      description: 'Complete transformation of a 120sqm apartment into a modern, functional living space.',
      challenge: 'Maximizing space in a compact apartment while maintaining style and functionality.',
      solution: 'Smart storage solutions, open-plan design, and strategic use of natural light to create sense of space.',
      results: '50% more usable space, increased home value, and a beautiful living environment.',
      images: [
        '/images/Bed Rm_11 - Photo copy.webp',
        '/images/CH Bed 1_1 - Photo copy.webp',
      ],
      featured: false
    },
    {
      id: 5,
      title: 'Luxury Hotel Lobby',
      type: 'Commercial',
      location: 'Addis Ababa',
      client: 'Hotel Chain',
      budget: '3,500,000 ETB',
      timeline: '10 months',
      description: 'Grand lobby design that creates a memorable first impression for hotel guests.',
      challenge: 'Creating an impressive lobby that reflects Ethiopian hospitality and luxury.',
      solution: 'Combined traditional Ethiopian architectural elements with luxury materials and modern amenities.',
      results: 'Award-winning design, increased bookings, and guest satisfaction scores above 4.8.',
      images: [
        '/images/LIVING_11 - Photo copy.webp',
        '/images/LIVING_13 - Photo copy.webp',
      ],
      featured: true
    },
    {
      id: 6,
      title: 'Gym & Fitness Center',
      type: 'Commercial',
      location: 'Addis Ababa',
      client: 'Fitness Center',
      budget: '1,500,000 ETB',
      timeline: '5 months',
      description: 'State-of-the-art fitness center design focusing on motivation and functionality.',
      challenge: 'Creating an inspiring workout environment that accommodates various fitness activities.',
      solution: 'Zoned design with specialized areas, motivational graphics, and premium equipment placement.',
      results: '30% increase in memberships, improved member retention, and recognition in fitness industry.',
      images: [
        '/images/Master Bath_11 - Photo copy.webp',
      ],
      featured: false
    }
  ].map(caseStudy => ({
    ...caseStudy,
    images: caseStudy.images.map(img => getImagePath(img))
  })), []);

  const filters = ['All', 'Residential', 'Commercial'];

  const filteredCases = activeFilter === 'All' 
    ? caseStudies 
    : caseStudies.filter(cs => cs.type === activeFilter);

  const featuredCases = caseStudies.filter(cs => cs.featured);

  return (
    <section id="case-studies" className="case-studies-section" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="section-subtitle">
            Explore our completed projects and see the transformation we bring to every space
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="case-studies-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Case Studies Grid */}
        <div className="case-studies-grid">
          {filteredCases.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              className={`case-study-card ${caseStudy.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedCase(caseStudy)}
              whileHover={{ y: -5 }}
            >
              <div className="case-study-image">
                <LazyImage
                  src={caseStudy.images[0]}
                  alt={caseStudy.title}
                  className="case-study-img"
                />
                {caseStudy.featured && (
                  <div className="featured-badge">Featured</div>
                )}
                <div className="case-study-overlay">
                  <span className="view-project">View Project →</span>
                </div>
              </div>
              <div className="case-study-content">
                <div className="case-study-header">
                  <span className="case-study-type">{caseStudy.type}</span>
                  <span className="case-study-location">{caseStudy.location}</span>
                </div>
                <h3 className="case-study-title">{caseStudy.title}</h3>
                <p className="case-study-description">{caseStudy.description}</p>
                <div className="case-study-details">
                  <div className="detail-item">
                    <span className="detail-label">Budget:</span>
                    <span className="detail-value">{caseStudy.budget}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Timeline:</span>
                    <span className="detail-value">{caseStudy.timeline}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Study Modal */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div
              className="case-study-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
            >
              <motion.div
                className="case-study-modal-content"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setSelectedCase(null)}
                  aria-label="Close modal"
                >
                  ×
                </button>

                <div className="modal-header">
                  <div className="modal-badges">
                    <span className="badge">{selectedCase.type}</span>
                    <span className="badge">{selectedCase.location}</span>
                  </div>
                  <h2 className="modal-title">{selectedCase.title}</h2>
                </div>

                <div className="modal-image-gallery">
                  {selectedCase.images.map((img, idx) => (
                    <LazyImage
                      key={idx}
                      src={img}
                      alt={`${selectedCase.title} - Image ${idx + 1}`}
                      className="modal-image"
                    />
                  ))}
                </div>

                <div className="modal-body">
                  <div className="modal-section">
                    <h3>Project Overview</h3>
                    <p>{selectedCase.description}</p>
                  </div>

                  <div className="modal-section">
                    <h3>The Challenge</h3>
                    <p>{selectedCase.challenge}</p>
                  </div>

                  <div className="modal-section">
                    <h3>Our Solution</h3>
                    <p>{selectedCase.solution}</p>
                  </div>

                  <div className="modal-section">
                    <h3>Results</h3>
                    <p>{selectedCase.results}</p>
                  </div>

                  <div className="modal-details-grid">
                    <div className="modal-detail">
                      <span className="detail-label">Client:</span>
                      <span className="detail-value">{selectedCase.client}</span>
                    </div>
                    <div className="modal-detail">
                      <span className="detail-label">Budget:</span>
                      <span className="detail-value">{selectedCase.budget}</span>
                    </div>
                    <div className="modal-detail">
                      <span className="detail-label">Timeline:</span>
                      <span className="detail-value">{selectedCase.timeline}</span>
                    </div>
                    <div className="modal-detail">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{selectedCase.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CaseStudies;




