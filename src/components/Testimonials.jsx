import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimatedInView } from '../hooks';

const Testimonials = () => {
  const { ref, inView } = useAnimatedInView(0.2);

  // Sample testimonials data - Replace with real testimonials
  const [testimonials] = useState([
    {
      id: 1,
      name: 'Alemayehu Tekle',
      role: 'Homeowner',
      project: 'Residential Renovation',
      location: 'Addis Ababa',
      image: '/images/testimonial-1.jpg', // Add actual testimonial photos
      rating: 5,
      text: 'Awra Designs transformed our home beyond our expectations. Their attention to detail and creative vision turned our outdated space into a modern masterpiece. The team was professional, timely, and truly understood our needs.',
      date: '2024'
    },
    {
      id: 2,
      name: 'Meron Assefa',
      role: 'Business Owner',
      project: 'Office Design',
      location: 'Addis Ababa',
      image: '/images/testimonial-2.jpg',
      rating: 5,
      text: 'Working with Awra Designs was a game-changer for our office space. They created a functional yet beautiful environment that reflects our company values. Our employees love coming to work!',
      date: '2024'
    },
    {
      id: 3,
      name: 'Bereket Haile',
      role: 'Property Developer',
      project: 'Commercial Interior',
      location: 'Addis Ababa',
      image: '/images/testimonial-3.jpg',
      rating: 5,
      text: 'Awra Designs delivered exceptional results on our commercial project. Their innovative designs and professional execution exceeded our expectations. Highly recommended!',
      date: '2024'
    },
    {
      id: 4,
      name: 'Selamawi Gebre',
      role: 'Restaurant Owner',
      project: 'Restaurant Interior',
      location: 'Addis Ababa',
      image: '/images/testimonial-4.jpg',
      rating: 5,
      text: 'The team at Awra Designs created an incredible dining atmosphere that perfectly captures our brand. Our customers constantly compliment the design. Exceptional service!',
      date: '2024'
    },
    {
      id: 5,
      name: 'Rahel Wondimu',
      role: 'Apartment Owner',
      project: 'Apartment Renovation',
      location: 'Addis Ababa',
      image: '/images/testimonial-5.jpg',
      rating: 5,
      text: 'Awra Designs made our apartment renovation smooth and stress-free. Their design expertise and project management skills are outstanding. We couldn\'t be happier with the results.',
      date: '2024'
    },
    {
      id: 6,
      name: 'Daniel Asnake',
      role: 'Villa Owner',
      project: 'Villa Design',
      location: 'Addis Ababa',
      image: '/images/testimonial-6.jpg',
      rating: 5,
      text: 'From concept to completion, Awra Designs exceeded all expectations. They understood our vision and brought it to life beautifully. The quality and attention to detail is remarkable.',
      date: '2024'
    }
  ]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [filter, setFilter] = useState('All');

  // Filter testimonials by project type
  const filteredTestimonials = filter === 'All' 
    ? testimonials 
    : testimonials.filter(t => 
        t.project.toLowerCase().includes(filter.toLowerCase())
      );

  // Auto-rotate testimonials
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev === filteredTestimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [filteredTestimonials.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  return (
    <section id="testimonials" className="testimonials-section" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="section-subtitle">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="testimonial-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {['All', 'Residential', 'Commercial', 'Office', 'Restaurant'].map((filterType) => (
            <button
              key={filterType}
              className={`filter-btn ${filter === filterType ? 'active' : ''}`}
              onClick={() => {
                setFilter(filterType);
                setCurrentTestimonial(0);
              }}
            >
              {filterType}
            </button>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setCurrentTestimonial(index)}
            >
              <div className="testimonial-header">
                <div className="testimonial-image">
                  <img 
                    src={testimonial.image || '/images/default-avatar.jpg'} 
                    alt={testimonial.name}
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.jpg';
                    }}
                  />
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                  <p className="testimonial-project">{testimonial.project}</p>
                  <p className="testimonial-location">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
              </div>
              
              <blockquote className="testimonial-text">
                "{testimonial.text}"
              </blockquote>
              
              <div className="testimonial-footer">
                <span className="testimonial-date">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Navigation Dots */}
        <div className="testimonial-dots">
          {filteredTestimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentTestimonial ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Google Reviews Link */}
        {/* Only show if Google Review URL is configured - Set VITE_GOOGLE_REVIEW_URL in .env */}
        {import.meta.env.VITE_GOOGLE_REVIEW_URL && import.meta.env.VITE_GOOGLE_REVIEW_URL !== 'XXXXXXXXXXXXX' && (
          <motion.div
            className="review-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p>Love our work? Share your experience!</p>
            <a 
              href={import.meta.env.VITE_GOOGLE_REVIEW_URL || 'https://g.page/r/XXXXXXXXXXXXX/review'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              aria-label="Leave a review on Google"
            >
              Leave a Review on Google
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;



