import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Search, 
  BarChart3, 
  Shield, 
  Database, 
  TrendingUp, 
  Users,
  MapPin,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'

const Home = () => {
  const stats = [
    { label: 'Medical Colleges', value: '1,275+', icon: Database },
    { label: 'Dental Colleges', value: '318+', icon: Award },
    { label: 'States Covered', value: '28+', icon: MapPin },
    { label: 'Active Users', value: '10K+', icon: Users },
  ]

  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Lightning-fast search with natural language processing. Find colleges by name, course, state, or any criteria.',
      color: 'text-primary-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics with historical data, trends, and comparative analysis across years.',
      color: 'text-medical-600'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'No tracking, no ads, no data selling. Your privacy is our priority with zero external monitoring.',
      color: 'text-warning-600'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Data',
      description: 'Always up-to-date information from official sources (NMC, DCI, MCC) with transparent validation.',
      color: 'text-danger-600'
    },
    {
      icon: Clock,
      title: 'Historical Analysis',
      description: 'Multi-year comparison and trend analysis to help you make informed decisions.',
      color: 'text-primary-600'
    },
    {
      icon: CheckCircle,
      title: 'Official Sources',
      description: 'All data verified from official sources with complete transparency and source attribution.',
      color: 'text-medical-600'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Medical Admissions Platform - India's Complete Medical & Dental College Database</title>
        <meta name="description" content="Privacy-first medical admissions platform for India. Complete national database with 1,275+ medical & 318+ dental colleges. Advanced search, analytics, and transparency tools." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-medical-50 dark:from-primary-950 dark:to-medical-950 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="heading-responsive font-bold text-neutral-900 dark:text-white mb-6">
              India's Most Comprehensive
              <span className="block text-primary-600 dark:text-primary-400">
                Medical Admissions Platform
              </span>
            </h1>
            <p className="text-responsive text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8">
              Privacy-first platform with complete national database of 1,275+ medical & 318+ dental colleges. 
              Advanced search, analytics, and transparency tools to help you make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="btn btn-primary text-lg px-8 py-3"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Searching
              </Link>
              <Link
                to="/analytics"
                className="btn btn-outline text-lg px-8 py-3"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-responsive font-bold text-neutral-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-responsive text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Built by medical professionals for students, with a focus on accuracy, transparency, and privacy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card hover:shadow-medium transition-shadow">
                  <div className="card-content">
                    <div className={`w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-responsive font-bold text-white mb-4">
            Ready to Find Your Perfect Medical College?
          </h2>
          <p className="text-responsive text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who trust our platform for accurate, up-to-date information 
            about medical and dental colleges across India.
          </p>
          <Link
            to="/search"
            className="btn bg-white text-primary-600 hover:bg-neutral-100 text-lg px-8 py-3"
          >
            <Search className="w-5 h-5 mr-2" />
            Explore Colleges Now
          </Link>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
              Trusted by students across India
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-sm font-medium text-neutral-500">NMC Verified</div>
              <div className="text-sm font-medium text-neutral-500">DCI Approved</div>
              <div className="text-sm font-medium text-neutral-500">MCC Data</div>
              <div className="text-sm font-medium text-neutral-500">Privacy First</div>
              <div className="text-sm font-medium text-neutral-500">Free Forever</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home