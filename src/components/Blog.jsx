import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Blog = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [selectedPost, setSelectedPost] = useState(null)

  // ESC key handler to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && selectedPost !== null) {
        setSelectedPost(null)
      }
    }

    if (selectedPost !== null) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [selectedPost])

  const blogPosts = [
    {
      id: 1,
      image: '/images/Gym_11 - Photo copy.webp',
      category: 'Interior Design',
      date: 'Dec 15, 2024',
      readTime: '5 min read',
      title: 'Top 10 Interior Design Trends for 2025',
      description: 'Discover the latest interior design trends that will dominate 2025, from sustainable materials to smart home integration.',
      fullContent: 'As we approach 2025, the world of interior design is embracing new philosophies that prioritize sustainability, functionality, and personal well-being. Sustainable materials are taking center stage, with bamboo, reclaimed wood, and recycled materials becoming increasingly popular. Smart home integration continues to evolve, with homeowners seeking seamless technology that enhances rather than complicates daily life.\n\nBiophilic design remains strong, bringing nature indoors through living walls, natural light optimization, and organic shapes. Color palettes are shifting towards earthy tones and warm neutrals, creating calming and grounded spaces. Minimalism is being reinterpreted with curated collections rather than stark emptiness.\n\nThe trend towards multifunctional spaces has accelerated, with flexible room designs that adapt to changing needs. Custom and artisanal pieces are valued over mass-produced items, reflecting a desire for uniqueness and sustainability. Textured surfaces add depth and interest, while bold accent pieces create focal points in otherwise restrained spaces.',
      tags: ['Trends', '2025', 'Modern'],
    },
    {
      id: 2,
      image: '/images/3D_1 - Photo copy.webp',
      category: 'Architecture',
      date: 'Dec 10, 2024',
      readTime: '8 min read',
      title: 'Complete Guide to Architectural Planning in Ethiopia',
      description: 'Everything you need to know about architectural planning, permits, and regulations in Ethiopia for your next project.',
      fullContent: 'Architectural planning in Ethiopia requires careful navigation of local regulations, cultural considerations, and environmental factors. The Ethiopian building code sets specific standards for construction, safety, and structural integrity that all projects must meet.\n\nBefore beginning any project, you\'ll need to obtain several permits from the relevant authorities. The Ministry of Urban Development and Construction oversees building permits for major developments, while local municipalities handle smaller projects. Environmental impact assessments may be required for larger developments.\n\nZoning regulations vary by city, with Addis Ababa having specific requirements for building heights, setbacks, and land use. Understanding local building traditions and materials is crucial for creating designs that are both functional and culturally appropriate.\n\nWorking with local architects and consultants familiar with Ethiopian regulations can streamline the approval process significantly. They can help navigate the permit application, ensure compliance with all codes, and coordinate with various government agencies. The approval process typically takes 4-8 weeks depending on project complexity.',
      tags: ['Planning', 'Ethiopia', 'Permits'],
    },
    {
      id: 3,
      image: '/images/Master Bath_11 - Photo copy.webp',
      category: 'Design Tips',
      date: 'Dec 5, 2024',
      readTime: '6 min read',
      title: 'Color Psychology: How Colors Affect Your Space',
      description: 'Learn how different colors can influence mood, productivity, and well-being in your home and office spaces.',
      fullContent: 'Color psychology is a powerful tool in interior design, influencing emotions, behaviors, and overall well-being. Understanding how different colors affect mood can help you create spaces that support your intended activities and emotions.\n\nBlue, often associated with calm and serenity, is ideal for bedrooms and relaxation areas. It can lower heart rate and reduce stress. However, darker blues should be used carefully as they can feel cold or depressing in excess.\n\nYellow brings energy and optimism, perfect for kitchens and social spaces. It stimulates creativity and conversation. However, bright yellows can cause agitation if overused, so consider softer shades for larger surfaces.\n\nGreen, representing nature and growth, promotes balance and harmony. It\'s excellent for home offices and living rooms where you want a calming yet energizing atmosphere. Green can reduce eye strain, making it suitable for spaces with extensive screen use.\n\nRed is stimulating and energizing, ideal for dining rooms where it can increase appetite and conversation. However, it should be used as an accent rather than a dominant color due to its intensity.\n\nNeutral colors like beige, gray, and white provide flexibility and can make spaces feel larger. They serve as excellent backgrounds for colorful accents and artwork. The key is finding the right balance that suits your personality and the function of each space.',
      tags: ['Colors', 'Psychology', 'Wellness'],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="blog" ref={ref} className="section-padding bg-black relative overflow-hidden">
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
            Design <span className="text-gradient">Insights & Tips</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white max-w-2xl mx-auto"
          >
            Stay updated with the latest trends in architecture, interior design, and construction.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 max-w-5xl mx-auto"
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              whileHover={{ x: 5 }}
              onClick={() => setSelectedPost(post)}
              className="group bg-gray-900 rounded-xl border-l-4 border-yellow-400 hover:border-yellow-300 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-yellow-500/10"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-80 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide z-10 shadow-lg">
                    {post.category}
                  </div>
                </div>

                {/* Text Section */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-yellow-400 transition-colors">
                      {post.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-base leading-relaxed line-clamp-2 mb-4">
                      {post.description}
                    </p>
                  </div>

                  {/* Tags and Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 text-gray-300 text-xs font-medium bg-gray-800 rounded-full hover:bg-yellow-400/20 hover:text-yellow-400 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-yellow-400 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Blog Post Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setSelectedPost(null)}
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
                  onClick={() => setSelectedPost(null)}
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
                <div className="overflow-y-auto max-h-[80vh]">
                  {/* Header Image */}
                  <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                    <img
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6 bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide shadow-lg z-10">
                      {selectedPost.category}
                    </div>
                  </div>

                  <div className="p-8 md:p-10">
                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <span>{selectedPost.date}</span>
                      <span>•</span>
                      <span>{selectedPost.readTime}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                      {selectedPost.title}
                    </h2>

                    {/* Full Content */}
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
                        {selectedPost.fullContent}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-gray-800">
                      {selectedPost.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-4 py-2 text-gray-300 text-sm font-medium bg-gray-800 rounded-full hover:bg-yellow-400/20 hover:text-yellow-400 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* ESC Key Hint */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      <p className="text-gray-500 text-sm text-center">
                        Press <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">ESC</kbd> to close
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Blog

