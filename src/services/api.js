// Client-side API Service
// Handles data fetching with fallback to static data

class ApiService {
  constructor() {
    this.baseUrl = '/api' // For future API endpoints
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Get medical colleges with filters
  async getMedicalColleges(filters = {}) {
    const cacheKey = `medical-${JSON.stringify(filters)}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      // Try to fetch from API/database
      const response = await fetch(`${this.baseUrl}/medical-colleges?${new URLSearchParams(filters)}`)
      if (response.ok) {
        const data = await response.json()
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
        return data
      }
    } catch (error) {
      console.warn('API fetch failed, using static data:', error)
    }

    // Fallback to static data
    try {
      const staticData = await import('@data/medicalColleges.json')
      const data = this.filterStaticData(staticData.default, filters)
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error('Static data loading failed:', error)
      throw new Error('Failed to load medical colleges data')
    }
  }

  // Get dental colleges with filters
  async getDentalColleges(filters = {}) {
    const cacheKey = `dental-${JSON.stringify(filters)}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      // Try to fetch from API/database
      const response = await fetch(`${this.baseUrl}/dental-colleges?${new URLSearchParams(filters)}`)
      if (response.ok) {
        const data = await response.json()
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
        return data
      }
    } catch (error) {
      console.warn('API fetch failed, using static data:', error)
    }

    // Fallback to static data
    try {
      const staticData = await import('@data/dentalColleges.json')
      const data = this.filterStaticData(staticData.default, filters)
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error('Static data loading failed:', error)
      throw new Error('Failed to load dental colleges data')
    }
  }

  // Get college by ID
  async getCollegeById(id, type = 'medical') {
    const cacheKey = `college-${type}-${id}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      // Try to fetch from API/database
      const response = await fetch(`${this.baseUrl}/${type}-colleges/${id}`)
      if (response.ok) {
        const data = await response.json()
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
        return data
      }
    } catch (error) {
      console.warn('API fetch failed, using static data:', error)
    }

    // Fallback to static data
    try {
      const staticData = await import(`@data/${type}Colleges.json`)
      const college = staticData.default.find(c => c.id === id)
      if (college) {
        this.cache.set(cacheKey, { data: college, timestamp: Date.now() })
        return college
      }
      throw new Error('College not found')
    } catch (error) {
      console.error('Static data loading failed:', error)
      throw new Error('Failed to load college data')
    }
  }

  // Get statistics
  async getStatistics() {
    const cacheKey = 'statistics'
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      // Try to fetch from API/database
      const response = await fetch(`${this.baseUrl}/statistics`)
      if (response.ok) {
        const data = await response.json()
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
        return data
      }
    } catch (error) {
      console.warn('API fetch failed, using static data:', error)
    }

    // Fallback to static data
    try {
      const staticData = await import('@data/statistics.json')
      this.cache.set(cacheKey, { data: staticData.default, timestamp: Date.now() })
      return staticData.default
    } catch (error) {
      console.error('Static data loading failed:', error)
      // Return default statistics
      return {
        totalMedicalColleges: 0,
        totalDentalColleges: 0,
        statesCovered: 0,
        dailySearches: 0,
        dailyUsers: 0,
        totalColleges: 0
      }
    }
  }

  // Search colleges
  async searchColleges(query, filters = {}) {
    const cacheKey = `search-${query}-${JSON.stringify(filters)}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      // Try to fetch from API/database
      const searchParams = new URLSearchParams({ query, ...filters })
      const response = await fetch(`${this.baseUrl}/search?${searchParams}`)
      if (response.ok) {
        const data = await response.json()
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
        return data
      }
    } catch (error) {
      console.warn('API search failed, using static data:', error)
    }

    // Fallback to static data with client-side search
    try {
      const [medicalData, dentalData] = await Promise.all([
        import('@data/medicalColleges.json'),
        import('@data/dentalColleges.json')
      ])

      const allColleges = [
        ...medicalData.default.map(college => ({ ...college, type: 'medical' })),
        ...dentalData.default.map(college => ({ ...college, type: 'dental' }))
      ]

      const filteredData = this.filterStaticData(allColleges, { search: query, ...filters })
      this.cache.set(cacheKey, { data: filteredData, timestamp: Date.now() })
      return filteredData
    } catch (error) {
      console.error('Static data search failed:', error)
      throw new Error('Failed to search colleges')
    }
  }

  // Log search analytics
  async logSearch(query, filters = {}, resultsCount = 0) {
    try {
      await fetch(`${this.baseUrl}/analytics/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          filters,
          resultsCount,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.warn('Failed to log search analytics:', error)
    }
  }

  // Log college view
  async logCollegeView(collegeId, collegeType) {
    try {
      await fetch(`${this.baseUrl}/analytics/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collegeId,
          collegeType,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.warn('Failed to log college view:', error)
    }
  }

  // Filter static data based on filters
  filterStaticData(data, filters = {}) {
    let filtered = [...data]

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

    if (filters.recognitionStatus) {
      filtered = filtered.filter(college => 
        college.recognitionStatus === filters.recognitionStatus
      )
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(college => 
        college.name.toLowerCase().includes(searchTerm) ||
        college.city.toLowerCase().includes(searchTerm) ||
        college.university?.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return filtered
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService