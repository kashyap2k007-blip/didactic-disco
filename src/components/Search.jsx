import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search as SearchIcon, Filter, Grid, List, Download, MapPin, Users, Award } from 'lucide-react'
import Fuse from 'fuse.js'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'react-hot-toast'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    state: '',
    type: '',
    management: '',
    course: '',
    category: '',
    bondRequired: '',
    seatRange: ''
  })
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)

  // Load college data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use API service with fallback to static data
        const apiService = await import('@services/api.js')
        const api = apiService.default
        
        // Get colleges from API service
        const [medicalColleges, dentalColleges] = await Promise.all([
          api.getMedicalColleges(),
          api.getDentalColleges()
        ])
        
        const allColleges = [
          ...medicalColleges.map(college => ({ ...college, type: 'medical' })),
          ...dentalColleges.map(college => ({ ...college, type: 'dental' }))
        ]
        
        setColleges(allColleges)
        console.log('✅ Loaded data from API service')
      } catch (error) {
        console.error('API service failed, falling back to static data:', error)
        
        // Fallback to static data if API fails
        try {
          const medicalData = await import('@data/medicalColleges.json')
          const dentalData = await import('@data/dentalColleges.json')
          
          const allColleges = [
            ...medicalData.default.map(college => ({ ...college, type: 'medical' })),
            ...dentalData.default.map(college => ({ ...college, type: 'dental' }))
          ]
          
          setColleges(allColleges)
          console.log('⚠️ Using fallback static data')
        } catch (fallbackError) {
          console.error('Fallback data loading failed:', fallbackError)
          toast.error('Failed to load college data')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Fuse.js configuration for fuzzy search
  const fuseOptions = {
    keys: [
      'name',
      'state',
      'city',
      'university',
      'courses.name',
      'type'
    ],
    threshold: 0.3,
    includeScore: true
  }

  // Filter and search colleges
  const filteredColleges = useMemo(() => {
    let filtered = colleges

    // Apply filters
    if (filters.state) {
      filtered = filtered.filter(college => 
        college.state.toLowerCase().includes(filters.state.toLowerCase())
      )
    }

    if (filters.type) {
      filtered = filtered.filter(college => 
        college.type === filters.type
      )
    }

    if (filters.management) {
      filtered = filtered.filter(college => 
        college.management.toLowerCase().includes(filters.management.toLowerCase())
      )
    }

    if (filters.course) {
      filtered = filtered.filter(college => 
        college.courses.some(course => course.name === filters.course)
      )
    }

    if (filters.category) {
      filtered = filtered.filter(college => {
        const seatMatrix = college.seatMatrix.mbbs || college.seatMatrix.bds
        return seatMatrix?.categories?.[filters.category] > 0
      })
    }

    if (filters.bondRequired !== '') {
      filtered = filtered.filter(college => 
        college.bond.required === (filters.bondRequired === 'true')
      )
    }

    if (filters.seatRange) {
      const [min, max] = filters.seatRange.split('-').map(Number)
      filtered = filtered.filter(college => {
        const totalSeats = college.seatMatrix.mbbs?.total || college.seatMatrix.bds?.total || 0
        return totalSeats >= min && totalSeats <= max
      })
    }

    // Apply search query
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, fuseOptions)
      const results = fuse.search(searchQuery)
      filtered = results.map(result => result.item)
    }

    // Sort results
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'state':
          aValue = a.state.toLowerCase()
          bValue = b.state.toLowerCase()
          break
        case 'seats':
          aValue = a.seatMatrix.mbbs?.total || a.seatMatrix.bds?.total || 0
          bValue = b.seatMatrix.mbbs?.total || b.seatMatrix.bds?.total || 0
          break
        case 'fees':
          aValue = a.fees.mbbs?.government || a.fees.bds?.government || 0
          bValue = b.fees.mbbs?.government || b.fees.bds?.government || 0
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [colleges, searchQuery, filters, sortBy, sortOrder])

  // Keyboard shortcuts
  useHotkeys('/', (e) => {
    e.preventDefault()
    const searchInput = document.querySelector('[data-search-input]')
    if (searchInput) searchInput.focus()
  })

  useHotkeys('esc', () => {
    setSearchQuery('')
    setFilters({
      state: '',
      type: '',
      management: '',
      course: '',
      category: '',
      bondRequired: '',
      seatRange: ''
    })
  })

  // Export filtered results
  const exportResults = (format) => {
    const data = filteredColleges.map(college => ({
      Name: college.name,
      State: college.state,
      City: college.city,
      Type: college.type,
      Management: college.management,
      University: college.university,
      'Total Seats': college.seatMatrix.mbbs?.total || college.seatMatrix.bds?.total || 0,
      'AIQ Seats': college.seatMatrix.mbbs?.aiq || college.seatMatrix.bds?.aiq || 0,
      'Government Fee': college.fees.mbbs?.government || college.fees.bds?.government || 0,
      'Bond Required': college.bond.required ? 'Yes' : 'No',
      'Recognition Status': college.recognitionStatus
    }))

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `medical-colleges-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `medical-colleges-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    }

    toast.success(`Exported ${data.length} colleges in ${format.toUpperCase()} format`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Search Medical Colleges - Medical Admissions Platform</title>
        <meta name="description" content="Search and filter through 1,275+ medical and 318+ dental colleges across India. Advanced search with natural language processing and comprehensive filtering options." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Search Medical Colleges
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">
              Find your perfect medical or dental college from our comprehensive database
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search colleges, courses, states, or any criteria... (Press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-search-input
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.state}
                onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
              >
                <option value="">All States</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
              >
                <option value="">All Types</option>
                <option value="medical">Medical</option>
                <option value="dental">Dental</option>
              </select>

              <select
                value={filters.management}
                onChange={(e) => setFilters(prev => ({ ...prev, management: e.target.value }))}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
              >
                <option value="">All Management</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Deemed">Deemed</option>
              </select>

              <select
                value={filters.course}
                onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
              >
                <option value="">All Courses</option>
                <option value="MBBS">MBBS</option>
                <option value="BDS">BDS</option>
              </select>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {filteredColleges.length} colleges found
              </span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="state-asc">State A-Z</option>
                <option value="seats-desc">Most Seats</option>
                <option value="fees-asc">Lowest Fees</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportResults('csv')}
                className="btn btn-outline text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                Export CSV
              </button>
              <button
                onClick={() => exportResults('json')}
                className="btn btn-outline text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                Export JSON
              </button>
            </div>
          </div>

          {/* Results Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredColleges.map((college) => (
                <CollegeListItem key={college.id} college={college} />
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredColleges.length === 0 && (
            <div className="text-center py-12">
              <SearchIcon className="mx-auto w-12 h-12 text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                No colleges found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const CollegeCard = ({ college }) => {
  const totalSeats = college.seatMatrix.mbbs?.total || college.seatMatrix.bds?.total || 0
  const aiqSeats = college.seatMatrix.mbbs?.aiq || college.seatMatrix.bds?.aiq || 0
  const governmentFee = college.fees.mbbs?.government || college.fees.bds?.government || 0

  return (
    <div className="card hover:shadow-medium transition-shadow cursor-pointer">
      <div className="card-content">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-2">
              {college.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <MapPin className="w-4 h-4" />
              <span>{college.city}, {college.state}</span>
            </div>
          </div>
          <span className={`badge ${college.type === 'medical' ? 'badge-primary' : 'badge-success'}`}>
            {college.type.toUpperCase()}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-300">Management:</span>
            <span className="font-medium">{college.management}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-300">Total Seats:</span>
            <span className="font-medium">{totalSeats}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-300">AIQ Seats:</span>
            <span className="font-medium">{aiqSeats}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-300">Govt. Fee:</span>
            <span className="font-medium">₹{governmentFee.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className={`badge ${college.bond.required ? 'badge-warning' : 'badge-success'}`}>
            {college.bond.required ? 'Bond Required' : 'No Bond'}
          </span>
          <span className={`badge ${college.recognitionStatus === 'Recognized' ? 'badge-success' : 'badge-warning'}`}>
            {college.recognitionStatus}
          </span>
        </div>
      </div>
    </div>
  )
}

const CollegeListItem = ({ college }) => {
  const totalSeats = college.seatMatrix.mbbs?.total || college.seatMatrix.bds?.total || 0
  const aiqSeats = college.seatMatrix.mbbs?.aiq || college.seatMatrix.bds?.aiq || 0
  const governmentFee = college.fees.mbbs?.government || college.fees.bds?.government || 0

  return (
    <div className="card hover:shadow-medium transition-shadow cursor-pointer">
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {college.name}
              </h3>
              <span className={`badge ${college.type === 'medical' ? 'badge-primary' : 'badge-success'}`}>
                {college.type.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{college.city}, {college.state}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{totalSeats} seats</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{college.management}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold text-neutral-900 dark:text-white">
              ₹{governmentFee.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">
              {aiqSeats} AIQ seats
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search