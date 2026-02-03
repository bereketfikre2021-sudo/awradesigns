import { useState, useEffect, lazy } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProgressBar from './components/ProgressBar'
import LazySection from './components/LazySection'
import { throttle } from './utils/throttle'

// Lazy load components below the fold; each loads when it nears the viewport
const About = lazy(() => import('./components/About'))
const Portfolio = lazy(() => import('./components/Portfolio'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const Blog = lazy(() => import('./components/Blog'))
const FAQ = lazy(() => import('./components/FAQ'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

const SCROLL_THROTTLE_MS = 100

function SectionFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    </div>
  )
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    const throttledScroll = throttle(handleScroll, SCROLL_THROTTLE_MS)
    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <ProgressBar />
      <Navbar isScrolled={isScrolled} />
      <Hero />
      <LazySection fallback={<SectionFallback />} rootMargin="240px">
        <About />
      </LazySection>
      <LazySection fallback={<SectionFallback />} rootMargin="240px">
        <Portfolio />
      </LazySection>
      <LazySection fallback={<SectionFallback />} rootMargin="240px">
        <Testimonials />
      </LazySection>
      <LazySection fallback={<SectionFallback />} rootMargin="240px">
        <Blog />
      </LazySection>
      <LazySection fallback={<SectionFallback />} rootMargin="240px">
        <FAQ />
      </LazySection>
      <LazySection fallback={<SectionFallback />} rootMargin="240px">
        <Contact />
      </LazySection>
      <LazySection fallback={<SectionFallback />} rootMargin="240px">
        <Footer />
      </LazySection>
    </div>
  )
}

export default App