// Database Service Layer
// Supports multiple database backends with unified API

import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class DatabaseService {
  constructor() {
    this.db = null
    this.isInitialized = false
  }

  // Initialize database connection
  async initialize() {
    try {
      // Use SQLite for development, can be extended for production databases
      this.db = await open({
        filename: path.join(__dirname, '..', '..', 'data', 'medical-admissions.db'),
        driver: sqlite3.Database
      })

      // Create tables if they don't exist
      await this.createTables()
      
      this.isInitialized = true
      console.log('✅ Database initialized successfully')
    } catch (error) {
      console.error('❌ Database initialization failed:', error)
      throw error
    }
  }

  // Create database tables
  async createTables() {
    const tables = [
      // Medical Colleges table
      `CREATE TABLE IF NOT EXISTS medical_colleges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        state TEXT NOT NULL,
        city TEXT NOT NULL,
        type TEXT NOT NULL,
        management TEXT NOT NULL,
        university TEXT,
        recognition_status TEXT NOT NULL,
        academic_year TEXT NOT NULL,
        total_seats INTEGER DEFAULT 0,
        aiq_seats INTEGER DEFAULT 0,
        state_seats INTEGER DEFAULT 0,
        general_seats INTEGER DEFAULT 0,
        sc_seats INTEGER DEFAULT 0,
        st_seats INTEGER DEFAULT 0,
        obc_seats INTEGER DEFAULT 0,
        ews_seats INTEGER DEFAULT 0,
        govt_fee INTEGER DEFAULT 0,
        private_fee INTEGER DEFAULT 0,
        nri_fee INTEGER DEFAULT 0,
        bond_required BOOLEAN DEFAULT FALSE,
        bond_duration INTEGER DEFAULT 0,
        bond_amount INTEGER DEFAULT 0,
        bond_description TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        latitude REAL,
        longitude REAL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        source TEXT DEFAULT 'NMC',
        confidence TEXT DEFAULT 'high',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Dental Colleges table
      `CREATE TABLE IF NOT EXISTS dental_colleges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        state TEXT NOT NULL,
        city TEXT NOT NULL,
        type TEXT NOT NULL,
        management TEXT NOT NULL,
        university TEXT,
        recognition_status TEXT NOT NULL,
        academic_year TEXT NOT NULL,
        total_seats INTEGER DEFAULT 0,
        aiq_seats INTEGER DEFAULT 0,
        state_seats INTEGER DEFAULT 0,
        general_seats INTEGER DEFAULT 0,
        sc_seats INTEGER DEFAULT 0,
        st_seats INTEGER DEFAULT 0,
        obc_seats INTEGER DEFAULT 0,
        ews_seats INTEGER DEFAULT 0,
        govt_fee INTEGER DEFAULT 0,
        private_fee INTEGER DEFAULT 0,
        nri_fee INTEGER DEFAULT 0,
        bond_required BOOLEAN DEFAULT FALSE,
        bond_duration INTEGER DEFAULT 0,
        bond_amount INTEGER DEFAULT 0,
        bond_description TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        latitude REAL,
        longitude REAL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        source TEXT DEFAULT 'DCI',
        confidence TEXT DEFAULT 'high',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Search Analytics table
      `CREATE TABLE IF NOT EXISTS search_analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        filters TEXT,
        results_count INTEGER DEFAULT 0,
        user_agent TEXT,
        ip_address TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // User Sessions table
      `CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME,
        pages_visited TEXT,
        total_searches INTEGER DEFAULT 0
      )`,

             // College Views table
       `CREATE TABLE IF NOT EXISTS college_views (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         college_id TEXT NOT NULL,
         college_type TEXT NOT NULL,
         session_id TEXT,
         timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
       )`,

      // Data Updates table
      `CREATE TABLE IF NOT EXISTS data_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT NOT NULL,
        operation TEXT NOT NULL,
        record_id TEXT,
        changes TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        source TEXT DEFAULT 'manual'
      )`
    ]

    for (const tableSQL of tables) {
      await this.db.exec(tableSQL)
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_medical_colleges_state ON medical_colleges(state)',
      'CREATE INDEX IF NOT EXISTS idx_medical_colleges_type ON medical_colleges(type)',
      'CREATE INDEX IF NOT EXISTS idx_medical_colleges_recognition ON medical_colleges(recognition_status)',
      'CREATE INDEX IF NOT EXISTS idx_dental_colleges_state ON dental_colleges(state)',
      'CREATE INDEX IF NOT EXISTS idx_dental_colleges_type ON dental_colleges(type)',
      'CREATE INDEX IF NOT EXISTS idx_dental_colleges_recognition ON dental_colleges(recognition_status)',
      'CREATE INDEX IF NOT EXISTS idx_search_analytics_timestamp ON search_analytics(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_college_views_college_id ON college_views(college_id)'
    ]

    for (const indexSQL of indexes) {
      await this.db.exec(indexSQL)
    }
  }

  // Medical Colleges CRUD operations
  async getMedicalColleges(filters = {}) {
    if (!this.isInitialized) await this.initialize()

    let query = 'SELECT * FROM medical_colleges WHERE 1=1'
    const params = []

    if (filters.state) {
      query += ' AND state = ?'
      params.push(filters.state)
    }

    if (filters.type) {
      query += ' AND type = ?'
      params.push(filters.type)
    }

    if (filters.management) {
      query += ' AND management = ?'
      params.push(filters.management)
    }

    if (filters.recognitionStatus) {
      query += ' AND recognition_status = ?'
      params.push(filters.recognitionStatus)
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR city LIKE ? OR university LIKE ?)'
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    query += ' ORDER BY name ASC'

    if (filters.limit) {
      query += ' LIMIT ?'
      params.push(filters.limit)
    }

    if (filters.offset) {
      query += ' OFFSET ?'
      params.push(filters.offset)
    }

    const colleges = await this.db.all(query, params)
    return colleges.map(this.formatMedicalCollege)
  }

  async getMedicalCollegeById(id) {
    if (!this.isInitialized) await this.initialize()

    const college = await this.db.get('SELECT * FROM medical_colleges WHERE id = ?', [id])
    return college ? this.formatMedicalCollege(college) : null
  }

  async createMedicalCollege(collegeData) {
    if (!this.isInitialized) await this.initialize()

    const query = `
      INSERT INTO medical_colleges (
        id, name, state, city, type, management, university, recognition_status, academic_year,
        total_seats, aiq_seats, state_seats, general_seats, sc_seats, st_seats, obc_seats, ews_seats,
        govt_fee, private_fee, nri_fee, bond_required, bond_duration, bond_amount, bond_description,
        address, phone, email, website, latitude, longitude, source, confidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      collegeData.id,
      collegeData.name,
      collegeData.state,
      collegeData.city,
      collegeData.type,
      collegeData.management,
      collegeData.university,
      collegeData.recognitionStatus,
      collegeData.academicYear,
      collegeData.seatMatrix?.mbbs?.total || 0,
      collegeData.seatMatrix?.mbbs?.aiq || 0,
      collegeData.seatMatrix?.mbbs?.state || 0,
      collegeData.seatMatrix?.mbbs?.categories?.general || 0,
      collegeData.seatMatrix?.mbbs?.categories?.sc || 0,
      collegeData.seatMatrix?.mbbs?.categories?.st || 0,
      collegeData.seatMatrix?.mbbs?.categories?.obc || 0,
      collegeData.seatMatrix?.mbbs?.categories?.ews || 0,
      collegeData.fees?.mbbs?.government || 0,
      collegeData.fees?.mbbs?.private || 0,
      collegeData.fees?.mbbs?.nri || 0,
      collegeData.bond?.required || false,
      collegeData.bond?.duration || 0,
      collegeData.bond?.amount || 0,
      collegeData.bond?.description || '',
      collegeData.contact?.address || '',
      collegeData.contact?.phone || '',
      collegeData.contact?.email || '',
      collegeData.contact?.website || '',
      collegeData.coordinates?.latitude || null,
      collegeData.coordinates?.longitude || null,
      collegeData.source || 'NMC',
      collegeData.confidence || 'high'
    ]

    await this.db.run(query, params)
    return this.getMedicalCollegeById(collegeData.id)
  }

  async updateMedicalCollege(id, updates) {
    if (!this.isInitialized) await this.initialize()

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const query = `UPDATE medical_colleges SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    
    const params = [...Object.values(updates), id]
    await this.db.run(query, params)
    
    return this.getMedicalCollegeById(id)
  }

  async deleteMedicalCollege(id) {
    if (!this.isInitialized) await this.initialize()

    await this.db.run('DELETE FROM medical_colleges WHERE id = ?', [id])
    return { success: true }
  }

  // Dental Colleges CRUD operations (similar structure)
  async getDentalColleges(filters = {}) {
    if (!this.isInitialized) await this.initialize()

    let query = 'SELECT * FROM dental_colleges WHERE 1=1'
    const params = []

    if (filters.state) {
      query += ' AND state = ?'
      params.push(filters.state)
    }

    if (filters.type) {
      query += ' AND type = ?'
      params.push(filters.type)
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR city LIKE ? OR university LIKE ?)'
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    query += ' ORDER BY name ASC'

    if (filters.limit) {
      query += ' LIMIT ?'
      params.push(filters.limit)
    }

    const colleges = await this.db.all(query, params)
    return colleges.map(this.formatDentalCollege)
  }

  async getDentalCollegeById(id) {
    if (!this.isInitialized) await this.initialize()

    const college = await this.db.get('SELECT * FROM dental_colleges WHERE id = ?', [id])
    return college ? this.formatDentalCollege(college) : null
  }

  // Analytics operations
  async logSearch(query, filters = {}, resultsCount = 0, userAgent = '', ipAddress = '') {
    if (!this.isInitialized) await this.initialize()

    const querySQL = `
      INSERT INTO search_analytics (query, filters, results_count, user_agent, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `
    
    await this.db.run(querySQL, [
      query,
      JSON.stringify(filters),
      resultsCount,
      userAgent,
      ipAddress
    ])
  }

  async logCollegeView(collegeId, collegeType, sessionId = null) {
    if (!this.isInitialized) await this.initialize()

    const querySQL = `
      INSERT INTO college_views (college_id, college_type, session_id)
      VALUES (?, ?, ?)
    `
    
    await this.db.run(querySQL, [collegeId, collegeType, sessionId])
  }

  async getSearchAnalytics(timeRange = '30d') {
    if (!this.isInitialized) await this.initialize()

    const query = `
      SELECT 
        query,
        COUNT(*) as search_count,
        AVG(results_count) as avg_results,
        MAX(timestamp) as last_searched
      FROM search_analytics 
      WHERE timestamp >= datetime('now', '-${timeRange}')
      GROUP BY query 
      ORDER BY search_count DESC 
      LIMIT 20
    `

    return await this.db.all(query)
  }

  async getPopularColleges(timeRange = '30d') {
    if (!this.isInitialized) await this.initialize()

    const query = `
      SELECT 
        college_id,
        college_type,
        COUNT(*) as view_count
      FROM college_views 
      WHERE timestamp >= datetime('now', '-${timeRange}')
      GROUP BY college_id, college_type 
      ORDER BY view_count DESC 
      LIMIT 20
    `

    return await this.db.all(query)
  }

  // Statistics
  async getStatistics() {
    if (!this.isInitialized) await this.initialize()

    const stats = await this.db.get(`
      SELECT 
        (SELECT COUNT(*) FROM medical_colleges) as medical_colleges_count,
        (SELECT COUNT(*) FROM dental_colleges) as dental_colleges_count,
        (SELECT COUNT(DISTINCT state) FROM medical_colleges) as states_covered,
        (SELECT COUNT(*) FROM search_analytics WHERE timestamp >= datetime('now', '-1 day')) as daily_searches,
        (SELECT COUNT(DISTINCT session_id) FROM user_sessions WHERE start_time >= datetime('now', '-1 day')) as daily_users
    `)

    return {
      totalMedicalColleges: stats.medical_colleges_count,
      totalDentalColleges: stats.dental_colleges_count,
      statesCovered: stats.states_covered,
      dailySearches: stats.daily_searches,
      dailyUsers: stats.daily_users,
      totalColleges: stats.medical_colleges_count + stats.dental_colleges_count
    }
  }

  // Data formatting helpers
  formatMedicalCollege(row) {
    return {
      id: row.id,
      name: row.name,
      state: row.state,
      city: row.city,
      type: row.type,
      management: row.management,
      university: row.university,
      recognitionStatus: row.recognition_status,
      academicYear: row.academic_year,
      courses: [{
        name: 'MBBS',
        duration: '5.5 years',
        seats: row.total_seats,
        recognitionStatus: row.recognition_status,
        fees: {
          government: row.govt_fee,
          private: row.private_fee,
          nri: row.nri_fee
        }
      }],
      seatMatrix: {
        mbbs: {
          total: row.total_seats,
          aiq: row.aiq_seats,
          state: row.state_seats,
          categories: {
            general: row.general_seats,
            sc: row.sc_seats,
            st: row.st_seats,
            obc: row.obc_seats,
            ews: row.ews_seats
          }
        }
      },
      fees: {
        mbbs: {
          government: row.govt_fee,
          private: row.private_fee,
          nri: row.nri_fee
        }
      },
      bond: {
        required: row.bond_required,
        duration: row.bond_duration,
        amount: row.bond_amount,
        description: row.bond_description
      },
      contact: {
        address: row.address,
        phone: row.phone,
        email: row.email,
        website: row.website
      },
      coordinates: {
        latitude: row.latitude,
        longitude: row.longitude
      },
      lastUpdated: row.last_updated,
      source: row.source,
      confidence: row.confidence
    }
  }

  formatDentalCollege(row) {
    return {
      id: row.id,
      name: row.name,
      state: row.state,
      city: row.city,
      type: row.type,
      management: row.management,
      university: row.university,
      recognitionStatus: row.recognition_status,
      academicYear: row.academic_year,
      courses: [{
        name: 'BDS',
        duration: '5 years',
        seats: row.total_seats,
        recognitionStatus: row.recognition_status,
        fees: {
          government: row.govt_fee,
          private: row.private_fee,
          nri: row.nri_fee
        }
      }],
      seatMatrix: {
        bds: {
          total: row.total_seats,
          aiq: row.aiq_seats,
          state: row.state_seats,
          categories: {
            general: row.general_seats,
            sc: row.sc_seats,
            st: row.st_seats,
            obc: row.obc_seats,
            ews: row.ews_seats
          }
        }
      },
      fees: {
        bds: {
          government: row.govt_fee,
          private: row.private_fee,
          nri: row.nri_fee
        }
      },
      bond: {
        required: row.bond_required,
        duration: row.bond_duration,
        amount: row.bond_amount,
        description: row.bond_description
      },
      contact: {
        address: row.address,
        phone: row.phone,
        email: row.email,
        website: row.website
      },
      coordinates: {
        latitude: row.latitude,
        longitude: row.longitude
      },
      lastUpdated: row.last_updated,
      source: row.source,
      confidence: row.confidence
    }
  }

  // Close database connection
  async close() {
    if (this.db) {
      await this.db.close()
      this.isInitialized = false
    }
  }
}

// Create singleton instance
const databaseService = new DatabaseService()

export default databaseService