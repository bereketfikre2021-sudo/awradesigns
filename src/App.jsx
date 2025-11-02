import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import WhyChoose from './components/WhyChoose'
import Services from './components/Services'
import HowWeWork from './components/HowWeWork'
import Pricing from './components/Pricing'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Blog from './components/Blog'
import FAQ from './components/FAQ'
import Team from './components/Team'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProgressBar from './components/ProgressBar'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <ProgressBar />
      <Navbar isScrolled={isScrolled} />
      <Hero />
      <About />
      <WhyChoose />
      <Team />
      <Services />
      <HowWeWork />
      <Pricing />
      <Portfolio />
      <Testimonials />
      <Blog />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}

export default App