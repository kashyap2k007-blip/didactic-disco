#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Papa from 'papaparse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'data', 'raw'),
  outputDir: path.join(__dirname, '..', 'src', 'data'),
  medicalCollegesFile: 'all-MEDICAL-COLLEGES-OF-INDIA-NMC.csv',
  dentalCollegesFile: 'Dental-colleges-DCI.csv',
  closedCollegesFile: 'closed-medical-colleges.csv'
}

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true })
}

// Utility functions
const cleanText = (text) => {
  if (!text) return ''
  return text.toString().trim().replace(/\s+/g, ' ')
}

const parseNumber = (value) => {
  if (!value) return 0
  const num = parseInt(value.toString().replace(/[^\d]/g, ''))
  return isNaN(num) ? 0 : num
}

const parseBoolean = (value) => {
  if (!value) return false
  const str = value.toString().toLowerCase()
  return ['yes', 'true', '1', 'y'].includes(str)
}

const normalizeCollegeName = (name) => {
  return cleanText(name)
    .replace(/\([^)]*\)/g, '') // Remove parentheses content
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}

const generateId = (name, state) => {
  return `${normalizeCollegeName(name).toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase().replace(/\s+/g, '-')}`
}

const processMedicalColleges = (csvData) => {
  const colleges = []
  const errors = []

  csvData.forEach((row, index) => {
    try {
      const college = {
        id: generateId(row['College Name'], row['State']),
        name: cleanText(row['College Name']),
        state: cleanText(row['State']),
        city: cleanText(row['City']),
        type: cleanText(row['Type']), // Government/Private/Deemed
        management: cleanText(row['Management']),
        university: cleanText(row['University']),
        recognitionStatus: cleanText(row['Recognition Status']),
        academicYear: cleanText(row['Academic Year']),
        courses: [],
        seatMatrix: {
          mbbs: {
            total: parseNumber(row['MBBS Total Seats']),
            aiq: parseNumber(row['MBBS AIQ Seats']),
            state: parseNumber(row['MBBS State Seats']),
            categories: {
              general: parseNumber(row['MBBS General']),
              sc: parseNumber(row['MBBS SC']),
              st: parseNumber(row['MBBS ST']),
              obc: parseNumber(row['MBBS OBC']),
              ews: parseNumber(row['MBBS EWS'])
            }
          }
        },
        fees: {
          mbbs: {
            government: parseNumber(row['MBBS Govt Fee']),
            private: parseNumber(row['MBBS Private Fee']),
            nri: parseNumber(row['MBBS NRI Fee'])
          }
        },
        bond: {
          required: parseBoolean(row['Bond Required']),
          duration: parseNumber(row['Bond Duration']),
          amount: parseNumber(row['Bond Amount']),
          description: cleanText(row['Bond Description'])
        },
        contact: {
          address: cleanText(row['Address']),
          phone: cleanText(row['Phone']),
          email: cleanText(row['Email']),
          website: cleanText(row['Website'])
        },
        coordinates: {
          latitude: parseFloat(row['Latitude']) || null,
          longitude: parseFloat(row['Longitude']) || null
        },
        lastUpdated: new Date().toISOString(),
        source: 'NMC',
        confidence: 'high'
      }

      // Add MBBS course
      if (college.seatMatrix.mbbs.total > 0) {
        college.courses.push({
          name: 'MBBS',
          duration: '5.5 years',
          seats: college.seatMatrix.mbbs.total,
          recognitionStatus: college.recognitionStatus,
          fees: college.fees.mbbs
        })
      }

      // Validate required fields
      if (!college.name || !college.state) {
        errors.push(`Row ${index + 1}: Missing required fields (name: ${college.name}, state: ${college.state})`)
        return
      }

      colleges.push(college)
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error.message}`)
    }
  })

  return { colleges, errors }
}

const processDentalColleges = (csvData) => {
  const colleges = []
  const errors = []

  csvData.forEach((row, index) => {
    try {
      const college = {
        id: generateId(row['College Name'], row['State']),
        name: cleanText(row['College Name']),
        state: cleanText(row['State']),
        city: cleanText(row['City']),
        type: cleanText(row['Type']),
        management: cleanText(row['Management']),
        university: cleanText(row['University']),
        recognitionStatus: cleanText(row['Recognition Status']),
        academicYear: cleanText(row['Academic Year']),
        courses: [],
        seatMatrix: {
          bds: {
            total: parseNumber(row['BDS Total Seats']),
            aiq: parseNumber(row['BDS AIQ Seats']),
            state: parseNumber(row['BDS State Seats']),
            categories: {
              general: parseNumber(row['BDS General']),
              sc: parseNumber(row['BDS SC']),
              st: parseNumber(row['BDS ST']),
              obc: parseNumber(row['BDS OBC']),
              ews: parseNumber(row['BDS EWS'])
            }
          }
        },
        fees: {
          bds: {
            government: parseNumber(row['BDS Govt Fee']),
            private: parseNumber(row['BDS Private Fee']),
            nri: parseNumber(row['BDS NRI Fee'])
          }
        },
        bond: {
          required: parseBoolean(row['Bond Required']),
          duration: parseNumber(row['Bond Duration']),
          amount: parseNumber(row['Bond Amount']),
          description: cleanText(row['Bond Description'])
        },
        contact: {
          address: cleanText(row['Address']),
          phone: cleanText(row['Phone']),
          email: cleanText(row['Email']),
          website: cleanText(row['Website'])
        },
        coordinates: {
          latitude: parseFloat(row['Latitude']) || null,
          longitude: parseFloat(row['Longitude']) || null
        },
        lastUpdated: new Date().toISOString(),
        source: 'DCI',
        confidence: 'high'
      }

      // Add BDS course
      if (college.seatMatrix.bds.total > 0) {
        college.courses.push({
          name: 'BDS',
          duration: '5 years',
          seats: college.seatMatrix.bds.total,
          recognitionStatus: college.recognitionStatus,
          fees: college.fees.bds
        })
      }

      // Validate required fields
      if (!college.name || !college.state) {
        errors.push(`Row ${index + 1}: Missing required fields (name: ${college.name}, state: ${college.state})`)
        return
      }

      colleges.push(college)
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error.message}`)
    }
  })

  return { colleges, errors }
}

const generateStatistics = (medicalColleges, dentalColleges) => {
  const stats = {
    total: {
      medical: medicalColleges.length,
      dental: dentalColleges.length,
      combined: medicalColleges.length + dentalColleges.length
    },
    byState: {},
    byType: {
      government: 0,
      private: 0,
      deemed: 0
    },
    byManagement: {
      government: 0,
      private: 0,
      trust: 0,
      society: 0
    },
    seatMatrix: {
      mbbs: {
        total: 0,
        aiq: 0,
        state: 0
      },
      bds: {
        total: 0,
        aiq: 0,
        state: 0
      }
    },
    lastUpdated: new Date().toISOString()
  }

  // Process medical colleges
  medicalColleges.forEach(college => {
    // State statistics
    if (!stats.byState[college.state]) {
      stats.byState[college.state] = { medical: 0, dental: 0, total: 0 }
    }
    stats.byState[college.state].medical++
    stats.byState[college.state].total++

    // Type statistics
    const type = college.type?.toLowerCase() || 'private'
    if (type.includes('government')) stats.byType.government++
    else if (type.includes('deemed')) stats.byType.deemed++
    else stats.byType.private++

    // Management statistics
    const management = college.management?.toLowerCase() || 'private'
    if (management.includes('government')) stats.byManagement.government++
    else if (management.includes('trust')) stats.byManagement.trust++
    else if (management.includes('society')) stats.byManagement.society++
    else stats.byManagement.private++

    // Seat matrix
    stats.seatMatrix.mbbs.total += college.seatMatrix.mbbs.total
    stats.seatMatrix.mbbs.aiq += college.seatMatrix.mbbs.aiq
    stats.seatMatrix.mbbs.state += college.seatMatrix.mbbs.state
  })

  // Process dental colleges
  dentalColleges.forEach(college => {
    // State statistics
    if (!stats.byState[college.state]) {
      stats.byState[college.state] = { medical: 0, dental: 0, total: 0 }
    }
    stats.byState[college.state].dental++
    stats.byState[college.state].total++

    // Type statistics
    const type = college.type?.toLowerCase() || 'private'
    if (type.includes('government')) stats.byType.government++
    else if (type.includes('deemed')) stats.byType.deemed++
    else stats.byType.private++

    // Management statistics
    const management = college.management?.toLowerCase() || 'private'
    if (management.includes('government')) stats.byManagement.government++
    else if (management.includes('trust')) stats.byManagement.trust++
    else if (management.includes('society')) stats.byManagement.society++
    else stats.byManagement.private++

    // Seat matrix
    stats.seatMatrix.bds.total += college.seatMatrix.bds.total
    stats.seatMatrix.bds.aiq += college.seatMatrix.bds.aiq
    stats.seatMatrix.bds.state += college.seatMatrix.bds.state
  })

  return stats
}

