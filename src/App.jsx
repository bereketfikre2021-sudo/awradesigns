import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProgressBar from './components/ProgressBar'

// Lazy load components below the fold for better initial load time
const About = lazy(() => import('./components/About'))
const Portfolio = lazy(() => import('./components/Portfolio'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const Blog = lazy(() => import('./components/Blog'))
const FAQ = lazy(() => import('./components/FAQ'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <ProgressBar />
      <Navbar isScrolled={isScrolled} />
      <Hero />
      <Suspense fallback={<LoadingFallback />}>
        <About />
        <Portfolio />
        <Testimonials />
        <Blog />
        <FAQ />
        <Contact />
        <Footer />
      </Suspense>
    </div>
  )
}

export default App