import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Add current theme class
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#1e40af')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const setThemeMode = (mode) => {
    if (['light', 'dark'].includes(mode)) {
      setTheme(mode)
    }
  }

  return {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }
}