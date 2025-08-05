import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Search, 
  BarChart3, 
  Info, 
  Menu, 
  X, 
  Settings,
  Sun,
  Moon,
  Smartphone
} from 'lucide-react'
import { useTheme } from '@hooks/useTheme'
import { useHotkeys } from 'react-hotkeys-hook'

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Keyboard shortcuts
  useHotkeys('/', (e) => {
    e.preventDefault()
    // Focus search input
    const searchInput = document.querySelector('[data-search-input]')
    if (searchInput) searchInput.focus()
  })

  useHotkeys('esc', () => {
    setIsMobileMenuOpen(false)
  })

  const navigation = [
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'About', href: '/about', icon: Info },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-700' 
          : 'bg-white dark:bg-neutral-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg text-neutral-900 dark:text-white">
                MedAdmissions
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Admin link */}
              <Link
                to="/admin"
                className="p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
                aria-label="Admin panel"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="font-semibold text-lg text-neutral-900 dark:text-white">
                  MedAdmissions
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm max-w-md">
                Privacy-first medical admissions platform for India. Complete national database with 
                1,275+ medical & 318+ dental colleges. Advanced search, analytics, and transparency tools.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                <li>Email: contact@medicaladmissions.in</li>
                <li>Support: support@medicaladmissions.in</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
                <span>&copy; 2024 Medical Admissions Platform. All rights reserved.</span>
                <span>•</span>
                <Link to="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                <Smartphone className="w-4 h-4" />
                <span>PWA Ready</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout