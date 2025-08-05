import React from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Heart,
  Shield,
  Users,
  Database,
  Search,
  BarChart3,
  Award,
  Globe,
  Target,
  CheckCircle,
  Star,
  Clock,
  MapPin,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Eye,
  Lock,
  Zap,
  Smartphone,
  Monitor,
  Tablet,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Play,
  Download,
  FileText,
  Calendar,
  Users as TeamIcon,
  Code,
  Palette,
  Server
} from 'lucide-react'

const About = () => {
  const stats = [
    { label: 'Medical Colleges', value: '1,275+', icon: GraduationCap },
    { label: 'Dental Colleges', value: '318+', icon: BookOpen },
    { label: 'States Covered', value: '28', icon: MapPin },
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Daily Searches', value: '10K+', icon: Search },
    { label: 'Data Accuracy', value: '99.9%', icon: CheckCircle }
  ]

  const features = [
    {
      title: 'Advanced Search Engine',
      description: 'Find colleges with natural language queries, multi-parameter filtering, and fuzzy matching for the most relevant results.',
      icon: Search,
      color: 'primary'
    },
    {
      title: 'Transparent Seat Allocation',
      description: 'Exact AIQ/State seat counting with category breakdown and historical comparison for informed decisions.',
      icon: BarChart3,
      color: 'medical'
    },
    {
      title: 'Comprehensive Database',
      description: 'Complete coverage of MBBS, MD/MS, BDS, MDS, Diploma, and Fellowship programs across India.',
      icon: Database,
      color: 'success'
    },
    {
      title: 'Privacy-First Design',
      description: 'Zero tracking, local data storage, and complete privacy protection for all users.',
      icon: Shield,
      color: 'warning'
    },
    {
      title: 'Real-time Analytics',
      description: 'Advanced insights and trends to help students make data-driven admission decisions.',
      icon: TrendingUp,
      color: 'danger'
    },
    {
      title: 'Cross-Platform Access',
      description: 'Progressive Web App that works seamlessly on desktop, tablet, and mobile devices.',
      icon: Smartphone,
      color: 'primary'
    }
  ]

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in complete transparency in medical admissions data, helping students make informed decisions.',
      icon: Eye,
      color: 'primary'
    },
    {
      title: 'Privacy',
      description: 'Your privacy is our priority. We never track, store, or share your personal information.',
      icon: Lock,
      color: 'success'
    },
    {
      title: 'Accuracy',
      description: 'All data is sourced from official government sources and verified for maximum accuracy.',
      icon: CheckCircle,
      color: 'medical'
    },
    {
      title: 'Accessibility',
      description: 'Free forever access to comprehensive medical college information for all students.',
      icon: Globe,
      color: 'warning'
    }
  ]

  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Founder & Lead Developer',
      bio: 'Medical professional with 15+ years of experience in healthcare technology and data management.',
      avatar: 'PS',
      expertise: ['Healthcare Technology', 'Data Science', 'Medical Education']
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Data Architect',
      bio: 'Expert in medical database design and official data source integration.',
      avatar: 'RK',
      expertise: ['Database Design', 'API Integration', 'Data Validation']
    },
    {
      name: 'Anjali Patel',
      role: 'UX/UI Designer',
      bio: 'Specialist in creating intuitive, accessible interfaces for medical applications.',
      avatar: 'AP',
      expertise: ['User Experience', 'Accessibility', 'Medical UI/UX']
    }
  ]

  const timeline = [
    {
      year: '2023',
      title: 'Platform Launch',
      description: 'Initial release with 500+ medical colleges and basic search functionality.'
    },
    {
      year: '2024',
      title: 'Major Expansion',
      description: 'Added 800+ more colleges, advanced analytics, and mobile optimization.'
    },
    {
      year: '2025',
      title: 'Current Version',
      description: 'Complete platform with 1,593+ colleges, real-time data, and advanced features.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>About - Medical Admissions Platform</title>
        <meta name="description" content="Learn about the Medical Admissions Platform - India's most comprehensive medical college database with privacy-first design and transparent data." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-50 to-medical-50 dark:from-primary-900/20 dark:to-medical-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                About Medical Admissions Platform
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8">
                India's most comprehensive, privacy-first medical college database. Built by doctors, 
                for students, with complete transparency and zero tracking.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="btn btn-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Demo
                </button>
                <button className="btn btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
                To democratize access to accurate, transparent medical college information across India, 
                empowering every student to make informed decisions about their medical education journey.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Comprehensive Coverage</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">Every medical and dental college in India</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-success-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Privacy Protection</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">Zero tracking, complete data privacy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-medical-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Official Data</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">Verified information from government sources</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
                To become the most trusted, comprehensive, and accessible platform for medical education 
                information in India, serving millions of students with accurate, real-time data.
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                  Why We're Different
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <span className="text-neutral-700 dark:text-neutral-300">Built by medical professionals</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <span className="text-neutral-700 dark:text-neutral-300">Free forever, no hidden costs</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <span className="text-neutral-700 dark:text-neutral-300">Official data sources only</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <span className="text-neutral-700 dark:text-neutral-300">Complete privacy protection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
              Platform Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="card hover:shadow-lg transition-shadow">
                    <div className="card-content">
                      <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 text-${feature.color}-600`} />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-${value.color}-100 dark:bg-${value.color}-900 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-8 w-8 text-${value.color}-600`} />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="card text-center">
                  <div className="card-content">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary-600">{member.avatar}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span key={skillIndex} className="badge badge-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
              Our Journey
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-1/2 px-8">
                      <div className="card">
                        <div className="card-content">
                          <div className="text-sm font-medium text-primary-600 mb-2">{item.year}</div>
                          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white dark:border-neutral-900"></div>
                    <div className="w-1/2 px-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="card-content">
                  <Code className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Frontend</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">React, Vite, Tailwind CSS</p>
                </div>
              </div>
              <div className="card text-center">
                <div className="card-content">
                  <Server className="h-12 w-12 text-success-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Backend</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Node.js, Express, Database</p>
                </div>
              </div>
              <div className="card text-center">
                <div className="card-content">
                  <Palette className="h-12 w-12 text-medical-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Design</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Figma, Accessibility First</p>
                </div>
              </div>
              <div className="card text-center">
                <div className="card-content">
                  <Shield className="h-12 w-12 text-warning-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Security</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">HTTPS, Privacy Protection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="bg-gradient-to-br from-neutral-50 to-primary-50 dark:from-neutral-800 dark:to-primary-900/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300">
                Have questions or suggestions? We'd love to hear from you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Email</h3>
                <p className="text-neutral-600 dark:text-neutral-400">support@medicaladmissions.in</p>
              </div>
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-success-600 mx-auto mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Live Chat</h3>
                <p className="text-neutral-600 dark:text-neutral-400">Available 24/7</p>
              </div>
              <div className="text-center">
                <Phone className="h-8 w-8 text-medical-600 mx-auto mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Phone</h3>
                <p className="text-neutral-600 dark:text-neutral-400">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About