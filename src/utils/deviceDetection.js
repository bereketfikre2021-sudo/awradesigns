// Device detection utility for performance optimizations
export const isMobile = () => {
  if (typeof window === 'undefined') return false
  
  // Check for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  const isMobileDevice = mobileRegex.test(userAgent)
  
  // Check screen width (more reliable)
  const isSmallScreen = window.innerWidth < 768
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return isMobileDevice || (isSmallScreen && isTouchDevice)
}

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false
  
  // Check for low-end device indicators
  const hardwareConcurrency = navigator.hardwareConcurrency || 4
  const deviceMemory = navigator.deviceMemory || 4
  
  return hardwareConcurrency <= 2 || deviceMemory <= 2
}