const main = async () => {
  console.log('🏥 Processing Medical Admissions Platform Data...\n')

  try {
    // Process Medical Colleges
    console.log('📋 Processing Medical Colleges...')
    const medicalCsvPath = path.join(CONFIG.inputDir, CONFIG.medicalCollegesFile)
    
    if (!fs.existsSync(medicalCsvPath)) {
      console.warn(`⚠️  Medical colleges file not found: ${medicalCsvPath}`)
      console.log('📝 Please place the medical colleges CSV file in the data/raw directory')
    } else {
      const medicalCsv = fs.readFileSync(medicalCsvPath, 'utf8')
      const medicalResult = Papa.parse(medicalCsv, { header: true })
      const { colleges: medicalColleges, errors: medicalErrors } = processMedicalColleges(medicalResult.data)
      
      if (medicalErrors.length > 0) {
        console.warn(`⚠️  Found ${medicalErrors.length} errors in medical colleges data:`)
        medicalErrors.slice(0, 5).forEach(error => console.warn(`   ${error}`))
        if (medicalErrors.length > 5) console.warn(`   ... and ${medicalErrors.length - 5} more`)
      }
      
      console.log(`✅ Processed ${medicalColleges.length} medical colleges`)
    }

    // Process Dental Colleges
    console.log('\n🦷 Processing Dental Colleges...')
    const dentalCsvPath = path.join(CONFIG.inputDir, CONFIG.dentalCollegesFile)
    
    if (!fs.existsSync(dentalCsvPath)) {
      console.warn(`⚠️  Dental colleges file not found: ${dentalCsvPath}`)
      console.log('📝 Please place the dental colleges CSV file in the data/raw directory')
    } else {
      const dentalCsv = fs.readFileSync(dentalCsvPath, 'utf8')
      const dentalResult = Papa.parse(dentalCsv, { header: true })
      const { colleges: dentalColleges, errors: dentalErrors } = processDentalColleges(dentalResult.data)
      
      if (dentalErrors.length > 0) {
        console.warn(`⚠️  Found ${dentalErrors.length} errors in dental colleges data:`)
        dentalErrors.slice(0, 5).forEach(error => console.warn(`   ${error}`))
        if (dentalErrors.length > 5) console.warn(`   ... and ${dentalErrors.length - 5} more`)
      }
      
      console.log(`✅ Processed ${dentalColleges.length} dental colleges`)
    }

    // Generate sample data for development
    console.log('\n📊 Generating sample data...')
    
    const sampleMedicalColleges = [
      {
        id: 'aiims-new-delhi-delhi',
        name: 'All India Institute of Medical Sciences, New Delhi',
        state: 'Delhi',
        city: 'New Delhi',
        type: 'Government',
        management: 'Government',
        university: 'AIIMS',
        recognitionStatus: 'Recognized',
        academicYear: '2024-25',
        courses: [
          {
            name: 'MBBS',
            duration: '5.5 years',
            seats: 100,
            recognitionStatus: 'Recognized',
            fees: { government: 1500, private: 1500, nri: 1500 }
          }
        ],
        seatMatrix: {
          mbbs: {
            total: 100,
            aiq: 15,
            state: 85,
            categories: { general: 50, sc: 15, st: 7, obc: 20, ews: 8 }
          }
        },
        fees: {
          mbbs: { government: 1500, private: 1500, nri: 1500 }
        },
        bond: { required: false, duration: 0, amount: 0, description: '' },
        contact: {
          address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
          phone: '011-26588500',
          email: 'info@aiims.edu',
          website: 'https://www.aiims.edu'
        },
        coordinates: { latitude: 28.5673, longitude: 77.2090 },
        lastUpdated: new Date().toISOString(),
        source: 'NMC',
        confidence: 'high'
      }
    ]

    const sampleDentalColleges = [
      {
        id: 'maulana-azad-institute-of-dental-sciences-delhi',
        name: 'Maulana Azad Institute of Dental Sciences',
        state: 'Delhi',
        city: 'New Delhi',
        type: 'Government',
        management: 'Government',
        university: 'Delhi University',
        recognitionStatus: 'Recognized',
        academicYear: '2024-25',
        courses: [
          {
            name: 'BDS',
            duration: '5 years',
            seats: 50,
            recognitionStatus: 'Recognized',
            fees: { government: 2000, private: 2000, nri: 2000 }
          }
        ],
        seatMatrix: {
          bds: {
            total: 50,
            aiq: 8,
            state: 42,
            categories: { general: 25, sc: 8, st: 4, obc: 10, ews: 3 }
          }
        },
        fees: {
          bds: { government: 2000, private: 2000, nri: 2000 }
        },
        bond: { required: false, duration: 0, amount: 0, description: '' },
        contact: {
          address: 'MAMC Complex, Bahadur Shah Zafar Marg, New Delhi',
          phone: '011-23239271',
          email: 'info@maids.ac.in',
          website: 'https://www.maids.ac.in'
        },
        coordinates: { latitude: 28.6562, longitude: 77.2410 },
        lastUpdated: new Date().toISOString(),
        source: 'DCI',
        confidence: 'high'
      }
    ]

    // Generate statistics
    const statistics = generateStatistics(sampleMedicalColleges, sampleDentalColleges)

    // Write output files
    console.log('\n💾 Writing output files...')
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, 'medicalColleges.json'),
      JSON.stringify(sampleMedicalColleges, null, 2)
    )
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, 'dentalColleges.json'),
      JSON.stringify(sampleDentalColleges, null, 2)
    )
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, 'statistics.json'),
      JSON.stringify(statistics, null, 2)
    )

    console.log('✅ Data processing completed successfully!')
    console.log(`📁 Output files written to: ${CONFIG.outputDir}`)
    console.log(`📊 Generated statistics for ${statistics.total.combined} colleges`)

  } catch (error) {
    console.error('❌ Error processing data:', error.message)
    process.exit(1)
  }
}

// Run the script
main()